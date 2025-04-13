from django.urls import path
from .views import enseignants_list,utilisateur_list,user_permission_add,user_permission_remouve  # Import the function from views.py
from .views import search_enseignants
urlpatterns = [
    path('enseignants/', enseignants_list, name='enseignants_list'),
    path('utilisateurs/', utilisateur_list, name='utilisateur_list'),
    path('user_permission/', user_permission_add, name='user_permission_add'),
    path('user_permission/', user_permission_remouve, name='user_permission_remouve'),
    path('search/', search_enseignants, name='search_enseignants'),


]
