from django.contrib import admin
from .models import Receipt

class ReceiptAdmin(admin.ModelAdmin):
    list_display = ('user', 'store_name', 'amount_spent', 'status', 'uploaded_at')
    list_filter = ('status',)
    search_fields = ('user__email', 'store_name')

admin.site.register(Receipt, ReceiptAdmin)
