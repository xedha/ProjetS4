"use client"

import type React from "react"
import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./Pages/LoginPage"
import { DashboardPage } from "./components/Dashboard/Dashboardpage"
import "./App.css"

// Import other pages as needed
// import { TeacherManagementPage } from './components/teachers/TeacherManagementPage';
// import { CourseManagementPage } from './components/courses/CourseManagementPage';
// etc.

interface User {
  email: string
  name: string
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (data: { email: string; password: string }) => {
    // In a real app, you would validate credentials with an API
    console.log("Login attempt with:", data)

    // For demo purposes, we'll just set a user
    setUser({
      email: data.email,
      name: "John Doe",
    })
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />

          {/* Add other protected routes here */}
          {/* 
          <Route 
            path="/teachers" 
            element={
              user ? <TeacherManagementPage /> : <Navigate to="/login" />
            } 
          />
          */}

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

