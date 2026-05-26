from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'submitted_at', 'is_resolved')
    list_filter = ('is_resolved', 'submitted_at')
    search_fields = ('name', 'email', 'subject')
