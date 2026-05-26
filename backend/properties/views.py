from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Property, SavedProperty
from .serializers import PropertySerializer, SavedPropertySerializer


class IsBuilderOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.role == 'builder'


class PropertyViewSet(viewsets.ModelViewSet):
    queryset           = Property.objects.all().order_by('-created_at')
    serializer_class   = PropertySerializer
    permission_classes = [IsBuilderOrReadOnly]

    def get_serializer_context(self):
        # Pass request into serializer so is_saved can check the current user
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(builder=self.request.user)

    # ── POST /api/properties/{id}/save/  → toggle save/unsave ──────────
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def save(self, request, pk=None):
        property_obj = self.get_object()
        saved, created = SavedProperty.objects.get_or_create(
            user=request.user, property=property_obj
        )
        if not created:
            # Already saved → unsave (toggle)
            saved.delete()
            return Response({'saved': False, 'message': 'Removed from saved homes'})
        return Response({'saved': True, 'message': 'Added to saved homes'}, status=status.HTTP_201_CREATED)

    # ── GET /api/properties/saved/ → list user's saved properties ──────
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def saved(self, request):
        saved_qs = SavedProperty.objects.filter(user=request.user).select_related('property')
        serializer = SavedPropertySerializer(
            saved_qs, many=True, context={'request': request}
        )
        return Response(serializer.data)
