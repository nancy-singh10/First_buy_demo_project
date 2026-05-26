from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Receipt
from credits.models import CreditTransaction
from decimal import Decimal


@receiver(pre_save, sender=Receipt)
def process_receipt_status_change(sender, instance, **kwargs):
    """
    Fires whenever a Receipt is saved.
    - On approval  → award credits + create a success notification
    - On rejection → create a rejection notification with admin notes
    """
    if not instance.id:
        return  # New receipt, skip

    try:
        old_receipt = Receipt.objects.get(id=instance.id)
    except Receipt.DoesNotExist:
        return

    # ── Approved ──────────────────────────────────────────────────────
    if old_receipt.status != 'approved' and instance.status == 'approved':
        user = instance.user

        # 5% base yield with tier multiplier
        base_credits = instance.amount_spent * Decimal('0.05')
        multipliers  = {
            'bronze':   Decimal('1.0'),
            'silver':   Decimal('1.2'),
            'gold':     Decimal('1.5'),
            'platinum': Decimal('2.0'),
        }
        multiplier    = multipliers.get(user.tier, Decimal('1.0'))
        final_credits = base_credits * multiplier

        # Ledger entry
        CreditTransaction.objects.create(
            user             = user,
            amount           = final_credits,
            transaction_type = 'earn_receipt',
            description      = f"Earned from receipt at {instance.store_name}",
        )

        # Update user total
        user.total_credits += final_credits
        user.save()

        # ── Notification ──
        from notifications.models import Notification
        Notification.objects.create(
            user       = user,
            notif_type = 'receipt_approved',
            title      = '✅ Receipt Approved!',
            message    = (
                f"Your receipt from {instance.store_name} (₹{instance.amount_spent}) "
                f"has been approved. You earned ₹{final_credits:.2f} in property credits! 🎉"
            ),
        )

    # ── Rejected ──────────────────────────────────────────────────────
    elif old_receipt.status != 'rejected' and instance.status == 'rejected':
        user = instance.user

        reason = instance.admin_notes.strip() if instance.admin_notes else 'No reason provided.'

        from notifications.models import Notification
        Notification.objects.create(
            user       = user,
            notif_type = 'receipt_rejected',
            title      = '❌ Receipt Rejected',
            message    = (
                f"Your receipt from {instance.store_name} (₹{instance.amount_spent}) "
                f"was rejected by the admin.\n\nReason: {reason}"
            ),
        )
