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

        <div className={styles.title}>Assign a Teacher</div>

        <div className={styles.content}>
          <form action="#">
            <div className={styles.userDetails}>
              {/* Level - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Level</span>
                <input list="levelOptions" placeholder="Enter level" required />
                <datalist id="levelOptions">
                  <option value="Undergraduate" />
                  <option value="Graduate" />
                </datalist>
              </div>

              {/* Specialty - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Specialty</span>
                <input list="specialtyOptions" placeholder="Enter specialty" required />
                <datalist id="specialtyOptions">
                  <option value="Computer Science" />
                  <option value="Software Engineering" />
                </datalist>
              </div>

              {/* Semester - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Semester</span>
                <input list="semesterOptions" placeholder="Enter semester" required />
                <datalist id="semesterOptions">
                  <option value="Spring" />
                  <option value="Fall" />
                </datalist>
              </div>

              {/* Section - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Section</span>
                <input list="sectionOptions" placeholder="Enter section" required />
                <datalist id="sectionOptions">
                  <option value="A" />
                  <option value="B" />
                </datalist>
              </div>

              {/* Group - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Group</span>
                <input list="groupOptions" placeholder="Enter group" required />
                <datalist id="groupOptions">
                  <option value="1" />
                  <option value="2" />
                </datalist>
              </div>

              {/* Type - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Type</span>
                <input list="typeOptions" placeholder="Enter type" required />
                <datalist id="typeOptions">
                  <option value="Lecture" />
                  <option value="Lab" />
                </datalist>
              </div>

              {/* Module Name - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Module Name</span>
                <input list="moduleNameOptions" placeholder="Enter module name" required />
                <datalist id="moduleNameOptions">
                  <option value="CS101" />
                  <option value="SE202" />
                </datalist>
              </div>

              {/* Module Abbreviation - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Module Abbreviation</span>
                <input list="moduleAbbrOptions" placeholder="Enter module abbreviation" required />
                <datalist id="moduleAbbrOptions">
                  <option value="CS" />
                  <option value="SE" />
                </datalist>
              </div>

              {/* Teacher - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Teacher</span>
                <input list="teacherOptions" placeholder="Enter teacher's name" required />
                <datalist id="teacherOptions">
                  <option value="Dr. John Doe" />
                  <option value="Prof. Jane Smith" />
                </datalist>
              </div>

              {/* Hours - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>Hours</span>
                <input list="hoursOptions" placeholder="Enter hours" required />
                <datalist id="hoursOptions">
                  <option value="1" />
                  <option value="2" />
                </datalist>
              </div>
            </div>

            <div className={styles.button}>
              <input type="submit" value="Add Module" onClick={() => setShowPopup(false)} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Form2;
