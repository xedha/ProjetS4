from django.shortcuts import render
from django.http import JsonResponse 
from .models import Enseignants,Utilisateurs
from django.contrib.auth.models import User
import json
from django.db.models import Q
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt


def enseignants_list(request):
    enseignants = Enseignants.objects.all()
    return render(request, 'enseignants.html', {'enseignants': enseignants})

def utilisateur_list(request):
    utilisateurs = User.objects.all()
    utilisateurs_data = [
        {"nom_utilisateur": user.username, "email": user.email,"mot_de_passe": user.password,
        "date_creation":user.last_login,"admin":user.is_superuser}
        for user in utilisateurs
    ]
    return JsonResponse(utilisateurs_data, safe=False, json_dumps_params={'indent': 4})

@csrf_exempt  # Needed for local testing without CSRF token
@require_POST
def search_enseignants(request):
    try:
        data = json.loads(request.body)
        query = data.get("query", "")

        if query:
            enseignants = Enseignants.objects.filter(
                Q(nom__icontains=query) | Q(prenom__icontains=query)
            )
        else:
            enseignants = Enseignants.objects.all()

        enseignants_data = [
            {
                "id": enseignant.code_enseignant,
                "nom": enseignant.nom,
                "prenom": enseignant.prenom,
                "specialite": enseignant.departement,
            }
            for enseignant in enseignants
        ]

        return JsonResponse(enseignants_data, safe=False, json_dumps_params={"indent": 4})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)


#@csrf_exempt------------------------------------------------------->kif kif 
def user_permission_add(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  
            username = data.get("username")  
            
            if not username:
                return JsonResponse({"error": "Username is required"}, status=400)

            user = User.objects.filter(username=username).first()  
            
            if user:
                user.is_superuser = True
                user.save()
                return JsonResponse({"message": f"Superuser permission added for {username}"})
            else:
                return JsonResponse({"error": "User not found"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Only POST requests allowed"}, status=405)
#from django.views.decorators.csrf import csrf_exempt--------------->add this line if u want to localy test
#@csrf_exempt------------------------------------------------------->kifkif
def user_permission_remouve(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)  
            username = data.get("username")  
            
            if not username:
                return JsonResponse({"error": "Username is required"}, status=400)

            user = User.objects.filter(username=username).first()  
            
            if user:
                user.is_superuser = False
                user.save()
                return JsonResponse({"message": f"Superuser permission remouved for {username}"})
            else:
                return JsonResponse({"error": "User not found"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Only POST requests allowed"}, status=405)

