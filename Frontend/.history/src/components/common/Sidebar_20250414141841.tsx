"use client"

import type React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "./Sidebar.css"
import logo from "./flags/logo.svg"
import Page from "../course/page"
import Page1 from "../exam/page1"
import Page2 from "../setting/page2"

interface SidebarItem {
  name: string
  path: string
  icon: React.ReactNode
}

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const menuItems: SidebarItem[] = [
    {
      name: "Teacher Management",
      path: "/teachers",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.9999 6H9.9999C9.5999 6 9.2999 5.8 9.0999 5.4L7.0999 1.4C6.9999 1.1 6.9999 0.8 7.0999 0.5C7.1999 0.2 7.6999 0 7.9999 0H15.9999C16.2999 0 16.6999 0.2 16.8999 0.5C17.0999 0.8 17.0999 1.2 16.8999 1.5L14.8999 5.5C14.6999 5.8 14.3999 6 13.9999 6Z" fill="currentColor" />
          <path d="M16.9998 19C16.4998 19 16.0998 18.7 15.9998 18.2L13.1998 6H10.7998L7.9998 18.2C7.8998 18.7 7.2998 19.1 6.7998 19C6.2998 18.9 5.8998 18.3 5.9998 17.8L8.9998 4.8C9.0998 4.3 9.4998 4 9.9998 4H13.9998C14.4998 4 14.8998 4.3 14.9998 4.8L17.9998 17.8C18.0998 18.3 17.7998 18.9 17.1998 19H16.9998Z" fill="currentColor" />
          <path d="M12 24C11.7 24 11.5 23.9 11.3 23.7L6.3 18.7C5.9 18.3 5.9 17.7 6.3 17.3C6.7 16.9 7.3 16.9 7.7 17.3L12 21.6L16.3 17.3C16.7 16.9 17.3 16.9 17.7 17.3C18.1 17.7 18.1 18.3 17.7 18.7L12.7 23.7C12.5 23.9 12.3 24 12 24Z" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "Teaching Management",
      path: "/teaching",
      icon: (
        <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M27.8022 21.9679H3.97168V5.49194" stroke="currentColor" strokeWidth="1.98588" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27.8022 7.68872L17.2109 15.3775L11.9152 10.9839L3.97168 16.4759" stroke="currentColor" strokeWidth="1.98588" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: "Course Page",
      path: "/course",
      icon: <span>📘</span>,
    },
    {
      name: "Exam Page",
      path: "/exam",
      icon: <span>📝</span>,
    },
    {
      name: "Settings Page",
      path: "/setting",
      icon: <span>⚙️</span>,
    },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" />
        <h2>My Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <button className="signout-btn" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  )
}

export { Page, Page1, Page2 }
