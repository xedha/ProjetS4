import styles from './addbutton.module.css';
import { useState } from 'react';
import Form2 from './Form2';
import { useTranslation } from 'react-i18next';

function AddButton() {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);

  return (
    <>
      {/* Add Module Button */}
   

     

      {/* Add Specialty Button */}
      <button
        className={styles.addbuttonblue}
        onClick={() => setShowSpecialtyForm(true)}
      >
        <img
          src="/src/assets/add.svg"
          alt="Add"
          className={styles.add}
        />{' '}
        {t('teachers.addTeacher')}
      </button>

      {showSpecialtyForm && <Form2 setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
