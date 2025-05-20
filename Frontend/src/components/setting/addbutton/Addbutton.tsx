import styles from './addbutton.module.css';
import { useState } from 'react';
import Form from './form';
import Form2 from './Form2';
import { useTranslation } from 'react-i18next';

function AddButton() {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);

  return (
    <>
      {/* Add Module Button */}
     

      {showModuleForm && <Form setShowPopup={setShowModuleForm} />}

      {/* Add Specialty Button */}
      <button
        className={styles.addbuttonblue}
        onClick={() => setShowSpecialtyForm(true)}
      >
        <img
          src='/src/components/exam/assets/add.svg'
          alt="Add"
          className={styles.add}
        />{' '}
        {t('settings.addAdmin')}
      </button>

      {showSpecialtyForm && <Form setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
