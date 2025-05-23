import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../components/AuthContext"
import { LeftPanel } from "../components/login/LeftPanel"
import { RightPanel } from "../components/login/RightPanel"
import "./LoginPage.css"

interface LocationState {
  from?: { pathname: string }
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  
  // Get the page they were trying to visit or default to /teachers
  const from = (location.state as LocationState)?.from?.pathname || "/teachers"

  console.log('LoginPage render - isAuthenticated:', isAuthenticated, 'from:', from)

  // Redirect if already authenticated
  useEffect(() => {
    console.log('LoginPage useEffect - checking auth:', isAuthenticated)
    if (isAuthenticated) {
      console.log('User is authenticated, navigating to:', from)
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleLoginSuccess = () => {
    // Navigation will be handled by the useEffect above when isAuthenticated changes
    console.log("Login successful, waiting for auth state update...")
  }

  return (
    <div className="login-page">
      <LeftPanel />
      <RightPanel onLoginSuccess={handleLoginSuccess} />
    </div>
  )
}