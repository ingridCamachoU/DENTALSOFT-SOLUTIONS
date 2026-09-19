from django.db import models
from pacientes.models import Paciente
from usuarios.models import PerfilUsuario


class HistoriaClinica(models.Model):

    paciente = models.OneToOneField(
        Paciente,
        on_delete=models.CASCADE,
        related_name='historia_clinica'
    )

    odontologo = models.ForeignKey(
        PerfilUsuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='historias_clinicas'
    )

    motivo_consulta = models.TextField()

    antecedentes_medicos = models.TextField(
        blank=True
    )

    alergias = models.TextField(
        blank=True
    )

    medicamentos_actuales = models.TextField(
        blank=True
    )

    antecedentes_odontologicos = models.TextField(
        blank=True
    )

    habitos = models.TextField(
        blank=True
    )

    diagnostico = models.TextField(
        blank=True
    )

    observaciones = models.TextField(
        blank=True
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    fecha_actualizacion = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Historia clínica - {self.paciente}"