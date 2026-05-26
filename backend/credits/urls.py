from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreditTransactionViewSet, RedemptionRequestViewSet

router = DefaultRouter()
router.register(r'redemptions', RedemptionRequestViewSet, basename='redemption')
router.register(r'transactions', CreditTransactionViewSet, basename='credit')

urlpatterns = [
    path('', include(router.urls)),
]
