from django.db import models
from pacientes.models import Paciente
from usuarios.models import PerfilUsuario

class Cita(models.Model):

    ESTADOS = [
        ('programada', 'Programada'),
        ('atendida', 'Atendida'),
        ('cancelada', 'Cancelada'),
        ('no_asistio', 'No asistió'),
    ]

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='citas'
    )

    odontologo = models.ForeignKey(
        PerfilUsuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='citas'
    )

    fecha_hora = models.DateTimeField()

    motivo = models.TextField()

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='programada'
    )

    observaciones = models.TextField(
        blank=True
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.paciente} - {self.fecha_hora}"