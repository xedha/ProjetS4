import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import styles from "./Tabel.module.css";
import modify from "./src/assets/edit.svg";
import Button from "./deletButton";
import Editbutton from "./editbutton";
import SendButton from "../send table button/send";
import SuccessModal from '../send table button/success';
import DeleteModal from '../send table button/deletepopup';
import TeacherPopup from './TeacherPopup';

interface Row {
  level: string;
  specialty: string;
  semester: string;
  section: string;
  date: string;
  time: string;
  examRoom: string;
  moduleName: string;
  nbrSE: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface Props {
  data: Row[];
}

const Tabel: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isTeacherPopupOpen, setTeacherPopupOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  // Mock data for teachers - replace with actual data from your API
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 1, name: "Dr. Smith", email: "smith@university.edu" },
    { id: 2, name: "Prof. Johnson", email: "johnson@university.edu" },
  ]);

  // Add supervisor state
  const [supervisor, setSupervisor] = useState({
    name: "Dr. Anderson",
    email: "anderson@university.edu"
  });

  const mockExamData: Row[] = [
    {
      level: "L3",
      specialty: "Computer Science",
      semester: "S1",
      section: "A",
      date: "2024-01-15",
      time: "09:00",
      examRoom: "Room 101",
      moduleName: "Advanced Algorithms & Complexity",
      nbrSE: "45"
    },
    {
      level: "L3",
      specialty: "Computer Science",
      semester: "S1",
      section: "A",
      date: "2024-01-16",
      time: "14:00",
      examRoom: "Room 102",
      moduleName: "Machine Learning Fundamentals",
      nbrSE: "42"
    },
    {
      level: "L3",
      specialty: "Computer Science",
      semester: "S1",
      section: "B",
      date: "2024-01-17",
      time: "09:00",
      examRoom: "Room 103",
      moduleName: "Distributed Systems & Cloud Computing",
      nbrSE: "38"
    },
    {
      level: "L3",
      specialty: "Computer Science",
      semester: "S1",
      section: "B",
      date: "2024-01-18",
      time: "14:00",
      examRoom: "Room 104",
      moduleName: "Artificial Intelligence & Neural Networks",
      nbrSE: "40"
    },
    {
      level: "L3",
      specialty: "Computer Science",
      semester: "S1",
      section: "C",
      date: "2024-01-19",
      time: "09:00",
      examRoom: "Room 105",
      moduleName: "Cryptography & Network Security",
      nbrSE: "35"
    }
  ];

  // Use mockExamData if no data prop is provided
  const displayData = data || mockExamData;

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const openSuccessModal = () => setSuccessModalOpen(true);
  const closeSuccessModal = () => setSuccessModalOpen(false);
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDelete = () => {
    closeDeleteModal();
  };

  const handleTeacherClick = (examId: number) => {
    setSelectedExamId(examId);
    setTeacherPopupOpen(true);
  };

  const handleEditTeacher = (teacherId: number, updatedTeacher: Teacher) => {
    setTeachers(prevTeachers =>
      prevTeachers.map(teacher =>
        teacher.id === teacherId ? updatedTeacher : teacher
      )
    );
  };

  const handleEditSupervisor = (updatedSupervisor: { name: string; email: string }) => {
    setSupervisor(updatedSupervisor);
  };

  const tableHeaders = [
    t('exam.level'),
    t('exam.specialty'),
    t('exam.semester'),
    t('exam.section'),
    t('exam.date'),
    t('exam.time'),
    t('exam.examRoom'),
    t('exam.moduleName'),
    t('exam.nbrSE'),
    t('teacher.viewTeachers'),
    t('exam.action'),
  ];

  return (
    <div className="overflow-x-auto">
      <table className={styles.tabel}>
        <thead>
          <tr className={styles.mainraw}>
            {tableHeaders.map((head) => (
              <th key={head} className={styles.headtext}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, index) => (
            <tr key={index} className={styles.lines}>
              <td className={styles.textnormal}>{row.level}</td>
              <td className={styles.textnormal}>{row.specialty}</td>
              <td className={styles.textnormal}>{row.semester}</td>
              <td className={styles.textnormal}>{row.section}</td>
              <td className={styles.textnormal}>{row.date}</td>
              <td className={styles.textnormal}>{row.time}</td>
              <td className={styles.textnormal}>{row.examRoom}</td>
              <td className={styles.textnormal}>{row.moduleName}</td>
              <td className={styles.textnormal}>{row.nbrSE}</td>
              <td className={styles.textnormal}>
                <button
                  onClick={() => handleTeacherClick(index)}
                  className={styles.teacherButton}
                >
                  {t('teacher.viewTeachers')}
                </button>
              </td>
              <td className="colomn">
                <div className={styles.buttonss}>
                  <Editbutton isOpen={isEditModalOpen} onClose={closeEditModal} />
                  <Button onClick={openDeleteModal} />
                  <SendButton onClick={openSuccessModal} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        message={t('exam.successMessage')}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        message={t('exam.deleteConfirmation')}
      />

      <TeacherPopup
        isOpen={isTeacherPopupOpen}
        onClose={() => setTeacherPopupOpen(false)}
        supervisor={supervisor}
        teachers={teachers}
        onEditTeacher={handleEditTeacher}
        onEditSupervisor={handleEditSupervisor}
      />
    </div>
  );
};

export default Tabel;