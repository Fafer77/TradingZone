import uuid
from django.db import models
from django.contrib.auth.models import User
from userentries.models import Playbook 


class TradeSample(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, default="Sample")
    size = models.PositiveIntegerField(default=20)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    grade = models.CharField(max_length=2, blank=True)
    pnl = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trade_samples')

    def __str__(self):
        return f"Sample {self.name} ({self.start_date})"


class Trade(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    sample = models.ForeignKey(TradeSample, on_delete=models.CASCADE, related_name='trades')
    
    strategy = models.ForeignKey(Playbook, on_delete=models.SET_NULL, null=True, blank=True, related_name='trades')
    
    date = models.DateTimeField()
    instrument = models.CharField(max_length=50)
    pnl = models.DecimalField(max_digits=10, decimal_places=2)
    rules_followed = models.BooleanField(default=True)
    reward_ratio = models.DecimalField(max_digits=5, decimal_places=2, help_text="Outcome in R-multiples, e.g., 2.2 or -1")
    risk_pips = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tp_pips = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    context = models.TextField(blank=True)
    comment = models.TextField(blank=True, help_text="Lessons, mistakes, emotions etc.")

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.instrument} on {self.date.strftime('%Y-%m-%d')}"