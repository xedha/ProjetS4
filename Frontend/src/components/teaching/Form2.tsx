import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import styles from './Form2.module.css';

interface FormProps {
  setShowPopup: (show: boolean) => void;
  onAdded?: () => void;
}

const Form2: React.FC<FormProps> = ({ setShowPopup, onAdded }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [level, setLevel] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [group, setGroup] = useState('');
  const [typeTeaching, setTypeTeaching] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [moduleAbbr, setModuleAbbr] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  // Data for dropdowns
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formations, setFormations] = useState<any[]>([]);
  
  // Selected formation
  const [selectedFormation, setSelectedFormation] = useState<string>('');

  // Load teachers and formations data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch teachers
        const teachersData = await api.getModelData('Enseignants', {
          page: 1,
          itemsPerPage: 1000,
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
          
          console.log('Teachers loaded:', teachersArray.length);
          setTeachers(teachersArray);
        }
        
        // Fetch formations
        const formationsData = await api.getModelData('Formations', {
          page: 1,
          itemsPerPage: 1000,
          search: '',
        });
        
        if (formationsData) {
          let formationsArray = [];
          if (Array.isArray(formationsData)) {
            formationsArray = formationsData;
          } else if (formationsData.results && Array.isArray(formationsData.results)) {
            formationsArray = formationsData.results;
          } else if (formationsData.data && Array.isArray(formationsData.data)) {
            formationsArray = formationsData.data;
          }
          
          console.log('Formations loaded:', formationsArray.length);
          setFormations(formationsArray);
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

  // Handle formation selection change
  const handleFormationChange = (formationId: string) => {
    setSelectedFormation(formationId);
    const formation = formations.find(f => f.id?.toString() === formationId);
    if (formation) {
      // Set module name from formation
      if (formation.modules) {
        setModuleName(formation.modules);
      }
      // Set module abbreviation if available
      if (formation.abv_module) {
        setModuleAbbr(formation.abv_module);
      }
      // Optionally set other fields from formation
      if (formation.filière || formation.filiere) {
        setSpecialty(formation.filière || formation.filiere);
      }
      if (formation.niveau_cycle) {
        setLevel(formation.niveau_cycle);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      const fields = {
        palier: level,
        specialite: specialty,
        semestre: semester,
        section,
        groupe: group,
        type: typeTeaching,
        intitulé_module: moduleName,
        abv_module: moduleAbbr,
        code_enseignant: teacherCode, // Using teacher code instead of ID
        annee_universitaire: academicYear,
      };

      await api.addModelRow('ChargesEnseignement', fields);
      onAdded?.();
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding ChargesEnseignement:', error);
      setError(error instanceof Error ? error.message : 'Failed to add teaching assignment');
    }
  };

  return (
    <>
      <div className={styles.blurOverlay} />
      <div className={styles.container}>
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
          </svg>
        </button>
        <div className={styles.title}>{t('teaching.assignTeacher') || 'Assign Teacher'}</div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {loading && <div className={styles.loading}>Loading form data...</div>}

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Formation Selection - Combo box */}
              <div className={styles.inputBox} style={{ gridColumn: 'span 2' }}>
                <span className={styles.details}>{t('teaching.formation') || 'Formation (Module)'}</span>
                <select
                  className={styles.selectbox}
                  value={selectedFormation}
                  onChange={(e) => handleFormationChange(e.target.value)}
                  disabled={loading || formations.length === 0}
                >
                  <option value="">{t('teaching.selectFormation') || 'Select Formation'}</option>
                  {formations.map((formation) => {
                    const formationId = formation.id || '';
                    const filiere = formation.filière || formation.filiere || 'Unknown';
                    const niveau = formation.niveau_cycle || 'Unknown';
                    const modules = formation.modules || 'Unknown';
                    return (
                      <option key={formationId} value={formationId}>
                        {filiere} - {niveau} - {modules}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Level */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.level') || 'Level'}</span>
                <input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder={t('teaching.enterLevel')}
                  required
                  disabled={loading}
                />
              </div>

              {/* Specialty */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.specialty') || 'Specialty'}</span>
                <input
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder={t('teaching.enterSpecialty')}
                  required
                  disabled={loading}
                />
              </div>

              {/* Semester */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.semester') || 'Semester'}</span>
                <input
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder={t('teaching.enterSemester')}
                  required
                  disabled={loading}
                />
              </div>

              {/* Section */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.section') || 'Section'}</span>
                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder={t('teaching.enterSection')}
                  required
                  disabled={loading}
                />
              </div>

              {/* Group */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.group') || 'Group'}</span>
                <input
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder={t('teaching.enterGroup')}
                  required
                  disabled={loading}
                />
              </div>

              {/* Type */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.type') || 'Type'}</span>
                <select
                  className={styles.selectbox}
                  value={typeTeaching}
                  onChange={(e) => setTypeTeaching(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">{t('teaching.selectType') || 'Select Type'}</option>
                  <option value="COURS">{t('teaching.typeCOURS') || 'Course'}</option>
                  <option value="TD">{t('teaching.typeTD') || 'TD'}</option>
                  <option value="TP">{t('teaching.typeTP') || 'TP'}</option>
                </select>
              </div>

              {/* Teacher Selection - Combo box */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.teacher') || 'Teacher'}</span>
                <select
                  className={styles.selectbox}
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  required
                  disabled={loading || teachers.length === 0}
                >
                  <option value="">{t('teaching.selectTeacher') || 'Select Teacher'}</option>
                  {teachers.map((teacher) => {
                    const code = teacher.Code_Enseignant || teacher.code_enseignant || '';
                    const name = teacher.nom || 'Unknown';
                    const firstName = teacher.prenom || '';
                    return (
                      <option key={code} value={code}>
                        {code} - {name} {firstName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Academic Year */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.academicYear') || 'Academic Year'}</span>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder={t('teaching.enterAcademicYear') || '2024-2025'}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className={styles.button}>
              <input 
                type="submit" 
                value={t('teaching.addModule') || 'Add Teaching Assignment'} 
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Form2;