from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import TradeLog, Instrument
from .serializers import TradeLogSerializer, InstrumentSerializer

class InstrumentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer

class TradeLogViewSet(viewsets.ModelViewSet):
    serializer_class = TradeLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.analytics_trade_logs.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)