import styles from './addbutton.module.css';
import { useState, useRef } from 'react';
import Form2 from './form';
import { useTranslation } from 'react-i18next';

function AddButton() {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an Excel file
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        // Here you would typically handle the Excel file
        // For example, you could use a library like xlsx to parse it
        console.log('Excel file selected:', file.name);
        // TODO: Add your Excel processing logic here
      } else {
        alert('Please select an Excel file (.xlsx or .xls)');
      }
    }
  };

  return (
    <>
      {/* Import Button */}
      <button
        className={styles.addbuttonblue}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg 
          className={styles.add}
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        Import Excel
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
        />
      </button>

      {/* Add Teacher Button */}
      <button
        className={styles.addbuttongreen}
        onClick={() => setShowSpecialtyForm(true)}
      >
        <img
          src="/src/assets/add.svg"
          alt="Add"
          className={styles.add}
        />{' '}
        {t('teaching.assignTeacher')}
      </button>

      {showSpecialtyForm && <Form2 setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;
