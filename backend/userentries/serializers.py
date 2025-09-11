from rest_framework import serializers
from .models import Playbook

class PlaybookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playbook
        fields = [
            'id', 
            'title',
            'overview',
            'trade_type',
            'entry_criteria',
            'exit_strategy',
            'stop_loss_rules',
            'enhancers',
            'trade_management',
            'owner',
            'checklist',
            'trade_database',
            'calculated_ev'
        ]

        read_only_fields = ['owner']

