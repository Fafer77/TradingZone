from rest_framework import serializers
from .models import DailyReportCard

class DailyReportCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyReportCard
        
        fields = [
            'id', 
            'date', 
            'grade', 
            'goal', 
            'pnl', 
            'reminders', 
            'improvements', 
            'mistakes_with_solutions', 
            'performance_table', 
            'owner'
        ]
        
        read_only_fields = ['owner']