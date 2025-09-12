from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from trade_samples.views import TradeViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'trades', TradeViewSet, basename='trade')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('userentries.urls')),
    path('api/', include('drc.urls')),
    path('api/', include('trade_samples.urls')),
    path('api/', include(router.urls)),
    path('api/', include('analytics.urls')),
    path('api/', include('dashboard.urls')),
]
