from rest_framework.response import Response
from rest_framework.decorators import api_view , permission_classes
from rest_framework import status
from django.contrib.auth.models import User  # Fetch users from existing database
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

# Function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Register API 
@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Check if the user already exists
    user = User.objects.filter(email=email).first()

    if user:
        return Response({'message': 'User already exists, please log in'}, status=status.HTTP_400_BAD_REQUEST)

    # If user does not exist
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({'message': 'User registered successfully', 'tokens': tokens}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login API 
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Check if the user exists
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'error': 'User not found, please register'}, status=status.HTTP_404_NOT_FOUND)

    # Authenticate user
    user = authenticate(username=user.username, password=password)
    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response({'message': 'Login successful', 'tokens': tokens}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])

@permission_classes([IsAuthenticated]) # Ensure user is logged in

def logout(request):
    try:
        refresh_token = request.data.get("refresh_token")  # Get refresh token from request
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)  # Blacklist the refresh token
        token.blacklist()

        return Response({'message': 'Logout successful'}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)    

