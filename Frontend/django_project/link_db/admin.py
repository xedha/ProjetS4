from django.contrib import admin
from .models import Enseignants,ChargesEnseignement,Formations,Surveillance,Utilisateurs
# Register your models here.
admin.site.register(Enseignants)
admin.site.register(ChargesEnseignement)
admin.site.register(Formations)
admin.site.register(Surveillance)
admin.site.register(Utilisateurs)



