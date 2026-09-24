from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Paciente
from .serializers import PacienteSerializer


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by('-fecha_registro')
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]