import styles from './Tabel.module.css'
import modify from './src/assets/edit.svg'
import Button from './deletButton'
import React, { useState } from "react";

import Editbutton from "./editbutton";

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
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);

  const openModal = (index: number) => setOpenRowIndex(index);
  const closeModal = () => setOpenRowIndex(null);

  return (
    <div className="overflow-x-auto">
      <table className={styles.tabel}>
        <thead>
          <tr className={styles.mainraw}>
            {[
              "Level",
              "Specialty",
              "Semester",
              "Section",
              "Date",
              "Time",
              "Exam Room",
              "Module Name",
              "Module Abbreviation",
              "Supervisor",
              "Order",
              "NbrSE",
              "NbrSS",
              "Email",
              "Action",
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
              {Object.values(row).map((val, i) => (
                <td key={i} className={styles.textnormal}>
                  {val}
                </td>
              ))}
              <td className="colomn">
                <div className={styles.buttonss}>
                  <button
                    onClick={() => openModal(index)}
                    className={styles.modifybutton}
                  >
                    <img src={modify} alt="Edit" />
                  </button>
                  <Button />
                  {/* Only open this modal if it's for the current row */}
                  {openRowIndex === index && (
                    <Editbutton isOpen={true} onClose={closeModal} />
                  )}
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
