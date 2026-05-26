from rest_framework import serializers
from .models import CreditTransaction, RedemptionRequest

class CreditTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTransaction
        fields = ('id', 'amount', 'transaction_type', 'description', 'created_at')

class RedemptionRequestSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model = RedemptionRequest
        fields = ('id', 'user', 'property', 'property_title', 'credits_spent', 'status', 'requested_at', 'admin_notes')
        read_only_fields = ('user', 'status', 'admin_notes')

    def validate_credits_spent(self, value):
        if value <= 0:
            raise serializers.ValidationError("Credits spent must be greater than zero.")
        user = self.context['request'].user
        if user.total_credits < value:
            raise serializers.ValidationError("Insufficient credits.")
        return value
