from django.db import models
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from random import randint

# Create your models here.


class Cadastro_user(models.Model):
    
    slug=models.SlugField(max_length=200, unique=True)
    
    foto=models.ImageField(upload_to='fotos/')
    
    nome=models.CharField(max_length=180)
    
    email=models.EmailField(max_length=80, unique=True)
    
    curso=models.CharField(max_length=200)    
   
    matricula=models.CharField(max_length=100, unique=True)
    
    def  __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        seq=self.name+ '_FUNC'+ str(randint(1000, 9999))
        self.slug=slugify(seq)
        super().save(*args, **kwargs)
        
class Coleta_faces(models.Model):
    aluno=models.ForeignKey(Cadastro_user, on_delete=models.CASCADE, related_name='aluno_coleta') 

    image=models.ImageField(upload_to='roi/')   
    
class Treinamento (models.Model):
    modelo=models.FileField(upload_to='treinamento/') 
  
  
    class meta:
        verbose_name = 'Treinamento'
        verbose_name_plural = 'Treinamentos'  
        
    def __str__(self):
        return 'Classificador (frontalface)'
    
    def clean (self):
        model=self.__class__
        if model.objects.exclude(id=self.id).exists():
            raise ValidationError('So pode haver um arquivo salvo.')     
        
 
    
    