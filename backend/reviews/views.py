from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Review.objects.all().order_by('-created_at')
        property_id = self.request.query_params.get('property_id', None)
        if property_id is not None:
            queryset = queryset.filter(property_id=property_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
