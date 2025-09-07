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
            'trade_database'
        ]

        read_only_fields = ['owner']

