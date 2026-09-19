from django.contrib import admin
from .models import HistoriaClinica


@admin.register(HistoriaClinica)
class HistoriaClinicaAdmin(admin.ModelAdmin):

    list_display = (
        'paciente',
        'odontologo',
        'fecha_creacion',
        'fecha_actualizacion',
    )

    search_fields = (
        'paciente__nombres',
        'paciente__apellidos',
        'paciente__documento',
    )

    list_filter = (
        'odontologo',
        'fecha_creacion',
    )