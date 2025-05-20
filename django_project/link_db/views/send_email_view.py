from django.shortcuts import render
from django.http import JsonResponse 
from link_db.models import Enseignants,Utilisateurs
from django.contrib.auth.models import User
import json
from django.db.models import Q
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from xhtml2pdf import pisa
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.conf import settings
import json
@csrf_exempt
def send_email_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            emails = data.get('emails')  # list of emails
            html_content = data.get('html')

            if not (emails and html_content):
                return JsonResponse({'error': 'Missing emails or HTML content'}, status=400)
            buffer = BytesIO()
            result = pisa.CreatePDF(src=html_content, dest=buffer)

            if result.err:
                return JsonResponse({'error': 'PDF generation failed'}, status=500)

            buffer.seek(0)

            email = EmailMessage(
                subject=' Vos informations',
                body=html_content,
                from_email=settings.EMAIL_HOST_USER,
                to=emails
            )
            email.content_subtype = "html"
            email.attach('infos.pdf', buffer.read(), 'application/pdf')
            email.send()

            return JsonResponse({'success': f'Email envoyé à {emails}'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



