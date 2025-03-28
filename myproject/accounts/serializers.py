from rest_framework import serializers
from django.contrib.auth.models import User  # Using the existing User table

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
