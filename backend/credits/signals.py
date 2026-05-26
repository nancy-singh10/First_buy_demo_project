from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Sum
from credits.models import CreditTransaction
from notifications.models import Notification

@receiver(post_save, sender=CreditTransaction)
def handle_tier_upgrade(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        # Calculate total credits ever earned
        earned = CreditTransaction.objects.filter(
            user=user, 
            transaction_type='earn_receipt'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        current_tier = user.tier
        new_tier = current_tier

        # Tier logic
        if earned >= 500000:
            new_tier = 'platinum'
        elif earned >= 200000:
            new_tier = 'gold'
        elif earned >= 50000:
            new_tier = 'silver'
            
        if new_tier != current_tier:
            # Upgrade the user
            user.tier = new_tier
            user.save(update_fields=['tier'])
            
            # Send a notification
            tier_display = new_tier.capitalize()
            Notification.objects.create(
                user=user,
                title="🎉 Tier Upgrade!",
                message=f"Congratulations! You've earned enough credits and have been upgraded to the {tier_display} tier.",
                notif_type='general'
            )
