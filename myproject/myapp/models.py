# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models



class ChargesEnseignement(models.Model):
    id_charge = models.AutoField(primary_key=True)
    palier = models.CharField(db_column='PALIER', max_length=20, blank=True, null=True)  # Field name made lowercase.
    specialite = models.CharField(db_column='SPECIALITE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    semestre = models.CharField(db_column='SEMESTRE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    section = models.CharField(db_column='SECTION', max_length=10, blank=True, null=True)  # Field name made lowercase.
    groupe = models.CharField(db_column='Groupe', max_length=10, blank=True, null=True)  # Field name made lowercase.
    type = models.CharField(db_column='Type', max_length=20, blank=True, null=True)  # Field name made lowercase.
    intitule_module = models.CharField(db_column='Intitulé MODULE', max_length=100, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    abv_module = models.ForeignKey('Formations', models.DO_NOTHING, db_column='Abv MODULE', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    enseignant = models.IntegerField(db_column='Enseignant', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'charges_enseignement'



class Enseignants(models.Model):
    code_enseignant = models.CharField(db_column='Code Enseignant',unique=True, max_length=20, blank=True,  primary_key=True  )  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nom = models.CharField(db_column='NOM', max_length=50, blank=True, null=True)  # Field name made lowercase.
    prenom = models.CharField(db_column='PRENOM', max_length=50, blank=True, null=True)  # Field name made lowercase.
    nom_jeune_fille = models.CharField(max_length=50, blank=True, null=True)
    genre = models.CharField(db_column='Genre', max_length=10, blank=True, null=True)  # Field name made lowercase.
    etat = models.CharField(db_column='Etat', max_length=30, blank=True, null=True)  # Field name made lowercase.
    departement = models.CharField(max_length=50, blank=True, null=True)
    grade = models.CharField(db_column='GRADE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    email1 = models.CharField(max_length=100, blank=True, null=True)
    email2 = models.CharField(max_length=100, blank=True, null=True)
    tel1 = models.CharField(max_length=20, blank=True, null=True)
    tel2 = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'enseignants'


class Formations(models.Model):
    palier = models.CharField(db_column='PALIER', max_length=20, blank=True, null=True)  # Field name made lowercase.
    specialite = models.CharField(db_column='SPECIALITE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    semestre = models.CharField(db_column='SEMESTRE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    intitule_module = models.CharField(db_column='Intitulé MODULE', max_length=100, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    abv_module = models.CharField(db_column='Abv MODULE', primary_key=True, max_length=20)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    coeff = models.DecimalField(db_column='Coeff', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    credit = models.DecimalField(db_column='Crédit', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    unite = models.CharField(db_column='Unité', max_length=10, blank=True, null=True)  # Field name made lowercase.
    vhc = models.IntegerField(db_column='VHC', blank=True, null=True)  # Field name made lowercase.
    vhtd = models.IntegerField(db_column='VHTD', blank=True, null=True)  # Field name made lowercase.
    vhtp = models.IntegerField(db_column='VHTP', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'formations'


class Surveillance(models.Model):
    palier = models.CharField(db_column='PALIER', max_length=20, blank=True, null=True)  # Field name made lowercase.
    specialite = models.CharField(db_column='SPECIALITE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    semestre = models.CharField(db_column='SEMESTRE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    section = models.CharField(db_column='SECTION', max_length=10, blank=True, null=True)  # Field name made lowercase.
    date = models.DateField(db_column='Date', blank=True, null=True)  # Field name made lowercase.
    horaire = models.CharField(db_column='Horaire', max_length=50, blank=True, null=True)  # Field name made lowercase.
    salles = models.CharField(db_column='Salles', max_length=100, blank=True, null=True)  # Field name made lowercase.
    intitule_module = models.CharField(db_column='Intitulé MODULE', max_length=100, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    abv_module = models.ForeignKey(Formations, models.DO_NOTHING, db_column='Abv MODULE', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    surveillant = models.IntegerField(db_column='Surveillant', blank=True, null=True)  # Field name made lowercase.
    ordre = models.IntegerField(db_column='Ordre', blank=True, null=True)  # Field name made lowercase.
    nbrse = models.IntegerField(db_column='NbrSE', blank=True, null=True)  # Field name made lowercase.
    nbrss = models.IntegerField(db_column='NbrSS', blank=True, null=True)  # Field name made lowercase.
    mail = models.CharField(db_column='Mail', max_length=100, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'surveillance'



class Utilisateurs(models.Model):
    email = models.CharField(unique=True, max_length=255)
    nom_utilisateur = models.CharField(unique=True, max_length=100)
    mot_de_passe = models.CharField(max_length=255)
    rang = models.CharField(max_length=50, blank=True, null=True)
    date_creation = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'utilisateurs'
