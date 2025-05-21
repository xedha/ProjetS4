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

  const [level, setLevel] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [group, setGroup] = useState('');
  const [typeTeaching, setTypeTeaching] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [moduleAbbr, setModuleAbbr] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [hours, setHours] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  const [teachersList, setTeachersList] = useState<{ id: number; nom: string; prenom: string }[]>([]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await api.getModelData('Enseignants', {
          page: 1,
          itemsPerPage: 100,
          search: '',
        });
        setTeachersList(response as any);
      } catch (err) {
        console.error('Failed to load teachers:', err);
      }
    }
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        Code_Enseignant_id: Number(teacherId),
        annee_universitaire: academicYear,
      };

      await api.addModelRow('ChargesEnseignement', fields);
      onAdded?.();
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding ChargesEnseignement:', error);
      alert(t('teaching.addError') || 'Failed to add teaching assignment.');
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
        <div className={styles.title}>{t('teaching.assignTeacher')}</div>
        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Level */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.level')}</span>
                <input
                  list="levelOptions"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder={t('teaching.enterLevel')}
                  required
                />
                <datalist id="levelOptions">
                  <option value="Undergraduate" />
                  <option value="Graduate" />
                </datalist>
              </div>
              {/* Specialty */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.specialty')}</span>
                <input
                  list="specialtyOptions"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder={t('teaching.enterSpecialty')}
                  required
                />
                <datalist id="specialtyOptions">
                  <option value="Computer Science" />
                  <option value="Software Engineering" />
                </datalist>
              </div>
              {/* Semester */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.semester')}</span>
                <input
                  list="semesterOptions"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder={t('teaching.enterSemester')}
                  required
                />
                <datalist id="semesterOptions">
                  <option value="Spring" />
                  <option value="Fall" />
                </datalist>
              </div>
              {/* Section */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.section')}</span>
                <input
                  list="sectionOptions"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder={t('teaching.enterSection')}
                  required
                />
                <datalist id="sectionOptions">
                  <option value="A" />
                  <option value="B" />
                </datalist>
              </div>
              {/* Group */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.group')}</span>
                <input
                  list="groupOptions"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder={t('teaching.enterGroup')}
                  required
                />
                <datalist id="groupOptions">
                  <option value="1" />
                  <option value="2" />
                </datalist>
              </div>
              {/* Type */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.type')}</span>
                <input
                  list="typeOptions"
                  value={typeTeaching}
                  onChange={(e) => setTypeTeaching(e.target.value)}
                  placeholder={t('teaching.enterType')}
                  required
                />
                <datalist id="typeOptions">
                  <option value="Lecture" />
                  <option value="Lab" />
                </datalist>
              </div>
              {/* Module Name */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.moduleName')}</span>
                <input
                  list="moduleNameOptions"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder={t('teaching.enterModuleName')}
                  required
                />
                <datalist id="moduleNameOptions">
                  <option value="CS101" />
                  <option value="SE202" />
                </datalist>
              </div>
              {/* Module Abbreviation */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.moduleAbbreviation')}</span>
                <input
                  list="moduleAbbrOptions"
                  value={moduleAbbr}
                  onChange={(e) => setModuleAbbr(e.target.value)}
                  placeholder={t('teaching.enterModuleAbbreviation')}
                  required
                />
                <datalist id="moduleAbbrOptions">
                  <option value="CS" />
                  <option value="SE" />
                </datalist>
              </div>

              {/* Hours */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.hours')}</span>
                <input
                  type="number"
                  min="1"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder={t('teaching.enterHours')}
                  required
                />
              </div>

              {/* Teacher Dropdown */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.teacher')}</span>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  required
                >
                  <option value="">{t('teaching.selectTeacher') || 'Select teacher'}</option>
                  {teachersList.map((tchr) => (
                    <option key={tchr.id} value={tchr.id}>
                      {`${tchr.nom}, ${tchr.prenom}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teaching.academicYear')}</span>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder={t('teaching.enterAcademicYear')}
                  required
                />
              </div>
            </div>
            <div className={styles.button}>
              <input type="submit" value={t('teaching.addModule')} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Form2;
