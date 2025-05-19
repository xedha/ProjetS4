import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from './logo';
import './Header.css';
import flagus from './flags/us.svg';
import flagfr from './flags/fr.svg';
import pfp from './flags/pfp.svg';
import i18n from '../../i18n';

interface HeaderProps {
  title: string;
}

const languages = [
  { code: 'en', name: 'English (US)', flag: flagus },
  { code: 'fr', name: 'Français (FR)', flag: flagfr },
];

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const navigate = useNavigate();

  // Update current language when i18n language changes
  useEffect(() => {
    const lang = languages.find(l => l.code === i18n.language) || languages[0];
    setCurrentLanguage(lang);
  }, [i18n.language]);

  const handleLanguageChange = (langCode: string) => {
    try {
      i18n.changeLanguage(langCode);
      setIsLanguageDropdownOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handleLogout = () => {
    // Clear any auth tokens or user data
    localStorage.removeItem("token");
    // Force a page reload to clear all state
    window.location.href = "/login";
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setIsLanguageDropdownOpen(false);
      }
      if (!target.closest('.user-profile')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <input type="text" placeholder={t('header.search')} className="header-search-input" />
          </div>
        </div>

        <div className="header-right">
          <div className="language-selector">
            <button
              className="language-button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              aria-expanded={isLanguageDropdownOpen}
              aria-haspopup="true"
            >
              <img src={currentLanguage.flag} alt={currentLanguage.name} className="language-flag" />
              {currentLanguage.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="language-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ transform: isLanguageDropdownOpen ? 'rotate(180deg)' : 'none' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLanguageDropdownOpen && (
              <div className="language-dropdown" role="menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="language-option"
                    onClick={() => handleLanguageChange(lang.code)}
                    role="menuitem"
                  >
                    <img src={lang.flag} alt={lang.name} className="language-flag" />
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="notification-button">
            {/* Your existing SVG icon here */} 🔔
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
                <button
                  className="user-dropdown-option"
                  onClick={() => {
                    navigate('/profile');
                    setIsUserDropdownOpen(false);
                  }}
                >
                  {t('header.profile')}
                </button>

                <button 
                  className="user-dropdown-option logout"
                  onClick={handleLogout}
                >
                  {t('header.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
