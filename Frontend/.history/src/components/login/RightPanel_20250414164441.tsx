"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "./logo.svg"
import "./RightPanel.css"

interface LoginFormData {
  email: string
  password: string
}

interface RightPanelProps {
  onLogin: (data: LoginFormData) => Promise<{ token: string } | null>
}

export const RightPanel: React.FC<RightPanelProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await onLogin(formData)

    if (response && response.token) {
      localStorage.setItem("token", response.token)
      navigate("/dashboard") // replace with your desired route
    } else {
      alert("Login failed: Invalid credentials.")
    }
  }

  return (
    <div className="right-panel">
      <div className="login-form-container">
        <div className="login-header">
          <img className="logo" src={logo} alt="Logo" />
          <span className="login-title">USER LOGIN</span>
        </div>

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
              placeholder="username@gmail.com"
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
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
