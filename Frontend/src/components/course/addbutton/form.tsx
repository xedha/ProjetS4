import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../services/api';
import styles from './form.module.css';

interface FormProps {
  setShowPopup: (show: boolean) => void;
  onAdded?: () => void;
}

const Form: React.FC<FormProps> = ({ setShowPopup, onAdded }) => {
  const { t } = useTranslation();

  const [domain, setDomain] = useState('');
  const [field, setField] = useState('');
  const [cycleLevel, setCycleLevel] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [numSections, setNumSections] = useState<number | ''>('');
  const [numGroups, setNumGroups] = useState<number | ''>('');
  const [semester, setSemester] = useState('');
  const [moduleName, setModuleName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fields = {
      domaine: domain,
      'filière': field,
      niveau_cycle: cycleLevel,
      'specialités': specialties,
      nbr_sections: numSections,
      nbr_groupes: numGroups,
      semestre: semester,
      modules: moduleName,
    };

    console.debug('Submitting course fields:', fields);

    try {
      await api.addModelRow('Formations', fields);
      onAdded?.();
      setShowPopup(false);
    } catch (err) {
      console.error('Error adding course:', err);
      alert(t('courses.addError') || 'Failed to add course.');
    }
  };

  return (
    <>
      <div className={styles.blurOverlay} />
      <div className={styles.container}>
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor"/>
          </svg>
        </button>

        <div className={styles.title}>{t('courses.moduleRegistration')}</div>
        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Domain Input */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.domain')}</span>
                <input
                  list="domainOptions"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  placeholder={t('courses.enterDomain')}
                  required
                />
                <datalist id="domainOptions">
                  <option value="Sciences et Technologies" />
                  <option value="Sciences de la Nature et de la Vie" />
                  <option value="Mathématiques et Informatique" />
                  <option value="Sciences Économiques" />
                  <option value="Sciences Humaines et Sociales" />
                </datalist>
              </div>

              {/* Field Input */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.field')}</span>
                <input
                  list="fieldOptions"
                  value={field}
                  onChange={e => setField(e.target.value)}
                  placeholder={t('courses.enterField')}
                  required
                />
                <datalist id="fieldOptions">
                  <option value="Informatique" />
                  <option value="Électronique" />
                  <option value="Mécanique" />
                  <option value="Génie Civil" />
                  <option value="Télécommunications" />
                </datalist>
              </div>

              {/* Cycle Level Input */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.cycleLevel')}               </span>
                <input
                  list="cycleLevelOptions"
                  value={cycleLevel}
                  onChange={e => setCycleLevel(e.target.value)}
                  placeholder={t('courses.enterCycleLevel')}
                  required
                />
                <datalist id="cycleLevelOptions">
                  <option value="Licence (L1)" />
                  <option value="Licence (L2)" />
                  <option value="Licence (L3)" />
                  <option value="Master (M1)" />
                  <option value="Master (M2)" />
                </datalist>
              </div>

              {/* Specialties Input */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.specialties')}</span>
                <input
                  list="specialtiesOptions"
                  value={specialties}
                  onChange={e => setSpecialties(e.target.value)}
                  placeholder={t('courses.enterSpecialties')}
                  required
                />
                <datalist id="specialtiesOptions">
                  <option value="Génie Logiciel" />
                  <option value="Réseaux et Systèmes Distribués" />
                  <option value="Intelligence Artificielle" />
                  <option value="Sécurité Informatique" />
                  <option value="Systèmes d'Information" />
                </datalist>
              </div>

              {/* Number of Sections Input */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.numSections')}</span>
                <input
                  type="number"
                  min="1"
                  value={numSections}
                  onChange={e => setNumSections(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={t('courses.enterNumSections')}
                  required
                />
              </div>

              {/* Number of Groups Input */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.numGroups')}</span>
                <input
                  type="number"
                  min="1"
                  value={numGroups}
                  onChange={e => setNumGroups(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={t('courses.enterNumGroups')}
                  required
                />
              </div>

              {/* Semester Input */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.semester')}</span>
                <input
                  list="semesterOptions"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  placeholder={t('courses.enterSemester')}
                  required
                />
                <datalist id="semesterOptions">
                  <option value="S1" />
                  <option value="S2" />
                  <option value="S3" />
                  <option value="S4" />
                  <option value="S5" />
                </datalist>
              </div>

              {/* Module Input */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('courses.modules')}</span>
                <input
                  list="moduleOptions"
                  value={moduleName}
                  onChange={e => setModuleName(e.target.value)}
                  placeholder={t('courses.enterModule')}
                  required
                />
                <datalist id="moduleOptions">
                  <option value="Algorithmique et Structures de Données" />
                  <option value="Programmation Orientée Objet" />
                  <option value="Bases de Données" />
                  <option value="Réseaux Informatiques" />
                  <option value="Intelligence Artificielle" />
                  <option value="Génie Logiciel" />
                </datalist>
              </div>
            </div>

            {/* Submit button */}
            <div className={styles.button}>
              <input type="submit" value={t('courses.addModule')} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Form;
