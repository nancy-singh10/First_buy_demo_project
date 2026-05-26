from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Receipt

User = get_user_model()

class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user info to show in admin receipt queue."""
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone', 'tier', 'total_credits')

class ReceiptSerializer(serializers.ModelSerializer):
    user_detail = UserMinimalSerializer(source='user', read_only=True)

    class Meta:
        model = Receipt
        fields = (
            'id', 'user', 'user_detail',
            'store_name', 'amount_spent', 'receipt_image',
            'status', 'uploaded_at', 'reviewed_at', 'admin_notes'
        )
        read_only_fields = ('user', 'status', 'reviewed_at', 'admin_notes')
