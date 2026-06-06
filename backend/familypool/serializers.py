from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FamilyPool, FamilyPoolInvitation
from credits.models import CreditTransaction

User = get_user_model()


class PoolMemberSerializer(serializers.ModelSerializer):
    """Serializes each family pool member's public info."""
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'avatar', 'tier', 'total_credits')
        read_only_fields = fields


class PoolInvitationBriefSerializer(serializers.ModelSerializer):
    """Brief serializer for invitations nested inside pool response."""
    class Meta:
        model = FamilyPoolInvitation
        fields = ('id', 'invited_email', 'status', 'created_at')


class FamilyPoolSerializer(serializers.ModelSerializer):
    members = PoolMemberSerializer(many=True, read_only=True)
    invitations = PoolInvitationBriefSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    combined_credits = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    member_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = FamilyPool
        fields = (
            'id', 'name', 'owner', 'owner_name', 'members', 'invitations',
            'combined_credits', 'member_count', 'created_at'
        )
        read_only_fields = ('owner', 'members', 'invitations', 'combined_credits', 'member_count', 'created_at')


class FamilyPoolCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)

    def validate(self, attrs):
        user = self.context['request'].user
        # A user can only be in one pool at a time
        if FamilyPool.objects.filter(members=user).exists():
            raise serializers.ValidationError("You are already a member of a family pool. Leave it first to create a new one.")
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        pool = FamilyPool.objects.create(
            name=validated_data['name'],
            owner=user
        )
        pool.members.add(user)
        return pool


class FamilyPoolInvitationSerializer(serializers.ModelSerializer):
    invited_by_name = serializers.CharField(source='invited_by.full_name', read_only=True)
    pool_name = serializers.CharField(source='pool.name', read_only=True)

    class Meta:
        model = FamilyPoolInvitation
        fields = (
            'id', 'pool', 'pool_name', 'invited_by', 'invited_by_name',
            'invited_email', 'status', 'created_at', 'responded_at'
        )
        read_only_fields = ('pool', 'invited_by', 'invited_by_name', 'pool_name', 'status', 'created_at', 'responded_at')


class InviteMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        user = self.context['request'].user
        if value.lower() == user.email.lower():
            raise serializers.ValidationError("You cannot invite yourself.")
        # Check if invited user already belongs to a pool
        try:
            invited_user = User.objects.get(email__iexact=value)
            if FamilyPool.objects.filter(members=invited_user).exists():
                raise serializers.ValidationError("This user is already a member of another family pool.")
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value.lower()


class FamilyMemberCreditActivitySerializer(serializers.ModelSerializer):
    """Credit transactions with the member's info attached."""
    member_name = serializers.CharField(source='user.full_name', read_only=True)
    member_email = serializers.CharField(source='user.email', read_only=True)
    member_avatar = serializers.ImageField(source='user.avatar', read_only=True)

    class Meta:
        model = CreditTransaction
        fields = (
            'id', 'member_name', 'member_email', 'member_avatar',
            'amount', 'transaction_type', 'description', 'created_at'
        )
