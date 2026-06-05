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

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.builder == request.user


class PropertyViewSet(viewsets.ModelViewSet):
    queryset           = Property.objects.all().order_by('-created_at')
    serializer_class   = PropertySerializer
    permission_classes = [IsBuilderOrReadOnly]

    def get_queryset(self):
        qs = Property.objects.all().order_by('-created_at')
        if self.request.user and self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return qs # Admins see all properties including booked
            
            from django.db import models
            if self.request.user.role == 'builder':
                qs = qs.filter(models.Q(status='available') | models.Q(builder=self.request.user))
            else:
                qs = qs.filter(models.Q(status='available') | models.Q(buyer=self.request.user))
        else:
            # For unauthenticated users, only show available properties
            qs = qs.filter(status='available')
            
        location = self.request.query_params.get('location', None)
        if location:
            qs = qs.filter(location__icontains=location)
            
        keyword = self.request.query_params.get('keyword', None)
        if keyword:
            from django.db import models
            qs = qs.filter(models.Q(title__icontains=keyword) | models.Q(description__icontains=keyword))
            
        price_range = self.request.query_params.get('price_range', None)
        if price_range:
            if price_range == 'under_1cr':
                qs = qs.filter(price_in_inr__lt=10000000)
            elif price_range == '1cr_to_3cr':
                qs = qs.filter(price_in_inr__gte=10000000, price_in_inr__lte=30000000)
            elif price_range == 'above_3cr':
                qs = qs.filter(price_in_inr__gt=30000000)

        return qs

    def get_serializer_context(self):
        # Pass request into serializer so is_saved can check the current user
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        property_obj = serializer.save(builder=self.request.user)
        image = self.request.FILES.get('image')
        if image:
            from .models import PropertyImage
            PropertyImage.objects.create(property=property_obj, image=image, is_primary=True)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def book(self, request, pk=None):
        property_obj = self.get_object()
        if property_obj.status == 'booked':
            return Response({'message': 'Property already booked'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Simulate payment processing here
        property_obj.status = 'booked'
        property_obj.buyer = request.user
        property_obj.save()

        # Update Builder Tier based on bookings
        builder = property_obj.builder
        if builder and builder.role == 'builder':
            total_bookings = Property.objects.filter(builder=builder, status='booked').count()
            new_tier = 'bronze'
            if total_bookings >= 25:
                new_tier = 'platinum'
            elif total_bookings >= 10:
                new_tier = 'gold'
            elif total_bookings >= 2:
                new_tier = 'silver'
            
            if builder.tier != new_tier:
                builder.tier = new_tier
                builder.save(update_fields=['tier'])

        return Response({'message': 'Property booked successfully!', 'status': 'booked', 'buyer': request.user.id})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancel_booking(self, request, pk=None):
        property_obj = self.get_object()
        if property_obj.buyer != request.user and not request.user.is_staff:
            return Response({'message': 'Not authorized to cancel this booking'}, status=status.HTTP_403_FORBIDDEN)
        
        property_obj.status = 'available'
        property_obj.buyer = None
        property_obj.save()
        return Response({'message': 'Booking cancelled successfully.', 'status': 'available', 'buyer': None})

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
