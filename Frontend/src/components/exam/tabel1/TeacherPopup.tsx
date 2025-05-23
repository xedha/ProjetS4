import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Tabel.module.css';
import { examApi, SurveillantWithDetails, Enseignant } from '../../../services/ExamApi';
import { api } from '../../../services/api';

interface TeacherPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planningId: number;
  onTeachersUpdated: () => void; // Callback to refresh parent component data
}

const TeacherPopup: React.FC<TeacherPopupProps> = ({
  isOpen,
  onClose,
  planningId,
  onTeachersUpdated,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supervisor, setSupervisor] = useState<SurveillantWithDetails | null>(null);
  const [teachers, setTeachers] = useState<SurveillantWithDetails[]>([]);
  const [allTeachers, setAllTeachers] = useState<Enseignant[]>([]);
  const [editingTeacher, setEditingTeacher] = useState<SurveillantWithDetails | null>(null);
  const [editingSupervisor, setEditingSupervisor] = useState(false);
  
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

  // Fetch planning data, teachers, and supervisor using the new examApi
  useEffect(() => {
    if (!isOpen || !planningId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all teachers using the original api
        const teachersResponse = await api.getModelData('Enseignants', {
          page: 1,
          itemsPerPage: 100,
          search: ''
        });
        
        if (teachersResponse?.results) {
          setAllTeachers(teachersResponse.results);
        }
        
        // Get the surveillants for this planning using the new examApi method
        const surveillants = await examApi.getSurveillantsByPlanning(planningId);
        
        if (surveillants && surveillants.length > 0) {
          // Separate supervisor (est_charge_cours = 1) from regular teachers
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
        
        // Update the teacher in the Enseignants table if needed
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
        
        // Reset state and refresh data
        setEditingTeacher(null);
        onTeachersUpdated();
        
        // Update local state to reflect changes
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
    setEditingSupervisor(true);
  };

  const handleSaveSupervisor = async () => {
    try {
      setLoading(true);
      
      if (!supervisor) {
        // If there's no supervisor yet, we need to add one
        if (supervisorForm.Code_Enseignant) {
          await api.addModelRow('Surveillant', {
            id_planning: planningId,
            code_enseignant: supervisorForm.Code_Enseignant,
            est_charge_cours: 1
          });
          
          // Find the teacher details from allTeachers
          const selectedTeacher = allTeachers.find(t => 
            t.Code_Enseignant === supervisorForm.Code_Enseignant);
          
          if (selectedTeacher) {
            const newSupervisor: SurveillantWithDetails = {
              id_surveillance: 0, // This will be updated when data is refreshed
              est_charge_cours: 1,
              code_enseignant: selectedTeacher.Code_Enseignant,
              enseignant: selectedTeacher
            };
            setSupervisor(newSupervisor);
          }
        }
      } else if (supervisorForm.Code_Enseignant !== supervisor.code_enseignant) {
        // If changing the supervisor, update the Surveillant table
        // First, find the existing supervisor record
        const surveillantsResponse = await api.getModelData('Surveillant', {
          page: 1,
          itemsPerPage: 100,
          search: `id_planning=${planningId} AND est_charge_cours=1`
        });
        
        if (surveillantsResponse?.results && surveillantsResponse.results.length > 0) {
          const supervisorRecord = surveillantsResponse.results[0];
          
          // Update the supervisor
          await api.editModel(
            'Surveillant',
            'id_surveillance',
            supervisorRecord.id_surveillance,
            {
              code_enseignant: supervisorForm.Code_Enseignant,
              est_charge_cours: 1
            }
          );
          
          // Find the teacher details from allTeachers
          const selectedTeacher = allTeachers.find(t => 
            t.Code_Enseignant === supervisorForm.Code_Enseignant);
          
          if (selectedTeacher) {
            const updatedSupervisor: SurveillantWithDetails = {
              ...supervisor,
              code_enseignant: selectedTeacher.Code_Enseignant,
              enseignant: selectedTeacher
            };
            setSupervisor(updatedSupervisor);
          }
        }
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

  const handleAddTeacher = async (teacherCode: string) => {
    try {
      setLoading(true);
      
      // Add a new teacher to the Surveillant table
      await api.addModelRow('Surveillant', {
        id_planning: planningId,
        code_enseignant: teacherCode,
        est_charge_cours: 0
      });
      
      // Find the teacher details from allTeachers
      const selectedTeacher = allTeachers.find(t => t.Code_Enseignant === teacherCode);
      
      if (selectedTeacher) {
        const newTeacher: SurveillantWithDetails = {
          id_surveillance: 0, // This will be updated when data is refreshed
          est_charge_cours: 0,
          code_enseignant: teacherCode,
          enseignant: selectedTeacher
        };
        setTeachers([...teachers, newTeacher]);
      }
      
      onTeachersUpdated();
    } catch (error) {
      console.error("Error adding teacher:", error);
      setError("Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeacher = async (teacherCode: string) => {
    try {
      setLoading(true);
      
      // Find the surveillant record for this teacher
      const surveillantsResponse = await api.getModelData('Surveillant', {
        page: 1,
        itemsPerPage: 100,
        search: `id_planning=${planningId} AND code_enseignant=${teacherCode} AND est_charge_cours=0`
      });
      
      if (surveillantsResponse?.results && surveillantsResponse.results.length > 0) {
        const surveillantRecord = surveillantsResponse.results[0];
        
        // Delete the surveillant record
        await api.deleteModel('Surveillant', surveillantRecord);
        
        // Update the local state
        setTeachers(teachers.filter(t => t.code_enseignant !== teacherCode));
      }
      
      onTeachersUpdated();
    } catch (error) {
      console.error("Error removing teacher:", error);
      setError("Failed to remove teacher");
    } finally {
      setLoading(false);
    }
  };

  // Get teachers not already assigned to this planning
  const availableTeachers = allTeachers.filter(teacher => 
    !teachers.some(t => t.code_enseignant === teacher.Code_Enseignant) && 
    (!supervisor || supervisor.code_enseignant !== teacher.Code_Enseignant)
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{t('teacher.management')}</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        {loading && <div className={styles.loadingMessage}>Loading teacher data...</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.supervisorSection}>
          <div className={styles.supervisorHeader}>
            <h3>{t('teacher.supervisor')}</h3>
            {!editingSupervisor && (
              <button onClick={handleEditSupervisorClick} className={styles.editButton}>
                {t('teacher.edit')}
              </button>
            )}
          </div>
          {editingSupervisor ? (
            <div className={styles.editSupervisorForm}>
              <div className={styles.formGroup}>
                <label>{t('teacher.select')}</label>
                <select
                  value={supervisorForm.Code_Enseignant}
                  onChange={(e) => {
                    const selectedTeacher = allTeachers.find(t => t.Code_Enseignant === e.target.value);
                    if (selectedTeacher) {
                      setSupervisorForm({
                        Code_Enseignant: selectedTeacher.Code_Enseignant,
                        nom: selectedTeacher.nom,
                        prenom: selectedTeacher.prenom,
                        email1: selectedTeacher.email1 || ''
                      });
                    }
                  }}
                  className={styles.editInput}
                >
                  <option value="">-- Select Supervisor --</option>
                  {availableTeachers.map(teacher => (
                    <option key={teacher.Code_Enseignant} value={teacher.Code_Enseignant}>
                      {teacher.nom} {teacher.prenom}
                    </option>
                  ))}
                  {supervisor && (
                    <option value={supervisor.code_enseignant}>
                      {supervisor.enseignant.nom} {supervisor.enseignant.prenom} (Current)
                    </option>
                  )}
                </select>
              </div>
              <div className={styles.buttonGroup}>
                <button 
                  onClick={handleSaveSupervisor} 
                  className={styles.saveButton}
                  disabled={!supervisorForm.Code_Enseignant}
                >
                  {t('teacher.save')}
                </button>
                <button onClick={() => setEditingSupervisor(false)} className={styles.cancelButton}>
                  {t('teacher.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <p>
              {supervisor 
                ? `${supervisor.enseignant.nom} ${supervisor.enseignant.prenom} - ${supervisor.enseignant.email1 || 'No email'}` 
                : "No supervisor assigned yet"}
            </p>
          )}
        </div>

        <div className={styles.teachersSection}>
          <div className={styles.teacherHeader}>
            <h3>{t('teacher.teachers')}</h3>
            <div className={styles.addTeacherForm}>
              <select
                id="addTeacherSelect"
                className={styles.editInput}
                defaultValue=""
              >
                
                {availableTeachers.map(teacher => (
                  <option key={teacher.Code_Enseignant} value={teacher.Code_Enseignant}>
                    {teacher.nom} {teacher.prenom}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <table className={styles.teacherTable}>
            <thead>
              <tr>
                <th>{t('teacher.name')}</th>
                <th>{t('teacher.email')}</th>
                <th>{t('teacher.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    No additional teachers assigned
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.code_enseignant}>
                    {editingTeacher?.code_enseignant === teacher.code_enseignant ? (
                      <>
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
                          <button onClick={handleSaveEdit} className={styles.saveButton}>
                            {t('teacher.save')}
                          </button>
                          <button onClick={() => setEditingTeacher(null)} className={styles.cancelButton}>
                            {t('teacher.cancel')}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{teacher.enseignant.nom} {teacher.enseignant.prenom}</td>
                        <td>{teacher.enseignant.email1 || 'No email'}</td>
                        <td>
                          <button onClick={() => handleEditClick(teacher)} className={styles.editButton}>
                            {t('teacher.edit')}
                          </button>
                          <button 
                            onClick={() => handleRemoveTeacher(teacher.code_enseignant)} 
                            className={styles.cancelButton}
                          >
                            {t('teacher.remove')}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherPopup;