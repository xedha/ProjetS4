import type React from "react"
import { Logo } from "./logo"
import "./Header.css"

interface HeaderProps {
  title: string
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Logo />
          <h1 className="header-title">{title}</h1>
        </div>

        <div className="header-right">
          <button className="notification-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="notification-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <div className="user-profile">
            <img src="/placeholder.svg?height=32&width=32" alt="User avatar" className="user-avatar" />
            <span className="user-name">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  )
}

