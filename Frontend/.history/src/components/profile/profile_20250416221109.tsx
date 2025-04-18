import styles from './profile.module.css';
import { useState } from 'react';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

function Form({ setShowPopup }: FormProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'security'>('edit');

  return (
    <div className={styles.bdd}>
      {/* Tab Navigation */}
      <div className={styles['radio-inputs']}>
        <label className={styles['radio']} onClick={() => setActiveTab('edit')}>
          <input type="radio" name="radio" checked={activeTab === 'edit'} readOnly />
          <span className={styles['name']}>Edit Profile</span>
        </label>
        <label className={styles['radio']} onClick={() => setActiveTab('security')}>
          <input type="radio" name="radio" checked={activeTab === 'security'} readOnly />
          <span className={styles['name']}>Security</span>
        </label>
      </div>

      <div className={styles.blurOverlay}></div>

      {/* Form Container */}
      <div className={styles.container}>
        {/* Close Button */}
       

        {/* Content */}
        {activeTab === 'edit' && (
          <div className={styles.contents}>
            <div className={styles.profilePicSection}>
              <img src="/src/assets/profile.svg" alt="Profile" className={styles.profilePic} />
              <label className={styles.editPic}>
                <input type="file" hidden />
                <div className={styles.iconWrapper}>
                  <img className={styles.editicon} src="/src/assets/editicon.svg" />
                </div>
              </label>
            </div>

            <form>
              <div className={styles.userDetails}>
                <div className={styles.inputBox}>
                  <span className={styles.details}>Your Name</span>
                  <input type="text" placeholder="Charlene Reed" required />
                </div>
                <div className={styles.inputBox}>
                  <span className={styles.details}>User Name</span>
                  <input type="text" placeholder="charlene.reed" required />
                </div>
                <div className={styles.inputBox}>
                  <span className={styles.details}>Email</span>
                  <input type="email" placeholder="charlene@example.com" required />
                </div>
                <div className={styles.inputBox}>
                  <span className={styles.details}>Phone Number</span>
                  <input type="tel" placeholder="+1 234 567 890" required />
                </div>
              </div>

              <div className={styles.button}>
                <input type="submit" value="Save Changes" />
              </div>
            </form>
          </div>
        )}

        {activeTab === 'security' && (

          <div className={styles.content}>
            <form>
              <div className={styles.change}>Change Password</div>
              <div className={styles.userDetail}>
                <div className={styles.inputBox}>
                  <span className={styles.details}>Current Password</span>
                  <input type="password" placeholder="••••••••" required />
                </div>
                <div className={styles.inputBox}>
                  <span className={styles.details}>New Password</span>
                  <input type="password" placeholder="••••••••" required />
                </div>
              </div>

              <div className={styles.button2}>
                <input type="submit" value="Change Password" />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
