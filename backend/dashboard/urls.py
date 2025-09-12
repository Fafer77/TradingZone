from rest_framework.routers import DefaultRouter
from .views import ReminderViewSet, MarketDriverViewSet

router = DefaultRouter()
router.register(r'reminders', ReminderViewSet, basename='reminder')
router.register(r'market-drivers', MarketDriverViewSet, basename='marketdriver')

urlpatterns = router.urls