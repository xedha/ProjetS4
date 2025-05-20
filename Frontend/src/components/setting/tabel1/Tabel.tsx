import React, { useState } from "react";
import styles from "./Tabel.module.css";
import Button from "./deletButton";
import Editbutton from "./editbutton";
import { useTranslation } from 'react-i18next';

interface Row {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
}

interface Props {
  data: Row[];
}

const Tabel: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="overflow-x-auto">
      <table className={styles.tabel}>
        <thead>
          <tr className={styles.mainraw}>
            {[
              t('settings.username'),
              t('settings.fullName'),
              t('settings.phone'),
              t('settings.email'),
              t('settings.role'),
              t('exam.action')
            ].map((head) => (
              <th key={head} className={styles.headtext}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={styles.lines}>
              <td className={styles.textnormal}>{row.username}</td>
              <td className={styles.textnormal}>{row.fullName}</td>
              <td className={styles.textnormal}>{row.phone}</td>
              <td className={styles.textnormal}>{row.email}</td>
              <td className={styles.textnormal}>{row.role}</td>
              <td className="colomn">
                <div className={styles.buttonss}>
                  <Editbutton isOpen={isModalOpen} onClose={closeModal} />
                  <Button />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tabel;
