from rest_framework import serializers
from .models import Playbook

class PlaybookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playbook
        fields = [
            'id', 
            'category', 
            'overview',
            'trade_type',
            'entry_criteria',
            'exit_strategy',
            'sl_rules',
            'confluence',
            'trade_management',
            'owner'
        ]

        read_only_fields = ['owner']

