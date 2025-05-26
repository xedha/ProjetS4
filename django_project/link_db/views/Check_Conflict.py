from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import logging
from django.db.models import Count, Q, Prefetch, Sum
import json
import re
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
    Surveillance workload balance calculation.
    
    Calculates NbrSS = Total Surveillances (sum of nombre_surveillant) / Charges of Teachers with Surveillances
    
    This approach focuses on the total surveillance needs from Planning
    and only considers the teaching load (charges) of teachers who are actually doing surveillances.
    """
    
    # Parse request body for target_surveillances parameter
    target_surveillances = None
    if request.method == 'POST':
        try:
            body = json.loads(request.body.decode('utf-8'))
            target_surveillances = body.get('target_surveillances')
            if target_surveillances is not None:
                target_surveillances = int(target_surveillances)
                if target_surveillances < 0:
                    return JsonResponse({'error': 'Target surveillances must be a positive integer'}, status=400)
        except (json.JSONDecodeError, ValueError):
            pass
    
    print("DEBUG: Starting workload balance calculation using NBRSE method (sum of nombre_surveillant)...")
    
    # Step 1: Get all formations and categorize by semester type
    formations = Formations.objects.only('id', 'semestre').all()
    odd_formation_ids = []
    even_formation_ids = []
    unmatched_formation_ids = []  # Track formations that don't match pattern
    
    for formation in formations:
        if formation.semestre:
            # Extract semester number from patterns like "S1", "S2", etc.
            match = re.search(r'S(\d+)', formation.semestre, re.IGNORECASE)
            if match:
                semester_num = int(match.group(1))
                if semester_num % 2 == 1:  # Odd semester
                    odd_formation_ids.append(formation.id)
                else:  # Even semester
                    even_formation_ids.append(formation.id)
            else:
                unmatched_formation_ids.append(formation.id)
                print(f"DEBUG: Formation {formation.id} has semestre '{formation.semestre}' which doesn't match pattern")
        else:
            unmatched_formation_ids.append(formation.id)
            print(f"DEBUG: Formation {formation.id} has NULL semestre")
    
    print(f"DEBUG: Found {len(odd_formation_ids)} odd formations and {len(even_formation_ids)} even formations")
    print(f"DEBUG: {len(unmatched_formation_ids)} formations didn't match the semester pattern")
    
    # Step 2: Count ChargesEnseignement by semester type
    total_charges = ChargesEnseignement.objects.count()
    
    # Try both formation-based and direct semestre field counting
    odd_charges_count = ChargesEnseignement.objects.filter(
        Q(formation_id__in=odd_formation_ids) | Q(semestre__iregex=r'S[13579]')
    ).count()
    
    even_charges_count = ChargesEnseignement.objects.filter(
        Q(formation_id__in=even_formation_ids) | Q(semestre__iregex=r'S[2468]')
    ).count()
    
    print(f"DEBUG: Charges - Total: {total_charges}, Odd: {odd_charges_count}, Even: {even_charges_count}")
    
    # Step 3: Get teachers who have surveillances
    teachers_with_surveillances = set(
        Surveillant.objects.values_list('code_enseignant_id', flat=True).distinct()
    )
    print(f"DEBUG: Found {len(teachers_with_surveillances)} teachers with surveillances")
    
    # Count ChargesEnseignement only for teachers who have surveillances
    charges_with_surveillances = ChargesEnseignement.objects.filter(
        Code_Enseignant_id__in=teachers_with_surveillances
    ).count()
    
    odd_charges_with_surv = ChargesEnseignement.objects.filter(
        Code_Enseignant_id__in=teachers_with_surveillances
    ).filter(
        Q(formation_id__in=odd_formation_ids) | Q(semestre__iregex=r'S[13579]')
    ).count()
    
    even_charges_with_surv = ChargesEnseignement.objects.filter(
        Code_Enseignant_id__in=teachers_with_surveillances
    ).filter(
        Q(formation_id__in=even_formation_ids) | Q(semestre__iregex=r'S[2468]')
    ).count()
    
    print(f"DEBUG: Charges for teachers with surveillances - Total: {charges_with_surveillances}, Odd: {odd_charges_with_surv}, Even: {even_charges_with_surv}")
    
    # Step 4: Calculate total surveillances by summing nombre_surveillant from Planning
    total_surveillances_needed = Planning.objects.aggregate(
        total=Sum('nombre_surveillant')
    )['total'] or 0
    
    # Count actual surveillant assignments (for comparison)
    total_surveillances_assigned = Surveillant.objects.count()
    
    # Sum surveillances by semester type
    first_sem_surveillances_needed = Planning.objects.filter(
        formation_id__in=odd_formation_ids
    ).aggregate(total=Sum('nombre_surveillant'))['total'] or 0
    
    second_sem_surveillances_needed = Planning.objects.filter(
        formation_id__in=even_formation_ids
    ).aggregate(total=Sum('nombre_surveillant'))['total'] or 0
    
    print(f"DEBUG: Surveillances (sum of nombre_surveillant) - Total: {total_surveillances_needed}, 1st Sem: {first_sem_surveillances_needed}, 2nd Sem: {second_sem_surveillances_needed}")
    print(f"DEBUG: Actual surveillant assignments: {total_surveillances_assigned}")
    print(f"DEBUG: Surveillance assignment rate: {total_surveillances_assigned}/{total_surveillances_needed} = {(total_surveillances_assigned/total_surveillances_needed*100) if total_surveillances_needed > 0 else 0:.1f}%")
    
    # Step 5: Calculate NbrSS using only charges of teachers who have surveillances
    first_sem_nbrss = first_sem_surveillances_needed / odd_charges_with_surv if odd_charges_with_surv > 0 else 0
    second_sem_nbrss = second_sem_surveillances_needed / even_charges_with_surv if even_charges_with_surv > 0 else 0
    global_nbrss = total_surveillances_needed / charges_with_surveillances if charges_with_surveillances > 0 else 0
    
    print(f"DEBUG: NbrSS (using sum of nombre_surveillant) - Global: {global_nbrss:.2f}, 1st Sem: {first_sem_nbrss:.2f}, 2nd Sem: {second_sem_nbrss:.2f}")
    
    # Get other metrics
    total_plannings = Planning.objects.count()
    
    # Step 6: Get teacher surveillance counts
    teacher_surveillance_counts = dict(
        Surveillant.objects.values('code_enseignant_id').annotate(
            count=Count('id_surveillance')
        ).values_list('code_enseignant_id', 'count')
    )
    
    # Get all teachers
    all_teachers = list(Enseignants.objects.all())
    teacher_count = len(all_teachers)
    
    # Calculate average surveillances per teacher (using actual assignments)
    avg_surveillances_per_teacher = total_surveillances_assigned / teacher_count if teacher_count > 0 else 0
    
    # Calculate target surveillances per teacher (using sum of nombre_surveillant)
    target_surveillances_per_teacher = total_surveillances_needed / teacher_count if teacher_count > 0 else 0
    
    print(f"DEBUG: Actual avg surveillances per teacher: {avg_surveillances_per_teacher:.2f}")
    print(f"DEBUG: Target surveillances per teacher (based on planning needs): {target_surveillances_per_teacher:.2f}")
    
    # Step 7: Get teacher course counts by semester
    teacher_charges = ChargesEnseignement.objects.values(
        'Code_Enseignant_id', 'formation_id', 'semestre'
    )
    
    # Build dictionaries
    teacher_course_counts = {}
    teacher_odd_courses = {}
    teacher_even_courses = {}
    
    for charge in teacher_charges:
        code = charge['Code_Enseignant_id']
        formation_id = charge['formation_id']
        semestre = charge['semestre']
        
        # Increment total
        teacher_course_counts[code] = teacher_course_counts.get(code, 0) + 1
        
        # Increment by semester type
        if formation_id and formation_id in odd_formation_ids:
            teacher_odd_courses[code] = teacher_odd_courses.get(code, 0) + 1
        elif formation_id and formation_id in even_formation_ids:
            teacher_even_courses[code] = teacher_even_courses.get(code, 0) + 1
        elif semestre:
            # Fallback to direct semestre field check
            match = re.search(r'S(\d+)', semestre, re.IGNORECASE)
            if match:
                semester_num = int(match.group(1))
                if semester_num % 2 == 1:
                    teacher_odd_courses[code] = teacher_odd_courses.get(code, 0) + 1
                else:
                    teacher_even_courses[code] = teacher_even_courses.get(code, 0) + 1
    
    # Step 8: Analyze each teacher
    teacher_analysis = []
    need_more_count = 0
    need_fewer_count = 0
    on_target_count = 0
    
    baseline_surveillances = target_surveillances if target_surveillances is not None else avg_surveillances_per_teacher
    
    for teacher in all_teachers:
        code_enseignant = teacher.Code_Enseignant
        surveillance_count = teacher_surveillance_counts.get(code_enseignant, 0)
        courses_count = teacher_course_counts.get(code_enseignant, 0)
        odd_courses = teacher_odd_courses.get(code_enseignant, 0)
        even_courses = teacher_even_courses.get(code_enseignant, 0)
        
        # Calculate expected surveillances based on semester-specific NbrSS
        expected_surveillances_by_nbrss = (odd_courses * first_sem_nbrss) + (even_courses * second_sem_nbrss)
        
        # Calculate deviation from baseline
        if baseline_surveillances > 0:
            deviation = surveillance_count - baseline_surveillances
            deviation_percentage = (deviation / baseline_surveillances) * 100
        else:
            deviation = surveillance_count
            deviation_percentage = 100 if surveillance_count > 0 else 0
        
        # Determine status
        if target_surveillances is not None:
            # Fixed target mode
            if surveillance_count < target_surveillances:
                individual_status = 'BELOW_TARGET'
                shifts_needed = target_surveillances - surveillance_count
                individual_recommendation = f'Currently has {surveillance_count} surveillances. Needs {shifts_needed} more to reach target of {target_surveillances}.'
                severity = 'high' if shifts_needed >= 3 else 'medium'
                need_more_count += 1
            elif surveillance_count > target_surveillances:
                individual_status = 'ABOVE_TARGET'
                excess_shifts = surveillance_count - target_surveillances
                individual_recommendation = f'Currently has {surveillance_count} surveillances. Should reduce by {excess_shifts} to reach target of {target_surveillances}.'
                severity = 'high' if excess_shifts >= 3 else 'medium'
                need_fewer_count += 1
            else:
                individual_status = 'ON_TARGET'
                individual_recommendation = f'Perfect! Has exactly {target_surveillances} surveillances as targeted.'
                severity = 'none'
                on_target_count += 1
        else:
            # NbrSS-based mode
            nbrss_deviation = surveillance_count - expected_surveillances_by_nbrss
            
            if surveillance_count == 0 and courses_count > 0:
                individual_status = 'NO_SURVEILLANCE'
                individual_recommendation = f'Teacher has no surveillance but teaches {courses_count} courses. Should have ~{expected_surveillances_by_nbrss:.1f} surveillances.'
                severity = 'high'
                need_more_count += 1
            elif nbrss_deviation > 2:
                individual_status = 'OVERLOADED'
                individual_recommendation = f'Has {surveillance_count} surveillances but should have ~{expected_surveillances_by_nbrss:.1f} based on {courses_count} courses.'
                severity = 'medium' if nbrss_deviation < 4 else 'high'
                need_fewer_count += 1
            elif nbrss_deviation < -2:
                individual_status = 'UNDERUTILIZED'
                individual_recommendation = f'Has {surveillance_count} surveillances but should have ~{expected_surveillances_by_nbrss:.1f} based on {courses_count} courses.'
                severity = 'medium' if nbrss_deviation > -4 else 'high'
                need_more_count += 1
            else:
                individual_status = 'NORMAL'
                individual_recommendation = f'Has {surveillance_count} surveillances, expected ~{expected_surveillances_by_nbrss:.1f} based on {courses_count} courses.'
                severity = 'none'
                on_target_count += 1
        
        # Add semester breakdown
        if courses_count > 0:
            semester_info = f" (1st Sem: {odd_courses}, 2nd Sem: {even_courses})"
            individual_recommendation += semester_info
        
        teacher_analysis.append({
            'teacher_info': {
                'code': code_enseignant,
                'name': f"{teacher.prenom} {teacher.nom}",
                'email': teacher.email1 or teacher.email2 or "No email",
                'department': getattr(teacher, 'departement', 'Unknown')
            },
            'statistics': {
                'surveillance_count': surveillance_count,
                'courses_count': courses_count,
                'odd_semester_courses': odd_courses,
                'even_semester_courses': even_courses,
                'average_surveillances': round(avg_surveillances_per_teacher, 2),
                'expected_by_nbrss': round(expected_surveillances_by_nbrss, 2),
                'target_surveillances': target_surveillances,
                'deviation': round(deviation, 1),
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
        -abs(x['statistics']['deviation'])
    ))
    
    # Global recommendation
    surveillance_gap = None
    unfilled_surveillances = total_surveillances_needed - total_surveillances_assigned
    
    if target_surveillances is not None:
        total_needed_surveillances = target_surveillances * teacher_count
        surveillance_gap = total_needed_surveillances - total_surveillances_assigned
        
        if surveillance_gap > 0:
            global_status = 'NEED_MORE_SURVEILLANCES'
            global_recommendation = f'To reach target of {target_surveillances} per teacher, need {surveillance_gap} more surveillance assignments.'
        elif surveillance_gap < 0:
            global_status = 'TOO_MANY_SURVEILLANCES'
            global_recommendation = f'Have {abs(surveillance_gap)} more surveillance assignments than target of {target_surveillances} per teacher.'
        else:
            global_status = 'PERFECTLY_BALANCED'
            global_recommendation = f'Perfect! Total surveillances match the target of {target_surveillances} per teacher.'
    else:
        # NbrSS-based analysis
        if first_sem_nbrss < 0.8 or second_sem_nbrss < 0.8:
            global_status = 'NEED_MORE_SURVEILLANCES'
            global_recommendation = f'Low NbrSS ratios indicate insufficient surveillance coverage. Consider adding more surveillances.'
        elif first_sem_nbrss > 2.5 or second_sem_nbrss > 2.5:
            global_status = 'TOO_MANY_SURVEILLANCES'
            global_recommendation = f'High NbrSS ratios indicate excessive surveillance assignments. Consider reducing surveillances.'
        else:
            global_status = 'BALANCED'
            global_recommendation = f'Surveillance workload is well balanced across semesters.'
    
    # Add details about unfilled positions
    if unfilled_surveillances > 0:
        global_recommendation += f' Note: {unfilled_surveillances} surveillance positions are currently unfilled (Planning needs: {total_surveillances_needed}, Actual assignments: {total_surveillances_assigned}).'
    
    # Add details about the calculation method
    global_recommendation += f' (NbrSS calculated using sum of nombre_surveillant from Planning - '
    global_recommendation += f'1st Sem: {first_sem_nbrss:.2f} = {first_sem_surveillances_needed} needed / {odd_charges_with_surv} courses, '
    global_recommendation += f'2nd Sem: {second_sem_nbrss:.2f} = {second_sem_surveillances_needed} needed / {even_charges_with_surv} courses)'
    
    # Build distribution
    if target_surveillances is not None:
        distribution = {
            'below_target': need_more_count,
            'above_target': need_fewer_count,
            'on_target': on_target_count,
            'total_teachers': teacher_count
        }
        summary_message = (f"Target: {target_surveillances} surveillances per teacher. "
                          f"{need_more_count} teachers need more, {need_fewer_count} need fewer, "
                          f"{on_target_count} are on target. "
                          f"Planning needs {total_surveillances_needed} total surveillances, {total_surveillances_assigned} assigned.")
    else:
        no_surveillance_count = sum(1 for t in teacher_analysis if t['statistics']['status'] == 'NO_SURVEILLANCE')
        overloaded_count = sum(1 for t in teacher_analysis if t['statistics']['status'] == 'OVERLOADED')
        underutilized_count = sum(1 for t in teacher_analysis if t['statistics']['status'] == 'UNDERUTILIZED')
        normal_count = sum(1 for t in teacher_analysis if t['statistics']['status'] == 'NORMAL')
        
        distribution = {
            'no_surveillance': no_surveillance_count,
            'overloaded': overloaded_count,
            'underutilized': underutilized_count,
            'normal': normal_count,
            'total_teachers': teacher_count
        }
        summary_message = (f"Analyzed {teacher_count} teachers using NbrSS based on Planning needs: "
                          f"{no_surveillance_count} with no surveillance, "
                          f"{overloaded_count} overloaded, {underutilized_count} underutilized, {normal_count} normal. "
                          f"Planning needs {total_surveillances_needed} surveillances, {total_surveillances_assigned} assigned.")
    
    return JsonResponse({
        'global_metrics': {
            'total_charges_enseignement': total_charges,
            'total_charges_with_surveillances': charges_with_surveillances,
            'total_plannings': total_plannings,
            'total_surveillances_needed': total_surveillances_needed,
            'total_surveillances_assigned': total_surveillances_assigned,
            'unfilled_surveillances': unfilled_surveillances,
            'assignment_rate_percentage': round((total_surveillances_assigned / total_surveillances_needed * 100) if total_surveillances_needed > 0 else 0, 1),
            'global_nbrss': round(global_nbrss, 2),
            'first_semester_nbrss': round(first_sem_nbrss, 2),
            'second_semester_nbrss': round(second_sem_nbrss, 2),
            'first_semester_charges': odd_charges_count,
            'second_semester_charges': even_charges_count,
            'first_semester_surveillances_needed': first_sem_surveillances_needed,
            'second_semester_surveillances_needed': second_sem_surveillances_needed,
            'status': global_status,
            'recommendation': global_recommendation,
            'target_surveillances': target_surveillances,
            'surveillance_gap': surveillance_gap
        },
        'teacher_distribution': {
            **distribution,
            'total_surveillances_assigned': total_surveillances_assigned,
            'total_surveillances_needed': total_surveillances_needed,
            'average_per_teacher': round(avg_surveillances_per_teacher, 2),
            'target_per_teacher': round(target_surveillances_per_teacher, 2),
        },
        'teacher_analysis': teacher_analysis,
        'message': summary_message
    })
