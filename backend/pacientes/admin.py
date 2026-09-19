from django.contrib import admin
from .models import Paciente

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = (
        'nombres',
        'apellidos',
        'tipo_documento',
        'documento',
        'fecha_nacimiento',
        'sexo',
        'telefono',
        'correo',
        'ciudad',
        'activo',
    )

    search_fields = (
        'nombres',
        'apellidos',
        'documento',
    )

    list_filter = (
        'activo',
        'sexo',
        'tipo_documento',
    )

    fieldsets = (
        ('Información personal', {
            'fields': (
                'tipo_documento',
                'documento',
                'nombres',
                'apellidos',
                'fecha_nacimiento',
                'sexo',
            )
        }),

        ('Información de contacto', {
            'fields': (
                'telefono',
                'correo',
                'direccion',
                'ciudad',
            )
        }),

        ('Estado', {
            'fields': (
                'activo',
            )
        }),
    )