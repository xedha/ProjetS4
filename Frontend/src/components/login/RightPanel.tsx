"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from 'react-i18next';
import logo from './logo.svg';
import "./RightPanel.css"

interface LoginFormData {
  email: string
  password: string
}

interface RightPanelProps {
  onLogin: (data: LoginFormData) => void
}

export const RightPanel: React.FC<RightPanelProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(formData)
  }

  return (
    <div className="right-panel">
      <div className="login-form-container">
        <div className="login-header">
          <img className="logo" src={logo} alt="Logo" />
          <span className="login-title">{t('login.title')}</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('login.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder={t('login.email')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('login.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder={t('login.password')}
            />
          </div>

          <button type="submit" className="login-button">
            {t('login.login')}
          </button>
        </form>
      </div>
    </div>
  )
}

