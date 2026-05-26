from django.db import models
from django.conf import settings

class CreditTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('earn_receipt', 'Earned via Receipt'),
        ('spend_property', 'Spent on Property'),
        ('bonus', 'Bonus Credits'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='credit_transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Amount of credits earned (positive) or spent (negative)")
    transaction_type = models.CharField(max_length=30, choices=TRANSACTION_TYPES)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.amount} ({self.transaction_type})"

class RedemptionRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='redemption_requests')
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='redemptions')
    credits_spent = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requested_at = models.DateTimeField(auto_now_add=True)
    admin_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email} - Redeeming {self.credits_spent} for {self.property.title}"
