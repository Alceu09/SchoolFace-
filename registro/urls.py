from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

from django.urls import path
from registro.views import criar_aluno, criar_coleta_faces



urlpatterns = [path("", views.configurando_view, name="configurando_view")]


urlpatterns = [
 path('', criar_aluno, name='criar_aluno'),
 path('criar_coleta_faces/<int:aluno_id>', criar_coleta_faces, name='criar_coleta_faces'),]

if settings.DEBUG:
 urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
 urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

