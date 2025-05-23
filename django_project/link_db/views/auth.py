from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers import UserSerializer

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Register API - NO AUTHENTICATION REQUIRED
@api_view(['POST'])
@permission_classes([AllowAny])  # This explicitly allows anyone to access this endpoint
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Check if the user already exists
    if User.objects.filter(email=email).exists():
        return Response({'message': 'User already exists, please log in'}, status=status.HTTP_400_BAD_REQUEST)

    # Create user with email as username (since Django requires username)
    try:
        user = User.objects.create_user(
            username=email,  # Use email as username
            email=email,
            password=password
        )
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'User registered successfully', 
            'tokens': tokens,
            'user': {
                'id': user.id,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Login API - NO AUTHENTICATION REQUIRED
@api_view(['POST'])
@permission_classes([AllowAny])  # This explicitly allows anyone to access this endpoint
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Check if the user exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found, please register'}, status=status.HTTP_404_NOT_FOUND)

    # Authenticate user using username (which is email in our case)
    authenticated_user = authenticate(username=user.username, password=password)
    if authenticated_user is not None:
        tokens = get_tokens_for_user(authenticated_user)
        return Response({
            'message': 'Login successful', 
            'tokens': tokens,
            'user': {
                'id': authenticated_user.id,
                'email': authenticated_user.email
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # This endpoint DOES require authentication
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