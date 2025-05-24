import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import styles from "./Tabel.module.css";
import Button from "./deletButton";
import Editbutton from "./editbutton";
import SendButton from "../send table button/send";
import SuccessModal from '../send table button/success';
import DeleteModal from '../send table button/deletepopup';
import TeacherPopup from './TeacherPopup';
import SendForm from '../addbutton/sendform';
import { examApi } from '../../../services/ExamApi';

interface TabelProps {
  data: {
    level: string;
    specialty: string;
    semester: string;
    section: string;
    date: string;
    time: string;
    examRoom: string;
    moduleName: string;
    moduleAbbreviation: string;
    supervisor: string;
    order: string;
    nbrSE: string;
    email: string;
  }[];
  planningsRaw?: any[]; // Add raw planning data from API
  onDataRefresh?: () => void;
}

const Tabel: React.FC<TabelProps> = ({ data, planningsRaw = [], onDataRefresh }) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSendFormOpen, setSendFormOpen] = useState(false);
  const [isTeacherPopupOpen, setTeacherPopupOpen] = useState(false);
  const [selectedPlanningId, setSelectedPlanningId] = useState<number | null>(null);
  const [selectedPlanningIdForDelete, setSelectedPlanningIdForDelete] = useState<string | null>(null);
  const [selectedPlanningData, setSelectedPlanningData] = useState<any>(null);

  // Modal controls
  const openEditModal = (planningId: string) => {
    const planningIdNumber = parseInt(planningId);
    setSelectedPlanningId(planningIdNumber);
    
    // Find the raw planning data
    const rawPlanning = planningsRaw.find(p => p.id_planning === planningIdNumber);
    
    // Find the corresponding table data
    const tableData = data.find(d => parseInt(d.order) === planningIdNumber);
    
    if (rawPlanning && tableData) {
      // Combine raw API data with table data format for the form
      setSelectedPlanningData({
        id_planning: planningIdNumber,
        level: tableData.level,
        specialty: tableData.specialty,
        semester: tableData.semester,
        section: tableData.section,
        date: tableData.date,
        time: tableData.time,
        examRoom: tableData.examRoom,
        moduleName: tableData.moduleName,
        moduleAbbreviation: tableData.moduleAbbreviation,
        supervisor: tableData.supervisor,
        order: tableData.order,
        nbrSE: tableData.nbrSE,
        nbrSS: "1", // Default value
        email: tableData.email,
        // Additional fields from API
        formation_id: rawPlanning.formation_id,
        session: rawPlanning.session,
        id_creneau: rawPlanning.id_creneau,
        surveillants: rawPlanning.surveillants || []
      });
    }
    
    setEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedPlanningId(null);
  };
  
  const openSuccessModal = () => setSuccessModalOpen(true);
  const closeSuccessModal = () => setSuccessModalOpen(false);
  
  const openDeleteModal = (planningId: string) => {
    setSelectedPlanningIdForDelete(planningId);
    setDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedPlanningIdForDelete(null);
  };

  // Handle teacher popup
  const handleTeacherClick = (planningId: string) => {
    setSelectedPlanningId(parseInt(planningId));
    setTeacherPopupOpen(true);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!selectedPlanningIdForDelete) return;
    
    try {
      await examApi.deletePlanning(parseInt(selectedPlanningIdForDelete));
      closeDeleteModal();
      if (onDataRefresh) {
        onDataRefresh();
      }
    } catch (error) {
      console.error('Error deleting planning:', error);
      alert('Failed to delete planning. Please try again.');
    }
  };

  // Send email functionality
  const handleSendEmail = (planningId: string) => {
    setSelectedPlanningId(parseInt(planningId));
    setSendFormOpen(true);
  };

  // Handle successful update
  const handleUpdateSuccess = () => {
    if (onDataRefresh) {
      onDataRefresh();
    }
  };

  const tableHeaders = [
    t('level'),
    t('specialty'),
    t('semester'),
    t('section'),
    t('date'),
    t('time'),
    t('examRoom'),
    t('moduleName'),
    t('moduleAbbreviation'),
    t('supervisor'),
    t('nbrSE'),
    t('actions')
  ];
  

  return (
    <>
      <div className={styles.tableWrapper}>
        <table className={styles.tabel}>
          <thead>
            <tr className={styles.mainraw}>
              {tableHeaders.map((header) => (
                <th key={header} className={styles.headtext}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={styles.lines}>
                <td className={styles.textnormal}>{row.level}</td>
                <td className={styles.textnormal}>{row.specialty}</td>
                <td className={styles.textnormal}>{row.semester}</td>
                <td className={styles.textnormal}>{row.section}</td>
                <td className={styles.textnormal}>{row.date}</td>
                <td className={styles.textnormal}>{row.time}</td>
                <td className={styles.textnormal}>{row.examRoom}</td>
                <td className={styles.textnormal}>{row.moduleName}</td>
                <td className={styles.textnormal}>{row.moduleAbbreviation}</td>
                <td className={styles.textnormal}>
                  <button 
                    className={styles.viewTeachersButton}
                    onClick={() => handleTeacherClick(row.order)}
                  >
                    {t('viewTeachers')}
                  </button>
                </td>
                <td className={styles.textnormal}>{row.nbrSE}</td>
                <td className={styles.textnormal}>
                  <div className={styles.buttonss}>
                    <Editbutton 
                      isOpen={isEditModalOpen && selectedPlanningId === parseInt(row.order)} 
                      onClose={closeEditModal} 
                      onClick={() => openEditModal(row.order)}
                      planningData={selectedPlanningData}
                      onUpdateSuccess={handleUpdateSuccess}
                    />
                    <Button onClick={() => openDeleteModal(row.order)} />
                    <SendButton 
                      onClick={() => handleSendEmail(row.order)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Success Modal for Email Sent */}
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        message={t('exam.successMessage') || "Email sent successfully!"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        message={t('exam.deleteConfirmation') || "Are you sure you want to delete this exam planning?"}
      />

      {/* Teacher Management Popup */}
      {selectedPlanningId && isTeacherPopupOpen && (
        <TeacherPopup
          isOpen={isTeacherPopupOpen}
          onClose={() => {
            setTeacherPopupOpen(false);
            setSelectedPlanningId(null);
          }}
          planningId={selectedPlanningId}
          onTeachersUpdated={() => {
            if (onDataRefresh) {
              onDataRefresh();
            }
          }}
        />
      )}

      {/* Send Email Confirmation Form */}
      {selectedPlanningId && isSendFormOpen && (
        <SendForm
          setShowPopup={setSendFormOpen}
          planningId={selectedPlanningId}
        />
      )}
    </>
  );
};

export default Tabel;