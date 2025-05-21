import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import styles from './Form2.module.css';

interface FormProps {
  setShowPopup: (show: boolean) => void;
  onAdded?: () => void;
}

const FormTeacher2: React.FC<FormProps> = ({ setShowPopup, onAdded }) => {
  const { t } = useTranslation();

  const [teacherCode, setTeacherCode] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthName, setBirthName] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [grade, setGrade] = useState('');
  const [diploma, setDiploma] = useState('');
  const [teacherType, setTeacherType] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fields = {
      Code_Enseignant: teacherCode,
      nom: lastName,
      prenom: firstName,
      nom_jeune_fille: birthName,
      genre: gender,
      etat: status,
      faculté: faculty,
      département: department,
      grade,
      diplôme: diploma,
      type: teacherType,
      email1,
      email2,
      tel1: phone1,
      tel2: phone2,
    };

    console.debug('Submitting teacher fields:', fields);

    try {
      await api.addModelRow('Enseignants', fields);
      onAdded?.();
      setShowPopup(false);
    } catch (err) {
      console.error('Error adding teacher:', err);
      alert(t('teachers.addError') || 'Failed to add teacher.');
    }
  };

  return (
    <>
      <div className={styles.blurOverlay} />
      <div className={styles.container}>
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          {/* close icon */}
          <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor"/>
          </svg>
        </button>

        <div className={styles.title}>{t('teachers.registration')}</div>
        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Code Enseignant */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.teacherCode')}</span>
                <input
                  value={teacherCode}
                  onChange={e => setTeacherCode(e.target.value)}
                  placeholder={t('teachers.enterTeacherCode')}
                  required
                />
              </div>

              {/* Nom */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.lastName')}</span>
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder={t('teachers.enterLastName')}
                  required
                />
              </div>

              {/* Prénom */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.firstName')}</span>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder={t('teachers.enterFirstName')}
                  required
                />
              </div>

              {/* Nom Jeune Fille */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.birthName')}</span>
                <input
                  value={birthName}
                  onChange={e => setBirthName(e.target.value)}
                  placeholder={t('teachers.enterBirthName')}
                />
              </div>

              {/* Genre */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.gender')}</span>
                <input
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  placeholder={t('teachers.enterGender')}
                  required
                />
              </div>

              {/* État */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.status')}</span>
                <select
                  className={styles.selectbox}
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  required
                >
                  <option value="">{t('teachers.selectStatus')}</option>
                  <option value="RETIRED">{t('teachers.statusRetired')}</option>
                  <option value="MUTATED">{t('teachers.statusMutated')}</option>
                  <option value="MED">{t('teachers.statusMed')}</option>
                  <option value="ADMIN">{t('teachers.statusAdmin')}</option>
                </select>
              </div>

              {/* Faculté */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.faculty')}</span>
                <input
                  value={faculty}
                  onChange={e => setFaculty(e.target.value)}
                  placeholder={t('teachers.enterFaculty')}
                />
              </div>

              {/* Département */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.department')}</span>
                <input
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder={t('teachers.enterDepartment')}
                  required
                />
              </div>

              {/* Grade */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.grade')}</span>
                <input
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  placeholder={t('teachers.enterGrade')}
                  required
                />
              </div>

              {/* Diplôme */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.diploma')}</span>
                <input
                  value={diploma}
                  onChange={e => setDiploma(e.target.value)}
                  placeholder={t('teachers.enterDiploma')}
                />
              </div>

              {/* Type */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.type')}</span>
                <input
                  value={teacherType}
                  onChange={e => setTeacherType(e.target.value)}
                  placeholder={t('teachers.enterType')}
                />
              </div>

              {/* Email1 */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.email')}</span>
                <input
                  type="email"
                  value={email1}
                  onChange={e => setEmail1(e.target.value)}
                  placeholder={t('teachers.enterEmail')}
                  required
                />
              </div>

              {/* Email2 */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.email2')}</span>
                <input
                  type="email"
                  value={email2}
                  onChange={e => setEmail2(e.target.value)}
                  placeholder={t('teachers.enterEmail2')}
                />
              </div>

              {/* Tel1 */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.phone')}</span>
                <input
                  value={phone1}
                  onChange={e => setPhone1(e.target.value)}
                  placeholder={t('teachers.enterPhone')}
                  required
                />
              </div>

              {/* Tel2 */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t('teachers.phone2')}</span>
                <input
                  value={phone2}
                  onChange={e => setPhone2(e.target.value)}
                  placeholder={t('teachers.enterPhone2')}
                />
              </div>
            </div>

            <div className={styles.button}>
              <input type="submit" value={t('teachers.addTeacher')} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormTeacher2;
