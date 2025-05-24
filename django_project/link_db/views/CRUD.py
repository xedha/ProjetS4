from django.apps import apps
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Q
import json
import logging
logger = logging.getLogger(__name__)
@csrf_exempt
def delete_model(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        data = json.loads(request.body)

        model_name = data.get("model")  # e.g., "Teachers"
        field_name = data.get("field")  # e.g., "code_enseignant"
        lookup_value = data.get("value")  # e.g., "ENS123"

        if not all([model_name, field_name, lookup_value]):
            return JsonResponse({'error': 'Missing model, field, or value'}, status=400)

        
        logger.debug(f"Deleting row from model: {model_name}")

        # Dynamically get model – ensure 'link_db' is correct for your project.
        Model = apps.get_model('link_db', model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{model_name}" not found'}, status=404)

        obj = Model.objects.get(**{field_name: lookup_value})
        obj.delete()

        return JsonResponse({'message': f'{model_name} deleted successfully'}, status=200)

    except Model.DoesNotExist:
        return JsonResponse({'error': 'Row not found'}, status=404)

    except Exception as e:
        logger.exception("Error deleting model row")
        return JsonResponse({'error': str(e)}, status=500)
    

    
@csrf_exempt
def add_model_row(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        data = json.loads(request.body)

        model_name = data.get("model")
        fields = data.get("fields")

        if not model_name or not fields:
            return JsonResponse({'error': 'Missing model or fields'}, status=400)

    
        logger.debug(f"Adding new row to model: {model_name}")

        Model = apps.get_model('link_db', model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{model_name}" not found'}, status=404)

        obj = Model.objects.create(**fields)

        return JsonResponse({'message': f'{model_name} row created', 'id': getattr(obj, 'id', None)}, status=201)

    except Exception as e:
        logger.exception("Error adding model row")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def Edit_Model(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        data = json.loads(request.body)
        model_name = data.get("model")
        field_name = data.get("field")
        lookup_value = data.get("value")
        update_val = data.get("updates")

        if not all([model_name, field_name, lookup_value, update_val]):
            return JsonResponse({'error': 'Missing required data: model, field, value, or updates'}, status=400)

        
        logger.debug(f"Editing row in model: {model_name}")

        Model = apps.get_model('link_db', model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{model_name}" not found'}, status=404)

        obj = Model.objects.get(**{field_name: lookup_value})
        for key, val in update_val.items():
            setattr(obj, key, val)
        obj.save()

        return JsonResponse({
            'message': f'{model_name} row updated successfully',
            'updated_fields': list(update_val.keys()),
            'lookup': {field_name: lookup_value}
        }, status=200)

    except Model.DoesNotExist:
        return JsonResponse({'error': f'No {model_name} found with {field_name} = {lookup_value}'}, status=404)

    except Exception as e:
        logger.exception("Error editing model row")
        return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    
    
def get_model_data(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

    model_name = request.GET.get('model')
    if not model_name:
        return JsonResponse({'error': 'Model name is required in the query string'}, status=400)

    
    logger.debug(f"Fetching data for model: {model_name}")

    try:
        Model = apps.get_model('link_db', model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{model_name}" not found'}, status=404)

        data = list(Model.objects.all().values())
        return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii': False})

    except Exception as e:
        logger.exception("Error fetching model data")
        return JsonResponse({'error': str(e)}, status=500)
    
    
logger = logging.getLogger(__name__)

@csrf_exempt
def search_model(request):
    """
    Search across all fields of a model for a given query string.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        data = json.loads(request.body)
        
        model_name = data.get("model")
        search_query = data.get("query", "").strip()
        limit = data.get("limit", 100)
        
        # Debug logging
        logger.debug(f"=== SEARCH REQUEST ===")
        logger.debug(f"Model: {model_name}")
        logger.debug(f"Query: '{search_query}'")
        logger.debug(f"Limit: {limit}")
        
        if not model_name:
            return JsonResponse({'error': 'Model name is required'}, status=400)
        
        if not search_query:
            return JsonResponse({'error': 'Search query is required'}, status=400)
        
        # Get the model
        Model = apps.get_model('link_db', model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{model_name}" not found'}, status=404)
        
        # Build Q objects for all fields
        q_objects = Q()
        searchable_fields = []
        
        # Get all fields from the model
        for field in Model._meta.get_fields():
            # Only search in fields that can contain text
            if field.get_internal_type() in ['CharField', 'TextField', 'EmailField', 'URLField']:
                field_name = field.name
                searchable_fields.append(field_name)
                q_objects |= Q(**{f"{field_name}__icontains": search_query})
            
            # For numeric fields, only search if the query is numeric
            elif field.get_internal_type() in ['IntegerField', 'FloatField', 'DecimalField'] and search_query.isdigit():
                field_name = field.name
                searchable_fields.append(field_name)
                q_objects |= Q(**{f"{field_name}": search_query})
        
        logger.debug(f"Searchable fields: {searchable_fields}")
        
        # Perform the search
        if q_objects:
            results = Model.objects.filter(q_objects)[:limit]
            data = list(results.values())
            
            logger.debug(f"Found {len(data)} results")
            if data:
                logger.debug(f"First result: {data[0]}")
            
            response_data = {
                'results': data,
                'count': len(data),
                'query': search_query,
                'model': model_name
            }
            
            return JsonResponse(response_data, safe=False, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({
                'results': [],
                'count': 0,
                'query': search_query,
                'model': model_name,
                'message': 'No searchable fields found in this model'
            })
    
    except Exception as e:
        logger.exception("Error searching model")
        return JsonResponse({'error': str(e)}, status=500)
