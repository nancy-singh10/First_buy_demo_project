from django.contrib import admin
from .models import Property, PropertyImage

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'builder', 'price_in_inr', 'location', 'trust_score')
    list_filter = ('location', 'builder')
    search_fields = ('title', 'location', 'builder__email')
    inlines = [PropertyImageInline]

admin.site.register(Property, PropertyAdmin)
admin.site.register(PropertyImage)
