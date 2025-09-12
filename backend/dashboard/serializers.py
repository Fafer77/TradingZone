from rest_framework import serializers
from .models import Reminder, MarketDriver

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'text', 'owner']
        read_only_fields = ['owner']

class MarketDriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketDriver
        fields = ['id', 'name', 'percentage', 'color', 'owner']
        read_only_fields = ['owner']