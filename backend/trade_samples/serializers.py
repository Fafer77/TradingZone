from rest_framework import serializers
from .models import TradeSample, Trade

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = '__all__'
        read_only_fields = ['sample'] 

class TradeSampleSerializer(serializers.ModelSerializer):
    trades = TradeSerializer(many=True, read_only=True)

    class Meta:
        model = TradeSample
        fields = [
            'id', 
            'name', 
            'size', 
            'start_date', 
            'end_date', 
            'grade', 
            'pnl', 
            'owner',
            'trades'
        ]
        read_only_fields = ['owner']