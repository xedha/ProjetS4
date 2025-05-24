from django.shortcuts import render
from django.http import JsonResponse 
from django.contrib.auth.models import User
import json
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from xhtml2pdf import pisa
from django.core.mail import EmailMessage
from django.conf import settings
from datetime import datetime


from django.shortcuts import render
from django.http import JsonResponse 
from django.contrib.auth.models import User
import json
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from xhtml2pdf import pisa
from django.core.mail import EmailMessage
from django.conf import settings
from datetime import datetime

from django.shortcuts import render
from django.http import JsonResponse 
from django.contrib.auth.models import User
import json
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from xhtml2pdf import pisa
from django.core.mail import EmailMessage
from django.conf import settings
from datetime import datetime
from django.template.loader import render_to_string
from link_db.models import Creneau,ChargesEnseignement, Enseignants, Formations  ,Utilisateurs,Planning, Surveillant


from django.shortcuts import render
from django.http import JsonResponse 
from link_db.models import Enseignants, ChargesEnseignement, Planning, Surveillant
from django.contrib.auth.models import User
import json
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from xhtml2pdf import pisa
from django.core.mail import EmailMessage
from django.conf import settings
from datetime import datetime

@csrf_exempt
@require_POST
def send_bulk_pv(request):
    """Send PV emails to all charge de cours with their exam details"""
    try:
        surveillants_charge = get_charge_de_cours_with_emails()
        
        if not surveillants_charge.exists():
            return JsonResponse({'error': 'No charge de cours with valid emails found'}, status=400)
        
        print(f"Found {surveillants_charge.count()} charge de cours with valid emails")
        
        results = process_all_surveillants(surveillants_charge)
        
        return JsonResponse({
            'success': f'{results["success_count"]} PV emails sent successfully to charge de cours.',
            'total_processed': surveillants_charge.count(),
            'successful': results["success_count"],
            'failed': len(results["errors"]),
            'errors': format_errors(results["errors"])
        }, status=200 if results["success_count"] > 0 else 500)
    
    except Exception as e:
        print(f"Global error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': f'Global error: {str(e)}'}, status=500)


def get_charge_de_cours_with_emails():
    """Get all surveillants who are charge de cours with valid emails"""
    return Surveillant.objects.filter(
        est_charge_cours=1,
        code_enseignant__email1__isnull=False
    ).exclude(
        code_enseignant__email1=''
    ).select_related(
        'code_enseignant', 
        'id_planning__formation', 
        'id_planning__id_creneau'
    )


def process_all_surveillants(surveillants_charge):
    """Process all surveillants and send PV emails"""
    success_count = 0
    errors = []
    
    for surveillant_charge in surveillants_charge:
        try:
            if send_pv_to_surveillant(surveillant_charge):
                success_count += 1
            else:
                errors.append({
                    'enseignant': get_enseignant_name(surveillant_charge.code_enseignant),
                    'email': surveillant_charge.code_enseignant.email1,
                    'error': 'Failed to process surveillant'
                })
        except Exception as e:
            print(f"Error processing surveillant: {str(e)}")
            errors.append({
                'enseignant': get_enseignant_name(surveillant_charge.code_enseignant),
                'email': surveillant_charge.code_enseignant.email1,
                'error': f'Processing error: {str(e)}'
            })
    
    return {"success_count": success_count, "errors": errors}


def send_pv_to_surveillant(surveillant_charge):
    """Send PV email to a single surveillant charge de cours"""
    enseignant = surveillant_charge.code_enseignant
    planning = surveillant_charge.id_planning
    
    print(f"Processing charge de cours: {enseignant.prenom} {enseignant.nom} ({enseignant.email1})")
    
    # Prepare context data
    context = prepare_pv_context(surveillant_charge)
    
    # Generate PDF
    pdf_data = generate_pv_pdf(context)
    if not pdf_data:
        return False
    
    # Send email
    return send_pv_email(enseignant, context, pdf_data)


def prepare_pv_context(surveillant_charge):
    """Prepare context data for PV generation"""
    enseignant = surveillant_charge.code_enseignant
    planning = surveillant_charge.id_planning
    formation = planning.formation if planning else None
    creneau = planning.id_creneau if planning else None
    
    # Get surveillants for this planning
    surveillants = get_surveillants_list(planning)
    
    # Get module information
    module_info = get_module_info(enseignant, formation, planning)
    
    # Build surveillants HTML rows
    surveillants_html = build_surveillants_rows(surveillants)
    
    return {
        'date_document': datetime.now().strftime("%d/%m/%Y"),
        'nom_enseignant': f"{enseignant.prenom} {enseignant.nom}",
        'semestre': module_info['semestre'],
        'session': planning.session if planning and hasattr(planning, 'session') else "Session Normale",
        'annee_universitaire': module_info['annee_universitaire'],
        'module': module_info['module_intitule'],
        'module_nom': module_info['module_abv'],
        'niveau': module_info['niveau'],
        'section': planning.section if planning else "A",
        'date_exam': creneau.date_creneau.strftime("%d/%m/%Y") if creneau and hasattr(creneau, 'date_creneau') and creneau.date_creneau else datetime.now().strftime("%d/%m/%Y"),
        'locaux': creneau.salle if creneau and hasattr(creneau, 'salle') else "À déterminer",
        'surveillants_rows': surveillants_html,
        'surveillants': surveillants,
        'creneau': creneau
    }


def get_surveillants_list(planning):
    """Get list of surveillants for a planning"""
    surveillants_qs = Surveillant.objects.filter(id_planning=planning).select_related('code_enseignant')
    
    surveillants = []
    for s in surveillants_qs:
        if hasattr(s.code_enseignant, 'prenom') and hasattr(s.code_enseignant, 'nom'):
            role_marker = " (Responsable)" if s.est_charge_cours == 1 else ""
            surveillants.append({
                "nom": f"{s.code_enseignant.prenom} {s.code_enseignant.nom}{role_marker}"
            })
    
    return surveillants


def get_module_info(enseignant, formation, planning):
    """Get module information from ChargesEnseignement or formation"""
    # Default values
    info = {
        'module_intitule': "Module",
        'module_abv': "MOD",
        'semestre': "Semestre",
        'annee_universitaire': "2024/2025",
        'niveau': "L1"
    }
    
    # Try to get info from ChargesEnseignement
    charge = ChargesEnseignement.objects.filter(
        Code_Enseignant_id=enseignant,
        formation=formation,
        section=planning.section if planning else None
    ).first()
    
    if charge:
        info['module_intitule'] = getattr(charge, 'intitulé_module', '') or getattr(charge, 'intitule_module', '') or "Module"
        info['module_abv'] = getattr(charge, 'abv_module', '') or getattr(charge, 'abv_MODULE', '') or "MOD"
        info['semestre'] = getattr(charge, 'semestre', "Semestre")
        info['annee_universitaire'] = getattr(charge, 'annee_universitaire', "2024/2025")
        info['niveau'] = getattr(charge, 'palier', "L1")
    elif formation:
        # Fallback to formation info
        info['module_intitule'] = formation.modules or "Module"
        info['module_abv'] = info['module_intitule'].split('-')[0].strip() if '-' in info['module_intitule'] else info['module_intitule'][:10]
        info['semestre'] = formation.semestre or "Semestre"
        info['niveau'] = formation.niveau_cycle or "L1"
    
    return info


def build_surveillants_rows(surveillants):
    """Build HTML rows for surveillants table"""
    html = ""
    
    # Add surveillant rows
    for surveillant in surveillants:
        html += f"""
      <tr>
        <td style="text-align: left; padding-left: 10px;">{surveillant['nom']}</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
      </tr>"""
    
    # Add empty rows (minimum 15 total)
    for _ in range(max(0, 15 - len(surveillants))):
        html += """
      <tr>
        <td style="text-align: left; padding-left: 10px;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
      </tr>"""
    
    return html


def generate_pv_pdf(context):
    """Generate PDF from PV template and context"""
    html_template = get_pv_template()
    
    # Replace placeholders with context values
    html_content = html_template
    for key, value in context.items():
        if key not in ['surveillants', 'creneau']:  # Skip non-string values
            html_content = html_content.replace(f'{{{key}}}', str(value))
    
    # Generate PDF
    buffer = BytesIO()
    try:
        pisa_status = pisa.CreatePDF(
            html_content,
            dest=buffer,
            encoding='utf-8'
        )
        
        if pisa_status.err:
            print(f"PDF generation error: {pisa_status.err}")
            return None
        
        pdf_data = buffer.getvalue()
        buffer.close()
        
        print(f"PDF generated successfully, size: {len(pdf_data)} bytes")
        return pdf_data
        
    except Exception as e:
        print(f"PDF generation exception: {str(e)}")
        return None


def send_pv_email(enseignant, context, pdf_data):
    """Send email with PV PDF attachment"""
    try:
        email_subject = f"PV d'examen - {context['module']} - {context['date_exam']}"
        
        # Build surveillants list for email
        other_surveillants = [s['nom'] for s in context['surveillants'] if "(Responsable)" not in s['nom']]
        surveillants_list = "\n".join([f"  - {s}" for s in other_surveillants]) if other_surveillants else "  Aucun autre surveillant"
        
        creneau = context.get('creneau')
        
        email_body = f"""Bonjour {context['nom_enseignant']},

En tant que responsable du module (chargé de cours), veuillez trouver ci-joint le procès-verbal d'examen pour:

- Module: {context['module']} ({context['module_nom']})
- Date: {context['date_exam']}
- Heure: {creneau.heure_creneau if creneau and hasattr(creneau, 'heure_creneau') else 'À confirmer'}
- Niveau: {context['niveau']}
- Section: {context['section']}
- Locaux: {context['locaux']}

Autres surveillants affectés:
{surveillants_list}

Merci de compléter ce PV et de le remettre au département après l'examen.

Cordialement,
L'administration de la Faculté d'Informatique
USTHB"""
        
        email = EmailMessage(
            subject=email_subject,
            body=email_body,
            from_email=settings.EMAIL_HOST_USER,
            to=[enseignant.email1]
        )
        
        # Attach PDF
        filename = f"PV_{context['module_nom']}_{context['section']}_{context['date_exam'].replace('/', '_')}.pdf"
        email.attach(filename, pdf_data, 'application/pdf')
        
        # Send email
        email.send()
        print(f"Email with PDF sent successfully to {enseignant.email1}")
        return True
        
    except Exception as e:
        print(f"Email sending failed for {enseignant.email1}: {str(e)}")
        return False


def get_enseignant_name(enseignant):
    """Get formatted name of enseignant"""
    if hasattr(enseignant, 'prenom') and hasattr(enseignant, 'nom'):
        return f"{enseignant.prenom} {enseignant.nom}"
    return "Unknown"


def format_errors(errors):
    """Format errors for response"""
    if len(errors) <= 10:
        return errors
    return errors[:10] + [{'message': f'... and {len(errors) - 10} more errors (truncated)'}]


def get_pv_template():
    """Return the PV HTML template"""
    return """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 1.5cm;
      @frame footer {
        -pdf-frame-content: footer;
        bottom: 1cm;
        margin-left: 1.5cm;
        margin-right: 1.5cm;
        height: 1cm;
      }
    }
    
    body {
      font-family: 'Helvetica', sans-serif;
      font-size: 12pt;
      line-height: 1.4;
      margin: 0;
      padding: 0;
    }

    .univ-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5cm;
    }

    .left, .right {
      width: 30%;
      font-size: 10pt;
    }

    .center-logo {
      width: 40%;
      text-align: center;
    }

    .usthb-date {
      text-align: right;
      margin-top: -0.5cm;
      margin-bottom: 0.5cm;
    }

    h2, h3, h4 {
      text-align: center;
      margin-bottom: 0.3cm;
    }

    .box {
      border: 1px solid #000;
      padding: 8pt;
      text-align: center;
      margin: 0.5cm auto;
      width: 70%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5cm;
      font-size: 10pt;
      -pdf-keep-in-frame-mode: shrink;
    }

    th, td {
      border: 1px solid #000;
      padding: 5pt;
      text-align: center;
    }

    th {
      background-color: #f2f2f2;
    }

    /* Set column widths */
    td:nth-child(1), th:nth-child(1) {
      width: 50%;
      text-align: left;
      padding-left: 10pt;
    }

    td:nth-child(2), th:nth-child(2) {
      width: 25%;
    }

    td:nth-child(3), th:nth-child(3) {
      width: 25%;
    }

    .observations {
      margin-top: 0.8cm;
    }

    .signature {
      margin-top: 0.5cm;
      text-align: right;
      font-style: italic;
    }

    .notes {
      font-size: 9pt;
      margin-top: 0.5cm;
    }

    .footer {
      font-size: 10pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="univ-header">
    <div class="left">
      <p>
        République Algérienne Démocratique et Populaire<br>
        Ministère de l'Enseignement Supérieur<br>
        et de la Recherche Scientifique<br>
        Université des Sciences et de la<br>
        Technologie Houari Boumediene USTHB
      </p>
    </div>
    <div class="center-logo">
      <strong>FACULTÉ D'INFORMATIQUE</strong>
    </div>
    <div class="right" style="text-align: right; direction: rtl;">
      <p>
        الجمهورية الجزائرية الديمقراطية الشعبية<br>
        وزارة التعليم العالي و البحث العلمي<br>
        جامعة هواري بومدين للعلوم والتكنولوجيا
      </p>
    </div>
  </div>

  <div class="usthb-date"><strong>USTHB Le, {date_document}</strong></div>

  <h2><u>P.V d'examen</u></h2>
  <h4>Premier {semestre} {session} – Année {annee_universitaire}</h4>

  <div class="box">
    <p><strong>{nom_enseignant}</strong></p>
    <p>{module}</p>
    <p>{niveau} {section}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th colspan="3" style="background-color: #e3f2fd; text-align: left; padding: 10px; border: 1px solid #000;">
          <span style="margin-right: 40px;"><strong>Date</strong> {date_exam}</span>
          <span style="margin-right: 40px;"><strong>Locaux :</strong> {locaux}</span>
          <span><strong>Module</strong> {module_nom}, <strong>Section :</strong> {section}</span>
        </th>
      </tr>
      <tr>
        <th style="width: 50%; text-align: center;">Surveillants</th>
        <th style="width: 25%; text-align: center;">Emargement</th>
        <th style="width: 25%; text-align: center;">Nombre d'étudiants<br>présents</th>
      </tr>
    </thead>
    <tbody>
      {surveillants_rows}
    </tbody>
  </table>

  <p style="text-align: right; margin-top: 10px;"><strong>Total : _________________</strong></p>

  <div class="observations">
    <p><strong>Observations et Remarques :</strong></p>
    <p>………………………………………………………………………………………………………………………………………………</p>
    <p>………………………………………………………………………………………………………………………………………………</p>
    <p>………………………………………………………………………………………………………………………………………………</p>
  </div>

  <div class="signature">
    <p style="margin-top: 40px;">Signature du Responsable du Module</p>
    <p style="margin-top: 40px;">_______________________________</p>
  </div>

  <div class="notes">
    <ul>
      <li>Les consignes particulières, s'il y en a, sont à transmettre aux surveillants par mail avant l'examen.</li>
      <li>Ce PV est à remplir par le responsable du module et à remettre au département juste après l'examen.</li>
      <li>Il faut signaler les cas de remplacement.</li>
    </ul>
  </div>

</body>
</html>"""

@csrf_exempt
@require_POST
def send_bulk_convocations(request):
    """
    Envoie des convocations :
    - Si le client POSTe un JSON avec "convocations", on l'utilise.
    - Sinon, on charge toutes les convocations depuis la BDD (uniquement aux surveillants).
    """
    try:
        try:
            payload = json.loads(request.body) if request.body else {}
        except json.JSONDecodeError:
            payload = {}

        convocations = payload.get('convocations')
        if convocations is None:
            convocations = _fetch_all_convocations()

        results = process_all_convocations({}, convocations or [])
        return JsonResponse({
            'success': True,
            'message': f"{results.get('success_count', 0)} convocation(s) envoyée(s) avec succès",
            'errors': results.get('errors') or None
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f"Erreur lors de l'envoi: {str(e)}"}, status=500)


def _fetch_all_convocations():
    """
    Récupère toutes les convocations en se basant sur les surveillants assignés.
    Chaque convocation regroupe tous les créneaux (examens) où le surveillant intervient.
    """
    surveillants = Surveillant.objects.select_related(
        'code_enseignant',
        'id_planning__id_creneau',
        'id_planning__formation'
    ).all()

    grouped = {}
    for s in surveillants:
        teacher = getattr(s, 'code_enseignant', None)
        if not teacher:
            continue

        # Récupère l'email principal ou secondaire
        email = getattr(teacher, 'email1', None) or getattr(teacher, 'email2', None)
        if not email:
            continue

        name = f"{getattr(teacher, 'prenom', '')} {getattr(teacher, 'nom', '')}".strip() or teacher.Code_Enseignant
        if email not in grouped:
            grouped[email] = {
                'nom_enseignant': name,
                'email': email,
                'examens': []
            }

        planning = getattr(s, 'id_planning', None)
        if not planning:
            continue

        creneau = getattr(planning, 'id_creneau', None)
        formation = getattr(planning, 'formation', None)
        if not creneau or not formation:
            continue

        # Format des champs
        date_str = creneau.date_creneau.strftime('%d/%m/%Y') if hasattr(creneau, 'date_creneau') else ''
        horaire = getattr(creneau, 'heure_creneau', '')
        module_name = getattr(formation, 'modules', '')
        local = getattr(creneau, 'salle', '')

        grouped[email]['examens'].append({
            'date': date_str,
            'horaire': horaire,
            'module': module_name,
            'local': local
        })

    return list(grouped.values())


def process_all_convocations(data, convocations):
    """Process all convocations and send emails"""
    success_count = 0
    errors = []
    
    for conv in convocations:
        try:
            if send_convocation_to_teacher(data, conv):
                success_count += 1
            else:
                teacher_name = conv.get('nom_enseignant', 'inconnu')
                errors.append(f"Échec de l'envoi pour {teacher_name}")
        except Exception as e:
            teacher_name = conv.get('nom_enseignant', 'inconnu')
            errors.append(f"Erreur pour {teacher_name}: {str(e)}")
    
    return {"success_count": success_count, "errors": errors}


def send_convocation_to_teacher(data, conv):
    """Send convocation to a single teacher"""
    # Extract teacher information
    teacher_email = conv.get('email')
    teacher_name = conv.get('nom_enseignant', '')
    examens = conv.get('examens', [])
    
    if not teacher_email or not examens:
        print(f"Données manquantes pour {teacher_name or teacher_email}")
        return False
    
    # Prepare convocation data
    convocation_data = prepare_convocation_data(data, examens)
    
    # Generate PDF
    pdf_data = generate_convocation_pdf(teacher_name, convocation_data)
    if not pdf_data:
        return False
    
    # Send email
    return send_convocation_email(teacher_name, teacher_email, convocation_data, pdf_data)


def prepare_convocation_data(data, examens):
    """Prepare convocation data structure"""
    return {
        'date_document': datetime.now().strftime('%d/%m/%Y'),
        'annee_universitaire': data.get('annee_universitaire', '2024/2025'),
        'semestre': data.get('semestre', ''),
        'session': data.get('session', ''),
        'examens': examens
    }


def generate_convocation_pdf(teacher_name, convocation_data):
    """Generate PDF from convocation template"""
    html_template = get_convocation_template()
    
    # Build exam rows
    examens_html = build_exam_rows(convocation_data['examens'])
    
    # Replace placeholders
    html_content = html_template
    replacements = {
        '{date_document}': convocation_data['date_document'],
        '{annee_universitaire}': convocation_data['annee_universitaire'],
        '{semestre}': convocation_data['semestre'],
        '{session}': convocation_data['session'],
        '{teacher_name}': teacher_name,
        '{examens_rows}': examens_html
    }
    
    for key, value in replacements.items():
        html_content = html_content.replace(key, str(value))
    
    # Generate PDF
    buffer = BytesIO()
    try:
        result = pisa.CreatePDF(src=html_content, dest=buffer, encoding='utf-8')
        
        if result.err:
            print(f"PDF generation error for {teacher_name}")
            return None
        
        buffer.seek(0)
        return buffer.read()
        
    except Exception as e:
        print(f"PDF generation exception for {teacher_name}: {str(e)}")
        return None


def build_exam_rows(examens):
    """Build HTML rows for exams table"""
    html = ""
    for exam in examens:
        html += f"""
            <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6;">{exam.get('date', '')}</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">{exam.get('horaire', '')}</td>
                <td style="padding: 12px; border: 1px solid #dee2e6; text-align: left;">{exam.get('module', '')}</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">{exam.get('local', '')}</td>
            </tr>"""
    return html


def send_convocation_email(teacher_name, teacher_email, convocation_data, pdf_data):
    """Send email with convocation PDF attachment"""
    try:
        subject = f"Convocation de surveillance - {convocation_data['semestre']} {convocation_data['session']}"
        
        # Build exam list for email body
        exam_list = "\n".join([
            f"  - {exam['date']} à {exam['horaire']}: {exam['module']} (Local: {exam['local']})"
            for exam in convocation_data['examens']
        ])
        
        body = f"""Bonjour {teacher_name},

Vous êtes convoqué(e) pour la surveillance des examens suivants:

{exam_list}

Année universitaire: {convocation_data['annee_universitaire']}
Session: {convocation_data['semestre']} - {convocation_data['session']}

IMPORTANT: Votre présence est indispensable. Veuillez vous présenter au moins 10 minutes avant le début de l'examen.

Cordialement,
L'administration de la Faculté d'Informatique
USTHB"""
        
        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.EMAIL_HOST_USER,
            to=[teacher_email]
        )
        
        filename = f"Convocation_{teacher_name.replace(' ', '_')}.pdf"
        email.attach(filename, pdf_data, 'application/pdf')
        
        email.send()
        print(f"Convocation sent successfully to {teacher_name} ({teacher_email})")
        return True
        
    except Exception as e:
        print(f"Email sending failed for {teacher_name}: {str(e)}")
        return False


def get_convocation_template():
    """Return the convocation HTML template"""
    return """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 1.5cm;
        }
        
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000000;
            margin: 0;
            padding: 0;
        }
        
        .univ-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1cm;
        }
        
        .left, .right {
            width: 45%;
            font-size: 10pt;
        }
        
        .left p, .right p {
            margin: 0;
            line-height: 1.8;
        }
        
        .right {
            text-align: right;
            direction: rtl;
        }
        
        .faculty-title {
            text-align: center;
            margin: 30px 0;
            font-size: 18pt;
            font-weight: bold;
            color: #003366;
        }
        
        .date-section {
            text-align: right;
            margin: 20px 0;
            font-weight: bold;
        }
        
        h2 {
            text-align: center;
            color: #003366;
            font-size: 16pt;
            font-weight: bold;
            margin: 30px 0 10px 0;
            text-decoration: underline;
        }
        
        .session-info {
            text-align: center;
            font-style: italic;
            font-weight: bold;
            margin-bottom: 30px;
        }
        
        .greeting {
            margin: 20px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        
        th {
            background-color: #003366;
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #003366;
        }
        
        td {
            padding: 12px;
            text-align: center;
            border: 1px solid #dee2e6;
        }
        
        /* Set column widths */
        th:nth-child(1), td:nth-child(1) {
            width: 20%;
        }
        
        th:nth-child(2), td:nth-child(2) {
            width: 20%;
        }
        
        th:nth-child(3), td:nth-child(3) {
            width: 40%;
            text-align: left;
            padding-left: 15px;
        }
        
        th:nth-child(4), td:nth-child(4) {
            width: 20%;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .note {
            margin-top: 40px;
            padding: 20px;
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            font-size: 11pt;
        }
        
        .note-label {
            font-weight: bold;
            color: #856404;
        }
        
        .thanks {
            text-align: center;
            font-weight: bold;
            margin-top: 40px;
            font-size: 14pt;
        }
    </style>
</head>
<body>
    <div class="univ-header">
        <div class="left">
            <p>
                République Algérienne Démocratique et Populaire<br>
                Ministère de l'Enseignement Supérieur<br>
                et de la Recherche Scientifique<br>
                Université des Sciences et de la<br>
                Technologie Houari Boumediene USTHB
            </p>
        </div>
        <div class="right">
            <p>
                الجمهورية الجزائرية الديمقراطية الشعبية<br>
                وزارة التعليم العالي و البحث العلمي<br>
                جامعة هواري بومدين للعلوم والتكنولوجيا
            </p>
        </div>
    </div>

    <div class="faculty-title">FACULTÉ D'INFORMATIQUE</div>

    <div class="date-section">USTHB Le, {date_document}</div>

    <h2>Convocation de surveillance</h2>
    <h3 style="text-align: center; font-weight: normal; margin-top: -10px;">Année Universitaire {annee_universitaire}</h3>
    
    <div class="session-info">Examens du {semestre} - {session}</div>

    <div class="greeting">
        <p>Bonjour {teacher_name},</p>
        <p>Vous êtes affecté pour Surveiller,</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Horaire</th>
                <th style="text-align: left; padding-left: 15px;">Module</th>
                <th>Local</th>
            </tr>
        </thead>
        <tbody>
            {examens_rows}
        </tbody>
    </table>

    <div class="note">
        <p><span class="note-label">NB :</span> <strong>Votre Présence à la surveillance est indispensable.</strong> Si pour des raisons majeures vous devez vous absenter, veuillez-vous faire remplacer en informant l'administration.</p>
        <p>Veuillez-vous présenter au moins dix minutes avant le début de l'examen. Le bon déroulement de l'examen en dépend.</p>
    </div>

    <div class="thanks">Merci.</div>

</body>
</html>"""