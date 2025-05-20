import styles from './addbutton.module.css';
import { useState } from 'react';
import Form from './form';
import Form2 from './Form2';
import add from "./assets/add.svg"
import { useTranslation } from 'react-i18next';

function AddButton() {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);

  return (
    <>
      {/* Add Module Button */}
      <button
        className={styles.addbuttongreen}
        onClick={() => setShowModuleForm(true)}
      >
        <img
          src={add}
          alt="Add"
          className={styles.add}
        />{' '}
        {t('courses.addModule')}
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
        {t('form.addSpecialty')}
      </button>

      {showSpecialtyForm && <Form2 setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
