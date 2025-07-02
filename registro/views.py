from django.shortcuts import render, redirect
from .forms import CadastroUserForm, ColetaFacesForm
from .models import Cadastro_user, Coleta_faces
# Create your views here.

def  configurando_view(request):
    return render (request, 'base.html')



def criar_aluno(request): # View para criar um novo aluno, e verificar se foi enviado #
    if request.method == 'POST':
   
      form = CadastroUserForm(request.POST, request.FILES)
   
      if form.is_valid():# Vai iterar os arquivos enviados e cria uma entrada para cada imagem#

         aluno = form.save()
         return redirect('criar_coleta_faces', aluno_id=aluno.id)

    else:
          form = CadastroUserForm()
    return render(request, 'criar_aluno.html', {'form': form})
  
def criar_coleta_faces(request, aluno_id):
    aluno = Cadastro_user.objects.get(id=aluno_id)

    if request.method == 'POST':
        form = ColetaFacesForm(request.POST, request.FILES)
        if form.is_valid():
            for image in request.FILES.getlist('images'):
                Coleta_faces.objects.create(aluno=aluno, image=image)
            return redirect('alguma_view_final')  # ou outra página após salvar
    else:
        form = ColetaFacesForm()

    context = {
        'aluno': aluno,
        'form': form
    }
    return render(request, 'criar_coleta_faces.html', context)
