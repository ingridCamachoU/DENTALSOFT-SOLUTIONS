from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()

        correo = kwargs.get('email') or username

        if not correo or not password:
            return None

        try:
            usuario = UserModel.objects.get(email__iexact=correo)
        except UserModel.DoesNotExist:
            return None

        if usuario.check_password(password) and self.user_can_authenticate(usuario):
            return usuario

        return None