from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ('id', 'name', 'email', 'subject', 'message', 'submitted_at', 'is_resolved')
        read_only_fields = ('submitted_at', 'is_resolved')
