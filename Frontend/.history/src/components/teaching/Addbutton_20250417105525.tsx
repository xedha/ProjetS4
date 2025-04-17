import styles from './addbutton.module.css';
import { useState } from 'react';

import Form2 from './Form2';

function AddButton() {
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
          src="/src/assets/add.svg"
          alt="Add"
          className={styles.add}
        />{' '}
        Add Module
      </button>

     

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
        Add Specialty
      </button>

      {showSpecialtyForm && <Form2 setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
