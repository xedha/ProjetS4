from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import logging
from django.db.models import Count
from link_db.models import Planning, Surveillant, Creneau, Formations, Enseignants, ChargesEnseignement

logger = logging.getLogger(__name__)

@csrf_exempt
def check_exam_date(request):
    exams = Planning.objects.select_related('formation', 'id_creneau').all()

    # Group slots by formation
    exam_checker = {}
    for exam in exams:
        formation = exam.formation_id
        creneau = exam.id_creneau

        exam_checker.setdefault(formation, []).append({
            'planning_id': exam.id_planning,
            'date': creneau.date_creneau,
            'time': creneau.heure_creneau,
        })
    
    # Find any "conflict" where date OR time differ
    conflicts_report = []
    
    for formation, slots in exam_checker.items():
        if len(slots) <= 1:
            continue

        # Get module name for this formation
        Module = Formations.objects.filter(pk=formation).values_list('modules', flat=True).first()
        
        formation_conflicts = []
        for i in range(len(slots)):
            for j in range(i + 1, len(slots)):
                s1, s2 = slots[i], slots[j]
                if s1['date'] != s2['date'] or s1['time'] != s2['time']:
                    formation_conflicts.append({
                        'planning1_id': s1['planning_id'],
                        'planning2_id': s2['planning_id'],
                        'date_1': str(s1['date']),
                        'time_1': str(s1['time']),
                        'date_2': str(s2['date']),
                        'time_2': str(s2['time']),
                    })

        if formation_conflicts:
            conflicts_report.append({
                'Module': Module or f"Formation {formation}",
                'conflicts': formation_conflicts,
            })

    # Return one of two JSON responses
    if conflicts_report:
        return JsonResponse({'conflicts': conflicts_report})
    else:
        return JsonResponse({'message': 'No date/time conflicts of this type found.'})


@csrf_exempt
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


@csrf_exempt
def check_surveillance_workload_balance(request):
    """
    Calculate surveillance workload balance (NbrSS) globally and for each teacher.
    Global NbrSS = Total ChargesEnseignement records / Total Planning records
    This metric helps determine if we need more or fewer surveillance shifts overall.
    """
    
    # Calculate global NbrSS
    total_charges = ChargesEnseignement.objects.count()
    total_plannings = Planning.objects.count()
    
    if total_plannings > 0:
        global_nbrss = total_charges / total_plannings
    else:
        global_nbrss = float('inf') if total_charges > 0 else 0
    
    # Determine global recommendation
    if global_nbrss > 3:
        global_status = 'NEED_MORE_SURVEILLANCES'
        global_recommendation = f'High NbrSS ratio ({global_nbrss:.2f}). Need to add more exam planning slots to balance workload.'
    elif global_nbrss < 1:
        global_status = 'TOO_MANY_SURVEILLANCES'
        global_recommendation = f'Low NbrSS ratio ({global_nbrss:.2f}). Consider reducing exam planning slots.'
    else:
        global_status = 'BALANCED'
        global_recommendation = f'NbrSS ratio ({global_nbrss:.2f}) is well balanced.'
    
    # Get surveillance count per teacher
    teachers_surveillance_count = {}
    surveillants = Surveillant.objects.values('code_enseignant_id').annotate(
        surveillance_count=Count('id_surveillance')
    )
    
    for item in surveillants:
        teachers_surveillance_count[item['code_enseignant_id']] = item['surveillance_count']
    
    # Get all teachers
    all_teachers = Enseignants.objects.all()
    
    # Analyze each teacher's surveillance load
    teacher_analysis = []
    total_surveillances = sum(teachers_surveillance_count.values())
    avg_surveillances_per_teacher = total_surveillances / len(all_teachers) if len(all_teachers) > 0 else 0
    
    for teacher in all_teachers:
        code_enseignant = teacher.Code_Enseignant
        surveillance_count = teachers_surveillance_count.get(code_enseignant, 0)
        
        # Calculate deviation from average
        if avg_surveillances_per_teacher > 0:
            deviation_percentage = ((surveillance_count - avg_surveillances_per_teacher) / avg_surveillances_per_teacher) * 100
        else:
            deviation_percentage = 0
        
        # Determine individual status
        if surveillance_count == 0:
            individual_status = 'NO_SURVEILLANCE'
            individual_recommendation = 'Teacher has no surveillance assignments. Should add shifts.'
            severity = 'high'
        elif deviation_percentage > 50:
            individual_status = 'OVERLOADED'
            individual_recommendation = f'Teacher has {surveillance_count} surveillances ({deviation_percentage:.1f}% above average). Consider removing shifts.'
            severity = 'medium'
        elif deviation_percentage < -50:
            individual_status = 'UNDERUTILIZED'
            individual_recommendation = f'Teacher has {surveillance_count} surveillances ({abs(deviation_percentage):.1f}% below average). Consider adding shifts.'
            severity = 'medium'
        else:
            individual_status = 'NORMAL'
            individual_recommendation = f'Teacher has {surveillance_count} surveillances (close to average).'
            severity = 'none'
        
        # Get teacher's course load for context
        courses_count = ChargesEnseignement.objects.filter(Code_Enseignant_id=code_enseignant).count()
        
        teacher_analysis.append({
            'teacher_info': {
                'code': code_enseignant,
                'name': f"{teacher.prenom} {teacher.nom}",
                'email': teacher.email1 or teacher.email2 or "No email",
                'department': teacher.département or "Unknown"
            },
            'statistics': {
                'surveillance_count': surveillance_count,
                'courses_count': courses_count,
                'average_surveillances': round(avg_surveillances_per_teacher, 2),
                'deviation_percentage': round(deviation_percentage, 1),
                'status': individual_status,
                'severity': severity
            },
            'recommendation': individual_recommendation
        })
    
    # Sort by severity and deviation
    severity_order = {'high': 0, 'medium': 1, 'low': 2, 'none': 3}
    teacher_analysis.sort(key=lambda x: (
        severity_order.get(x['statistics']['severity'], 3),
        -abs(x['statistics']['deviation_percentage'])
    ))
    
    # Count distribution
    no_surveillance_count = sum(1 for t in teacher_analysis if t['statistics']['status'] == 'NO_SURVEILLANCE')
    overloaded_count = sum(1 for t in teacher_analysis if t['statistics']['status'] == 'OVERLOADED')
    underutilized_count = sum(1 for t in teacher_analysis if t['statistics']['status'] == 'UNDERUTILIZED')
    normal_count = sum(1 for t in teacher_analysis if t['statistics']['status'] == 'NORMAL')
    
    return JsonResponse({
        'global_metrics': {
            'total_charges_enseignement': total_charges,
            'total_plannings': total_plannings,
            'global_nbrss': round(global_nbrss, 2) if global_nbrss != float('inf') else 'N/A',
            'status': global_status,
            'recommendation': global_recommendation
        },
        'teacher_distribution': {
            'total_teachers': len(all_teachers),
            'total_surveillances': total_surveillances,
            'average_per_teacher': round(avg_surveillances_per_teacher, 2),
            'no_surveillance': no_surveillance_count,
            'overloaded': overloaded_count,
            'underutilized': underutilized_count,
            'normal': normal_count
        },
        'teacher_analysis': teacher_analysis,
        'message': f"Global NbrSS: {global_nbrss:.2f}. Analyzed {len(all_teachers)} teachers: {no_surveillance_count} with no surveillance, {overloaded_count} overloaded, {underutilized_count} underutilized, {normal_count} normal."
    })