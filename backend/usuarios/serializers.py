from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        correo = attrs.get('correo')
        password = attrs.get('password')

        usuario = authenticate(
            email=correo,
            password=password
        )

        if usuario is None:
            raise serializers.ValidationError(
                'Correo o contraseña incorrectos.'
            )

        if not usuario.is_active:
            raise serializers.ValidationError(
                'Este usuario está desactivado.'
            )

        attrs['usuario'] = usuario

        return attrs


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'