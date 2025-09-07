from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DailyReportCard
from .serializers import DailyReportCardSerializer

class DailyReportCardView(viewsets.ModelViewSet):
    serializer_class = DailyReportCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.daily_report_cards.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

