
from zipfile import BadZipFile
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from requests import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from link_db.models import Planning, Surveillant, Formations, Creneau, Enseignants
from rest_framework.parsers import MultiPartParser, FormParser
from openpyxl import load_workbook

import json
@require_GET
def get_planning_with_creneau_and_formation(request):
    """
    GET /api/planning-join/
    Retourne la liste de tous les plannings avec leur créneau et leur formation associée.
    """
    # On profite de select_related pour faire la jointure SQL sur formation et creneau
    queryset = Planning.objects.select_related('formation', 'id_creneau').all()

    data = []
    for plan in queryset:
        c = plan.id_creneau
        f = plan.formation

        data.append({
            'id_planning': plan.id_planning,
            'section': plan.section,
            'session': plan.session,
            'nombre_surveillant': plan.nombre_surveillant,
            'creneau': {
                'id_creneau': c.id_creneau,
                'date_creneau': c.date_creneau,
                'heure_creneau': c.heure_creneau,
                'salle': c.salle,
            },
            'formation': {
                'id': f.pk,
                'domaine': f.domaine,
                'filière': f.filière,
                'niveau_cycle': f.niveau_cycle,
                'specialités': f.specialités,
                'nbr_sections': f.nbr_sections,
                'nbr_groupes': f.nbr_groupes,
                'semestre': f.semestre,
                'modules': f.modules,
            }
        })

    return JsonResponse(data, safe=False)



@csrf_exempt
def delete_planning_only(request):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Only DELETE allowed'}, status=405)

    try:
        payload = json.loads(request.body)
        planning_id = payload.get('id_planning')
        if not planning_id:
            return JsonResponse({'error': 'Field "id_planning" is required'}, status=400)

        planning = Planning.objects.get(id_planning=planning_id)
        planning.delete()
        return JsonResponse({'message': f'Planning {planning_id} deleted successfully'}, status=200)

    except Planning.DoesNotExist:
        return JsonResponse({'error': f'No Planning found with id_planning = {planning_id}'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def create_planning_with_surveillants(request):
    """
    POST /api/planning-surveillants/create/
    Crée un Planning et plusieurs Surveillants liés.

    Corps JSON attendu :
    {
        "formation_id": <int>,
        "section": <str>,
        "nombre_surveillant": <int>,
        "session": <str>,               # optionnel
        "id_creneau": <int>,
        "surveillants": [
            {"code_enseignant": <str>, "est_charge_cours": <0|1>},  # au moins un avec 1
            {"code_enseignant": <str>},                              # défaut est_charge_cours=0
            ...
        ]
    }
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        required = ('formation_id','section','nombre_surveillant','id_creneau','surveillants')
        for f in required:
            if f not in data:
                return JsonResponse({'error': f'Field "{f}" is required'}, status=400)

        surveillants = data['surveillants']
        if not isinstance(surveillants, list) or not surveillants:
            return JsonResponse({'error': '"surveillants" must be a non-empty list'}, status=400)

        # Vérifie et normalize le flag est_charge_cours
        pcs = [s for s in surveillants if s.get('est_charge_cours') == 1]
        if len(pcs) > 1:
            return JsonResponse({'error': 'Only one surveillant can have est_charge_cours=1'}, status=400)
        if len(pcs) == 0:
            # aucun principal déclaré → on en fait le premier
            surveillants[0]['est_charge_cours'] = 1

        with transaction.atomic():
            # Création du planning
            planning = Planning.objects.create(
                formation_id = data['formation_id'],
                section      = data['section'],
                nombre_surveillant = data['nombre_surveillant'],
                session      = data.get('session',''),
                id_creneau_id= data['id_creneau']
            )

            created = []
            for s in surveillants:
                # chaque dict doit avoir code_enseignant
                code = s.get('code_enseignant')
                if not code:
                    transaction.set_rollback(True)
                    return JsonResponse({'error': 'Each surveillant needs "code_enseignant"'}, status=400)

                srv = Surveillant.objects.create(
                    id_planning       = planning,
                    code_enseignant_id= code,
                    est_charge_cours  = s.get('est_charge_cours', 0)
                )
                created.append(srv.id_surveillance)

        return JsonResponse({
            'message': 'Planning et surveillants créés avec succès',
            'id_planning': planning.id_planning,
            'surveillants': created
        }, status=201)

    except Formations.DoesNotExist:
        return JsonResponse({'error': 'Formation not found'}, status=404)
    except Creneau.DoesNotExist:
        return JsonResponse({'error': 'Creneau not found'}, status=404)
    except Enseignants.DoesNotExist:
        return JsonResponse({'error': 'Enseignant not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt   
def update_planning_with_surveillants(request):
    """
    PUT /api/planning-surveillants/update/
    Met à jour un Planning et son ensemble de Surveillants associés.
    Corps JSON attendu :
    {
        "id_planning": <int>,
        # champs Planning optionnels :
        "formation_id": <int>,
        "section": <str>,
        "nombre_surveillant": <int>,
        "session": <str>,
        "id_creneau": <int>,
        # liste entière des surveillants à conserver/créer :
        "surveillants": [
            {"code_enseignant": <str>, "est_charge_cours": <0|1>},
            ...
        ]
    }
    """
    if request.method != 'PUT':
        return JsonResponse({'error': 'Only PUT allowed'}, status=405)

    try:
        data = json.loads(request.body)
        planning_id = data.get('id_planning')
        surveillants = data.get('surveillants')

        if not planning_id:
            return JsonResponse({'error': '"id_planning" is required'}, status=400)
        if not isinstance(surveillants, list) or not surveillants:
            return JsonResponse({'error': '"surveillants" must be a non-empty list'}, status=400)

        # Vérification du flag est_charge_cours
        principals = [s for s in surveillants if s.get('est_charge_cours') == 1]
        if len(principals) > 1:
            return JsonResponse({'error': 'Only one surveillant can have est_charge_cours=1'}, status=400)
        if len(principals) == 0:
            surveillants[0]['est_charge_cours'] = 1

        with transaction.atomic():
            # Verify if planning exists
            if not Planning.objects.filter(id_planning=planning_id).exists():
                return JsonResponse({'error': f'Planning with id {planning_id} not found'}, status=404)
            
            # Verify if formation exists if formation_id is provided
            if 'formation_id' in data and not Formations.objects.filter(pk=data['formation_id']).exists():
                return JsonResponse({'error': f'Formation with id {data["formation_id"]} not found'}, status=404)
            
            # Verify if creneau exists if id_creneau is provided
            if 'id_creneau' in data and not Creneau.objects.filter(pk=data['id_creneau']).exists():
                return JsonResponse({'error': f'Creneau with id {data["id_creneau"]} not found'}, status=404)
            
            # Delete and recreate approach - delete the planning first
            old_planning = Planning.objects.get(id_planning=planning_id)
            planning_data = {
                'id_planning': planning_id,  # Keep the same ID
                'formation_id': data.get('formation_id', old_planning.formation_id),  # This is correct for Django ORM
                'section': data.get('section', old_planning.section),
                'nombre_surveillant': data.get('nombre_surveillant', old_planning.nombre_surveillant),
                'session': data.get('session', old_planning.session),
                'id_creneau_id': data.get('id_creneau', old_planning.id_creneau_id)
            }
            
            # Delete old planning (cascades to delete related surveillants)
            old_planning.delete()
            
            # Create new planning with same ID and updated data
            planning = Planning.objects.create(**planning_data)
            
            # Create new surveillants
            created = []
            for s in surveillants:
                code = s.get('code_enseignant')
                if not code:
                    transaction.set_rollback(True)
                    return JsonResponse({'error': 'Each surveillant needs "code_enseignant"'}, status=400)
                
                # Verify if enseignant exists
                if not Enseignants.objects.filter(Code_Enseignant=code).exists():
                    transaction.set_rollback(True)
                    return JsonResponse({'error': f'Enseignant with code {code} not found'}, status=404)

                srv = Surveillant.objects.create(
                    id_planning=planning,
                    code_enseignant_id=code,
                    est_charge_cours=s.get('est_charge_cours', 0)
                )
                created.append({
                    'id_surveillance': srv.id_surveillance,
                    'code_enseignant': code,
                    'est_charge_cours': srv.est_charge_cours
                })

        # Return the updated planning data
        return JsonResponse({
            'message': 'Planning et surveillants mis à jour avec succès',
            'planning': {
                'id_planning': planning.id_planning,
                'formation_id': planning.formation_id,
                'section': planning.section,
                'nombre_surveillant': planning.nombre_surveillant,
                'session': planning.session,
                'id_creneau': planning.id_creneau_id
            },
            'surveillants': created
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_GET
def get_surveillants_by_planning(request):
    """
    GET /api/surveillants/
    Retrieve all surveillants and their details for a specific planning ID.
    Query Parameters:
    - id_planning (int): The ID of the planning to fetch surveillants for.
    """
    planning_id = request.GET.get('id_planning')
    if not planning_id:
        return JsonResponse({'error': 'The "id_planning" parameter is required.'}, status=400)
    
    try:
        planning_id = int(planning_id)
    except ValueError:
        return JsonResponse({'error': 'Invalid "id_planning" value; must be an integer.'}, status=400)
    
    try:
        # Fetch surveillants and join with Enseignants
        surveillants = Surveillant.objects.filter(id_planning_id=planning_id).select_related('code_enseignant')
        data = []
        for surveillant in surveillants:
            enseignant = surveillant.code_enseignant
            # Construct enseignant details
            enseignant_details = {
                'Code_Enseignant': enseignant.Code_Enseignant,
                'nom': enseignant.nom,
                'prenom': enseignant.prenom,
                'nom_jeune_fille': enseignant.nom_jeune_fille,
                'genre': enseignant.genre,
                'etat': enseignant.etat,
                'faculté': enseignant.faculté,
                'département': enseignant.département,
                'grade': enseignant.grade,
                'diplôme': enseignant.diplôme,
                'type': enseignant.type,
                'email1': enseignant.email1,
                'email2': enseignant.email2,
                'tel1': enseignant.tel1,
                'tel2': enseignant.tel2,
            }
            data.append({
                'id_surveillance': surveillant.id_surveillance,
                'est_charge_cours': surveillant.est_charge_cours,
                'code_enseignant': surveillant.code_enseignant_id,
                'enseignant': enseignant_details
            })
        return JsonResponse(data, safe=False)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)  
@csrf_exempt
def get_monitoring_planning(request):
    monitoring_data = []
    
    try:
        # Get all plannings with related data
        plannings = Planning.objects.select_related('id_creneau', 'formation').prefetch_related('surveillant_set__code_enseignant')
        
        for planning in plannings:
            # Get all surveillants for this planning
            for surveillant in planning.surveillant_set.all():
                enseignant = surveillant.code_enseignant
                
                monitoring_data.append({
                    'teacher_name': f"{enseignant.prenom} {enseignant.nom}".strip() if enseignant.prenom and enseignant.nom else enseignant.Code_Enseignant,
                    'teacher_code': enseignant.Code_Enseignant,
                    'module': planning.formation.modules,
                    'room': planning.id_creneau.salle,
                    'date': str(planning.id_creneau.date_creneau),
                    'time': str(planning.id_creneau.heure_creneau),
                    'level': planning.formation.niveau_cycle,
                    'specialty': planning.formation.filière,
                    'role': 'Main' if surveillant.est_charge_cours == 1 else 'Assistant'
                })
        
        # Sort by teacher name, then by date and time
        monitoring_data.sort(key=lambda x: (x['teacher_name'], x['date'], x['time']))
        
        return JsonResponse(monitoring_data, safe=False)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

# Add this class to your Xcel_Api.py file

class UploadFormations_xlsx(APIView):
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        excel_file = request.FILES.get('excel_file')
        if not excel_file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Log file details for debugging
        print(f"Received file: {excel_file.name}")
        print(f"File size: {excel_file.size} bytes")
        print(f"Content type: {excel_file.content_type}")

        try:
            # Check file extension
            file_name = excel_file.name.lower()
            
            if file_name.endswith('.csv'):
                # Handle CSV files
                import csv
                import io
                
                # Read CSV file
                decoded_file = excel_file.read().decode('utf-8-sig')  # utf-8-sig handles BOM
                io_string = io.StringIO(decoded_file)
                reader = csv.reader(io_string)
                
                rows = list(reader)
                if len(rows) < 2:
                    return Response({
                        'error': 'CSV file appears to be empty or only contains headers'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                inserted = []
                skipped = []
                
                # Skip header row
                for row_num, row in enumerate(rows[1:], start=2):
                    if len(row) < 8:
                        skipped.append({
                            'row': f'Row {row_num}',
                            'reason': f'Insufficient columns. Expected at least 8, got {len(row)}'
                        })
                        continue
                    
                    # Process row data
                    domaine = row[0].strip() if row[0] else ''
                    filiere = row[1].strip() if len(row) > 1 else ''
                    niveau_cycle = row[2].strip() if len(row) > 2 else ''
                    specialites = row[3].strip() if len(row) > 3 else ''
                    nbr_sections = row[4].strip() if len(row) > 4 else ''
                    nbr_groupes = row[5].strip() if len(row) > 5 else ''
                    semestre = row[6].strip() if len(row) > 6 else ''
                    modules = row[7].strip() if len(row) > 7 else ''
                    
                    # Convert numeric fields
                    try:
                        nbr_sections_int = int(nbr_sections) if nbr_sections else None
                    except ValueError:
                        nbr_sections_int = None
                        
                    try:
                        nbr_groupes_int = int(nbr_groupes) if nbr_groupes else None
                    except ValueError:
                        nbr_groupes_int = None

                    # Check for duplicates
                    exists = Formations.objects.filter(
                        domaine=domaine,
                        filière=filiere,
                        niveau_cycle=niveau_cycle,
                        specialités=specialites
                    ).exists()
                    
                    if exists:
                        skipped.append({
                            'row': f'Row {row_num}',
                            'reason': 'Formation already exists with same domaine, filière, niveau_cycle, and specialités'
                        })
                        continue

                    try:
                        formation = Formations(
                            domaine=domaine,
                            filière=filiere,
                            niveau_cycle=niveau_cycle,
                            specialités=specialites,
                            nbr_sections=nbr_sections_int,
                            nbr_groupes=nbr_groupes_int,
                            semestre=semestre,
                            modules=modules
                        )
                        formation.save()
                        
                        inserted.append({
                            'id': formation.id,
                            'domaine': formation.domaine,
                            'filière': formation.filière,
                            'niveau_cycle': formation.niveau_cycle,
                            'specialités': formation.specialités
                        })
                    except Exception as e:
                        skipped.append({
                            'row': f'Row {row_num}',
                            'reason': f'Database error: {str(e)}'
                        })
                
            else:
                # Handle .xlsx files with openpyxl
                workbook = load_workbook(filename=excel_file, data_only=True)
                sheet = workbook.active

                inserted = []
                skipped = []
                
                # Check if sheet has any data
                if sheet.max_row < 2:
                    return Response({
                        'error': 'Excel file appears to be empty or only contains headers'
                    }, status=status.HTTP_400_BAD_REQUEST)

                for row_num, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
                    # Skip empty rows
                    if not row or all(cell is None for cell in row):
                        continue
                        
                    # Check if row has at least 8 columns
                    if len(row) < 8:
                        skipped.append({
                            'row': f'Row {row_num}',
                            'reason': f'Insufficient columns. Expected at least 8, got {len(row)}'
                        })
                        continue

                    # Extract values
                    domaine = str(row[0]).strip() if row[0] else ''
                    filiere = str(row[1]).strip() if row[1] else ''
                    niveau_cycle = str(row[2]).strip() if row[2] else ''
                    specialites = str(row[3]).strip() if row[3] else ''
                    nbr_sections = row[4] if row[4] is not None else None
                    nbr_groupes = row[5] if row[5] is not None else None
                    semestre = str(row[6]).strip() if row[6] else ''
                    modules = str(row[7]).strip() if row[7] else ''
                    
                    # Convert numeric fields
                    try:
                        if nbr_sections is not None:
                            nbr_sections_int = int(float(str(nbr_sections)))
                        else:
                            nbr_sections_int = None
                    except (ValueError, TypeError):
                        nbr_sections_int = None
                        
                    try:
                        if nbr_groupes is not None:
                            nbr_groupes_int = int(float(str(nbr_groupes)))
                        else:
                            nbr_groupes_int = None
                    except (ValueError, TypeError):
                        nbr_groupes_int = None

                    # Check for duplicates
                    exists = Formations.objects.filter(
                        domaine=domaine,
                        filière=filiere,
                        niveau_cycle=niveau_cycle,
                        specialités=specialites
                    ).exists()
                    
                    if exists:
                        skipped.append({
                            'row': f'Row {row_num}',
                            'reason': 'Formation already exists with same domaine, filière, niveau_cycle, and specialités'
                        })
                        continue

                    try:
                        formation = Formations(
                            domaine=domaine,
                            filière=filiere,
                            niveau_cycle=niveau_cycle,
                            specialités=specialites,
                            nbr_sections=nbr_sections_int,
                            nbr_groupes=nbr_groupes_int,
                            semestre=semestre,
                            modules=modules
                        )
                        formation.save()
                        
                        inserted.append({
                            'id': formation.id,
                            'domaine': formation.domaine,
                            'filière': formation.filière,
                            'niveau_cycle': formation.niveau_cycle,
                            'specialités': formation.specialités
                        })
                        
                    except Exception as e:
                        skipped.append({
                            'row': f'Row {row_num}',
                            'reason': f'Database error: {str(e)}'
                        })

            # If nothing was processed, the file might be in wrong format
            if len(inserted) == 0 and len(skipped) == 0:
                return Response({
                    'error': 'No valid data found in the file. Please check the file format.',
                    'expected_columns': [
                        'domaine', 'filiere', 'niveau_cycle', 'specialites', 
                        'nbr_sections', 'nbr_groupes', 'semestre', 'modules'
                    ],
                    'note': 'First row should be headers, data starts from row 2. Supported formats: .xlsx, .csv'
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                'message': f'Successfully processed file',
                'inserted': inserted,
                'skipped': skipped,
                'summary': {
                    'total_rows': len(inserted) + len(skipped),
                    'inserted_count': len(inserted),
                    'skipped_count': len(skipped)
                }
            }, status=status.HTTP_201_CREATED)

        except BadZipFile:
            return Response({
                'error': 'Invalid Excel file. The file appears to be corrupted or is not a valid Excel file.',
                'hint': 'Please ensure you are uploading a valid .xlsx or .csv file.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({
                'error': f'Error processing file: {str(e)}',
                'type': type(e).__name__,
                'hint': 'Please ensure your file has the correct format and column structure'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    