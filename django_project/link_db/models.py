# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class ChargesEnseignement(models.Model):
    id_charge = models.AutoField(primary_key=True)
    palier = models.CharField(db_column='PALIER', max_length=20, blank=True, null=True)  # Field name made lowercase.
    specialite = models.CharField(db_column='SPECIALITE', max_length=50, blank=True, null=True)  # Field name made lowercase.
    semestre = models.CharField(db_column='SEMESTRE', max_length=10, blank=True, null=True)  # Field name made lowercase.
    section = models.CharField(db_column='SECTION', max_length=10, blank=True, null=True)  # Field name made lowercase.
    groupe = models.CharField(db_column='Groupe', max_length=10, blank=True, null=True)  # Field name made lowercase.
    type = models.CharField(db_column='Type', max_length=20, blank=True, null=True)  # Field name made lowercase.
    intitulé_module = models.CharField(db_column='Intitulé MODULE', max_length=100, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    abv_module = models.CharField(db_column='Abv MODULE', max_length=20, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    Code_Enseignant_id = models.OneToOneField('Enseignants', models.DO_NOTHING, db_column='Code_Enseignant', blank=True, null=True)  # Field name made lowercase.
    annee_universitaire = models.CharField(max_length=7)
    formation = models.ForeignKey('Formations', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'charges_enseignement'


class Creneau(models.Model):
    id_creneau = models.AutoField(primary_key=True)
    date_creneau = models.DateField()
    heure_creneau = models.TimeField()
    salle = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'creneau'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    id = models.BigAutoField(primary_key=True)
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Enseignants(models.Model):
    Code_Enseignant = models.CharField(db_column='Code Enseignant', unique=True, max_length=20, blank=True, primary_key=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nom = models.CharField(db_column='NOM', max_length=50, blank=True, null=True)  # Field name made lowercase.
    prenom = models.CharField(db_column='PRENOM', max_length=50, blank=True, null=True)  # Field name made lowercase.
    nom_jeune_fille = models.CharField(db_column='Nom Jeune Fille', max_length=255, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    genre = models.CharField(db_column='Genre', max_length=10, blank=True, null=True)  # Field name made lowercase.
    etat = models.CharField(db_column='Etat', max_length=30, blank=True, null=True)  # Field name made lowercase.
    faculté = models.CharField(db_column='Faculté', max_length=255, blank=True, null=True)  # Field name made lowercase.
    département = models.CharField(db_column='Département', max_length=255, blank=True, null=True)  # Field name made lowercase.
    grade = models.CharField(db_column='GRADE', max_length=20, blank=True, null=True)  # Field name made lowercase.
    diplôme = models.CharField(db_column='Diplôme', max_length=255, blank=True, null=True)  # Field name made lowercase.
    type = models.CharField(db_column='Type', max_length=100, blank=True, null=True)  # Field name made lowercase.
    email1 = models.CharField(db_column='EMAIL1', max_length=255, blank=True, null=True)  # Field name made lowercase.
    email2 = models.CharField(db_column='EMAIL2', max_length=255, blank=True, null=True)  # Field name made lowercase.
    tel1 = models.CharField(db_column='TEL1', max_length=50, blank=True, null=True)  # Field name made lowercase.
    tel2 = models.CharField(db_column='TEL2', max_length=50, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'enseignants'


class Formations(models.Model):
    domaine = models.CharField(db_column='Domaine', max_length=100, blank=True, null=True)  # Field name made lowercase.
    filière = models.CharField(max_length=100, blank=True, null=True)
    niveau_cycle = models.CharField(db_column='Niveau/Cycle', max_length=100, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    specialités = models.CharField(db_column='Specialités', max_length=100, blank=True, null=True)  # Field name made lowercase.
    nbr_sections = models.IntegerField(db_column='Nbr Sections', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nbr_groupes = models.IntegerField(db_column='Nbr groupes', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    semestre = models.CharField(db_column='Semestre', max_length=100, blank=True, null=True)  # Field name made lowercase.
    modules = models.CharField(db_column='Modules', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'formations'


class Planning(models.Model):
    id_planning = models.AutoField(primary_key=True)
    formation = models.ForeignKey(Formations, models.DO_NOTHING)
    section = models.CharField(max_length=10)
    nombre_surveillant = models.IntegerField()
    session = models.CharField(max_length=20, blank=True, null=True)
    id_creneau = models.ForeignKey(Creneau, models.DO_NOTHING, db_column='id_creneau')

    class Meta:
        managed = True
        db_table = 'planning'


class Surveillant(models.Model):
    id_surveillance = models.AutoField(primary_key=True)
    id_planning = models.ForeignKey(Planning, models.DO_NOTHING, db_column='id_planning')
    code_enseignant = models.ForeignKey(Enseignants, models.DO_NOTHING, db_column='code_enseignant')
    est_charge_cours = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'surveillant'


class TokenBlacklistBlacklistedtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    blacklisted_at = models.DateTimeField()
    token = models.OneToOneField('TokenBlacklistOutstandingtoken', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'token_blacklist_blacklistedtoken'


class TokenBlacklistOutstandingtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    token = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField()
    user = models.ForeignKey(AuthUser, models.DO_NOTHING, blank=True, null=True)
    jti = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'token_blacklist_outstandingtoken'


class Utilisateurs(models.Model):
    email = models.CharField(unique=True, max_length=255)
    nom_utilisateur = models.CharField(unique=True, max_length=100)
    mot_de_passe = models.CharField(max_length=255)
    rang = models.CharField(max_length=50, blank=True, null=True)
    date_creation = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'utilisateurs'