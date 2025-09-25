from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Reminder, MarketDriver, MarketBias
from .serializers import ReminderSerializer, MarketDriverSerializer, MarketBiasSerializer

class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.reminders.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class MarketDriverViewSet(viewsets.ModelViewSet):
    serializer_class = MarketDriverSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.market_drivers.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class MarketBiasViewSet(viewsets.ModelViewSet):
    serializer_class = MarketBiasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.market_biases.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
