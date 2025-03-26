from django.db import models

# You can keep these models if you need them, or remove them if you want to use Django’s built-in ones.
class AuthGroup(models.Model):
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
    name = models.CharField(max_length=255)
    # Change the reference to use the built-in ContentType model
    content_type = models.ForeignKey('contenttypes.ContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
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
    palier = models.CharField(db_column='PALIER', max_length=20, blank=True, null=True)
    specialite = models.CharField(db_column='SPECIALITE', max_length=50, blank=True, null=True)
    semestre = models.CharField(db_column='SEMESTRE', max_length=10, blank=True, null=True)
    section = models.CharField(db_column='SECTION', max_length=10, blank=True, null=True)
    groupe = models.CharField(db_column='Groupe', max_length=10, blank=True, null=True)
    type = models.CharField(db_column='Type', max_length=20, blank=True, null=True)
    intitulé_module = models.CharField(db_column='Intitulé MODULE', max_length=100, blank=True, null=True)
    abv_module = models.ForeignKey('Formations', models.DO_NOTHING, db_column='Abv MODULE', blank=True, null=True)
    enseignant = models.IntegerField(db_column='Enseignant', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'charges_enseignement'
        verbose_name = "Charge d’enseignement"
        verbose_name_plural = "Charges d’enseignement"


class Enseignants(models.Model):
    # Set your actual primary key field here.
    code_enseignant = models.CharField(db_column='Code Enseignant', primary_key=True, max_length=20)
    nom = models.CharField(db_column='NOM', max_length=50, blank=True, null=True)
    prenom = models.CharField(db_column='PRENOM', max_length=50, blank=True, null=True)
    nom_jeune_fille = models.CharField(max_length=50, blank=True, null=True)
    genre = models.CharField(db_column='Genre', max_length=10, blank=True, null=True)
    etat = models.CharField(db_column='Etat', max_length=30, blank=True, null=True)
    departement = models.CharField(max_length=50, blank=True, null=True)
    grade = models.CharField(db_column='GRADE', max_length=20, blank=True, null=True)
    email1 = models.CharField(max_length=100, blank=True, null=True)
    email2 = models.CharField(max_length=100, blank=True, null=True)
    tel1 = models.CharField(max_length=20, blank=True, null=True)
    tel2 = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'enseignants'
        verbose_name = "Enseignant"
        verbose_name_plural = "Enseignants"


class Formations(models.Model):
    palier = models.CharField(db_column='PALIER', max_length=20, blank=True, null=True)
    specialite = models.CharField(db_column='SPECIALITE', max_length=50, blank=True, null=True)
    semestre = models.CharField(db_column='SEMESTRE', max_length=10, blank=True, null=True)
    intitulé_module = models.CharField(db_column='Intitulé MODULE', max_length=100, blank=True, null=True)
    abv_module = models.CharField(db_column='Abv MODULE', primary_key=True, max_length=20)
    coeff = models.DecimalField(db_column='Coeff', max_digits=4, decimal_places=2, blank=True, null=True)
    crédit = models.DecimalField(db_column='Crédit', max_digits=4, decimal_places=2, blank=True, null=True)
    unité = models.CharField(db_column='Unité', max_length=10, blank=True, null=True)
    vhc = models.IntegerField(db_column='VHC', blank=True, null=True)
    vhtd = models.IntegerField(db_column='VHTD', blank=True, null=True)
    vhtp = models.IntegerField(db_column='VHTP', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'formations'
        verbose_name = "Formation"
        verbose_name_plural = "Formations"



class Surveillance(models.Model):
    palier = models.CharField(db_column='PALIER', max_length=20, blank=True, null=True)
    specialite = models.CharField(db_column='SPECIALITE', max_length=50, blank=True, null=True)
    semestre = models.CharField(db_column='SEMESTRE', max_length=10, blank=True, null=True)
    section = models.CharField(db_column='SECTION', max_length=10, blank=True, null=True)
    date = models.DateField(db_column='Date', blank=True, null=True)
    horaire = models.CharField(db_column='Horaire', max_length=50, blank=True, null=True)
    salles = models.CharField(db_column='Salles', max_length=100, blank=True, null=True)
    intitulé_module = models.CharField(db_column='Intitulé MODULE', max_length=100, blank=True, null=True)
    abv_module = models.ForeignKey(Formations, models.DO_NOTHING, db_column='Abv MODULE', blank=True, null=True)
    surveillant = models.IntegerField(db_column='Surveillant', blank=True, null=True)
    ordre = models.IntegerField(db_column='Ordre', blank=True, null=True)
    nbrse = models.IntegerField(db_column='NbrSE', blank=True, null=True)
    nbrss = models.IntegerField(db_column='NbrSS', blank=True, null=True)
    mail = models.CharField(db_column='Mail', max_length=100, blank=True, null=True)

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
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
