from django.db import models
from pacientes.models import Paciente
from usuarios.models import PerfilUsuario

class Tratamiento(models.Model):

    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En proceso'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado'),
    ]

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='tratamientos'
    )

    odontologo = models.ForeignKey(
        PerfilUsuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tratamientos'
    )

    diagnostico = models.TextField()

    tratamiento = models.CharField(
        max_length=200
    )

    descripcion = models.TextField(
        blank=True
    )

    fecha_inicio = models.DateField()

    fecha_fin = models.DateField(
        null=True,
        blank=True
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='pendiente'
    )

    valor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    observaciones = models.TextField(
        blank=True
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.paciente} - {self.tratamiento}"