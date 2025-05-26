import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './pdfOptionsModal.module.css';
import { generateTablePDF, generateTablePDFByLevel, getUniqueLevels, generateMonitoringPlanningPDF, generatePVPDF } from '../tabel1/table-pdf-generator';
import { examApi } from '../../../services/ExamApi';

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
  const [selectedPlanning, setSelectedPlanning] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const levels = getUniqueLevels(data);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    let success = false;
    
    try {
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
          
        case 'planning-pv':
          if (!selectedPlanning) {
            alert('Veuillez sélectionner un examen');
            return;
          }
          success = await generatePVForPlanning(parseInt(selectedPlanning));
          break;
      }
      
      if (success) {
        onClose();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePVForPlanning = async (planningId: number): Promise<boolean> => {
    try {
      // Fetch surveillants
      const surveillants = await examApi.getSurveillantsByPlanning(planningId);
      
      // Find planning details
      const rawPlanning = planningsRaw.find(p => p.id_planning === planningId);
      
      if (surveillants && rawPlanning) {
        // Generate PDF
        const success = await generatePVPDF(
          planningId,
          surveillants,
          rawPlanning,
          surveillants.find(s => s.est_charge_cours === 1)
        );
        return success;
      }
      
      alert('Impossible de récupérer les données pour ce planning');
      return false;
    } catch (error) {
      console.error('Error generating PV:', error);
      alert('Erreur lors de la génération du PV');
      return false;
    }
  };

  // Get planning options for dropdown
  const getPlanningOptions = () => {
    return data.map(row => ({
      value: row.order,
      label: `${row.moduleName} - ${row.section} - ${row.date} ${row.time}`
    }));
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
            
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="pdfOption"
                value="planning-pv"
                checked={selectedOption === 'planning-pv'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>{t('pdf.planningPV') || 'PV for Specific Exam'}</span>
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
          
          {selectedOption === 'planning-pv' && (
            <div className={styles.levelSelectContainer}>
              <label className={styles.selectLabel}>
                {t('pdf.selectExam') || 'Select Exam:'}
              </label>
              <select
                value={selectedPlanning}
                onChange={(e) => setSelectedPlanning(e.target.value)}
                className={styles.levelSelect}
              >
                <option value="">{t('pdf.chooseExam') || 'Choose an exam...'}</option>
                {getPlanningOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
            disabled={
              isGenerating ||
              (selectedOption === 'level-exam' && !selectedLevel) ||
              (selectedOption === 'planning-pv' && !selectedPlanning)
            }
          >
            {isGenerating ? 'Generating...' : (t('button.generatePDF') || 'Generate PDF')}
          </button>
        </div>
      </div>
    </>
  );
};

export default PDFOptionsModal;