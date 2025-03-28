from django.urls import path
from .views import enseignants_list,utilisateur_list  # Import the function from views.py

urlpatterns = [
    path('enseignants/', enseignants_list, name='enseignants_list'),
    path('utilisateurs/', utilisateur_list, name='utilisateur_list'),
]
