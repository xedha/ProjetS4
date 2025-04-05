import type React from "react"
import { Link, useLocation } from "react-router-dom"
import "./Sidebar.css"

interface SidebarItem {
  name: string
  path: string
  icon: React.ReactNode
}

export const Sidebar: React.FC = () => {
  const location = useLocation()

  const menuItems: SidebarItem[] = [
    {
      name: "Teacher Management",
      path: "/teachers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
    {
      name: "Teaching Management",
      path: "/teaching",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Course Management",
      path: "/courses",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
    },
    {
      name: "Exam & Scheduling",
      path: "/exams",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src="/images/logo.svg" alt="ExamTrack Logo" className="sidebar-logo" />
          <span className="sidebar-title">EXAMTRACK</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.name} className="sidebar-menu-item">
              <Link to={item.path} className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}>
                <span className="sidebar-icon-wrapper">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="sign-out-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v6a1 1 0 102 0V6zm-8 2a1 1 0 00-1 1v2a1 1 0 001 1h3a1 1 0 100-2H7V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}

