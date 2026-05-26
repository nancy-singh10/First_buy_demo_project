from django.db import models
from django.conf import settings

class Receipt(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='receipts')
    store_name = models.CharField(max_length=200)
    amount_spent = models.DecimalField(max_digits=12, decimal_places=2)
    receipt_image = models.ImageField(upload_to='receipts/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.store_name} - ₹{self.amount_spent} ({self.status})"
