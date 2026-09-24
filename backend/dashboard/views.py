from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


def inicio(request):
    return render(request, 'dashboard/inicio.html')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil_actual(request):
    return Response({
        'mensaje': 'Autenticación correcta',
        'usuario': request.user.username,
    })