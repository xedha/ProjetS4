from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from openpyxl import load_workbook
from django.core.exceptions import ObjectDoesNotExist
from link_db.models import Creneau,ChargesEnseignement, Enseignants, Formations  

class UploadExcel_creneau(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        excel_file = request.FILES.get('excel_file')

        if not excel_file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            workbook = load_workbook(filename=excel_file, data_only=True)
            sheet = workbook.active

            inserted = []

            for row in sheet.iter_rows(min_row=2, values_only=True):
                date, heure, salle = row[0], row[1], row[2]

                if not (date and heure):
                    continue

                
                if not Creneau.objects.filter(date_creneau=date, heure_creneau=heure, salle=salle).exists():
                    creneau = Creneau(date_creneau=date, heure_creneau=heure, salle=salle)
                    creneau.save()
                    inserted.append({
                        'date_creneau': date.isoformat(),
                        'heure_creneau': str(heure),
                        'salle': salle
                    })

            return Response({
                'message': f'{len(inserted)} new rows inserted.',
                'inserted': inserted
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ChargesEnseignement_xlsx(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        excel_file = request.FILES.get('excel_file')
        if not excel_file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            workbook = load_workbook(filename=excel_file, data_only=True)
            sheet = workbook.active

            inserted = []
            skipped = []

            for row in sheet.iter_rows(min_row=2, values_only=True):  # skip header

                # Adapt indices to your Excel file structure
                palier = row[0]
                specialite = row[1]
                semestre = row[2]
                section = row[3]
                groupe = row[4]
                type_charge = row[5]
                intitule_module = row[6]
                abv_module = row[7]
                code_enseignant_val = row[8]
                annee_universitaire = row[9]
                formation_val = row[10]

                # Validation: Required field
                if not annee_universitaire:
                    skipped.append({'row': row, 'reason': 'Missing annee_universitaire'})
                    continue

                # Attempt to get Enseignant instance or None
                enseignant = None
                if code_enseignant_val:
                    try:
                        enseignant = Enseignants.objects.get(pk=code_enseignant_val)
                    except ObjectDoesNotExist:
                        skipped.append({'row': row, 'reason': f'Enseignant with code {code_enseignant_val} not found'})
                        continue

                # Attempt to get Formation instance or None
                formation = None
                if formation_val:
                    try:
                        formation = Formations.objects.get(pk=formation_val)
                    except ObjectDoesNotExist:
                        skipped.append({'row': row, 'reason': f'Formation with id {formation_val} not found'})
                        continue

                # Prevent duplicates: check if this charge exists by unique fields (define your own criteria)
                exists = ChargesEnseignement.objects.filter(
                    palier=palier,
                    specialite=specialite,
                    semestre=semestre,
                    section=section,
                    groupe=groupe,
                    type=type_charge,
                    intitule_module=intitule_module,
                    abv_module=abv_module,
                    code_enseignant=enseignant,
                    annee_universitaire=annee_universitaire,
                    formation=formation
                ).exists()

                if exists:
                    skipped.append({'row': row, 'reason': 'Duplicate entry'})
                    continue

                # Create and save
                charge = ChargesEnseignement(
                    palier=palier,
                    specialite=specialite,
                    semestre=semestre,
                    section=section,
                    groupe=groupe,
                    type=type_charge,
                    intitule_module=intitule_module,
                    abv_module=abv_module,
                    code_enseignant=enseignant,
                    annee_universitaire=annee_universitaire,
                    formation=formation
                )
                charge.save()
                inserted.append({
                    'palier': palier,
                    'specialite': specialite,
                    'semestre': semestre,
                    'section': section,
                    'groupe': groupe,
                    'type': type_charge,
                    'intitule_module': intitule_module,
                    'abv_module': abv_module,
                    'code_enseignant': code_enseignant_val,
                    'annee_universitaire': annee_universitaire,
                    'formation': formation_val
                })

            return Response({
                'message': f'{len(inserted)} rows inserted, {len(skipped)} rows skipped.',
                'inserted': inserted,
                'skipped': skipped,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UploadEnseignants_xlsx(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        excel_file = request.FILES.get('excel_file')
        if not excel_file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            workbook = load_workbook(filename=excel_file, data_only=True)
            sheet = workbook.active

            inserted = []
            skipped = []

            for row in sheet.iter_rows(min_row=2, values_only=True):  # Skip header

                code_enseignant = row[0]
                nom = row[1]
                prenom = row[2]
                nom_jeune_fille = row[3]
                genre = row[4]
                etat = row[5]
                faculte = row[6]
                departement = row[7]
                grade = row[8]
                dipleme = row[9]
                type_ = row[10]
                email1 = row[11]
                email2 = row[12]
                tel1 = row[13]
                tel2 = row[14]

                if not code_enseignant:
                    skipped.append({'row': row, 'reason': 'Missing code_enseignant'})
                    continue

                # Prevent duplicates by code_enseignant
                if Enseignants.objects.filter(code_enseignant=code_enseignant).exists():
                    skipped.append({'row': row, 'reason': 'Duplicate code_enseignant'})
                    continue

                enseignant = Enseignants(
                    code_enseignant=code_enseignant,
                    nom=nom,
                    prenom=prenom,
                    nom_jeune_fille=nom_jeune_fille,
                    genre=genre,
                    etat=etat,
                    faculte=faculte,
                    departement=departement,
                    grade=grade,
                    dipleme=dipleme,
                    type=type_,
                    email1=email1,
                    email2=email2,
                    tel1=tel1,
                    tel2=tel2
                )
                enseignant.save()
                inserted.append({
                    'code_enseignant': code_enseignant,
                    'nom': nom,
                    'prenom': prenom
                })

            return Response({
                'message': f'{len(inserted)} enseignants inserted, {len(skipped)} skipped.',
                'inserted': inserted,
                'skipped': skipped,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)