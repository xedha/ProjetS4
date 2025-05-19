import styles from './addbutton.module.css';
import { useState } from 'react';
import Form from './sendform';
import Form2 from './Form2';
import add from "/src/assets/add.svg"
import { useTranslation } from 'react-i18next';

function AddButton() {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);

  return (
    <>
      {/* Add Module Button */}
        <button className={styles.send}  
        onClick={() => setShowModuleForm(true)}>
      
      <div className={styles.svgWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path
            fill="currentColor"
            d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
          ></path>
        </svg>
      </div>
      <span>{t('button.send')}</span>
    </button>

      {showModuleForm && <Form setShowPopup={setShowModuleForm} />}

      {/* Add Specialty Button */}
      <button
        className={styles.addbuttonblue}
        onClick={() => setShowSpecialtyForm(true)}
      >
        <img
         src={add}
          alt="Add"
          className={styles.add}
        />{' '}
      {t('exam.generateSchedule')}
      </button>

      {showSpecialtyForm && <Form2 setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
