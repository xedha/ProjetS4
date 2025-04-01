# Cleaned-up models.py based on your original inspectdb output
# Safe clean-up applied:
# - Added primary_key=True where missing
# - Renamed problematic fields with proper Python names + db_column
# - Removed unnecessary auth/admin/session tables
# - Kept managed = False assuming existing DB

from django.db import models

class ChargesEnseignement(models.Model):
    id_charge = models.AutoField(primary_key=True)
    palier = models.CharField(db_column='PALIER', max_length=20, blank=True, null=True)
    specialite = models.CharField(db_column='SPECIALITE', max_length=50, blank=True, null=True)
    semestre = models.CharField(db_column='SEMESTRE', max_length=10, blank=True, null=True)
    section = models.CharField(db_column='SECTION', max_length=10, blank=True, null=True)
    groupe = models.CharField(db_column='Groupe', max_length=10, blank=True, null=True)
    type = models.CharField(db_column='Type', max_length=20, blank=True, null=True)
    intitule_module = models.CharField(db_column='Intitulé MODULE', max_length=100, blank=True, null=True)
    abv_module = models.CharField(db_column='Abv MODULE', max_length=20, blank=True, null=True)
    enseignant = models.IntegerField(db_column='Enseignant', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'charges_enseignement'


class Enseignants(models.Model):
    code_enseignant = models.CharField(db_column='Code Enseignant', max_length=20, primary_key=True)
    nom = models.CharField(db_column='NOM', max_length=50, blank=True, null=True)
    prenom = models.CharField(db_column='PRENOM', max_length=50, blank=True, null=True)
    nom_jeune_fille = models.CharField(db_column='Nom Jeune Fille', max_length=255, blank=True, null=True)
    genre = models.CharField(db_column='Genre', max_length=10, blank=True, null=True)
    etat = models.CharField(db_column='Etat', max_length=30, blank=True, null=True)
    faculte = models.CharField(db_column='Faculté', max_length=255, blank=True, null=True)
    departement = models.CharField(db_column='Département', max_length=255, blank=True, null=True)
    grade = models.CharField(db_column='GRADE', max_length=20, blank=True, null=True)
    diplome = models.CharField(db_column='Diplôme', max_length=255, blank=True, null=True)
    type = models.CharField(db_column='Type', max_length=100, blank=True, null=True)
    email1 = models.CharField(db_column='EMAIL1', max_length=255, blank=True, null=True)
    email2 = models.CharField(db_column='EMAIL2', max_length=255, blank=True, null=True)
    tel1 = models.CharField(db_column='TEL1', max_length=50, blank=True, null=True)
    tel2 = models.CharField(db_column='TEL2', max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'enseignants'


class Formations(models.Model):
    id = models.AutoField(primary_key=True)
    domaine = models.CharField(db_column='Domaine', max_length=100, blank=True, null=True)
    filiere = models.CharField(db_column='Filière', max_length=100, blank=True, null=True)
    niveau_cycle = models.CharField(db_column='Niveau/Cycle', max_length=100, blank=True, null=True)
    specialites = models.CharField(db_column='Specialités', max_length=100, blank=True, null=True)
    nbr_sections = models.IntegerField(db_column='Nbr Sections', blank=True, null=True)
    nbr_groupes = models.IntegerField(db_column='Nbr groupes', blank=True, null=True)
    semestre = models.CharField(db_column='Semestre', max_length=100, blank=True, null=True)
    modules = models.CharField(db_column='Modules', max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'formations'


class Surveillance(models.Model):
    id = models.AutoField(primary_key=True)
    palier = models.CharField(db_column='Palier', max_length=100, blank=True, null=True)
    specialite = models.CharField(db_column='Spécialité', max_length=100, blank=True, null=True)
    semestre = models.CharField(db_column='Semestre', max_length=100, blank=True, null=True)
    section = models.CharField(db_column='Section', max_length=100, blank=True, null=True)
    date = models.DateField(db_column='Date', blank=True, null=True)
    horaire = models.CharField(db_column='Horaire', max_length=50, blank=True, null=True)
    salle = models.CharField(db_column='Salle', max_length=100, blank=True, null=True)
    module = models.CharField(db_column='Module', max_length=255, blank=True, null=True)
    surveillant = models.IntegerField(db_column='Surveillant', blank=True, null=True)
    ordre = models.CharField(db_column='ORDRE', max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'surveillance'


class Utilisateurs(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=255)
    nom_utilisateur = models.CharField(unique=True, max_length=100)
    mot_de_passe = models.CharField(max_length=255)
    rang = models.CharField(max_length=50, blank=True, null=True)
    date_creation = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'utilisateurs'
