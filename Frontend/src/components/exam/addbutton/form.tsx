import styles from './form.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

function Form({ setShowPopup }: FormProps) {
  const { t } = useTranslation();

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
        <div className={styles.title}>{t('exam.moduleRegistration')}</div>

        {/* Form Content */}
        <div className={styles.content}>
          <form action="#">
            <div className={styles.userDetails}>
              {/* Level */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.level')}</span>
                <input type="text" placeholder={t('exam.enterLevel')} required />
              </div>

              {/* Specialty */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.specialty')}</span>
                <input type="text" placeholder={t('exam.enterSpecialty')} required />
              </div>

              {/* Semester */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.semester')}</span>
                <input type="text" placeholder={t('exam.enterSemester')} required />
              </div>

              {/* Section */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.section')}</span>
                <input type="text" placeholder={t('exam.enterSection')} required />
              </div>

              {/* Date */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.date')}</span>
                <input type="date" placeholder={t('exam.selectDate')} required />
              </div>

              {/* Time */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.time')}</span>
                <input type="time" placeholder={t('exam.selectTime')} required />
              </div>

              {/* Exam Room */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.examRoom')}</span>
                <input type="text" placeholder={t('exam.enterExamRoom')} required />
              </div>

              {/* Module Name */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.moduleName')}</span>
                <input type="text" placeholder={t('exam.enterModuleName')} required />
              </div>

              {/* Module Abbreviation */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.moduleAbbreviation')}</span>
                <input type="text" placeholder={t('exam.enterModuleAbbreviation')} required />
              </div>

              {/* Supervisor */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.supervisor')}</span>
                <input type="text" placeholder={t('exam.enterSupervisor')} required />
              </div>

              {/* Order */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.order')}</span>
                <input type="text" placeholder={t('exam.enterOrder')} required />
              </div>

              {/* NbrSE */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.nbrSE')}</span>
                <input type="number" placeholder={t('exam.enterNbrSE')} required />
              </div>

              {/* NbrSS */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.nbrSS')}</span>
                <input type="number" placeholder={t('exam.enterNbrSS')} required />
              </div>

              {/* Email */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.email')}</span>
                <input type="email" placeholder={t('exam.enterEmail')} required />
              </div>
            </div>

            {/* Submit button */}
            <div className={styles.button}>
              <input onClick={() => setShowPopup(false)} type="submit" value={t('button.addExam')} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Form;
