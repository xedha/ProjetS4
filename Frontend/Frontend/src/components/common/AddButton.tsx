import styles from './addbutton.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from './form';
import Form2 from './Form2';
import add from "./assets/add.svg";

function AddButton({ name }: { name?: string }) {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);

  return (
    <>
      {/* Add Module Form (unused in current button, but kept here) */}
      {showModuleForm && <Form setShowPopup={setShowModuleForm} />}

      {/* Add Specialty Button */}
      <button
        className={styles.addbuttonblue}
        onClick={() => setShowSpecialtyForm(true)}
      >
        <img
          src={add}
          alt={t('button.add')}
          className={styles.add}
        />{' '}
        {name || t('button.addExam')}
      </button>

      {showSpecialtyForm && <Form setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
