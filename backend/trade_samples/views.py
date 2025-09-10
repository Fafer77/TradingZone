from django.db.models import Sum
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

    def _update_sample_pnl(self, sample):
        total_pnl = sample.trades.aggregate(total=Sum('realized_pnl'))['total']
        sample.pnl = total_pnl or 0.00
        sample.save()
        

    def perform_create(self, serializer):
        sample_id = self.kwargs['sample_pk']
        sample = TradeSample.objects.get(id=sample_id, owner=self.request.user)
        serializer.save(sample=sample)
        self._update_sample_pnl(sample)

    def perform_update(self, serializer):
        trade = serializer.save()
        self._update_sample_pnl(trade.sample)
    
    def perform_destroy(self, instance):
        sample = instance.sample
        instance.delete()
        self._update_sample_pnl(sample)
