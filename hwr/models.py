from django.db import models
# Create your models here.


class Autore(models.Model):
    nome = models.CharField(max_length=64)

    def __str__(self):
        return self.nome


class Opera(models.Model):
    nome = models.CharField(max_length=128)
    scheda = models.TextField(default="photo")
    autore = models.ForeignKey(Autore, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome


class Pagina(models.Model):
    opera = models.ForeignKey(Opera, on_delete=models.CASCADE)
    pagina_nr = models.IntegerField()
    photo = models.ImageField(upload_to="")
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.id

class Annotazione(models.Model):
    cropData = models.TextField()   # dati sul crop
    cropBoxData = models.TextField()    # dati per reset cropbox sul canvas
    canvasData = models.TextField()     # dati per reset canvas
    annotazione = models.TextField(default="")
    opera_id = models.IntegerField()
    page_id = models.IntegerField()
    annotated_by = models.CharField(max_length=32)  # username annotatore