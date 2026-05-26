from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CreditTransaction, RedemptionRequest
from .serializers import CreditTransactionSerializer, RedemptionRequestSerializer
from django.db import transaction

class CreditTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CreditTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CreditTransaction.objects.filter(user=self.request.user).order_by('-created_at')

class RedemptionRequestViewSet(viewsets.ModelViewSet):
    serializer_class = RedemptionRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return RedemptionRequest.objects.all().order_by('-requested_at')
        return RedemptionRequest.objects.filter(user=self.request.user).order_by('-requested_at')

    def perform_create(self, serializer):
        with transaction.atomic():
            # Save the redemption request
            redemption = serializer.save(user=self.request.user)
            # Create a negative credit transaction to deduct credits
            CreditTransaction.objects.create(
                user=self.request.user,
                amount=-redemption.credits_spent,
                transaction_type='spend_property',
                description=f"Redeemed credits for property: {redemption.property.title}"
            )
            # Update user's total_credits immediately
            self.request.user.total_credits -= redemption.credits_spent
            self.request.user.save(update_fields=['total_credits'])

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        redemption = self.get_object()
        if redemption.status != 'pending':
            return Response({'detail': 'Only pending requests can be approved.'}, status=status.HTTP_400_BAD_REQUEST)
        
        redemption.status = 'approved'
        redemption.admin_notes = request.data.get('notes', '')
        redemption.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        redemption = self.get_object()
        if redemption.status != 'pending':
            return Response({'detail': 'Only pending requests can be rejected.'}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            redemption.status = 'rejected'
            redemption.admin_notes = request.data.get('notes', '')
            redemption.save()
            
            # Refund the credits
            CreditTransaction.objects.create(
                user=redemption.user,
                amount=redemption.credits_spent,
                transaction_type='bonus',
                description=f"Refund for rejected redemption: {redemption.property.title}"
            )
            redemption.user.total_credits += redemption.credits_spent
            redemption.user.save(update_fields=['total_credits'])
            
        return Response({'status': 'rejected'})
