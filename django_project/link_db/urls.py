from django.urls import path
from .views import register, login,logout
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('delete_model/', views.delete_model),
    path('get_model_data/',views.get_model_data),
    path('add_model_row/',views.add_model_row),
    path('Edit_Model/',views.Edit_Model)
    ]

