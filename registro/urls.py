from django.urls import path
from . import views

urlpatterns = [path("", views.configurando_view, name="configurando_view")]

