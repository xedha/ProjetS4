import styles from './addbutton.module.css';
import { useState } from 'react';
import Form from './form';
import Form2 from './Form2';
import add from "/src/assets/add.svg"
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
          src={add}
          alt="Add"
          className={styles.add}
        />{' '}
        Add Exam
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
       Generate Schedule
      </button>

      {showSpecialtyForm && <Form2 setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
