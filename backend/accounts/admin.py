from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'full_name', 'role', 'tier', 'total_credits', 'is_staff']
    ordering = ['email']
    
    # We need to configure fieldsets because we removed the default 'username' field
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'phone', 'avatar')}),
        ('FirstBuy Data', {'fields': ('role', 'tier', 'total_credits')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password', 'role'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
