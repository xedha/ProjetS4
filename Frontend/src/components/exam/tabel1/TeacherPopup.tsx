import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Tabel.module.css';
import buttonStyles from './TeacherPopup.module.css';
import { examApi, SurveillantWithDetails, Enseignant, PlanningWithDetails } from '../../../services/ExamApi';
import { api } from '../../../services/api';
import ConflictChecker from '../ConflictChecker/ConflictChecker'; // Import ConflictChecker

interface TeacherPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planningId: number;
  onTeachersUpdated: () => void;
  maxSupervisorsPerMonitoring?: number; // Add this prop
}

interface TeacherConflict {
  code_enseignant: string;
  conflicts: {
    surveillance1_id: number;
    planning1_id: number;
    surveillance2_id: number;
    planning2_id: number;
    date: string;
    time: string;
  }[];
}

const TeacherPopup: React.FC<TeacherPopupProps> = ({
  isOpen,
  onClose,
  planningId,
  onTeachersUpdated,
  maxSupervisorsPerMonitoring = 3, // Default value
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supervisor, setSupervisor] = useState<SurveillantWithDetails | null>(null);
  const [teachers, setTeachers] = useState<SurveillantWithDetails[]>([]);
  const [allTeachers, setAllTeachers] = useState<Enseignant[]>([]);
  const [editingTeacher, setEditingTeacher] = useState<SurveillantWithDetails | null>(null);
  const [editingSupervisor, setEditingSupervisor] = useState(false);
  
  // State to control showing ConflictChecker modal
  const [showConflictChecker, setShowConflictChecker] = useState(false);
  
  // Original conflict checking states (for inline conflicts)
  const [showInlineConflicts, setShowInlineConflicts] = useState(false);
  const [checkingConflicts, setCheckingConflicts] = useState(false);
  const [teacherConflicts, setTeacherConflicts] = useState<TeacherConflict[]>([]);
  const [planningDetails, setPlanningDetails] = useState<Map<number, PlanningWithDetails>>(new Map());
  
  // Form state
  const [editForm, setEditForm] = useState({ 
    Code_Enseignant: '', 
    nom: '', 
    prenom: '', 
    email1: '' 
  });
  
  const [supervisorForm, setSupervisorForm] = useState({ 
    Code_Enseignant: '', 
    nom: '', 
    prenom: '', 
    email1: '' 
  });

  // Original inline conflict checking
  const checkInlineTeacherConflicts = async () => {
    try {
      setCheckingConflicts(true);
      const response = await examApi.checkEnseignantScheduleConflict({});
      
      if (response.conflicts) {
        const allPlanningTeachers = [
          ...(supervisor ? [supervisor.code_enseignant] : []),
          ...teachers.map(t => t.code_enseignant)
        ];
        
        const relevantConflicts = response.conflicts.filter((conflict: TeacherConflict) =>
          allPlanningTeachers.includes(conflict.code_enseignant)
        );
        
        const planningIds = new Set<number>();
        relevantConflicts.forEach(conflict => {
          conflict.conflicts.forEach(c => {
            planningIds.add(c.planning1_id);
            planningIds.add(c.planning2_id);
          });
        });
        
        try {
          const allPlannings = await examApi.getPlanningsWithDetails();
          const detailsMap = new Map<number, PlanningWithDetails>();
          
          allPlannings.forEach((planning: PlanningWithDetails) => {
            if (planningIds.has(planning.id_planning)) {
              detailsMap.set(planning.id_planning, planning);
            }
          });
          
          setPlanningDetails(detailsMap);
        } catch (err) {
          console.error('Error fetching planning details:', err);
        }
        
        setTeacherConflicts(relevantConflicts);
        setShowInlineConflicts(true);
      } else {
        setTeacherConflicts([]);
        setShowInlineConflicts(true);
      }
    } catch (error) {
      console.error('Error checking teacher conflicts:', error);
      setError(t('teacher.conflictCheckError') || 'Unable to check for scheduling conflicts. Please try again.');
    } finally {
      setCheckingConflicts(false);
    }
  };

  // Fetch planning data, teachers, and supervisor
  useEffect(() => {
    if (!isOpen || !planningId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const teachersResponse = await api.getModelData('Enseignants', {
          page: 1,
          itemsPerPage: 1000,
          search: ''
        });
        
        if (teachersResponse?.results) {
          setAllTeachers(teachersResponse.results);
        } else if (Array.isArray(teachersResponse)) {
          setAllTeachers(teachersResponse);
        }
        
        const surveillants = await examApi.getSurveillantsByPlanning(planningId);
        
        if (surveillants && surveillants.length > 0) {
          const supervisorData = surveillants.find(s => s.est_charge_cours === 1) || null;
          const teachersData = surveillants.filter(s => s.est_charge_cours !== 1);
          
          setSupervisor(supervisorData);
          if (supervisorData) {
            setSupervisorForm({
              Code_Enseignant: supervisorData.code_enseignant,
              nom: supervisorData.enseignant.nom,
              prenom: supervisorData.enseignant.prenom,
              email1: supervisorData.enseignant.email1 || ''
            });
          }
          
          setTeachers(teachersData);
        }
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch teacher data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, planningId]);

  if (!isOpen) return null;

  const handleEditClick = (teacher: SurveillantWithDetails) => {
    setEditingTeacher(teacher);
    setEditForm({
      Code_Enseignant: teacher.code_enseignant,
      nom: teacher.enseignant.nom,
      prenom: teacher.enseignant.prenom,
      email1: teacher.enseignant.email1 || ''
    });
  };

  const handleSaveEdit = async () => {
    if (editingTeacher) {
      try {
        setLoading(true);
        
        if (editForm.nom !== editingTeacher.enseignant.nom || 
            editForm.prenom !== editingTeacher.enseignant.prenom || 
            editForm.email1 !== editingTeacher.enseignant.email1) {
          
          await api.editModel(
            'Enseignants',
            'Code_Enseignant',
            editingTeacher.code_enseignant,
            {
              nom: editForm.nom,
              prenom: editForm.prenom,
              email1: editForm.email1
            }
          );
        }
        
        setEditingTeacher(null);
        onTeachersUpdated();
        
        setTeachers(teachers.map(t => 
          t.code_enseignant === editingTeacher.code_enseignant 
            ? {
                ...t,
                enseignant: {
                  ...t.enseignant,
                  nom: editForm.nom,
                  prenom: editForm.prenom,
                  email1: editForm.email1
                }
              } 
            : t
        ));
      } catch (error) {
        console.error("Error updating teacher:", error);
        setError("Failed to update teacher information");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditSupervisorClick = () => {
    if (supervisor) {
      setEditingSupervisor(true);
      setSupervisorForm({
        Code_Enseignant: supervisor.code_enseignant,
        nom: supervisor.enseignant.nom,
        prenom: supervisor.enseignant.prenom,
        email1: supervisor.enseignant.email1 || ''
      });
    }
  };

  const handleSaveSupervisor = async () => {
    try {
      setLoading(true);
      
      if (supervisor && (
        supervisorForm.nom !== supervisor.enseignant.nom || 
        supervisorForm.prenom !== supervisor.enseignant.prenom || 
        supervisorForm.email1 !== supervisor.enseignant.email1
      )) {
        await api.editModel(
          'Enseignants',
          'Code_Enseignant',
          supervisor.code_enseignant,
          {
            nom: supervisorForm.nom,
            prenom: supervisorForm.prenom,
            email1: supervisorForm.email1
          }
        );
        
        setSupervisor({
          ...supervisor,
          enseignant: {
            ...supervisor.enseignant,
            nom: supervisorForm.nom,
            prenom: supervisorForm.prenom,
            email1: supervisorForm.email1
          }
        });
      }
      
      setEditingSupervisor(false);
      onTeachersUpdated();
    } catch (error) {
      console.error("Error updating supervisor:", error);
      setError("Failed to update supervisor information");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeacher = async (teacherCode: string) => {
    if (!confirm('Are you sure you want to remove this teacher?')) return;
    
    try {
      setLoading(true);
      
      const surveillantsResponse = await api.getModelData('Surveillant', {
        page: 1,
        itemsPerPage: 100,
        search: ''
      });
      
      if (surveillantsResponse?.results) {
        const surveillantRecord = surveillantsResponse.results.find(
          (s: any) => s.id_planning === planningId && 
                      s.code_enseignant === teacherCode && 
                      s.est_charge_cours === 0
        );
        
        if (surveillantRecord) {
          await api.deleteModel('Surveillant', 'id_surveillance', surveillantRecord);
          setTeachers(teachers.filter(t => t.code_enseignant !== teacherCode));
        }
      }
      
      onTeachersUpdated();
    } catch (error) {
      console.error("Error removing teacher:", error);
      setError("Failed to remove teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>{t('teacher.management')}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Updated button to show ConflictChecker */}
              <button 
                onClick={() => setShowConflictChecker(true)} 
                className={buttonStyles.conflictButton}
                title="Check all conflicts and workload balance"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 24L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Full Conflict Analysis
              </button>
              
              {/* Optional: Keep the inline conflict check button */}
              <button 
                onClick={checkInlineTeacherConflicts} 
                className={buttonStyles.conflictButton}
                disabled={checkingConflicts}
                style={{ 
                  background: 'linear-gradient(90deg, #6B7280 0%, #4B5563 100%)',
                  fontSize: '13px',
                  padding: '6px 12px'
                }}
                title="Quick check for this exam's teachers only"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {checkingConflicts ? 'Checking...' : 'Quick Check'}
              </button>
              
              <button onClick={onClose} className={styles.closeButton}>×</button>
            </div>
          </div>

          {loading && <div className={styles.loadingMessage}>{t('teacher.loadingData') || 'Loading teacher information...'}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* Inline Conflicts Section (optional - for quick view) */}
          {showInlineConflicts && (
            <div style={{
              margin: '16px 24px',
              padding: '16px',
              backgroundColor: teacherConflicts.length > 0 ? '#FEF3C7' : '#D1FAE5',
              border: `1px solid ${teacherConflicts.length > 0 ? '#F59E0B' : '#10B981'}`,
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ 
                  margin: 0, 
                  color: teacherConflicts.length > 0 ? '#92400E' : '#065F46',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {teacherConflicts.length > 0 ? '⚠️ Schedule Conflicts Found' : '✅ No Schedule Conflicts'}
                </h3>
                <button 
                  onClick={() => setShowInlineConflicts(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#6B7280',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ×
                </button>
              </div>
              
              {teacherConflicts.length === 0 ? (
                <p style={{ margin: 0, color: '#065F46', fontSize: '15px' }}>
                  All teachers assigned to this exam are available at the scheduled time. No scheduling conflicts detected.
                </p>
              ) : (
                <div>
                  <p style={{ margin: '0 0 12px 0', color: '#92400E', fontSize: '14px' }}>
                    The following teacher{teacherConflicts.length > 1 ? 's have' : ' has'} been assigned to multiple exams at the same time:
                  </p>
                  {teacherConflicts.map((conflict, idx) => {
                    const teacher = (() => {
                      if (supervisor && supervisor.code_enseignant === conflict.code_enseignant) {
                        return supervisor.enseignant;
                      }
                      const found = teachers.find(t => t.code_enseignant === conflict.code_enseignant);
                      return found ? found.enseignant : null;
                    })();

                    const teacherName = teacher 
                      ? `${teacher.prenom} ${teacher.nom}` 
                      : conflict.code_enseignant;
                    
                    const isMainSupervisor = supervisor && supervisor.code_enseignant === conflict.code_enseignant;

                    return (
                      <div key={idx} style={{ 
                        marginBottom: '16px', 
                        padding: '12px',
                        backgroundColor: '#FEF8E1',
                        borderRadius: '6px',
                        border: '1px solid #FCD34D'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          marginBottom: '8px',
                          gap: '8px'
                        }}>
                          <strong style={{ color: '#92400E', fontSize: '15px' }}>
                            {teacherName}
                          </strong>
                          {isMainSupervisor && (
                            <span style={{
                              backgroundColor: '#DC2626',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              Main Supervisor
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '14px', color: '#78350F' }}>
                          <p style={{ margin: '0 0 4px 0' }}>
                            <strong>Conflict Details:</strong>
                          </p>
                          {conflict.conflicts.map((c, cIdx) => {
                            const date = new Date(c.date);
                            const formattedDate = date.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            });
                            
                            const planning1 = planningDetails.get(c.planning1_id);
                            const planning2 = planningDetails.get(c.planning2_id);
                            
                            const getExamDescription = (planning: PlanningWithDetails | undefined, examPlanningId: number) => {
                              if (!planning) return `Exam #${examPlanningId}`;
                              
                              const module = planning.formation?.modules || 'Unknown Module';
                              const section = planning.section || '';
                              const room = planning.creneau?.salle || 'Unknown Room';
                              
                              const isCurrentExam = examPlanningId === planningId;
                              
                              return (
                                <span style={{ fontWeight: isCurrentExam ? '600' : '500' }}>
                                  {module} {section ? `(Section ${section})` : ''} in {room}
                                  {isCurrentExam && <span style={{ color: '#059669', marginLeft: '4px' }}>[This Exam]</span>}
                                </span>
                              );
                            };
                            
                            return (
                              <div key={cIdx} style={{ 
                                marginLeft: '16px',
                                marginBottom: '8px',
                                fontSize: '13px',
                                color: '#92400E',
                                lineHeight: '1.5'
                              }}>
                                <div style={{ marginBottom: '2px' }}>
                                  • <strong>{formattedDate} at {c.time}</strong>
                                </div>
                                <div style={{ marginLeft: '12px' }}>
                                  <div>📍 {getExamDescription(planning1, c.planning1_id)}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0' }}>
                                    <span style={{ color: '#DC2626', marginRight: '8px' }}>conflicts with</span>
                                  </div>
                                  <div>📍 {getExamDescription(planning2, c.planning2_id)}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {teacher && teacher.email1 && (
                          <div style={{ 
                            marginTop: '8px',
                            fontSize: '13px',
                            color: '#78350F'
                          }}>
                            <strong>Contact:</strong> {teacher.email1}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#FEE2E2',
                    borderRadius: '6px',
                    border: '1px solid #FECACA'
                  }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '14px',
                      color: '#991B1B'
                    }}>
                      <strong>Action Required:</strong> Please reassign these teachers or reschedule the conflicting exams to resolve these conflicts.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={styles.teachersSection}>
            <div className={styles.teacherHeader}>
              <h3>{t('teacher.allTeachers')}</h3>
            </div>
            
            <table className={styles.teacherTable}>
              <thead>
                <tr>
                  <th>{t('teacher.role')}</th>
                  <th>{t('teacher.name')}</th>
                  <th>{t('teacher.email')}</th>
                  <th>{t('teacher.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {/* Supervisor Row */}
                {supervisor && (
                  <tr style={{ backgroundColor: '#f0f9ff' }}>
                    {editingSupervisor ? (
                      <>
                        <td><strong>Supervisor</strong></td>
                        <td>
                          <input
                            type="text"
                            value={supervisorForm.nom}
                            onChange={(e) => setSupervisorForm({ ...supervisorForm, nom: e.target.value })}
                            className={styles.editInput}
                            placeholder="Last Name"
                          />
                          <input
                            type="text"
                            value={supervisorForm.prenom}
                            onChange={(e) => setSupervisorForm({ ...supervisorForm, prenom: e.target.value })}
                            className={styles.editInput}
                            placeholder="First Name"
                            style={{ marginTop: '5px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            value={supervisorForm.email1}
                            onChange={(e) => setSupervisorForm({ ...supervisorForm, email1: e.target.value })}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <button onClick={handleSaveSupervisor} className={buttonStyles.saveButton}>
                            {t('teacher.save')}
                          </button>
                          <button onClick={() => setEditingSupervisor(false)} className={buttonStyles.cancelButton}>
                            {t('teacher.cancel')}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td><strong>Supervisor</strong></td>
                        <td>{supervisor.enseignant.nom} {supervisor.enseignant.prenom}</td>
                        <td>{supervisor.enseignant.email1 || 'No email'}</td>
                        <td>
                          <button onClick={handleEditSupervisorClick} className={buttonStyles.editButton}>
                            {t('teacher.edit')}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                )}
                
                {/* Regular Teachers */}
                {teachers.map((teacher) => (
                  <tr key={teacher.code_enseignant}>
                    {editingTeacher?.code_enseignant === teacher.code_enseignant ? (
                      <>
                        <td>Teacher</td>
                        <td>
                          <input
                            type="text"
                            value={editForm.nom}
                            onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                            className={styles.editInput}
                            placeholder="Last Name"
                          />
                          <input
                            type="text"
                            value={editForm.prenom}
                            onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                            className={styles.editInput}
                            placeholder="First Name"
                            style={{ marginTop: '5px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            value={editForm.email1}
                            onChange={(e) => setEditForm({ ...editForm, email1: e.target.value })}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <button onClick={handleSaveEdit} className={buttonStyles.saveButton}>
                            {t('teacher.save')}
                          </button>
                          <button onClick={() => setEditingTeacher(null)} className={buttonStyles.cancelButton}>
                            {t('teacher.cancel')}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>Teacher</td>
                        <td>{teacher.enseignant.nom} {teacher.enseignant.prenom}</td>
                        <td>{teacher.enseignant.email1 || 'No email'}</td>
                        <td>
                          <button onClick={() => handleEditClick(teacher)} className={buttonStyles.editButton}>
                            {t('teacher.edit')}
                          </button>
                          <button 
                            onClick={() => handleRemoveTeacher(teacher.code_enseignant)} 
                            className={buttonStyles.cancelButton}
                            style={{ display: 'none' }}
                          >
                            {t('teacher.remove')}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                
                {/* No teachers message */}
                {!supervisor && teachers.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', padding: '24px' }}>
                      <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                        No teachers have been assigned to supervise this exam yet.
                      </div>
                      <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                        Teachers must be assigned when creating or editing the exam details.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ConflictChecker Modal - Rendered separately */}
      {showConflictChecker && (
        <div style={{ position: 'relative', zIndex: 2000 }}>
          <ConflictChecker 
            maxSupervisorsPerMonitoring={maxSupervisorsPerMonitoring}
            // Add a custom wrapper to handle closing
            {...{
              // Wrap the component to add close functionality
              children: (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2000
                }}>
                  <div style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    maxWidth: '90%',
                    maxHeight: '90vh',
                    overflow: 'auto'
                  }}>
                    <button
                      onClick={() => setShowConflictChecker(false)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        padding: '5px',
                        borderRadius: '4px',
                        color: '#6B7280',
                        zIndex: 10
                      }}
                    >
                      ×
                    </button>
                    <ConflictChecker maxSupervisorsPerMonitoring={maxSupervisorsPerMonitoring} />
                  </div>
                </div>
              )
            }}
          />
        </div>
      )}
    </>
  );
};

export default TeacherPopup;