import styles from './addbutton.module.css';
import { useState, useRef } from 'react';
import Form2 from './form';
import { useTranslation } from 'react-i18next';
import { api } from '../../../services/api';

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
          
          // Call the API to upload the Excel file for courses
          const result = await api.uploadExcel('formations', file);
          
          console.log('Upload result:', result);
          
          // Show success message
          const insertedCount = result.inserted?.length || 0;
          const skippedCount = result.skipped?.length || 0;
          
          let message = `Successfully uploaded ${file.name}\n`;
          message += `Inserted: ${insertedCount} courses\n`;
          message += `Skipped: ${skippedCount} courses`;
          
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
    // Create a sample Excel template for courses
    const templateData = [
      ['domaine', 'filiere', 'niveau_cycle', 'specialites', 'nbr_sections', 'nbr_groupes', 'semestre', 'modules'],
      ['Sciences et Technologies', 'Informatique', 'Licence', 'Génie Logiciel', '2', '4', 'S1, S2', 'Algorithmique, Programmation'],
      ['Sciences et Technologies', 'Informatique', 'Master', 'Intelligence Artificielle', '1', '2', 'S1, S2', 'Machine Learning, Deep Learning']
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
    link.setAttribute('download', 'courses_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Import Button */}
      <button
        className={styles.addbuttonblue}
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

      {/* Add Course Button */}
      <button
        className={styles.addbuttongreen}
        onClick={() => setShowSpecialtyForm(true)}
      >
        <img
          src="/src/assets/add.svg"
          alt="Add"
          className={styles.add}
        />{' '}
        {t('courses.addCourse')}
      </button>

      {/* Import Modal */}
      {showImportModal && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowImportModal(false)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px',
                borderBottom: '1px solid #e5e7eb',
              }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#1f2937' }}>
                  Import Courses
                </h2>
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    color: '#6b7280',
                  }}
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

              <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{
                  textAlign: 'center',
                  padding: '24px',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#6b7280' }}>
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                    Upload Excel/CSV File
                  </h3>
                  <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
                    Select a file from your computer to import courses
                  </p>
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: '#10b981',
                      color: 'white',
                    }}
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
                  <span style={{ display: 'block', marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
                    Supported: .xlsx, .xls, .csv
                  </span>
                </div>

                <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '1px',
                    backgroundColor: '#e5e7eb',
                  }}></div>
                  <span style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '0 16px',
                    color: '#9ca3af',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}>
                    OR
                  </span>
                </div>

                <div style={{
                  textAlign: 'center',
                  padding: '24px',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#6b7280' }}>
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
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                    Download Template
                  </h3>
                  <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
                    Get a sample CSV file with the correct format
                  </p>
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                    }}
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

              <div style={{
                padding: '16px 24px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  Required columns:
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', lineHeight: 1.8 }}>
                  <strong style={{ color: '#374151', fontWeight: 600 }}>domaine</strong> (field of study), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> filiere</strong> (program/major), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> niveau_cycle</strong> (Licence/Master/Doctorat), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> specialites</strong> (specializations), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> nbr_sections</strong> (number), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> nbr_groupes</strong> (number), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> semestre</strong> (S1, S2, etc.), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> modules</strong> (comma-separated list)
                </p>
              </div>
            </div>
          </div>
        </>
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