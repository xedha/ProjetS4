import styles from './pro.module.css';
import { useState } from 'react';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

function Form({ setShowPopup }: FormProps) {
  return (
    <>
      <div className={styles.blurOverlay}></div>

      <div className={styles.wrapper}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <span className={`${styles.tab} ${styles.active}`}>Edit Profile</span>
          <span className={styles.tab}>Security</span>
        </div>

        {/* Close button */}
        <button className={styles.closeBtn} onClick={() => setShowPopup(false)}>
          &times;
        </button>

        {/* Profile form */}
        <div className={styles.profileForm}>
          {/* Profile image */}
          <div className={styles.profilePicContainer}>
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className={styles.profilePic}
            />
            <button className={styles.editPic}>✎</button>
          </div>

          <form className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Your Name</label>
              <input type="text" placeholder="Charlene Reed" />
            </div>

            <div className={styles.inputGroup}>
              <label>User Name</label>
              <input type="text" placeholder="Charlene Reed" />
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" placeholder="charlenereed@gmail.com" />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" placeholder="********" />
            </div>

            <div className={styles.inputGroup}>
              <label>Date of Birth</label>
              <input type="date" />
            </div>

            <div className={styles.inputGroup}>
              <label>Present Address</label>
              <input type="text" placeholder="San Jose, California, USA" />
            </div>
          </form>

          <div className={styles.saveContainer}>
            <button className={styles.saveButton} onClick={() => setShowPopup(false)}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form;
