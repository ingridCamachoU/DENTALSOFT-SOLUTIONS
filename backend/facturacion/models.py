from django.db import models
from pacientes.models import Paciente
from tratamiento.models import Tratamiento

class Factura(models.Model):

    METODOS_PAGO = [
        ('efectivo', 'Efectivo'),
        ('tarjeta', 'Tarjeta'),
        ('transferencia', 'Transferencia'),
        ('otro', 'Otro'),
    ]

    ESTADOS_PAGO = [
        ('pendiente', 'Pendiente'),
        ('pagada', 'Pagada'),
        ('anulada', 'Anulada'),
    ]

    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='facturas'
    )

    tratamiento = models.ForeignKey(
        Tratamiento,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='facturas'
    )

    numero_factura = models.CharField(
        max_length=30,
        unique=True,
        blank=True
    )

    fecha = models.DateField(
        auto_now_add=True
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    descuento = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    metodo_pago = models.CharField(
        max_length=20,
        choices=METODOS_PAGO
    )

    estado_pago = models.CharField(
        max_length=20,
        choices=ESTADOS_PAGO,
        default='pendiente'
    )

    observaciones = models.TextField(
        blank=True
    )

    def save(self, *args, **kwargs):
        if not self.numero_factura:
            super().save(*args, **kwargs)
            self.numero_factura = f"FAC-{self.pk:06d}"
            super().save(update_fields=['numero_factura'])
        else:
            super().save(*args, **kwargs)


def __str__(self):
    return f"Factura {self.numero_factura} - {self.paciente}"