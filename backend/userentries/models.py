from django.db import models
import uuid
from django.contrib.auth.models import User

class Playbook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    overview = models.TextField(blank=True, null=True)

    TRADE_TYPE_CHOICES = [
        ('day_trading', 'Day Trading'),
        ('scalping', 'Scalping'),
        ('swing_trading', 'Swing')
    ]

    trade_type = models.CharField(
        max_length=20, choices=TRADE_TYPE_CHOICES, 
        default='day_trading', verbose_name='trade type choice'
    )

    entry_criteria = models.JSONField(default=list)
    exit_strategy = models.JSONField(default=list)
    stop_loss_rules = models.JSONField(default=list)
    enhancers = models.JSONField(default=list)
    trade_management = models.JSONField(default=list)

    checklist = models.JSONField(default=list)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playbooks')

    trade_database = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.title
