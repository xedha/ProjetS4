import styles from './addbutton.module.css';
import { useState } from 'react';
import Form from './form';
import Form2 from './Form2';
import add from "./assets/add.svg";

function AddButton({ name = "Add Exam" }) { // <- Accept a prop with default value
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
          alt="Add"
          className={styles.add}
        />{' '}
        {name}
      </button>

      {showSpecialtyForm && <Form setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
