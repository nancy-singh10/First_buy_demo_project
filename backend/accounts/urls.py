from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserProfileView, AdminStatsView, AdminUserListView, AdminUserDetailView, GrantCreditsView, SubscribeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserProfileView.as_view(), name='user_profile'),
    path('admin_stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('users/', AdminUserListView.as_view(), name='admin_users'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('grant_credits/<int:pk>/', GrantCreditsView.as_view(), name='grant_credits'),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
]
