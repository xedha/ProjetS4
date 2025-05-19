import React, { useEffect, useState } from 'react';
import styles from './success.module.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message = "Successfully removed product." }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.modalContent}>
            <button 
              type="button" 
              className={styles.closeButton}
              onClick={onClose}
            >
              <svg aria-hidden="true" className={styles.closeIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
              <span className={styles.srOnly}>Close modal</span>
            </button>
            
            <div className={styles.successIconContainer}>
              <svg aria-hidden="true" className={styles.successIcon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className={styles.srOnly}>Success</span>
            </div>
            
            <p className={styles.message}>{message}</p>
            
            <button 
              onClick={onClose}
              className={styles.continueButton}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;
