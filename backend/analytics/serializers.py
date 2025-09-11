from rest_framework import serializers
from .models import TradeLog, Instrument

class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = ['id', 'name']

class TradeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeLog
        fields = '__all__'
        read_only_fields = ['owner']