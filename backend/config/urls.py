from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from usuarios.views import EmailTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('dashboard/', include('dashboard.urls')),
    path('api/', include('pacientes.urls')),
    path('api/', include('historias.urls')),

    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]