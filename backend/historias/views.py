from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import HistoriaClinica
from .serializers import HistoriaClinicaSerializer


class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.all().order_by(
        '-fecha_actualizacion'
    )
    serializer_class = HistoriaClinicaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        perfil = getattr(
            self.request.user,
            'perfilusuario',
            None
        )

        serializer.save(odontologo=perfil)