from django.contrib import admin
from .models import Instrument, TradeLog

# Register your models here.
admin.site.register(Instrument)
admin.site.register(TradeLog)