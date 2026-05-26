from django.db import models
from django.conf import settings
from properties.models import Property
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')

    def __str__(self):
        return f"{self.user.email} - {self.property.title} - {self.rating}/5"
