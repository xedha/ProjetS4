import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Tabel.module.css';

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface Supervisor {
  name: string;
  email: string;
}

interface TeacherPopupProps {
  isOpen: boolean;
  onClose: () => void;
  supervisor: Supervisor;
  teachers: Teacher[];
  onEditTeacher: (teacherId: number, updatedTeacher: Teacher) => void;
  onEditSupervisor: (updatedSupervisor: Supervisor) => void;
}

const TeacherPopup: React.FC<TeacherPopupProps> = ({
  isOpen,
  onClose,
  supervisor,
  teachers,
  onEditTeacher,
  onEditSupervisor,
}) => {
  const { t } = useTranslation();
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingSupervisor, setEditingSupervisor] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [supervisorForm, setSupervisorForm] = useState({ name: supervisor.name, email: supervisor.email });

  if (!isOpen) return null;

  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setEditForm({ name: teacher.name, email: teacher.email });
  };

  const handleSaveEdit = () => {
    if (editingTeacher) {
      onEditTeacher(editingTeacher.id, {
        ...editingTeacher,
        name: editForm.name,
        email: editForm.email,
      });
      setEditingTeacher(null);
    }
  };

  const handleEditSupervisorClick = () => {
    setEditingSupervisor(true);
  };

  const handleSaveSupervisor = () => {
    onEditSupervisor(supervisorForm);
    setEditingSupervisor(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{t('teacher.management')}</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

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
                <label>{t('teacher.name')}</label>
                <input
                  type="text"
                  value={supervisorForm.name}
                  onChange={(e) => setSupervisorForm({ ...supervisorForm, name: e.target.value })}
                  className={styles.editInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t('teacher.email')}</label>
                <input
                  type="email"
                  value={supervisorForm.email}
                  onChange={(e) => setSupervisorForm({ ...supervisorForm, email: e.target.value })}
                  className={styles.editInput}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button onClick={handleSaveSupervisor} className={styles.saveButton}>
                  {t('teacher.save')}
                </button>
                <button onClick={() => setEditingSupervisor(false)} className={styles.cancelButton}>
                  {t('teacher.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <p>{supervisor.name} - {supervisor.email}</p>
          )}
        </div>

        <div className={styles.teachersSection}>
          <h3>{t('teacher.teachers')}</h3>
          <table className={styles.teacherTable}>
            <thead>
              <tr>
                <th>{t('teacher.name')}</th>
                <th>{t('teacher.email')}</th>
                <th>{t('teacher.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  {editingTeacher?.id === teacher.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className={styles.editInput}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
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
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>
                        <button onClick={() => handleEditClick(teacher)} className={styles.editButton}>
                          {t('teacher.edit')}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherPopup; 