import styles from './addbutton.module.css';
import { useState, useRef } from 'react';
import Form2 from './FormTeacher2';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

interface AddButtonProps {
  onUploadSuccess?: () => void;
}

function AddButton({ onUploadSuccess }: AddButtonProps) {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an Excel or CSV file
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'text/csv' ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.xls') ||
          file.name.endsWith('.csv')) {
        
        setIsUploading(true);
        setShowImportModal(false);
        try {
          console.log('Uploading Excel file:', file.name);
          console.log('File type:', file.type);
          console.log('File size:', file.size);
          
          // Call the API to upload the Excel file
          const result = await api.uploadExcel('enseignants', file);
          
          console.log('Upload result:', result);
          
          // Show success message
          const insertedCount = result.inserted?.length || 0;
          const skippedCount = result.skipped?.length || 0;
          
          let message = `Successfully uploaded ${file.name}\n`;
          message += `Inserted: ${insertedCount} teachers\n`;
          message += `Skipped: ${skippedCount} teachers`;
          
          if (skippedCount > 0 && result.skipped) {
            message += '\n\nSkipped reasons:\n';
            // Show first 5 skip reasons
            result.skipped.slice(0, 5).forEach((skip: any, index: number) => {
              message += `${index + 1}. ${skip.reason}\n`;
            });
            if (result.skipped.length > 5) {
              message += `... and ${result.skipped.length - 5} more`;
            }
          }
          
          alert(message);
          
          // Clear the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          // Notify parent component to refresh the data
          if (onUploadSuccess) {
            onUploadSuccess();
          }
          
        } catch (error: any) {
          console.error('Upload error:', error);
          
          // Check if it's an authentication error
          if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            alert('Authentication error. Please log in again.');
          } else {
            alert(`Failed to upload file: ${error.message || 'Unknown error'}`);
          }
        } finally {
          setIsUploading(false);
        }
      } else {
        alert('Please select an Excel file (.xlsx, .xls) or CSV file (.csv)');
      }
    }
  };

  const downloadTemplate = () => {
    // Create a sample Excel template matching the exact database fields
    const templateData = [
      ['Code_Enseignant', 'nom', 'prenom', 'nom_jeune_fille', 'genre', 'etat', 'departement', 'grade', 'email1', 'email2', 'tel1', 'tel2'],
      ['ENS001', 'Dupont', 'Jean', '', 'M', 'ACTIF', 'Informatique', 'MCF', 'jean.dupont@univ.dz', '', '0555123456', ''],
      ['ENS002', 'Martin', 'Marie', 'Dubois', 'F', 'ACTIF', 'Mathematiques', 'PR', 'marie.martin@univ.dz', '', '0555234567', '']
    ];

    // Convert to CSV
    const csv = templateData.map(row => row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(cell).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    }).join(',')).join('\n');
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'teachers_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Import Button */}
      <button
        className={styles.addbuttongreen}
        onClick={() => setShowImportModal(true)}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <div className={styles.spinner}></div>
            Uploading...
          </>
        ) : (
          <>
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
          </>
        )}
      </button>

      {/* Add Teacher Button */}
      <button
        className={styles.addbuttonblue}
        onClick={() => setShowSpecialtyForm(true)}
      >
        <img
          src="/src/assets/add.svg"
          alt="Add"
          className={styles.add}
        />{' '}
        {t('teachers.addTeacher')}
      </button>

      {/* Import Modal */}
      {showImportModal && (
        <div className={styles.modalOverlay} onClick={() => setShowImportModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Import Teachers</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowImportModal(false)}
              >
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
            </div>

            <div className={styles.modalBody}>
              <div className={styles.importOption}>
                <div className={styles.importIconWrapper}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Upload Excel/CSV File</h3>
                <p>Select a file from your computer to import teacher data</p>
                <button
                  className={styles.primaryButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Choose File
                </button>
                <span className={styles.fileFormats}>Supported: .xlsx, .xls, .csv</span>
              </div>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <div className={styles.importOption}>
                <div className={styles.importIconWrapper}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20M12 11V17M9 14L12 17L15 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>Download Template</h3>
                <p>Get a sample CSV file with the correct format</p>
                <button
                  className={styles.secondaryButton}
                  onClick={downloadTemplate}
                >
                  <svg
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
                  Download Template
                </button>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.columnInfo}>
                <h4>Required columns:</h4>
                <p>Code_Enseignant, nom, prenom, nom_jeune_fille, genre, etat, departement, grade, email1, email2, tel1, tel2</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        style={{ display: 'none' }}
        disabled={isUploading}
      />

      {showSpecialtyForm && <Form2 setShowPopup={setShowSpecialtyForm} />}
    </>
  );
}

export default AddButton;