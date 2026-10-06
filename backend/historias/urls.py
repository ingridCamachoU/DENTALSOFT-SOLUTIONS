from rest_framework.routers import DefaultRouter

from .views import HistoriaClinicaViewSet


router = DefaultRouter()
router.register('historias', HistoriaClinicaViewSet, basename='historia-clinica')

urlpatterns = router.urls