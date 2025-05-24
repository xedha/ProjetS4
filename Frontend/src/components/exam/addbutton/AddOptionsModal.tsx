import React from 'react';
import styles from './addbutton.module.css';

interface AddOptionsModalProps {
  onClose: () => void;
  onAddNormalClick: () => void;
  onImportClick: () => void;
}

const AddOptionsModal: React.FC<AddOptionsModalProps> = ({ 
  onClose, 
  onAddNormalClick, 
  onImportClick 
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <h2 className={styles.modalTitle}>Choose an Option</h2>
        
        <div className={styles.modalOptions}>
          <button className={styles.optionButton} onClick={onAddNormalClick}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Add Module Manually</span>
          </button>
          
          <button className={styles.optionButton} onClick={onImportClick}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Import Time Slots (Créneau)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddOptionsModal;
