from rest_framework import serializers

from .models import HistoriaClinica


class HistoriaClinicaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(
        source='paciente.__str__',
        read_only=True
    )

    odontologo_nombre = serializers.CharField(
        source='odontologo.nombre',
        read_only=True
    )

    class Meta:
        model = HistoriaClinica
        fields = [
            'id',
            'paciente',
            'paciente_nombre',
            'odontologo',
            'odontologo_nombre',
            'motivo_consulta',
            'antecedentes_medicos',
            'alergias',
            'medicamentos_actuales',
            'antecedentes_odontologicos',
            'habitos',
            'diagnostico',
            'observaciones',
            'fecha_creacion',
            'fecha_actualizacion',
        ]
        read_only_fields = [
            'odontologo',
            'fecha_creacion',
            'fecha_actualizacion',
        ]

    def validate_paciente(self, paciente):
        historias = HistoriaClinica.objects.filter(
            paciente=paciente
        )

        if self.instance:
            historias = historias.exclude(
                pk=self.instance.pk
            )

        if historias.exists():
            raise serializers.ValidationError(
                'Este paciente ya tiene una historia clínica registrada.'
            )

        return paciente