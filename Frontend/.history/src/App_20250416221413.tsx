"use client"

import type React from "react"
import { Profiler, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "./Pages/LoginPage"
import { TeacherManagementPage } from "./components/teachers/TeacherManagementPage"
import { TeachingManagementPage } from "./components/teaching/TeachingManagementPage"
import Page from "./components/course/page"
import Page1 from "./components/exam/page1"
import Page2 from "./components/setting/page2"
import "./App.css"
import P from "./components/profile/profile"
import Page2 from "./components/profile/profile"
/**
 * Main App Component
 *
 * This component serves as the entry point for the ExamTrack application.
 * It handles:
 * - Routing between different pages
 * - Authentication state management
 * - Protected routes that require authentication
 * - Redirects for unauthorized access attempts
 */

// Define the User interface to type-check the user state
interface User {
  email: string
  name: string
}

const App: React.FC = () => {
  // Authentication state management

  // User state to track authentication
  // null means not authenticated, object means authenticated
  const [user, setUser] = useState<User | null>(null)

  /**
   * Handle login functionality
   * In a real app, this would validate credentials with an API
   * @param data - Object containing email and password
   */
  const handleLogin = (data: { email: string; password: string }) => {
    // Log login attempt for debugging
    console.log("Login attempt with:", data)

    // For demo purposes, we'll just set a user without actual validation
    // In a production app, this would include API calls to validate credentials
    setUser({
      email: data.email,
      name: "Admin", // Changed from "John Doe" to "Admin"
    })
  }

  /**
   * Handle logout functionality
   * Clears the user state to null, effectively logging the user out
   */
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

          {/* Course Page */}
          <Route path="/courses" element={user ? <Page /> : <Navigate to="/login" />} />

          {/* Exam Page */}
          <Route path="/exams" element={user ? <Page1 /> : <Navigate to="/login" />} />

          {/* Settings Page */}
          <Route path="/settings" element={user ? <Page2 /> : <Navigate to="/login" />} />


      
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
