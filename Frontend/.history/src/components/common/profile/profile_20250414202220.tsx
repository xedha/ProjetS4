import styles from './profi.module.css';
import { useState } from 'react';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

function Form({ setShowPopup }: FormProps) {
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
        <div className={styles.title}>Module Registration</div>

        {/* Form Content */}
        <div className={styles.content}>
          <form action="#">
            <div className={styles.userDetails}>
              {/* Level */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Level</span>
                <input type="text" placeholder="Enter level" required />
              </div>

              {/* Specialty */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Specialty</span>
                <input type="text" placeholder="Enter specialty" required />
              </div>

              {/* Semester */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Semester</span>
                <input type="text" placeholder="Enter semester" required />
              </div>

              {/* Section */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Section</span>
                <input type="text" placeholder="Enter section" required />
              </div>

              {/* Date */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Date</span>
                <input type="date" placeholder="Select date" required />
              </div>

              {/* Time */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Time</span>
                <input type="time" placeholder="Select time" required />
              </div>

              {/* Exam Room */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Exam Room</span>
                <input type="text" placeholder="Enter exam room" required />
              </div>

              {/* Module Name */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Module Name</span>
                <input type="text" placeholder="Enter module name" required />
              </div>

              {/* Module Abbreviation */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Module Abbreviation</span>
                <input type="text" placeholder="Enter module abbreviation" required />
              </div>

              {/* Supervisor */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Supervisor</span>
                <input type="text" placeholder="Enter supervisor" required />
              </div>

              {/* Order */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Order</span>
                <input type="text" placeholder="Enter order" required />
              </div>

              {/* NbrSE */}
              <div className={styles.inputBox}>
                <span className={styles.details}>NbrSE</span>
                <input type="number" placeholder="Enter NbrSE" required />
              </div>

              {/* NbrSS */}
              <div className={styles.inputBox}>
                <span className={styles.details}>NbrSS</span>
                <input type="number" placeholder="Enter NbrSS" required />
              </div>

              {/* Email */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Email</span>
                <input type="email" placeholder="Enter email" required />
              </div>
            </div>

            {/* Submit button */}
            <div className={styles.button}>
              <input onClick={() => setShowPopup(false)} type="submit" value="Add Exam" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Form;
