from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserRegistrationSerializer
from properties.models import Property
from receipts.models import Receipt

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate JWT tokens for immediate login upon registration
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.filter(role='user').count()
        total_builders = User.objects.filter(role='builder').count()
        total_properties = Property.objects.count()
        pending_receipts = Receipt.objects.filter(status='pending').count()

        from django.db.models import Sum
        booked_props = Property.objects.filter(status='booked').aggregate(Sum('price_in_inr'))['price_in_inr__sum'] or 0
        total_revenue = float(booked_props) * 0.01  # 1% commission

        circulating_credits = User.objects.filter(role='user').aggregate(Sum('total_credits'))['total_credits__sum'] or 0

        return Response({
            'total_users': total_users,
            'total_builders': total_builders,
            'total_properties': total_properties,
            'pending_receipts': pending_receipts,
            'total_revenue': total_revenue,
            'circulating_credits': circulating_credits
        })

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')

class AdminUserDetailView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = User.objects.all()

class GrantCreditsView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            target_user = User.objects.get(pk=pk)
            amount = int(request.data.get('amount', 50000))
            target_user.total_credits += amount
            target_user.save()
            return Response({'message': f'Granted {amount} credits to {target_user.email}', 'total_credits': target_user.total_credits})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class SubscribeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        tier = request.data.get('tier')
        if tier not in ['gold', 'platinum']:
            return Response({'error': 'Invalid subscription tier'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.tier = tier
        user.save()
        return Response({'message': f'Successfully subscribed to {tier.title()} tier!', 'tier': tier})
