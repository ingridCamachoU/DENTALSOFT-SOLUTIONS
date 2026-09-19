from django.contrib import admin
from .models import Tratamiento

@admin.register(Tratamiento)
class TratamientoAdmin(admin.ModelAdmin):

    list_display = (
        'paciente',
        'odontologo',
        'tratamiento',
        'diagnostico',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'valor',
    )

    search_fields = (
        'paciente__nombres',
        'paciente__apellidos',
        'paciente__documento',
        'tratamiento',
        'diagnostico',
    )

    list_filter = (
        'estado',
        'odontologo',
        'fecha_inicio',
    )