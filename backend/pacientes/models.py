from django.db import models


class Paciente(models.Model):

    TIPOS_DOCUMENTO = [
        ('CC', 'Cédula de ciudadanía'),
        ('TI', 'Tarjeta de identidad'),
        ('RC', 'Registro civil'),
        ('CE', 'Cédula de extranjería'),
        ('PA', 'Pasaporte'),
    ]

    SEXOS = [
        ('F', 'Femenino'),
        ('M', 'Masculino'),
        ('O', 'Otro'),
    ]

    tipo_documento = models.CharField(
        max_length=2,
        choices=TIPOS_DOCUMENTO,
        default='CC'
    )

    documento = models.CharField(
        max_length=20,
        unique=True
    )

    nombres = models.CharField(max_length=100)

    apellidos = models.CharField(max_length=100)

    fecha_nacimiento = models.DateField(
        null=True,
        blank=True
    )

    sexo = models.CharField(
        max_length=1,
        choices=SEXOS,
        blank=True
    )

    telefono = models.CharField(
        max_length=20,
        blank=True
    )

    correo = models.EmailField(
        blank=True
    )

    direccion = models.CharField(
        max_length=200,
        blank=True
    )

    ciudad = models.CharField(
        max_length=100,
        default='Cúcuta'
    )

    fecha_registro = models.DateTimeField(
        auto_now_add=True
    )

    activo = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"