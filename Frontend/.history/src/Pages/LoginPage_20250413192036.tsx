import type React from "react"
import  LeftPanel  from "../components/login/LeftPanel"
import { RightPanel } from "../components/login/RightPanel"
import "./LoginPage.css"

interface LoginPageProps {
  onLogin: (data: { email: string; password: string }) => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <LeftPanel />
        </div>
        <div className="login-right">
          <RightPanel onLogin={onLogin} />
        </div>
      </div>
    </div>
  )
}

