import styles from './Tabel.module.css'
import modify from './src/assets/edit.svg'
import Button from './deletButton'
import React, { useState } from "react";
import styles from "./Tabel.module.css";
import modify from "./src/assets/edit.svg";
import Button from "./deletButton";
import Editbutton from "./editbutton";

interface Row {
  name: string;
  type: string;
  date: string;
  title: string;
  abbreviation: string;
  coef: string;
  credits: string;
  unit: string;
  lecture: string;
  tutorial: string;
  practical: string;
}
const varr = "overflow-x-auto";
interface Props {
  data: Row[];
}

const Tabel: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.varr}>
      <table className= {styles.tabel}>
        <thead>
          <tr className={styles.mainraw}>
            {[
              "Level",
              "Specialty",
              "Semester",
              "Module Title",
              "Module Abbreviation",
              "Coefficient",
              "Credits",
              "Unit",
              "Lecture Hours (VHC)",
              "Tutorial Hours (VHTD)",
              "Practical Hours (VHTP)",
              "Actions",
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
                <td key={i} className={styles.textnormal}>{val}</td>
              ))}
              <td className={styles.colomn}>
                
                <div className={styles.buttonss}>
                  
                <button className={styles.modifybutton}   > </button>
               
               
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
