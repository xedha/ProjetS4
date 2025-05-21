from rest_framework import serializers
from django.contrib.auth.models import User  # Using the existing User table
from .models import Enseignants, Formations, ChargesEnseignement

class EnseignantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enseignants
        fields = '__all__'

class FormationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formations
        fields = '__all__'

class ChargesEnseignementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargesEnseignement
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User  # Using the existing database
        fields = ['id', 'email', 'password']

    def create(self, validated_data):
        user, created = User.objects.get_or_create(
            email=validated_data['email']
        )
        if created:
            user.set_password(validated_data['password'])
            user.save()
        return user
