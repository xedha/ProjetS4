import type React from "react"
import "./Logo.css"

export const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img src="" alt="ExamTrack Logo" className="logo-icon" />
      <span className="logo-text">ExamTrack</span>
    </div>
  )
}
