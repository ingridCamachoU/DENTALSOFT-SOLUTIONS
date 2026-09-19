from django.contrib import admin
from .models import Cita

@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):

    list_display = (
        'paciente',
        'odontologo',
        'fecha_hora',
        'motivo',
        'estado',
    )

    search_fields = (
        'paciente__nombres',
        'paciente__apellidos',
        'paciente__documento',
    )

    list_filter = (
        'estado',
        'odontologo',
        'fecha_hora',
    )