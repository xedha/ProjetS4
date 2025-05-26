import styles from './sendfrompopup.module.css';
import { useState, useEffect } from 'react';
import { examApi, PVData, ConvocationData, ConvocationExam, SurveillantWithDetails, PlanningWithDetails } from '../../../services/ExamApi';

interface SendFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planningId?: number; // Direct planning ID
  rowData?: any; // Keep this for backward compatibility
  teacherCode?: string; // Optional: specific teacher to send to
  onSuccess?: () => void;
}

const SendFormPopup: React.FC<SendFormPopupProps> = ({ 
  isOpen, 
  onClose, 
  planningId: directPlanningId, 
  rowData,
  teacherCode,
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
  const [emailType, setEmailType] = useState<'pv' | 'convocation'>('convocation');
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  
  // State for surveillants and planning data
  const [surveillants, setSurveillants] = useState<SurveillantWithDetails[]>([]);
  const [planningDetails, setPlanningDetails] = useState<PlanningWithDetails | null>(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<SurveillantWithDetails | null>(null);

  // Extract planning ID from either direct prop or rowData
  const planningId = directPlanningId || rowData?.planning?.id_planning || rowData?.id_planning;

  // Debug logging
  useEffect(() => {
    console.log('[SendFormPopup] Component state:', {
      isOpen,
      directPlanningId,
      planningIdFromRowData: rowData?.planning?.id_planning || rowData?.id_planning,
      finalPlanningId: planningId,
      teacherCode: teacherCode || rowData?.teacher?.code,
      rowData,
      surveillants: surveillants.length,
      selectedTeacher: selectedTeacher?.code_enseignant,
      selectedEmail,
      fetchingData
    });
  }, [isOpen, directPlanningId, planningId, teacherCode, rowData, surveillants, selectedTeacher, selectedEmail, fetchingData]);

  // Fetch all data when popup opens
  useEffect(() => {
    if (!isOpen) {
      console.log('[SendFormPopup] Popup is closed, skipping fetch');
      return;
    }

    if (!planningId) {
      console.error('[SendFormPopup] No planningId found in props or rowData:', {
        directPlanningId,
        rowData
      });
      setResult({ error: 'ID de planning manquant' });
      return;
    }

    const fetchData = async () => {
      try {
        setFetchingData(true);
        setResult(null);
        console.log('[SendFormPopup] Starting data fetch for planning:', planningId);
        
        // Fetch surveillants
        try {
          console.log('[SendFormPopup] Calling getSurveillantsByPlanning with ID:', planningId);
          const surveillantsData = await examApi.getSurveillantsByPlanning(planningId);
          console.log('[SendFormPopup] Raw surveillants response:', surveillantsData);
          
          if (surveillantsData && Array.isArray(surveillantsData) && surveillantsData.length > 0) {
            setSurveillants(surveillantsData);
            console.log(`[SendFormPopup] Found ${surveillantsData.length} surveillants`);
            
            // Log each surveillant for debugging
            surveillantsData.forEach((s, index) => {
              console.log(`[SendFormPopup] Surveillant ${index}:`, {
                code: s.code_enseignant,
                nom: s.enseignant?.nom,
                prenom: s.enseignant?.prenom,
                email1: s.enseignant?.email1,
                email2: s.enseignant?.email2,
                est_charge_cours: s.est_charge_cours
              });
            });
            
            // Check if we should pre-select a teacher
            const targetTeacherCode = teacherCode || rowData?.teacher?.code || rowData?.teacher?.Code_Enseignant;
            
            if (targetTeacherCode) {
              console.log('[SendFormPopup] Looking for teacher with code:', targetTeacherCode);
              const teacher = surveillantsData.find(s => s.code_enseignant === targetTeacherCode);
              if (teacher) {
                console.log('[SendFormPopup] Found matching teacher:', teacher);
                setSelectedTeacher(teacher);
                // Set their first available email
                const emails = getTeacherEmails(teacher);
                console.log('[SendFormPopup] Teacher emails:', emails);
                if (emails.length > 0) {
                  setSelectedEmail(emails[0]);
                }
              } else {
                console.warn('[SendFormPopup] Teacher not found with code:', targetTeacherCode);
                // Still select the first available teacher
                const supervisor = surveillantsData.find(s => s.est_charge_cours === 1);
                const firstTeacher = supervisor || surveillantsData[0];
                setSelectedTeacher(firstTeacher);
                const emails = getTeacherEmails(firstTeacher);
                if (emails.length > 0) {
                  setSelectedEmail(emails[0]);
                }
              }
            } else {
              // No specific teacher, select the first one (preferably the supervisor)
              const supervisor = surveillantsData.find(s => s.est_charge_cours === 1);
              const firstTeacher = supervisor || surveillantsData[0];
              console.log('[SendFormPopup] Auto-selecting teacher:', firstTeacher?.code_enseignant);
              setSelectedTeacher(firstTeacher);
              const emails = getTeacherEmails(firstTeacher);
              if (emails.length > 0) {
                setSelectedEmail(emails[0]);
              }
            }
          } else {
            console.warn('[SendFormPopup] No surveillants found or invalid response');
            setSurveillants([]);
          }
        } catch (err) {
          console.error('[SendFormPopup] Error fetching surveillants:', err);
          throw new Error(`Erreur lors du chargement des surveillants: ${err}`);
        }
        
        // Fetch planning details
        try {
          console.log('[SendFormPopup] Fetching planning details...');
          const allPlannings = await examApi.getPlanningsWithDetails();
          console.log(`[SendFormPopup] Got ${allPlannings?.length || 0} plannings`);
          
          if (Array.isArray(allPlannings)) {
            const planning = allPlannings.find(p => p.id_planning === planningId);
            if (planning) {
              console.log('[SendFormPopup] Found planning details:', planning);
              setPlanningDetails(planning);
            } else {
              console.warn('[SendFormPopup] Planning not found with ID:', planningId);
              // Try to use planning data from rowData if available
              if (rowData?.planning) {
                console.log('[SendFormPopup] Using planning data from rowData');
                setPlanningDetails(rowData.planning);
              }
            }
          }
        } catch (err) {
          console.error('[SendFormPopup] Error fetching planning details:', err);
          // Don't throw here, we can still work without full planning details
          // Try to use planning data from rowData if available
          if (rowData?.planning) {
            console.log('[SendFormPopup] Using planning data from rowData after error');
            setPlanningDetails(rowData.planning);
          }
        }
        
      } catch (err) {
        console.error('[SendFormPopup] General error in fetchData:', err);
        setResult({ error: err instanceof Error ? err.message : 'Erreur lors du chargement des données' });
      } finally {
        setFetchingData(false);
        console.log('[SendFormPopup] Fetch complete');
      }
    };

    fetchData();
  }, [isOpen, planningId, teacherCode, rowData]);

  // Reset states when closing
  useEffect(() => {
    if (!isOpen) {
      console.log('[SendFormPopup] Resetting state on close');
      setResult(null);
      setSelectedEmail('');
      setSurveillants([]);
      setSelectedTeacher(null);
      setPlanningDetails(null);
      setEmailType('convocation');
    }
  }, [isOpen]);

  // Helper function to get teacher emails
  const getTeacherEmails = (teacher: SurveillantWithDetails): string[] => {
    if (!teacher || !teacher.enseignant) {
      console.warn('[SendFormPopup] getTeacherEmails called with invalid teacher:', teacher);
      return [];
    }
    
    const emails: string[] = [];
    if (teacher.enseignant.email1) emails.push(teacher.enseignant.email1);
    if (teacher.enseignant.email2) emails.push(teacher.enseignant.email2);
    
    console.log('[SendFormPopup] getTeacherEmails result:', emails);
    return emails;
  };

  // Get teacher name
  const getTeacherName = (): string => {
    if (!selectedTeacher || !selectedTeacher.enseignant) {
      console.warn('[SendFormPopup] getTeacherName: no selected teacher');
      return '';
    }
    const e = selectedTeacher.enseignant;
    const name = `${e.nom || ''} ${e.prenom || ''}`.trim();
    console.log('[SendFormPopup] getTeacherName:', name);
    return name;
  };

  // Get teacher role
  const getTeacherRole = (): string => {
    if (!selectedTeacher) return '';
    return selectedTeacher.est_charge_cours === 1 ? 'Responsable Principal' : 'Surveillant';
  };

  // Get all surveillants for PV - Format as HTML table rows
  const getAllSurveillantsForPV = (): string => {
    let html = '';
    
    // Add rows for each surveillant
    surveillants.forEach(s => {
      if (!s.enseignant) return;
      const role = s.est_charge_cours === 1 ? ' (Responsable)' : '';
      const name = `${s.enseignant.prenom} ${s.enseignant.nom}${role}`;
      
      html += `
      <tr>
        <td style="text-align: left; padding-left: 10px;">${name}</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
      </tr>`;
    });
    
    // Add empty rows to reach minimum 15 rows total
    const remainingRows = Math.max(0, 15 - surveillants.length);
    for (let i = 0; i < remainingRows; i++) {
      html += `
      <tr>
        <td style="text-align: left; padding-left: 10px;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
        <td style="border: 1px solid #000;">&nbsp;</td>
      </tr>`;
    }
    
    console.log('[SendFormPopup] getAllSurveillantsForPV - HTML rows generated');
    return html;
  };

  const validateForm = (): string | null => {
    console.log('[SendFormPopup] Validating form...');
    
    if (!selectedTeacher) {
      return "Veuillez sélectionner un enseignant";
    }
    if (!selectedEmail) {
      return "Veuillez sélectionner une adresse email";
    }
    if (!planningDetails && !rowData?.planning) {
      // Less strict - we can still send with basic info
      console.warn('[SendFormPopup] Planning details missing, but continuing...');
    }
    
    console.log('[SendFormPopup] Form validation passed');
    return null;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCurrentAcademicYear = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    if (month >= 8) {
      return `${year}/${year + 1}`;
    } else {
      return `${year - 1}/${year}`;
    }
  };

  const handleTeacherChange = (teacherCode: string) => {
    console.log('[SendFormPopup] Changing teacher to:', teacherCode);
    
    const teacher = surveillants.find(s => s.code_enseignant === teacherCode);
    if (teacher) {
      setSelectedTeacher(teacher);
      const emails = getTeacherEmails(teacher);
      setSelectedEmail(emails.length > 0 ? emails[0] : '');
      console.log('[SendFormPopup] Teacher changed successfully');
    } else {
      console.error('[SendFormPopup] Teacher not found:', teacherCode);
    }
  };

  const handleSendEmail = async () => {
    console.log('[SendFormPopup] Starting email send process...');
    
    const validationError = validateForm();
    if (validationError) {
      setResult({ error: validationError });
      return;
    }

    try {
      setIsLoading(true);
      setResult(null);

      // Use planning details from either fetched data or rowData
      const planning = planningDetails || rowData?.planning;

      // Build email data
      const baseData = {
        email: selectedEmail,
        teacher_name: getTeacherName(),
        date_document: new Date().toLocaleDateString('fr-FR'),
        semestre: planning?.formation?.semestre || 'S1',
        session: planning?.session || 'Normale',
        annee_universitaire: getCurrentAcademicYear(),
      };

      if (emailType === 'pv') {
        const pvData: PVData = {
          ...baseData,
          module: planning?.formation?.modules || '',
          module_nom: planning?.formation?.modules || '',
          niveau: planning?.formation?.niveau_cycle || '',
          section: planning?.section || '',
          date_exam: formatDate(planning?.creneau?.date_creneau),
          locaux: planning?.creneau?.salle || '',
          surveillants_rows: getAllSurveillantsForPV() // This now includes ALL surveillants
        };

        console.log("[SendFormPopup] Sending PV with data:", pvData);
        const response = await examApi.sendPV(pvData);
        console.log("[SendFormPopup] PV response:", response);
        
        if (response.success) {
          setResult({ success: `PV envoyé avec succès à ${selectedEmail}` });
        } else {
          throw new Error(response.error || 'Failed to send PV');
        }
      } else {
        const convocationExam: ConvocationExam = {
          date: formatDate(planning?.creneau?.date_creneau),
          horaire: planning?.creneau?.heure_creneau || '',
          module: planning?.formation?.modules || '',
          local: planning?.creneau?.salle || ''
        };

        const convocationData: ConvocationData = {
          ...baseData,
          examens: [convocationExam]
        };

        console.log("[SendFormPopup] Sending Convocation with data:", convocationData);
        const response = await examApi.sendConvocation(convocationData);
        console.log("[SendFormPopup] Convocation response:", response);
        
        if (response.success) {
          setResult({ success: `Convocation envoyée avec succès à ${selectedEmail}` });
        } else {
          throw new Error(response.error || 'Failed to send convocation');
        }
      }

      // Auto-close after successful send
      setTimeout(() => {
        console.log('[SendFormPopup] Auto-closing after success');
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error: any) {
      console.error("[SendFormPopup] Error sending email:", error);
      setResult({
        error: error.message || `Échec de l'envoi du ${emailType}. Veuillez réessayer.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      console.log('[SendFormPopup] Closing popup');
      onClose();
    }
  };

  if (!isOpen) return null;

  const availableEmails = selectedTeacher ? getTeacherEmails(selectedTeacher) : [];

  return (
    <>
      {/* Blur overlay - this blurs everything behind the popup */}
      <div className={styles.blurOverlay} onClick={handleClose}></div>
      
      {/* Main popup container */}
      <div className={styles.container}>
        <button 
          className={styles.close} 
          onClick={handleClose}
          disabled={isLoading}
        >
          <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor"/>
          </svg>
        </button>

        <div className={styles.title}>Envoyer Email Individuel</div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ fontSize: '10px', color: '#666', margin: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            Debug: planningId={planningId}, surveillants={surveillants.length}, selected={selectedTeacher?.code_enseignant}
          </div>
        )}

        {/* Loading state while fetching data */}
        {fetchingData && (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <span>Chargement des informations...</span>
          </div>
        )}

        {/* Error state if no planning ID */}
        {!planningId && !fetchingData && (
          <div className={styles.errorMessage} style={{ margin: '16px 24px' }}>
            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Aucun ID de planning fourni. Impossible de charger les données.</span>
          </div>
        )}

        {/* Error state if no data found */}
        {!fetchingData && surveillants.length === 0 && isOpen && planningId && (
          <div className={styles.errorMessage} style={{ margin: '16px 24px' }}>
            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Aucun surveillant trouvé pour cet examen (Planning ID: {planningId}).</span>
          </div>
        )}

        {/* Teacher Selection */}
        {!fetchingData && surveillants.length > 0 && (
          <div className={styles.formSection}>
            <div className={styles.inputBox}>
              <span className={styles.details}>Sélectionner l'enseignant</span>
              <select
                value={selectedTeacher?.code_enseignant || ''}
                onChange={(e) => handleTeacherChange(e.target.value)}
                disabled={isLoading}
                className={styles.select}
              >
                <option value="">-- Sélectionner un enseignant --</option>
                {surveillants.map(s => (
                  <option key={s.code_enseignant} value={s.code_enseignant}>
                    {s.enseignant?.nom} {s.enseignant?.prenom} ({s.est_charge_cours === 1 ? 'Responsable Principal' : 'Surveillant'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Teacher Information */}
        {selectedTeacher && selectedTeacher.enseignant && (
          <div className={styles.infoSection}>
            <h3 className={styles.infoTitle}>Information de l'Enseignant</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Nom:</span>
                <span className={styles.infoValue}>{getTeacherName()}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Code:</span>
                <span className={styles.infoValue}>{selectedTeacher.code_enseignant}</span>
              </div>
              {selectedTeacher.enseignant.département && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Département:</span>
                  <span className={styles.infoValue}>{selectedTeacher.enseignant.département}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Rôle:</span>
                <span className={styles.infoValue}>{getTeacherRole()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Exam Information */}
        {(planningDetails || rowData?.planning) && (
          <div className={styles.infoSection}>
            <h3 className={styles.infoTitle}>Information de l'Examen</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Date:</span>
                <span className={styles.infoValue}>{formatDate((planningDetails || rowData?.planning)?.creneau?.date_creneau)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Heure:</span>
                <span className={styles.infoValue}>{(planningDetails || rowData?.planning)?.creneau?.heure_creneau || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Salle:</span>
                <span className={styles.infoValue}>{(planningDetails || rowData?.planning)?.creneau?.salle || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Module:</span>
                <span className={styles.infoValue}>{(planningDetails || rowData?.planning)?.formation?.modules || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Niveau:</span>
                <span className={styles.infoValue}>{(planningDetails || rowData?.planning)?.formation?.niveau_cycle || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Section:</span>
                <span className={styles.infoValue}>{(planningDetails || rowData?.planning)?.section || 'N/A'}</span>
              </div>
            </div>
            
            {/* Show all surveillants for PV */}
            {surveillants.length > 0 && emailType === 'pv' && (
              <div className={styles.infoItem} style={{ marginTop: '12px', gridColumn: '1 / -1' }}>
                <span className={styles.infoLabel}>Surveillants qui seront inclus dans le PV:</span>
                <div className={styles.infoValue} style={{ 
                  whiteSpace: 'pre-line',
                  backgroundColor: '#f0f9ff',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #bfdbfe',
                  marginTop: '4px'
                }}>
                  {surveillants.map(s => {
                    if (!s.enseignant) return null;
                    const role = s.est_charge_cours === 1 ? 'Responsable' : 'Surveillant';
                    const isCurrent = selectedTeacher && s.code_enseignant === selectedTeacher.code_enseignant;
                    return (
                      <div key={s.code_enseignant} style={{ 
                        marginBottom: '4px',
                        fontWeight: isCurrent ? 'bold' : 'normal',
                        color: isCurrent ? '#2563eb' : 'inherit'
                      }}>
                        • {s.enseignant.prenom} {s.enseignant.nom} ({role})
                        {isCurrent && ' ← Destinataire'}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Message */}
        {result && (
          <div className={result.success ? styles.successMessage : styles.errorMessage}>
            {result.success ? (
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{result.success || result.error}</span>
          </div>
        )}

        {/* Form Fields */}
        {selectedTeacher && !fetchingData && (
          <div className={styles.formSection}>
            <div className={styles.inputBox}>
              <span className={styles.details}>Type d'Email</span>
              <select 
                value={emailType} 
                onChange={(e) => setEmailType(e.target.value as 'pv' | 'convocation')}
                disabled={isLoading}
                className={styles.select}
              >
                <option value="convocation">Convocation de surveillance</option>
                <option value="pv">Procès-verbal (PV)</option>
              </select>
            </div>

            <div className={styles.inputBox}>
              <span className={styles.details}>Adresse Email</span>
              {availableEmails.length > 1 ? (
                <select
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  disabled={isLoading}
                  className={styles.select}
                >
                  <option value="">-- Sélectionner un email --</option>
                  {availableEmails.map((email, index) => (
                    <option key={index} value={email}>{email}</option>
                  ))}
                </select>
              ) : availableEmails.length === 1 ? (
                <input
                  type="email"
                  value={selectedEmail}
                  readOnly
                  className={styles.input}
                />
              ) : (
                <input
                  type="email"
                  value=""
                  readOnly
                  className={styles.input}
                  placeholder="Aucun email disponible"
                />
              )}
            </div>
          </div>
        )}

        {/* Loading State for email sending */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <span>Envoi en cours...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button 
            className={styles.cancelButton} 
            onClick={handleClose}
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={handleSendEmail}
            disabled={isLoading || !selectedEmail || !selectedTeacher || fetchingData}
          >
            {isLoading ? 'Envoi...' : `Envoyer ${emailType === 'convocation' ? 'Convocation' : 'PV'}`}
          </button>
        </div>
      </div>
    </>
  );
};

export default SendFormPopup;