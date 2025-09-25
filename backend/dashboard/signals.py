from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import MarketBias

DEFAULT_INSTRUMENTS = [
    "XAUUSD", "NASDAQ", "DAX", "GBPJPY", "BTC", "USD"
]

@receiver(post_save, sender=User)
def create_default_biases(sender, instance, created, **kwargs):
    if created:
        biases_to_create = [
            MarketBias(owner=instance, instrument=instrument_name)
            for instrument_name in DEFAULT_INSTRUMENTS
        ]
        MarketBias.objects.bulk_create(biases_to_create)