from rest_framework_nested import routers
from .views import TradeSampleViewSet, TradeViewSet

router = routers.SimpleRouter()
router.register(r'samples', TradeSampleViewSet, basename='sample')

samples_router = routers.NestedSimpleRouter(router, r'samples', lookup='sample')
samples_router.register(r'trades', TradeViewSet, basename='sample-trades')

urlpatterns = router.urls + samples_router.urls