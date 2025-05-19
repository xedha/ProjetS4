"use client"

import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import { useTranslation } from 'react-i18next';
import styles from './profile.module.css';
import { useState } from 'react';

function Profile() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'edit' | 'security'>('edit');

  return (
    <>
      <div className="teacher-management-layout">
        <Sidebar />
        <div className="teacher-management-main">
          <Header title={t('profile.title')} />
        </div>
      </div>
      <div className={styles.bdd}>
        {/* Tab Navigation */}
        <div className={styles['radio-inputs']}>
          <label className={styles['radio']} onClick={() => setActiveTab('edit')}>
            <input type="radio" name="radio" checked={activeTab === 'edit'} readOnly />
            <span className={styles['name']}>{t('profile.editProfile')}</span>
          </label>
          <label className={styles['radio']} onClick={() => setActiveTab('security')}>
            <input type="radio" name="radio" checked={activeTab === 'security'} readOnly />
            <span className={styles['name']}>{t('profile.security')}</span>
          </label>
        </div>

        <div className={styles.blurOverlay}></div>

        {/* Form Container */}
        <div className={styles.container}>
          {/* Content */}
          {activeTab === 'edit' && (
            <div className={styles.contents}>
              <div className={styles.profilePicSection}>
                <img src="/src/assets/profile.svg" alt="Profile" className={styles.profilePic} />
                <label className={styles.editPic}>
                  <input type="file" hidden />
                  <div className={styles.iconWrapper}>
                    <img className={styles.editicon} src="/src/assets/editicon.svg" alt={t('profile.editPicture')} />
                  </div>
                </label>
              </div>

              <form>
                <div className={styles.userDetails}>
                  <div className={styles.inputBox}>
                    <span className={styles.details}>{t('profile.name')}</span>
                    <input type="text" placeholder={t('profile.enterName')} required />
                  </div>
                  <div className={styles.inputBox}>
                    <span className={styles.details}>{t('profile.username')}</span>
                    <input type="text" placeholder={t('profile.enterUsername')} required />
                  </div>
                  <div className={styles.inputBox}>
                    <span className={styles.details}>{t('profile.email')}</span>
                    <input type="email" placeholder={t('profile.enterEmail')} required />
                  </div>
                  <div className={styles.inputBox}>
                    <span className={styles.details}>{t('profile.phone')}</span>
                    <input type="tel" placeholder={t('profile.enterPhone')} required />
                  </div>
                </div>

                <div className={styles.button}>
                  <input type="submit" value={t('profile.saveChanges')} />
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.content}>
              <form>
                <div className={styles.change}>{t('profile.changePassword')}</div>
                <div className={styles.userDetail}>
                  <div className={styles.inputBox}>
                    <span className={styles.details}>{t('profile.currentPassword')}</span>
                    <input type="password" placeholder={t('profile.enterCurrentPassword')} required />
                  </div>
                  <div className={styles.inputBox}>
                    <span className={styles.details}>{t('profile.newPassword')}</span>
                    <input type="password" placeholder={t('profile.enterNewPassword')} required />
                  </div>
                  <div className={styles.inputBox}>
                    <span className={styles.details}>{t('profile.confirmPassword')}</span>
                    <input type="password" placeholder={t('profile.confirmNewPassword')} required />
                  </div>
                </div>

                <div className={styles.button2}>
                  <input type="submit" value={t('profile.changePassword')} />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
