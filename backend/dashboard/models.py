import uuid
from django.db import models
from django.contrib.auth.models import User

class Reminder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')

    def __str__(self):
        return self.text[:50]

class MarketDriver(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    percentage = models.PositiveIntegerField()
    color = models.CharField(max_length=20, default='blue')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='market_drivers')

    def __str__(self):
        return f"{self.name} ({self.percentage}%)"
    

class MarketBias(models.Model):
    class BiasChoices(models.TextChoices):
        BULLISH = 'BULLISH', 'Bullish'
        BEARISH = 'BEARISH', 'Bearish'
        NEUTRAL = 'NEUTRAL', 'Neutral'
        RANGE = 'RANGE', 'Range'
        RESURRECTION = 'RESURRECTION', 'Resurrection'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    instrument = models.CharField(max_length=20)
    bias = models.CharField(max_length=20, choices=BiasChoices.choices, default=BiasChoices.NEUTRAL)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='market_biases')

    class Meta:
        unique_together = ['owner', 'instrument'] # Jeden użytkownik = jeden wpis na instrument

    def __str__(self):
        return f"{self.instrument} bias for {self.owner.username} is {self.bias}"
