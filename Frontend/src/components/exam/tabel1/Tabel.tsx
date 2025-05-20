import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import styles from "./Tabel.module.css";
import modify from "./src/assets/edit.svg";
import Button from "./deletButton";
import Editbutton from "./editbutton";
import SendButton from "../send table button/send";
import SuccessModal from '../send table button/success';
import DeleteModal from '../send table button/deletepopup';

interface Row {
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
  nbrSS: string;
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

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const openSuccessModal = () => setSuccessModalOpen(true);
  const closeSuccessModal = () => setSuccessModalOpen(false);
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDelete = () => {
    // Add your delete logic here
    closeDeleteModal();
    // You might want to show a success message after deletion
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
    t('exam.moduleAbbreviation'),
    t('exam.supervisor'),
    t('exam.order'),
    t('exam.nbrSE'),
    t('exam.nbrSS'),
    t('exam.email'),
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
          {data.map((row, index) => (
            <tr key={index} className={styles.lines}>
              {Object.values(row).map((val, i) => (
                <td key={i} className={styles.textnormal}>
                  {val}
                </td>
              ))}
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
    </div>
  );
};

export default Tabel;