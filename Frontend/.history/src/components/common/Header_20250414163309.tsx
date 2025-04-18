"use client"



import { Link, useLocation, useNavigate } from "react-router-dom"
import "./Sidebar.css"


import type React from "react"
import { useState } from "react"
import { Logo } from "./logo"
import "./Header.css"
import flagus from "./flags/us.svg"
import flagfr from "./flags/fr.svg"
import pfp from "./flags/pfp.svg"
interface HeaderProps {
  title: string
}

const languages = [
  { name: "English (US)", flag: flagus },
  { name: "Français (FR)", flag: flagfr },
]
const location = useLocation()
const navigate = useNavigate()
export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [language, setLanguage] = useState(languages[0])
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const handleSignOut = () => {
    // Clear any auth tokens or user data
    localStorage.removeItem("token")
    // Redirect to login page
    navigate("/login")
  }
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="header-title">{title}</h1>
        </div>

        <div className="header-center">
          <div className="header-search-container">
            <button className="header-search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="header-search-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <input type="text" placeholder="Search..." className="header-search-input" />
          </div>
        </div>

        <div className="header-right">
          <div className="language-selector">
            <button
              className="language-button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <img src={language.flag} alt={language.name} className="language-flag" />
              {language.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="language-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLanguageDropdownOpen && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <button
                    key={lang.name}
                    className="language-option"
                    onClick={() => {
                      setLanguage(lang)
                      setIsLanguageDropdownOpen(false)
                    }}
                  >
                    <img src={lang.flag} alt={lang.name} className="language-flag" />
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="notification-button">
            {/* Your existing SVG icon here */}
            🔔
          </button>

          <div className="user-profile">
            <img src={pfp} alt="User avatar" className="user-avatar" />
            <div className="user-info" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
              <span className="user-name">Admin</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="user-dropdown-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isUserDropdownOpen && (
              <div className="user-dropdown">
                <button className="user-dropdown-option">My Profile</button>
                <button className="user-dropdown-option logout"  onClick={handleSignOut}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
