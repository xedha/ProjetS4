from django.shortcuts import render
from django.http import JsonResponse 
from .models import Enseignants,Utilisateurs # Assurez-vous d'importer le bon modèle

def enseignants_list(request):
    enseignants = Enseignants.objects.all()
    return render(request, 'enseignants.html', {'enseignants': enseignants})

def utilisateur_list(request):
    utilisateurs = Utilisateurs.objects.all()
    utilisateurs_data = [
        {"nom_utilisateur": user.nom_utilisateur, "email": user.email,"mot_de_passe": user.mot_de_passe,"date_creation":user.date_creation}
        for user in utilisateurs
    ]
    return JsonResponse(utilisateurs_data, safe=False, json_dumps_params={'indent': 4})
