import styles from './form.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

function Form({ setShowPopup }: FormProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  return (
    <>
      {/* Overlay for the blur effect */}
      <div className={styles.blurOverlay}></div>

      {/* Form container */}
      <div className={styles.container}>
        {/* Close Button */}
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          <svg
            className={styles.svg}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Title */}
        <div className={styles.title}>{t('settings.addAdmin')}</div>

        {/* Form Content */}
        <div className={styles.content}>
          <form action="#">
            <div className={styles.userDetails}>
              {/* Username */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('settings.username')}</span>
                <input
                  type="text"
                  placeholder={t('settings.enterUsername')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  list="username-options"
                  required
                />
                <datalist id="username-options">
                  <option value="user1" />
                  <option value="user2" />
                  <option value="user3" />
                </datalist>
              </div>

              {/* Full Name */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('settings.fullName')}</span>
                <input
                  type="text"
                  placeholder={t('settings.enterFullName')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  list="fullname-options"
                  required
                />
                <datalist id="fullname-options">
                  <option value="John Doe" />
                  <option value="Jane Smith" />
                  <option value="Alice Johnson" />
                </datalist>
              </div>

              {/* Phone */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('settings.phone')}</span>
                <input
                  type="tel"
                  placeholder={t('settings.enterPhone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  list="phone-options"
                  required
                />
                <datalist id="phone-options">
                  <option value="123-456-7890" />
                  <option value="987-654-3210" />
                  <option value="555-123-4567" />
                </datalist>
              </div>

              {/* Email */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('settings.email')}</span>
                <input
                  type="email"
                  placeholder={t('settings.enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  list="email-options"
                  required
                />
                <datalist id="email-options">
                  <option value="example@example.com" />
                  <option value="contact@example.com" />
                  <option value="support@example.com" />
                </datalist>
              </div>

              {/* Role */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('settings.role')}</span>
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="">{t('settings.selectRole')}</option>
                  <option value="admin">{t('settings.admin')}</option>
                  <option value="moderator">{t('settings.moderator')}</option>
                  <option value="editor">{t('settings.editor')}</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className={styles.button}>
              <input onClick={() => setShowPopup(false)} type="submit" value={t('settings.submit')} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Form;
