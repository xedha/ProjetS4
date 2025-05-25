"use client"

import type React from "react"
import { useState } from "react"
// import { useTranslation } from 'react-i18next'; // Uncomment if using i18n
import { useAuth } from '../AuthContext'; // Import useAuth hook
import logo from './logo.svg';
import "./RightPanel.css"

interface LoginFormData {
  email: string
  password: string
}

interface RightPanelProps {
  onLogin?: (data: LoginFormData) => void
  onLoginSuccess?: () => void
}

export const RightPanel: React.FC<RightPanelProps> = ({ onLogin, onLoginSuccess }) => {
  // const { t } = useTranslation(); // Uncomment if using i18n
  const { login } = useAuth(); // Use auth context
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Logging in user:', formData.email);
      await login(formData.email, formData.password);
      console.log('Login completed');
      
      if (onLogin) {
        onLogin(formData);
      }
      
      if (onLoginSuccess) {
        console.log('Calling onLoginSuccess');
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Provide user-friendly error messages based on the error
      let errorMessage = 'An error occurred';
      
      if (err.message) {
        if (err.message.includes('Invalid credentials') || err.message.includes('401')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.message.includes('User not found') || err.message.includes('404')) {
          errorMessage = 'No account found with this email.';
        } else if (err.message.includes('Network') || err.message.includes('fetch')) {
          errorMessage = 'Connection error. Please check your internet and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="right-panel">
      <div className="login-form-container">
        <div className="login-header">
          <img className="logo" src={logo} alt="Logo" />
          <span className="login-title">Login</span>
        </div>

        {error && (
          <div className="error-message" style={{ 
            color: '#d32f2f', 
            marginBottom: '1rem', 
            padding: '0.75rem 1rem', 
            border: '1px solid #ffcdd2',
            borderRadius: '8px',
            backgroundColor: '#ffebee',
            position: 'absolute',
            top: '16rem',
            right: '4%',
            width: '33.625rem',
            textAlign: 'center',
            fontSize: '0.95rem',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};