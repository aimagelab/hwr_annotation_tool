from django.contrib import admin

# Register your models here.
from .models import *

# Register your models here.
admin.site.register(Autore)
admin.site.register(Opera)
admin.site.register(Pagina)
admin.site.register(Annotazione)
