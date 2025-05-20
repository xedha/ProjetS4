import styles from './Form2.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FormProps {
  setShowPopup: (show: boolean) => void;
}

function Form2({ setShowPopup }: FormProps) {
  const { t } = useTranslation();

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

        <div className={styles.title}>{t('teachers.registration')}</div>

        <div className={styles.content}>
          <form action="#">
            <div className={styles.userDetails}>
              {/* Teacher Code - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.teacherCode')}</span>
                <input list="teacherCodeOptions" placeholder={t('teachers.enterTeacherCode')} required />
                <datalist id="teacherCodeOptions">
                  <option value="T001" />
                  <option value="T002" />
                </datalist>
              </div>

              {/* First & Last Name - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.fullName')}</span>
                <input list="nameOptions" placeholder={t('teachers.enterFullName')} required />
                <datalist id="nameOptions">
                  <option value="John Doe" />
                  <option value="Jane Smith" />
                </datalist>
              </div>

              {/* Birth Name - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.birthName')}</span>
                <input list="birthNameOptions" placeholder={t('teachers.enterBirthName')} required />
                <datalist id="birthNameOptions">
                  <option value="Johnathan" />
                  <option value="Jane" />
                </datalist>
              </div>

              {/* Gender - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.gender')}</span>
                <input list="genderOptions" placeholder={t('teachers.enterGender')} required />
                <datalist id="genderOptions">
                  <option value="Male" />
                  <option value="Female" />
                </datalist>
              </div>

              {/* Department - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.department')}</span>
                <input list="departmentOptions" placeholder={t('teachers.enterDepartment')} required />
                <datalist id="departmentOptions">
                  <option value="Computer Science" />
                  <option value="Mathematics" />
                </datalist>
              </div>

              {/* Grade - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.grade')}</span>
                <input list="gradeOptions" placeholder={t('teachers.enterGrade')} required />
                <datalist id="gradeOptions">
                  <option value="A" />
                  <option value="B" />
                </datalist>
              </div>

              {/* Email - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.email')}</span>
                <input list="emailOptions" placeholder={t('teachers.enterEmail')} required />
                <datalist id="emailOptions">
                  <option value="johndoe@example.com" />
                  <option value="janesmith@example.com" />
                </datalist>
              </div>

              {/* Phone - Use datalist */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.phone')}</span>
                <input list="phoneOptions" placeholder={t('teachers.enterPhone')} required />
                <datalist id="phoneOptions">
                  <option value="123-456-7890" />
                  <option value="098-765-4321" />
                </datalist>
              </div>

              {/* Status - Optional dropdown */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.status')}</span>
                <select className={styles.selectbox}>
                  <option className={styles.box} value="">{t('teachers.selectStatus')}</option>
                  <option value="RETIRED">{t('teachers.statusRetired')}</option>
                  <option value="MUTATED">{t('teachers.statusMutated')}</option>
                  <option value="MED">{t('teachers.statusMed')}</option>
                  <option value="ADMIN">{t('teachers.statusAdmin')}</option>
                </select>
              </div>
            </div>

            <div className={styles.button}>
              <input type="submit" value={t('teachers.addTeacher')} onClick={() => setShowPopup(false)} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Form2;
