import type React from "react"
import "./Logo.css"
import logo from 
export const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img src="./public/images/logo.svg" alt="ExamTrack Logo" className="logo-icon" />
      <span className="logo-text">ExamTrack</span>
    </div>
  )
}
