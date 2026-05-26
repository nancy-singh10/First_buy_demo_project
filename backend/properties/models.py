from django.db import models
from django.conf import settings


class Property(models.Model):
    builder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role': 'builder'}, related_name='properties')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price_in_inr = models.DecimalField(max_digits=15, decimal_places=2)
    location = models.CharField(max_length=200)
    trust_score = models.IntegerField(default=100)  # 0 to 100
    max_credit_discount_allowed = models.DecimalField(max_digits=15, decimal_places=2, help_text="Maximum INR discount achievable via Property Credits")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.location}"


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.title}"


class SavedProperty(models.Model):
    """Wishlist — a user bookmarks a property."""
    user     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_properties')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')   # one save per user per property
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.email} saved {self.property.title}"

