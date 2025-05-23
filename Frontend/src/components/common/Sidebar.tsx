"use client"

import type React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext'; // Import useAuth hook
import "./Sidebar.css"
import logo from "./flags/logo.svg"

interface SidebarItem {
  name: string
  path: string
  icon: React.ReactNode
  translationKey: string
}

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth(); // Get logout function from auth context

  const handleSignOut = async () => {
    try {
      // Call the logout function from auth context
      await logout();
      // The navigation to login will be handled by the auth context
      // or you can explicitly navigate after logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to login
      navigate('/login');
    }
  }

  const menuItems: SidebarItem[] = [
    {
      name: t('sidebar.teacherManagement'),
      path: "/teachers",
      translationKey: 'sidebar.teacherManagement',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_2_2468)">
            <path
              d="M13.9999 6H9.9999C9.5999 6 9.2999 5.8 9.0999 5.4L7.0999 1.4C6.9999 1.1 6.9999 0.8 7.0999 0.5C7.1999 0.2 7.6999 0 7.9999 0H15.9999C16.2999 0 16.6999 0.2 16.8999 0.5C17.0999 0.8 17.0999 1.2 16.8999 1.5L14.8999 5.5C14.6999 5.8 14.3999 6 13.9999 6ZM10.5999 4H13.3999L14.3999 2H9.5999L10.5999 4Z"
              fill="currentColor"
            />
            <path
              d="M16.9998 19C16.4998 19 16.0998 18.7 15.9998 18.2L13.1998 6H10.7998L7.9998 18.2C7.8998 18.7 7.2998 19.1 6.7998 19C6.2998 18.9 5.8998 18.3 5.9998 17.8L8.9998 4.8C9.0998 4.3 9.4998 4 9.9998 4H13.9998C14.4998 4 14.8998 4.3 14.9998 4.8L17.9998 17.8C18.0998 18.3 17.7998 18.9 17.1998 19H16.9998Z"
              fill="currentColor"
            />
            <path
              d="M12 24C11.7 24 11.5 23.9 11.3 23.7L6.3 18.7C5.9 18.3 5.9 17.7 6.3 17.3C6.7 16.9 7.3 16.9 7.7 17.3L12 21.6L16.3 17.3C16.7 16.9 17.3 16.9 17.7 17.3C18.1 17.7 18.1 18.3 17.7 18.7L12.7 23.7C12.5 23.9 12.3 24 12 24Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_2_2468">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      name: t('sidebar.teachingManagement'),
      path: "/teaching",
      translationKey: 'sidebar.teachingManagement',
      icon: (
        <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M27.8022 21.9679H3.97168V5.49194"
            stroke="currentColor"
            strokeWidth="1.98588"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27.8022 7.68872L17.2109 15.3775L11.9152 10.9839L3.97168 16.4759"
            stroke="currentColor"
            strokeWidth="1.98588"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: t('sidebar.courseManagement'),
      path: "/courses",
      translationKey: 'sidebar.courseManagement',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.5 3.5H8C10.2092 3.5 12 5.29085 12 7.5V21C12 19.3432 10.6568 18 9 18H2.5V3.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M21.5 3.5H16C13.7908 3.5 12 5.29085 12 7.5V21C12 19.3432 13.3432 18 15 18H21.5V3.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: t('sidebar.examScheduling'),
      path: "/exams",
      translationKey: 'sidebar.examScheduling',
      icon: (
        <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.5 11.5H23.5V22C23.5 22.5523 23.0523 23 22.5 23H5.5C4.94771 23 4.5 22.5523 4.5 22V11.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 6.5C4.5 5.94771 4.94771 5.5 5.5 5.5H22.5C23.0523 5.5 23.5 5.94771 23.5 6.5V11.5H4.5V6.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M10 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 19H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 15H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: t('sidebar.settings'),
      path: "/settings",
      translationKey: 'sidebar.settings',
      icon: (
        <svg width="32" height="27" viewBox="0 0 32 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.8869 8.78765C17.2914 8.78765 18.6384 9.25055 19.6315 10.0745C20.6247 10.8985 21.1826 12.016 21.1826 13.1812C21.1826 14.3465 20.6247 15.464 19.6315 16.288C18.6384 17.1119 17.2914 17.5748 15.8869 17.5748C14.4824 17.5748 13.1355 17.1119 12.1423 16.288C11.1492 15.464 10.5913 14.3465 10.5913 13.1812C10.5913 12.016 11.1492 10.8985 12.1423 10.0745C13.1355 9.25055 14.4824 8.78765 15.8869 8.78765ZM15.8869 10.9845C15.1847 10.9845 14.5112 11.2159 14.0146 11.6279C13.5181 12.0399 13.2391 12.5986 13.2391 13.1812C13.2391 13.7639 13.5181 14.3226 14.0146 14.7346C14.5112 15.1466 15.1847 15.378 15.8869 15.378C16.5892 15.378 17.2627 15.1466 17.7592 14.7346C18.2558 14.3226 18.5348 13.7639 18.5348 13.1812C18.5348 12.5986 18.2558 12.0399 17.7592 11.6279C17.2627 11.2159 16.5892 10.9845 15.8869 10.9845ZM13.2391 24.1652C12.9081 24.1652 12.6301 23.9675 12.5771 23.7039L12.0873 20.7931C11.2532 20.5185 10.5383 20.1451 9.84987 19.7057L6.55331 20.8151C6.26205 20.903 5.90459 20.8151 5.74572 20.5735L3.09788 16.773C3.01685 16.6598 2.98829 16.526 3.01753 16.3967C3.04677 16.2673 3.13181 16.1512 3.25675 16.07L6.05022 14.2467L5.95755 13.1812L6.05022 12.0828L3.25675 10.2925C3.13181 10.2113 3.04677 10.0952 3.01753 9.96583C2.98829 9.83645 3.01685 9.70266 3.09788 9.58949L5.74572 5.78903C5.90459 5.54738 6.26205 5.44852 6.55331 5.54738L9.84987 6.64578C10.5383 6.2174 11.2532 5.84395 12.0873 5.56935L12.5771 2.65859C12.6301 2.39498 12.9081 2.19727 13.2391 2.19727H18.5348C18.8658 2.19727 19.1438 2.39498 19.1967 2.65859L19.6866 5.56935C20.5206 5.84395 21.2356 6.2174 21.924 6.64578L25.2206 5.54738C25.5118 5.44852 25.8693 5.54738 26.0282 5.78903L28.676 9.58949C28.8481 9.83113 28.7687 10.1277 28.5171 10.2925L25.7236 12.0828L25.8163 13.1812L25.7236 14.2796L28.5171 16.07C28.7687 16.2348 28.8481 16.5314 28.676 16.773L26.0282 20.5735C25.8693 20.8151 25.5118 20.914 25.2206 20.8151L21.924 19.7167C21.2356 20.1451 20.5206 20.5185 19.6866 20.7931L19.1967 23.7039C19.1438 23.9675 18.8658 24.1652 18.5348 24.1652H13.2391ZM14.894 4.39406L14.4041 7.26088C12.8154 7.53548 11.4121 8.23846 10.3927 9.21603L7.20203 8.0737L6.20909 9.50161L9.00256 11.2041C8.47299 12.4856 8.47299 13.8769 9.00256 15.1584L6.19585 16.8719L7.18879 18.2998L10.4059 17.1574C11.4253 18.124 12.8154 18.827 14.3909 19.0906L14.8808 21.9684H16.8931L17.383 19.1016C18.9584 18.827 20.3485 18.124 21.368 17.1574L24.5851 18.2998L25.578 16.8719L22.7713 15.1693C23.3009 13.8842 23.3009 12.4893 22.7713 11.2041L25.5648 9.50161L24.5718 8.0737L21.3812 9.21603C20.3409 8.21684 18.9297 7.53293 17.3697 7.27187L16.8799 4.39406H14.894Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src={logo} alt="ExamTrack Logo" className="sidebar-logo" />
          <span className="sidebar-title">{t('sidebar.appName')}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.translationKey} className="sidebar-menu-item">
              <Link to={item.path} className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}>
                <span className="sidebar-icon-wrapper">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <button className="sign-out-button" onClick={handleSignOut}>
        <svg
          width="42"
          height="32"
          viewBox="0 0 42 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sidebar-icon"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M29.7352 23.3727L36.7702 17.0435C37.1062 16.748 37.2781 16.375 37.2783 15.9999C37.2785 15.7433 37.1983 15.4858 37.0354 15.2516C36.9629 15.1472 36.8745 15.0481 36.7702 14.9564L29.7352 8.62713C28.9962 7.96236 27.6983 7.88532 26.8362 8.45506C25.974 9.02481 25.8741 10.0256 26.613 10.6904L30.7525 14.4146L14.8298 14.4146C13.6943 14.4146 12.7738 15.1243 12.7738 15.9998C12.7738 16.8754 13.6943 17.5851 14.8298 17.5851L30.7527 17.5851L26.613 21.3095C25.8741 21.9743 25.974 22.9751 26.8362 23.5448C27.6983 24.1146 28.9962 24.0375 29.7352 23.3727ZM16.7186 6.48817C17.8541 6.48817 18.7746 7.19792 18.7746 8.07345L18.7746 10.4514C18.7746 11.3269 19.6951 12.0366 20.8306 12.0366C21.9661 12.0366 22.8865 11.3269 22.8865 10.4514L22.8865 8.07345C22.8865 5.44688 20.1251 3.31763 16.7186 3.31763L10.5507 3.31763C7.1443 3.31763 4.38284 5.44688 4.38284 8.07345L4.38284 23.9262C4.38284 26.5527 7.1443 28.682 10.5507 28.682L16.7186 28.682C20.1251 28.682 22.8865 26.5527 22.8865 23.9262L22.8865 21.5483C22.8865 20.6727 21.9661 19.963 20.8306 19.963C19.6951 19.963 18.7746 20.6727 18.7746 21.5483L18.7746 23.9262C18.7746 24.8017 17.8541 25.5115 16.7186 25.5115L10.5507 25.5115C9.41526 25.5115 8.49477 24.8017 8.49477 23.9262L8.49477 8.07345C8.49477 7.19792 9.41526 6.48817 10.5507 6.48817L16.7186 6.48817Z"
            fill="white"
          />
        </svg>
        {t('sidebar.signOut')}
      </button>
    </aside>
  )
}