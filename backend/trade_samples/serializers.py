from rest_framework import serializers
from .models import TradeSample, Trade

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = [
            'id',
            'sample',
            'strategy',
            'date',
            'instrument',
            'initial_risk_pips',
            'initial_target_pips',
            'realized_pnl',
            'realized_r_multiple',
            'outcome',
            'rules_followed',
            'context',
            'comment',
        ]
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