from django.db import models
from django.conf import settings


class FamilyPool(models.Model):
    """
    Represents a family group that pools credits together.
    A user can only belong to one family pool at a time.
    """
    name = models.CharField(max_length=100, help_text="Family pool display name, e.g. 'The Sharma Family'")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_pools',
        help_text="The user who created this pool"
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='family_pools',
        blank=True,
        help_text="All members of this pool (including the owner)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} (owner: {self.owner.email})"

    @property
    def combined_credits(self):
        """Sum of total_credits across all pool members."""
        return sum(m.total_credits for m in self.members.all())

    @property
    def member_count(self):
        return self.members.count()


class FamilyPoolInvitation(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    )

    pool = models.ForeignKey(FamilyPool, on_delete=models.CASCADE, related_name='invitations')
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_pool_invitations'
    )
    invited_email = models.EmailField(help_text="Email of the user being invited")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        # Prevent duplicate pending invitations
        constraints = [
            models.UniqueConstraint(
                fields=['pool', 'invited_email'],
                condition=models.Q(status='pending'),
                name='unique_pending_invitation'
            )
        ]

    def __str__(self):
        return f"Invite {self.invited_email} to {self.pool.name} ({self.status})"
