from rest_framework.routers import DefaultRouter
from .views import TradeLogViewSet, InstrumentViewSet

router = DefaultRouter()
router.register(r'trade-logs', TradeLogViewSet, basename='tradelog')
router.register(r'instruments', InstrumentViewSet, basename='instrument')

urlpatterns = router.urls