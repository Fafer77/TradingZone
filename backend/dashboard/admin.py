from django.contrib import admin
from .models import Reminder, MarketBias

# Rejestrujemy modele, aby były widoczne w panelu admina
admin.site.register(Reminder)
admin.site.register(MarketBias)