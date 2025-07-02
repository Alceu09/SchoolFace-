from django import forms
from .models import Cadastro_user  # Importe o modelo
from .models import Coleta_faces  # Importe o modelo para coleta de faces
class CadastroUserForm(forms.ModelForm):
    class Meta:
        model = Cadastro_user
        fields = ['nome', 'email', 'foto', 'matricula']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        for field in self.fields.values():
            field.widget.attrs['class']='form-control'
            
            
            
 # DOC: https://docs.djangoproject.com/en/5.1/topics/http/file-uploads/#uploading-multiple-files
# Multiplos Arquivos
class MultipleFileInput(forms.ClearableFileInput):
 allow_multiple_selected = True

class MultipleFileField(forms.FileField):

  def __init__(self, *args, **kwargs):

      kwargs.setdefault("widget", MultipleFileInput())

      super().__init__(*args, **kwargs)
 
  def clean(self, data, initial=None):
 
      single_file_clean = super().clean
 
      if isinstance(data, (list, tuple)):
 
          result = [single_file_clean(d, initial) for d in data]
 
      else:
        result = [single_file_clean(data, initial)]
      return result
class ColetaFacesForm(forms.ModelForm): 
    
    images = MultipleFileField()
   
    class Meta:
       model = Coleta_faces
   
       fields = ['images']
    def __init__(self, *args, **kwargs):
   
     super().__init__(*args, **kwargs)
   
     for field in self.fields.values():
   
      field.widget.attrs['class'] = 'form-control'
    
    
    
    
    