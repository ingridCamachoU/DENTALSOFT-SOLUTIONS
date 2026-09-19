from django.contrib import admin
from .models import Factura

@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):

    list_display = (
        'numero_factura',
        'paciente',
        'tratamiento',
        'fecha',
        'total',
        'metodo_pago',
        'estado_pago',
    )

    search_fields = (
        'numero_factura',
        'paciente__nombres',
        'paciente__apellidos',
        'paciente__documento',
    )

    list_filter = (
        'estado_pago',
        'metodo_pago',
        'fecha',
    )