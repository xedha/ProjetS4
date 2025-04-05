"use client"

import type React from "react"
import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./Pages/LoginPage"
import { TeacherManagementPage } from "./components/teachers/TeacherManagementPage"
import { TeachingManagementPage } from "./components/teaching/TeachingManagementPage"
import "./App.css"

// Import other pages as needed
// import { CourseManagementPage } from './components/courses/CourseManagementPage';
// import { ExamSchedulingPage } from './components/exams/ExamSchedulingPage';
// import { SettingsPage } from './components/settings/SettingsPage';

interface User {
  email: string
  name: string
}

const App: React.FC = () => {
  // User state to track authentication
  const [user, setUser] = useState<User | null>(null)

  // Handle login functionality
  const handleLogin = (data: { email: string; password: string }) => {
    // In a real app, you would validate credentials with an API
    console.log("Login attempt with:", data)

    // For demo purposes, we'll just set a user
    setUser({
      email: data.email,
      name: "redha bouras",
    })
  }

  // Handle logout functionality
  const handleLogout = () => {
    setUser(null)
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* 
            Public routes - accessible without authentication
            If user is already logged in, redirect to teachers page
          */}
          <Route path="/login" element={user ? <Navigate to="/teachers" /> : <LoginPage onLogin={handleLogin} />} />

          {/* 
            Protected routes - require authentication
            If user is not logged in, redirect to login page
          */}

          {/* Teacher Management route */}
          <Route path="/teachers" element={user ? <TeacherManagementPage /> : <Navigate to="/login" />} />

          {/* Teaching Management route */}
          <Route path="/teaching" element={user ? <TeachingManagementPage /> : <Navigate to="/login" />} />

          {/* 
            Additional routes to be implemented:
            
            <Route 
              path="/courses" 
              element={
                user ? <CourseManagementPage /> : <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/exams" 
              element={
                user ? <ExamSchedulingPage /> : <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                user ? <SettingsPage /> : <Navigate to="/login" />
              } 
            />
          */}

          {/* 
            Root path redirect
            If user is logged in, go to teachers page, otherwise go to login
          */}
          <Route path="/" element={<Navigate to={user ? "/teachers" : "/login"} />} />

          {/* Redirect dashboard to teachers */}
          <Route path="/dashboard" element={<Navigate to="/teachers" />} />

          {/* 
            Catch-all route for any undefined paths
            Redirects to teachers if logged in, or login if not
          */}
          <Route path="*" element={<Navigate to={user ? "/teachers" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

