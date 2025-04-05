import type React from "react"
import "./Logo.css"

export const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img src="/Users/redha/Downloads/coding /ProjetS4/front/Frontend/src/components/common/logo.svg" alt="ExamTrack Logo" className="logo-icon" />
      <span className="logo-text">ExamTrack</span>
    </div>
  )
}


