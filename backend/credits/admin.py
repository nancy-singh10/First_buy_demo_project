from django.contrib import admin
from .models import CreditTransaction, RedemptionRequest

@admin.register(CreditTransaction)
class CreditTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'transaction_type', 'created_at')
    list_filter = ('transaction_type', 'created_at')
    search_fields = ('user__email', 'description')

@admin.register(RedemptionRequest)
class RedemptionRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'credits_spent', 'status', 'requested_at')
    list_filter = ('status', 'requested_at')
    search_fields = ('user__email', 'property__name')
