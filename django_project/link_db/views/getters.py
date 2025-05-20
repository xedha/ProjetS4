
from django.apps import apps
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
@csrf_exempt
def get_model_data(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

    model_name = request.GET.get('model')
    if not model_name:
        return JsonResponse({'error': 'Model name is required in the query string'}, status=400)
    try:
        Model = apps.get_model('link_db', model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{model_name}" not found'}, status=404)

        data = list(Model.objects.all().values())
        return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii': False})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
from link_db.models import Formations
def get_supervisor(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
    search = request.GET.get('formation_id','section')
    if not search:
        return JsonResponse({'error': 'Model name is required in the query string'}, status=400)
    
    
    

         