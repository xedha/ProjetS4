from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import logging
from django.db.models import  Count
from link_db.models import Planning, Surveillant,Creneau,Salle
logger = logging.getLogger(__name__)


from django.db.models import Count


def distinct_creneau(request):
    # Group by formation, id_creneau, and section and count how many records in each group
    duplicates = Planning.objects.values('formation', 'id_creneau', 'section').annotate(
        group_creneau=Count('id_creneau')
    ).filter(group_creneau__gt=1)

    if duplicates.exists():
        occurence = []
        warnings = []

        for group in duplicates:
            # Get all planning ids for this formation & id_creneau & section
            planning_ids = list(
                Planning.objects.filter(
                    formation=group['formation'],
                    id_creneau=group['id_creneau'],
                    section=group['section'],
                ).values_list('id_planning', flat=True)
            )
            warning_msg = (
                f"There are exams with the same schedule "
                f"having multiple slots (found {group['group_creneau']} groups)."
            )
            warnings.append(warning_msg)
            occurence.append({
                'formation': group['formation'],
                'id_creneau': group['id_creneau'],
                'section': group['section'],
                'group_creneau': group['group_creneau'],
                'planning_ids': planning_ids
            })

        return JsonResponse({
            'warnings': warnings,
            'duplicates': occurence
        })

    return JsonResponse({
        'message': 'All exams have distinct scheduling.'
    })


def check_enseignant_schedule_conflict(request):
    conflicts = []
    
    # Get all surveillants with related planning and creneau data
    surveillants = Surveillant.objects.select_related(
        'id_planning',
        'id_planning__id_creneau',
    ).all()
    
    # Group surveillances by enseignant code
    enseignants_surveillances = {}
    
    for surveillant in surveillants:
        code_enseignant = surveillant.code_enseignant_id  # This is the value like "NOM6PRENOM6"
        
        if code_enseignant not in enseignants_surveillances:
            enseignants_surveillances[code_enseignant] = []
        
        # Get the planning and creneau details
        planning = surveillant.id_planning
        creneau = planning.id_creneau
        
        # Store the planning and associated creneau details
        enseignants_surveillances[code_enseignant].append({
            'planning_id': planning.id_planning,
            'date': creneau.date_creneau,
            'time': creneau.heure_creneau,
            'surveillance_id': surveillant.id_surveillance
        })
    
    # Debug - print what we found for each teacher
    for code_enseignant, surveillances in enseignants_surveillances.items():
        print(f"Teacher {code_enseignant} has {len(surveillances)} assignments:")
        for s in surveillances:
            print(f"  Planning {s['planning_id']} at {s['date']} {s['time']}")
    
    # Check for conflicts - same teacher assigned to different plannings at the same time
    for code_enseignant, surveillances in enseignants_surveillances.items():
        # Skip if this enseignant has only one surveillance
        if len(surveillances) <= 1:
            continue
            
        # Compare each pair of surveillances for this enseignant
        conflicts_for_enseignant = []
        
        for i in range(len(surveillances)):
            for j in range(i + 1, len(surveillances)):
                surv1 = surveillances[i]
                surv2 = surveillances[j]
                
                # Check if date and time overlap (exact match indicates conflict)
                if surv1['date'] == surv2['date'] and surv1['time'] == surv2['time']:
                    conflict_found = {
                        'surveillance1_id': surv1['surveillance_id'],
                        'planning1_id': surv1['planning_id'],
                        'surveillance2_id': surv2['surveillance_id'],
                        'planning2_id': surv2['planning_id'],
                        'date': str(surv1['date']),
                        'time': str(surv1['time'])
                    }
                    
                    conflicts_for_enseignant.append(conflict_found)
        
        # If conflicts found for this enseignant, add to main conflicts list
        if conflicts_for_enseignant:
            conflicts.append({
                'code_enseignant': code_enseignant,
                'conflicts': conflicts_for_enseignant
            })
    
    # For debugging - print what conflicts were found
    print(f"Found {len(conflicts)} teachers with conflicts")
    for conflict in conflicts:
        print(f"Teacher {conflict['code_enseignant']} has {len(conflict['conflicts'])} conflicts")
    
    return JsonResponse({'conflicts': conflicts}, safe=False)

def check_salle_schedule_conflict(request):
    conflicts = []
    
    # Get all salles with their related creneau data
    salles = Salle.objects.select_related('id_creneau').all()
    
    # Group salles by name and collect their creneaux
    salle_creneaux = {}
    for salle in salles:
        salle_name = salle.nom_salle
        creneau = salle.id_creneau  # Get the Creneau object linked to this salle
        
        if salle_name not in salle_creneaux:
            salle_creneaux[salle_name] = []
        
        # Store creneau details for this salle
        salle_creneaux[salle_name].append({
            'salle_id': salle.id_salle,
            'creneau_id': creneau.id_creneau,
            'date': creneau.date_creneau,
            'time': creneau.heure_creneau
        })
    
    # Check for conflicts: same salle in overlapping creneaux (same date/time)
    for salle_name, creneaux in salle_creneaux.items():
        # Skip if this salle has only one creneau assignment
        if len(creneaux) <= 1:
            continue
        
        # Compare each pair of creneaux for this salle
        conflicts_for_salle = []
        
        for i in range(len(creneaux)):
            for j in range(i + 1, len(creneaux)):
                cr1 = creneaux[i]
                cr2 = creneaux[j]
                
                # Check if date and time overlap (exact match indicates conflict)
                if cr1['date'] == cr2['date'] and cr1['time'] == cr2['time']:
                    conflict_found = {
                        'salle_name': salle_name,
                        'creneau1_id': cr1['creneau_id'],
                        'salle1_id': cr1['salle_id'],
                        'creneau2_id': cr2['creneau_id'],
                        'salle2_id': cr2['salle_id'],
                        'date': str(cr1['date']),
                        'time': str(cr1['time'])
                    }
                    conflicts_for_salle.append(conflict_found)
        
        # Add conflicts for this salle to the main list
        if conflicts_for_salle:
            conflicts.append({
                'salle': salle_name,
                'conflicts': conflicts_for_salle
            })
    
    return JsonResponse({'conflicts': conflicts}, safe=False)



