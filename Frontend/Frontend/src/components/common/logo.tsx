import type React from "react"
import "./Logo.css"
import logo from "./public/images/logo.svg"
export const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img src={logo} alt="ExamTrack Logo" className="logo-icon" />
      <span className="logo-text">ExamTrack</span>
    </div>
  )
}
