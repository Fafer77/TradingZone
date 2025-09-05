from django.db import models
import uuid
from django.contrib.auth.models import User

class Playbook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=100)
    overview = models.TextField(blank=True, null=True)

    TRADE_TYPE_CHOICES = [
        ('daytrading', 'Day Trading'),
        ('scalping', 'Scalping'),
        ('swing', 'Swing')
    ]

    trade_type = models.CharField(
        max_length=20, choices=TRADE_TYPE_CHOICES, 
        default='daytrading', verbose_name='trade type choice'
    )

    entry_criteria = models.JSONField(default=list)
    exit_strategy = models.JSONField(default=list)
    sl_rules = models.JSONField(default=list)
    confluence = models.JSONField(default=list)
    trade_management = models.JSONField(default=list)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playbooks')

    def __str__(self):
        return self.category
