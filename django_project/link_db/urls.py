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
    path('edit_model/',views.Edit_Model),
    path('check_exam_date/',views.check_exam_date),
    path('check_enseignant_schedule_conflict/',views.check_enseignant_schedule_conflict),
    path('send_email/',views.send_email_view),
    path('delete_planning_only/',views.delete_planning_only),
    path('get_planning_with_creneau_and_formation/',views.get_planning_with_creneau_and_formation),
    path('create_planning_with_surveillants',views.create_planning_with_surveillants),
    path('update_planning_with_surveillants',views.update_planning_with_surveillants),
    path('get_surveillants_by_planning/', views.get_surveillants_by_planning, name='get_surveillants_by_planning'),
    path('get_monitoring_planning',views.get_monitoring_planning)
    ]

