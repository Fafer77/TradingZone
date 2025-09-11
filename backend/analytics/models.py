import uuid
from django.db import models
from django.contrib.auth.models import User
from userentries.models import Playbook

class Instrument(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class TradeLog(models.Model):
    class OutcomeChoices(models.TextChoices):
        WIN = 'WIN', 'Win'
        LOSS = 'LOSS', 'Loss'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    strategy = models.ForeignKey(Playbook, on_delete=models.CASCADE, related_name='trade_logs')
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics_trade_logs')

    date = models.DateTimeField(auto_now_add=True)
    instrument = models.ForeignKey(Instrument, on_delete=models.CASCADE, related_name='trade_logs')
    outcome = models.CharField(max_length=4, choices=OutcomeChoices.choices)
    realized_r = models.DecimalField(max_digits=5, decimal_places=2, help_text="Rzeczywisty wynik w R, np. 2.5 lub -1")

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.instrument} ({self.realized_r}R) for {self.strategy.title}"