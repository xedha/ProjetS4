"use client"

import type React from "react"
import { useState } from "react"
import { Logo } from "./logo"
import "./Header.css"

interface HeaderProps {
  title: string // This will now be the current page name
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [language, setLanguage] = useState("English")
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  const languages = ["English(US) ", "Français(FR)  "]

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
            <button className="language-button" onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}>
              {language}
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
                    key={lang}
                    className="language-option"
                    onClick={() => {
                      setLanguage(lang)
                      setIsLanguageDropdownOpen(false)
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="notification-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
  <path d="M26.0192 21.1377C25.2742 20.505 24.6221 19.7797 24.0802 18.9813C23.4886 17.8792 23.1341 16.6756 23.0373 15.4412V11.8054C23.0424 9.8665 22.3042 7.99258 20.9614 6.53569C19.6186 5.0788 17.7635 4.13923 15.7449 3.89351V2.94409C15.7449 2.6835 15.6362 2.43359 15.4428 2.24933C15.2494 2.06507 14.9871 1.96155 14.7136 1.96155C14.4401 1.96155 14.1778 2.06507 13.9844 2.24933C13.7909 2.43359 13.6823 2.6835 13.6823 2.94409V3.90823C11.6817 4.17166 9.84911 5.11691 8.52393 6.56891C7.19874 8.0209 6.47077 9.88125 6.47484 11.8054V15.4412C6.37809 16.6756 6.02353 17.8792 5.43196 18.9813C4.89962 19.7779 4.25791 20.5031 3.52388 21.1377C3.44148 21.2067 3.37544 21.2916 3.33015 21.3867C3.28486 21.4819 3.26137 21.5852 3.26123 21.6897V22.6906C3.26123 22.8858 3.34262 23.073 3.48749 23.2111C3.63236 23.3491 3.82885 23.4266 4.03373 23.4266H25.5093C25.7142 23.4266 25.9107 23.3491 26.0556 23.2111C26.2004 23.073 26.2818 22.8858 26.2818 22.6906V21.6897C26.2817 21.5852 26.2582 21.4819 26.2129 21.3867C26.1676 21.2916 26.1016 21.2067 26.0192 21.1377ZM4.86804 21.9546C5.58678 21.2931 6.21961 20.5519 6.75294 19.7467C7.49811 18.4156 7.93289 16.947 8.02757 15.4412V11.8054C7.99694 10.9428 8.1488 10.0832 8.47411 9.27775C8.79943 8.47228 9.29155 7.73742 9.92117 7.11692C10.5508 6.49642 11.305 6.00298 12.139 5.66597C12.9729 5.32897 13.8695 5.1553 14.7754 5.1553C15.6812 5.1553 16.5779 5.32897 17.4118 5.66597C18.2457 6.00298 19 6.49642 19.6296 7.11692C20.2592 7.73742 20.7513 8.47228 21.0767 9.27775C21.402 10.0832 21.5538 10.9428 21.5232 11.8054V15.4412C21.6179 16.947 22.0527 18.4156 22.7978 19.7467C23.3312 20.5519 23.964 21.2931 24.6827 21.9546H4.86804Z" fill="#FFA412"/>
  <path d="M14.8096 25.8841C15.2962 25.8734 15.7632 25.6991 16.1279 25.392C16.4927 25.0849 16.7317 24.6648 16.8026 24.2061H12.7393C12.8122 24.6773 13.0624 25.1073 13.4432 25.416C13.8241 25.7246 14.3096 25.891 14.8096 25.8841Z" fill="#FFA412"/>
            </svg>
          </button>

          <div className="user-profile">
            <img src="/placeholder.svg?height=32&width=32" alt="User avatar" className="user-avatar" />
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
                <button className="user-dropdown-option">Switch User</button>
                <button className="user-dropdown-option">Settings</button>
                <button className="user-dropdown-option logout">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
