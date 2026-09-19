from django.db import models
from django.contrib.auth.models import User


class PerfilUsuario(models.Model):

    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    ROLES = [
        ('administrador', 'Administrador'),
        ('odontologo', 'Odontólogo'),
        ('auxiliar', 'Auxiliar'),
    ]

    nombre = models.CharField(max_length=100)

    rol = models.CharField(max_length=20, choices=ROLES)

    def __str__(self):
        return f"{self.nombre} - {self.get_rol_display()}"
