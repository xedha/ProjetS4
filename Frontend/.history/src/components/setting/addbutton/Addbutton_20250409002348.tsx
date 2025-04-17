import styles from './addbutton.module.css';
import { useState } from 'react';
import Form from './form';
import Form2 from './Form2';

function AddButton() {
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
          src="/src/assets/add.svg"
          alt="Add"
          className={styles.add}
        />{' '}
        Add an Admine
      </button>

      {showSpecialtyForm && <Form setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
