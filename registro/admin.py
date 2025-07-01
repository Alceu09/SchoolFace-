from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Cadastro_user, Coleta_faces, Treinamento
admin.site.register(Cadastro_user)
admin.site.register(Coleta_faces)
admin.site.register(Treinamento)
