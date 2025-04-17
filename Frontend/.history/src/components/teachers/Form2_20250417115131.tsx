import styles from './Form2.module.css';
import { useState } from 'react';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

function Form2({ setShowPopup }: FormProps) {
  return (
    <>
      <div className={styles.blurOverlay}></div>

      <div className={styles.container}>
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
              fill="currentColor" />
          </svg>
        </button>

        <div className={styles.title}>Teacher Registration</div>

        <div className={styles.content}>
          <form action="#">
            <div className={styles.userDetails}>
              {[
                'Teacher Code',
                'First & Last Name',
                'Birth Name',
                'Gender',
                'Department',
                'Grade',
                'Email',
                'Phone'
              ].map((label, i) => (
                <div className={styles.inputBox} key={i}>
                  <span className={styles.details}>{label}</span>
                  <input type="text" placeholder={`Enter ${label}`} required />
                </div>
              ))}

              {/* Status - optional dropdown */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Status</span>
                <select 
.selectBox {
  width: 150px;  
  font-size: 18px;
  padding: 10px 14px;
  border-radius: 10px;
  background-color: #f7fafc;
  border: 1px solid #cbd5e0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
  outline: none;
}

.selectBox:hover {
  background-color: #ebf8ff;
  border-color: #3182ce;
  color: #2b6cb0;
}

.selectBox:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.6);
}

.head{
 
  height: 2.75rem;
  padding: 0.8125rem 0.8125rem 0.8125rem 1.375rem;
  border: 0.5px solid #000;
  background: var(--Style, linear-gradient(180deg, #45D699 0%, #08B2AC 100%));
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  color: #FFF;
  font-family: Poppins;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.125rem; /* 90% */
  letter-spacing: 0.03125rem;

}>
                  <option  value="">Select status (optional)</option>
                  <option value="RETIRED">RETIRED</option>
                  <option value="MUTATED">MUTATED</option>
                  <option value="MED">MED</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div className={styles.button}>
              <input type="submit" value="Add Teacher" onClick={() => setShowPopup(false)} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Form2;
