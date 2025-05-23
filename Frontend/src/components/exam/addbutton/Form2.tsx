import styles from './form.module.css';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { examApi, Surveillant, updatePlanningWithSurveillants } from '../../../services/ExamApi';
import { api } from '../../../services/api';

interface FormProps {
  setShowPopup: (show: boolean) => void;
  editData?: {
    id_planning: number;
    formation_id?: number;
    section: string;
    session?: string;
    id_creneau?: number;
    nombre_surveillant?: number;
    surveillants?: Array<{
      code_enseignant: string;
      est_charge_cours?: 0 | 1;
    }>;
  };
  onUpdateSuccess?: () => void; // Callback to refresh parent component
}

function Form2({ setShowPopup, editData, onUpdateSuccess }: FormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formationId, setFormationId] = useState('');
  const [section, setSection] = useState('');
  const [session, setSession] = useState('');
  const [creneauId, setCreneauId] = useState('');
  const [numberOfSupervisors, setNumberOfSupervisors] = useState(1);
  const [surveillants, setSurveillants] = useState<string[]>(['']); // Array of teacher codes
  
  // Data for dropdowns
  const [formations, setFormations] = useState<any[]>([]);
  const [creneaux, setCreneaux] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [sessions] = useState<string[]>(['Normale', 'Rattrapage']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set initial values when editData changes
  useEffect(() => {
    if (editData) {
      if (editData.formation_id) {
        setFormationId(editData.formation_id.toString());
      }
      
      setSection(editData.section || '');
      setSession(editData.session || '');
      
      if (editData.id_creneau) {
        setCreneauId(editData.id_creneau.toString());
      }
      
      if (editData.nombre_surveillant) {
        setNumberOfSupervisors(editData.nombre_surveillant);
      }
      
      // Initialize surveillants from editData if available
      if (editData.surveillants && editData.surveillants.length > 0) {
        setSurveillants(editData.surveillants.map(s => s.code_enseignant));
      }
    }
  }, [editData]);

  // Load data for dropdowns
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch formations
        const formationsData = await api.getModelData('Formations', {
          page: 1,
          itemsPerPage: 100,
          search: '',
        });
        
        if (formationsData) {
          if (Array.isArray(formationsData)) {
            setFormations(formationsData);
          } else if (formationsData.results && Array.isArray(formationsData.results)) {
            setFormations(formationsData.results);
          } else if (formationsData.data && Array.isArray(formationsData.data)) {
            setFormations(formationsData.data);
          }
        }
        
        // Fetch creneaux
        const creneauxData = await api.getModelData('Creneau', {
          page: 1,
          itemsPerPage: 100,
          search: '',
        });
        
        if (creneauxData) {
          if (Array.isArray(creneauxData)) {
            setCreneaux(creneauxData);
          } else if (creneauxData.results && Array.isArray(creneauxData.results)) {
            setCreneaux(creneauxData.results);
          } else if (creneauxData.data && Array.isArray(creneauxData.data)) {
            setCreneaux(creneauxData.data);
          }
        }
        
        // Fetch teachers
        const teachersData = await api.getModelData('Enseignants', {
          page: 1,
          itemsPerPage: 100,
          search: '',
        });
        
        if (teachersData) {
          let teachersArray = [];
          if (Array.isArray(teachersData)) {
            teachersArray = teachersData;
          } else if (teachersData.results && Array.isArray(teachersData.results)) {
            teachersArray = teachersData.results;
          } else if (teachersData.data && Array.isArray(teachersData.data)) {
            teachersArray = teachersData.data;
          }
          
          // Debug: Log the first few teachers to see their structure
          console.log('Sample teachers data:', teachersArray.slice(0, 3));
          
          setTeachers(teachersArray);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load form options: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Update surveillants array when number changes
  useEffect(() => {
    const currentLength = surveillants.length;
    if (numberOfSupervisors > currentLength) {
      // Add empty slots
      const newSurveillants = [...surveillants];
      for (let i = currentLength; i < numberOfSupervisors; i++) {
        newSurveillants.push('');
      }
      setSurveillants(newSurveillants);
    } else if (numberOfSupervisors < currentLength) {
      // Remove extra slots
      setSurveillants(surveillants.slice(0, numberOfSupervisors));
    }
  }, [numberOfSupervisors, surveillants]);

  // Handle surveillant selection change
  const handleSurveillantChange = (index: number, value: string) => {
    const newSurveillants = [...surveillants];
    newSurveillants[index] = value;
    setSurveillants(newSurveillants);
    
    // Debug: Log the selected value
    console.log(`Surveillant ${index + 1} selected:`, value);
  };

  // Handle form submission
  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (isSubmitting || !editData) return; // Prevent double submission or if no editData
  
  try {
    setIsSubmitting(true);
    setError(null);
    
    // Check if all required fields are filled
    if (!formationId || !section || !creneauId) {
      setError('Please fill all required fields');
      return;
    }
    
    // Check if all surveillants are selected
    const allSurveillantsSelected = surveillants.every(s => s !== '');
    if (!allSurveillantsSelected) {
      setError('Please select all supervisors');
      return;
    }
    
    // Check for duplicate surveillants
    const uniqueSurveillants = new Set(surveillants);
    if (uniqueSurveillants.size !== surveillants.length) {
      setError('Each supervisor must be different');
      return;
    }
    
    // Create the surveillants array with proper structure
    const surveillantsData: Surveillant[] = surveillants.map((code, index) => ({
      code_enseignant: code,
      est_charge_cours: index === 0 ? 1 : 0 // First one is the main supervisor
    }));
    
    // Create the planning data object with proper field names
    // that match what the backend expects
    const updateData = {
      id_planning: editData.id_planning,
      formation_id: parseInt(formationId),  // Send formation_id directly, not a formation object
      section: section,
      nombre_surveillant: numberOfSupervisors,
      session: session || '', // Ensure we send empty string if no session selected
      id_creneau: parseInt(creneauId),  // Send id_creneau directly, not a creneau object
      surveillants: surveillantsData
    };
    
    // Debug: Log the exact payload being sent
    console.log('=== PLANNING UPDATE PAYLOAD ===');
    console.log('Full payload:', JSON.stringify(updateData, null, 2));
    console.log('=================================');
    
    // Send the API request using the imported function
    const response = await updatePlanningWithSurveillants(updateData);
    console.log('Planning updated successfully:', response);
    
    // Close the popup and refresh data
    setShowPopup(false);
    if (onUpdateSuccess) {
      onUpdateSuccess();
    }
    
  } catch (err) {
    console.error('Error updating planning:', err);
    setError(err instanceof Error ? err.message : 'Failed to update planning');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      {/* Overlay for the blur effect */}
      <div className={styles.blurOverlay}></div>

      {/* Form container */}
      <div className={styles.container}>
        {/* Close Button */}
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          <svg
            className={styles.svg}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Title */}
        <div className={styles.title}>{t('exam.editModule')}</div>

        {/* Form Content */}
        <div className={styles.content}>
          {loading && <div className={styles.loading}>Loading form data...</div>}
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Formation (Module) Selection */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.formation')}</span>
                <select 
                  value={formationId} 
                  onChange={(e) => setFormationId(e.target.value)} 
                  required
                  disabled={loading || formations.length === 0}
                >
                  <option value="">{t('exam.selectFormation')}</option>
                  {formations.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.filière || formation.filiere || 'Unknown'} - 
                      {formation.niveau_cycle || 'Unknown'} - 
                      {formation.modules || 'Unknown'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.section')}</span>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder={t('exam.enterSection')}
                  required
                />
              </div>

              {/* Session/Semester */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.session')}</span>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                >
                  <option value="">{t('exam.selectSession')}</option>
                  {sessions.map((sessionOption) => (
                    <option key={sessionOption} value={sessionOption}>
                      {sessionOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Creneau Selection */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.creneau')}</span>
                <select
                  value={creneauId}
                  onChange={(e) => setCreneauId(e.target.value)}
                  required
                  disabled={loading || creneaux.length === 0}
                >
                  <option value="">{t('exam.selectCreneau')}</option>
                  {creneaux.map((creneau) => (
                    <option key={creneau.id_creneau || creneau.id} value={creneau.id_creneau || creneau.id}>
                      {creneau.date_creneau || 'Unknown'} - 
                      {creneau.heure_creneau || 'Unknown'} - 
                      {creneau.salle || 'Unknown'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Supervisors */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('exam.nbrSE')}</span>
                <input 
                  type="number" 
                  placeholder={t('exam.enterNbrSE')} 
                  value={numberOfSupervisors}
                  onChange={(e) => setNumberOfSupervisors(parseInt(e.target.value) || 1)}
                  min="1"
                  max="10"
                  required 
                />
              </div>

              {/* Empty space for layout balance */}
              <div className={styles.inputBox}></div>

              {/* Supervisors Selection - Dynamic based on numberOfSupervisors */}
              {surveillants.map((teacherId, index) => (
                <div key={index} className={styles.inputBox} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.details}>
                    {index === 0 ? t('exam.mainSupervisor') : `${t('exam.supervisor')} ${index + 1}`}
                    {index === 0 && <span style={{ color: '#666', fontSize: '0.9em' }}> (Chargé de cours)</span>}
                  </span>
                  <select
                    value={teacherId}
                    onChange={(e) => handleSurveillantChange(index, e.target.value)}
                    required
                    disabled={loading || teachers.length === 0}
                  >
                    <option value="">{t('exam.selectSupervisor')}</option>
                    {teachers.map((teacher) => {
                      const teacherCode = teacher.Code_Enseignant || teacher.code_enseignant;
                      // Disable if already selected in another dropdown
                      const isDisabled = surveillants.some((s, i) => i !== index && s === teacherCode);
                      return (
                        <option 
                          key={teacherCode} 
                          value={teacherCode}
                          disabled={isDisabled}
                        >
                          {teacherCode} - {teacher.nom || 'Unknown'} {teacher.prenom || ''}
                          {isDisabled && ' (Already selected)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className={styles.button}>
              <input 
                type="submit" 
                value={isSubmitting ? t('button.updating') : t('button.updateExam')} 
                disabled={isSubmitting || loading || formations.length === 0 || creneaux.length === 0 || teachers.length === 0}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Form2;