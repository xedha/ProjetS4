import styles from './addbutton.module.css';
import { useState } from 'react';
import Form from './form';
import Form2 from './Form2';
import SendForm from './sendform';
import add from "/src/assets/add.svg";
import { useTranslation } from 'react-i18next';

interface AddButtonProps {
  onAddSuccess?: () => void; // Callback for refreshing data after adding
}

function AddButton({ onAddSuccess }: AddButtonProps) {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);

  const handleAddSuccess = () => {
    // Close forms and trigger refresh
    setShowModuleForm(false);
    setShowScheduleForm(false);
    setShowSendForm(false);
    
    // Call the parent callback if provided
    if (onAddSuccess) {
      onAddSuccess();
    }
  };

  return (
    <>
      {/* Send Button */}
      <button className={styles.send} onClick={() => setShowSendForm(true)}>
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

      {/* Add Module Button */}
      <button 
        className={styles.addbuttonblue} 
        onClick={() => setShowModuleForm(true)}
      >
        <img
          src={add}
          alt="Add"
          className={styles.add}
        />{' '}
        {t('exam.addModule')}
      </button>

      {/* Generate Schedule Button */}
      

      {/* Show the appropriate forms when buttons are clicked */}
      {showModuleForm && (
        <Form 
          setShowPopup={setShowModuleForm} 
          onAddSuccess={handleAddSuccess}
        />
      )}

      {showScheduleForm && (
        <Form2 
          setShowPopup={setShowScheduleForm}
          onAddSuccess={handleAddSuccess}
        />
      )}

      {showSendForm && (
        <SendForm
          setShowPopup={setShowSendForm}
        />
      )}
    </>
  );
}

export default AddButton;