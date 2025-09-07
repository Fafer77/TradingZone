from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyReportCardView

router = DefaultRouter()

router.register(r'drcs', DailyReportCardView, basename='daily_report_card')

urlpatterns = [
    path('', include(router.urls)),
]
