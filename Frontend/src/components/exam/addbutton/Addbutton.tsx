import styles from './addbutton.module.css';
import { useState, useRef } from 'react';
import Form from './form';
import Form2 from './Form2';
import SendForm from './sendform';
import add from "/src/assets/add.svg";
import { useTranslation } from 'react-i18next';
import AddOptionsModal from './AddOptionsModal';
import { api } from '../../../services/api';

interface AddButtonProps {
  onAddSuccess?: () => void; // Callback for refreshing data after adding
  onUploadSuccess?: () => void; // Callback for refreshing data after upload
}

function AddButton({ onAddSuccess, onUploadSuccess }: AddButtonProps) {
  const { t } = useTranslation();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const creneauFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an Excel file
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        // Here you would typically handle the Excel file
        console.log('Excel file selected:', file.name);
        // TODO: Add your Excel processing logic here
      } else {
        alert('Please select an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleCreneauImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          
          // Call the API to upload the Excel file for creneaux
          const result = await api.uploadExcel('creneau', file);
          
          console.log('Upload result:', result);
          
          // Show success message
          const insertedCount = result.inserted?.length || 0;
          const skippedCount = result.skipped?.length || 0;
          
          let message = `Successfully uploaded ${file.name}\n`;
          message += `Inserted: ${insertedCount} time slots\n`;
          message += `Skipped: ${skippedCount} time slots`;
          
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
          if (creneauFileInputRef.current) {
            creneauFileInputRef.current.value = '';
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

  const downloadCreneauTemplate = () => {
    // Create a sample Excel template for creneaux
    const templateData = [
      ['date_creneau', 'heure_creneau', 'salle'],
      ['2024-06-10', '08:00:00', 'Amphi A'],
      ['2024-06-10', '10:00:00', 'Amphi B'],
      ['2024-06-10', '14:00:00', 'Salle 101']
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
    link.setAttribute('download', 'creneau_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* Import Button */}
      <button
        className={styles.addbuttongreen}
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

      {/* Add Module Button */}
      <button 
        className={styles.addbuttonblue} 
        onClick={() => setShowOptionsModal(true)}
      >
        <img
          src={add}
          alt="Add"
          className={styles.add}
        />{' '}
        {t('exam.addModule')}
      </button>

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

      {/* Options Modal */}
      {showOptionsModal && (
        <AddOptionsModal
          onClose={() => setShowOptionsModal(false)}
          onImportClick={() => {
            setShowOptionsModal(false);
            setShowImportModal(true);
          }}
          onAddNormalClick={() => {
            setShowOptionsModal(false);
            setShowModuleForm(true);
          }}
        />
      )}

      {/* Import Creneau Modal */}
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
                  Import Time Slots (Créneau)
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
                        d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
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
                    Select a file from your computer to import exam time slots
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
                    onClick={() => creneauFileInputRef.current?.click()}
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
                      </>
                    )}
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
                    onClick={downloadCreneauTemplate}
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
                  <strong style={{ color: '#374151', fontWeight: 600 }}>date_creneau</strong> (YYYY-MM-DD format), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> heure_creneau</strong> (HH:MM:SS format), 
                  <strong style={{ color: '#374151', fontWeight: 600 }}> salle</strong> (room/hall name)
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <input
        type="file"
        ref={creneauFileInputRef}
        onChange={handleCreneauImport}
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        style={{ display: 'none' }}
        disabled={isUploading}
      />
    </>
  );
}

export default AddButton;