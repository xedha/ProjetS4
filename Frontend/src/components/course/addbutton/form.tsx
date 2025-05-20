import styles from './form.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FormProps {
  setShowPopup: (show: boolean) => void; // The function to set the state to false
}

function Form({ setShowPopup }: FormProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Overlay for the blur effect */}
      <div className={styles.blurOverlay}></div>

      {/* Registration form container */}
      <div className={styles.container}>
        {/* Close Button */}
        <button className={styles.close}    onClick={() => setShowPopup(false)}><svg className={styles.svg}
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
</svg></button>

        {/* Title section */}
        <div className={styles.title}>{t('courses.moduleRegistration')}</div>

        <div className={styles.content}>
          {/* Registration form */}
          <form action="#">
            <div className={styles.userDetails}>
              {/* Input for Level */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.level')}</span>
                <input type="text" placeholder={t('courses.enterLevel')} required />
              </div>

              {/* Input for Specialty */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.specialty')}</span>
                <input type="text" placeholder={t('courses.enterSpecialty')} required />
              </div>

              {/* Input for Semester */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.semester')}</span>
                <input type="text" placeholder={t('courses.enterSemester')} required />
              </div>

              {/* Input for Module Title */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.moduleTitle')}</span>
                <input type="text" placeholder={t('courses.enterModuleTitle')} required />
              </div>

              {/* Input for Module Abbreviation */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.moduleAbbreviation')}</span>
                <input type="text" placeholder={t('courses.enterModuleAbbreviation')} required />
              </div>

              {/* Input for Coefficient */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.coefficient')}</span>
                <input type="number" placeholder={t('courses.enterCoefficient')} required />
              </div>

              {/* Input for Credits */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.credits')}</span>
                <input type="number" placeholder={t('courses.enterCredits')} required />
              </div>

              {/* Input for Unit */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.unit')}</span>
                <input type="text" placeholder={t('courses.enterUnit')} required />
              </div>

              {/* Input for Lecture Hours (VHC) */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.lectureHours')}</span>
                <input type="number" placeholder={t('courses.enterLectureHours')} required />
              </div>

              {/* Input for Tutorial Hours (VHTD) */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.tutorialHours')}</span>
                <input type="number" placeholder={t('courses.enterTutorialHours')} required />
              </div>

              {/* Input for Practical Hours (VHTP) */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.practicalHours')}</span>
                <input type="number" placeholder={t('courses.enterPracticalHours')} required />
              </div>
            </div>

            {/* Submit button */}
            <div className={styles.button}>
              <input onClick={() => setShowPopup(false)} type="submit" value={t('courses.addModule')} />
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
}

export default Form;
