"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./components/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { LoginPage } from "./Pages/LoginPage"
import { TeacherManagementPage } from "./components/teachers/TeacherManagementPage"
import { TeachingManagementPage } from "./components/teaching/TeachingManagementPage"
import Page from "./components/course/page"
import Page1 from "./components/exam/page1"
import Page2 from "./components/setting/page2"
import Profile from "./components/profile/profile"
import "./App.css"

/**
 * Main App Component
 *
 * This component serves as the entry point for the ExamTrack application.
 * It handles:
 * - Routing between different pages
 * - Authentication state management via AuthContext
 * - Protected routes that require authentication
 * - Redirects for unauthorized access attempts
 */

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* 
              Public routes - accessible without authentication
              The LoginPage will handle its own redirect when logged in
            */}
            <Route path="/login" element={<LoginPage />} />

            {/* 
              Protected routes - require authentication
              Using ProtectedRoute component to handle auth checks
            */}

            {/* Teacher Management route */}
            <Route
              path="/teachers"
              element={
                <ProtectedRoute>
                  <TeacherManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Teaching Management route */}
            <Route
              path="/teaching"
              element={
                <ProtectedRoute>
                  <TeachingManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Course Page */}
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Page />
                </ProtectedRoute>
              }
            />

            {/* Exam Page */}
            <Route
              path="/exams"
              element={
                <ProtectedRoute>
                  <Page1 />
                </ProtectedRoute>
              }
            />

            {/* Settings Page */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Page2 />
                </ProtectedRoute>
              }
            />

            {/* Profile Page */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 
              Root path redirect
              Always redirect to teachers page, ProtectedRoute will handle auth check
            */}
            <Route path="/" element={<Navigate to="/teachers" />} />

            {/* Redirect dashboard to teachers */}
            <Route path="/dashboard" element={<Navigate to="/teachers" />} />

            {/* 
              Catch-all route for any undefined paths
              Redirect to teachers page, ProtectedRoute will handle auth check
            */}
            <Route path="*" element={<Navigate to="/teachers" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App