from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Receipt
from .serializers import ReceiptSerializer

class ReceiptViewSet(viewsets.ModelViewSet):
    serializer_class = ReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admins see all receipts, normal users only see their own
        if self.request.user.is_staff:
            return Receipt.objects.all().order_by('-uploaded_at')
        return Receipt.objects.filter(user=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        receipt = self.get_object()
        receipt.status = 'approved'
        receipt.reviewed_at = timezone.now()
        receipt.save() # This triggers the signal for credits
        return Response({'status': 'approved'})
        
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        receipt = self.get_object()
        receipt.status = 'rejected'
        receipt.reviewed_at = timezone.now()
        # Optional: Add admin_notes from request
        if 'notes' in request.data:
            receipt.admin_notes = request.data['notes']
        receipt.save()
        return Response({'status': 'rejected'})
