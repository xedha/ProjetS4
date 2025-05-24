import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './pdfOptionsModal.module.css';
import { generateTablePDF, generateTablePDFByLevel, getUniqueLevels, generateMonitoringPlanningPDF } from '../tabel1/table-pdf-generator';

interface PDFOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  planningsRaw?: any[]; // Add raw planning data
}

const PDFOptionsModal: React.FC<PDFOptionsModalProps> = ({ isOpen, onClose, data, planningsRaw = [] }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string>('overall-exam');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const levels = getUniqueLevels(data);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    let success = false;
    
    switch (selectedOption) {
      case 'overall-exam':
        success = generateTablePDF(data, 'exam-schedule-all.pdf');
        break;
      
      case 'overall-monitoring':
        success = await generateMonitoringPlanningPDF(data, planningsRaw, 'monitoring-planning.pdf');
        break;
      
      case 'level-exam':
        if (!selectedLevel) {
          alert('Please select a level');
          return;
        }
        success = generateTablePDFByLevel(data, selectedLevel);
        break;
    }
    
    if (success) {
      onClose();
    } else {
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>{t('pdf.selectOption') || 'Select PDF Option'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.optionGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="pdfOption"
                value="overall-exam"
                checked={selectedOption === 'overall-exam'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>{t('pdf.overallExamSchedule') || 'Overall Exam Schedule'}</span>
            </label>
            
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="pdfOption"
                value="overall-monitoring"
                checked={selectedOption === 'overall-monitoring'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>{t('pdf.overallMonitoringPlanning') || 'Overall Monitoring Planning'}</span>
            </label>
            
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="pdfOption"
                value="level-exam"
                checked={selectedOption === 'level-exam'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>{t('pdf.levelExamSchedule') || 'Level Exam Schedule'}</span>
            </label>
          </div>
          
          {selectedOption === 'level-exam' && (
            <div className={styles.levelSelectContainer}>
              <label className={styles.selectLabel}>
                {t('pdf.selectLevel') || 'Select Level:'}
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className={styles.levelSelect}
              >
                <option value="">{t('pdf.chooseLevel') || 'Choose a level...'}</option>
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            {t('button.cancel') || 'Cancel'}
          </button>
          <button 
            className={styles.generateButton} 
            onClick={handleGenerate}
            disabled={selectedOption === 'level-exam' && !selectedLevel}
          >
            {t('button.generatePDF') || 'Generate PDF'}
          </button>
        </div>
      </div>
    </>
  );
};

export default PDFOptionsModal;