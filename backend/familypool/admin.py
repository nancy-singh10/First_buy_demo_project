from django.contrib import admin
from .models import FamilyPool, FamilyPoolInvitation


@admin.register(FamilyPool)
class FamilyPoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'member_count', 'created_at')
    filter_horizontal = ('members',)
    search_fields = ('name', 'owner__email')


@admin.register(FamilyPoolInvitation)
class FamilyPoolInvitationAdmin(admin.ModelAdmin):
    list_display = ('pool', 'invited_email', 'invited_by', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('invited_email', 'pool__name')
