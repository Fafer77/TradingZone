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