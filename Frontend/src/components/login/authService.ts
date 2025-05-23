// authService.ts
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface LoginResponse {
  message: string;
  tokens: AuthTokens;
  user?: {
    id: number;
    email: string;
  };
}

interface RegisterResponse {
  message: string;
  tokens: AuthTokens;
  user?: {
    id: number;
    email: string;
  };
}

class AuthService {
  // Store tokens in localStorage
  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Clear tokens
  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Login method
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store tokens
      this.setTokens(data.tokens);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register method
  async register(credentials: LoginCredentials): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store tokens
      this.setTokens(data.tokens);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      const accessToken = this.getAccessToken();

      if (!refreshToken || !accessToken) {
        throw new Error('No tokens found');
      }

      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear tokens even if logout fails
    } finally {
      this.clearTokens();
    }
  }

  // Make authenticated request
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const accessToken = this.getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export default new AuthService();