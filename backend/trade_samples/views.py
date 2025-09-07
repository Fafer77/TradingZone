from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import TradeSample, Trade
from .serializers import TradeSampleSerializer, TradeSerializer


class TradeSampleViewSet(viewsets.ModelViewSet):
    serializer_class = TradeSampleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.trade_samples.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TradeViewSet(viewsets.ModelViewSet):
    serializer_class = TradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trade.objects.filter(sample__owner=self.request.user)

    def perform_create(self, serializer):
        sample_id = self.kwargs['sample_pk']
        sample = TradeSample.objects.get(id=sample_id, owner=self.request.user)
        serializer.save(sample=sample)