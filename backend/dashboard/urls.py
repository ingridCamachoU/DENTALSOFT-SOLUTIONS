from django.urls import path

from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('perfil/', views.perfil_actual, name='perfil_actual'),
]