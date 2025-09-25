from rest_framework.routers import DefaultRouter
from .views import ReminderViewSet, MarketDriverViewSet, MarketBiasViewSet

router = DefaultRouter()
router.register(r'reminders', ReminderViewSet, basename='reminder')
router.register(r'market-drivers', MarketDriverViewSet, basename='marketdriver')
router.register(r'market-bias', MarketBiasViewSet, basename='marketbias')

urlpatterns = router.urls