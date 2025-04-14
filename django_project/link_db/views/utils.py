from django.apps import apps
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import logging

logger = logging.getLogger(__name__)

# Mapping from the front-end model names to the actual Django model names.
MODEL_MAPPING = {
    'Teachers': 'Enseignants',
    'Teachings': 'ChargesEnseignement',
    # Add additional mappings as needed.
}

def get_actual_model_name(model_name):
    """Return the actual model name using the mapping, or the original if not mapped."""
    return MODEL_MAPPING.get(model_name, model_name)

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

        actual_model_name = get_actual_model_name(model_name)
        logger.debug(f"Deleting row from model: {actual_model_name}")

        # Dynamically get model – ensure 'link_db' is correct for your project.
        Model = apps.get_model('link_db', actual_model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{actual_model_name}" not found'}, status=404)

        obj = Model.objects.get(**{field_name: lookup_value})
        obj.delete()

        return JsonResponse({'message': f'{model_name} deleted successfully'}, status=200)

    except Model.DoesNotExist:
        return JsonResponse({'error': 'Row not found'}, status=404)

    except Exception as e:
        logger.exception("Error deleting model row")
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def get_model_data(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

    model_name = request.GET.get('model')
    if not model_name:
        return JsonResponse({'error': 'Model name is required in the query string'}, status=400)

    actual_model_name = get_actual_model_name(model_name)
    logger.debug(f"Fetching data for model: {actual_model_name}")

    try:
        Model = apps.get_model('link_db', actual_model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{actual_model_name}" not found'}, status=404)

        data = list(Model.objects.all().values())
        return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii': False})

    except Exception as e:
        logger.exception("Error fetching model data")
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

        actual_model_name = get_actual_model_name(model_name)
        logger.debug(f"Adding new row to model: {actual_model_name}")

        Model = apps.get_model('link_db', actual_model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{actual_model_name}" not found'}, status=404)

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

        actual_model_name = get_actual_model_name(model_name)
        logger.debug(f"Editing row in model: {actual_model_name}")

        Model = apps.get_model('link_db', actual_model_name)
        if not Model:
            return JsonResponse({'error': f'Model "{actual_model_name}" not found'}, status=404)

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
