from rest_framework import serializers
from .models import Property, PropertyImage, SavedProperty


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PropertyImage
        fields = ('id', 'image', 'is_primary')


class PropertySerializer(serializers.ModelSerializer):
    images       = PropertyImageSerializer(many=True, read_only=True)
    builder_name = serializers.CharField(source='builder.full_name', read_only=True)
    is_saved     = serializers.SerializerMethodField()

    class Meta:
        model  = Property
        fields = (
            'id', 'builder', 'builder_name',
            'title', 'description', 'price_in_inr',
            'location', 'trust_score', 'max_credit_discount_allowed',
            'images', 'is_saved', 'created_at',
        )
        read_only_fields = ('builder', 'trust_score')

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedProperty.objects.filter(user=request.user, property=obj).exists()
        return False


class SavedPropertySerializer(serializers.ModelSerializer):
    property_detail = PropertySerializer(source='property', read_only=True)

    class Meta:
        model  = SavedProperty
        fields = ('id', 'property', 'property_detail', 'saved_at')
        read_only_fields = ('saved_at',)
