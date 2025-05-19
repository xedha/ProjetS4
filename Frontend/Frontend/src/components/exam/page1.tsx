"use client"

import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import { useTranslation } from 'react-i18next';
import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton";
import Search from "./search bar/seach";
import { generateTestPDF } from './test-pdf';
import styles from './page1.module.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Add type declaration for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface AutoTableData {
  settings: {
    margin: {
      left: number;
    };
  };
}

const data = [
  {
    level: "L1",
    specialty: "Informatique",
    semester: "S1",
    section: "A",
    date: "13/05/2022",
    time: "10:00",
    examRoom: "Room 101",
    moduleName: "Transfer Bank",
    moduleAbbreviation: "TB",
    supervisor: "Matt Dickerson",
    order: "1",
    nbrSE: "2",
    nbrSS: "1",
    email: "matt@example.com"
  },
  {
    level: "L2",
    specialty: "Mathématiques",
    semester: "S2",
    section: "B",
    date: "22/05/2022",
    time: "11:00",
    examRoom: "Room 202",
    moduleName: "Cash on Delivery",
    moduleAbbreviation: "COD",
    supervisor: "Wiktoria",
    order: "2",
    nbrSE: "1",
    nbrSS: "2",
    email: "wiktoria@example.com"
  },
  {
    level: "L3",
    specialty: "Physique",
    semester: "S3",
    section: "C",
    date: "15/06/2022",
    time: "08:30",
    examRoom: "Room 303",
    moduleName: "Credit Card Payment",
    moduleAbbreviation: "CC",
    supervisor: "Liam",
    order: "3",
    nbrSE: "3",
    nbrSS: "1",
    email: "liam@example.com"
  },
  {
    level: "M1",
    specialty: "Chimie",
    semester: "S4",
    section: "D",
    date: "30/07/2022",
    time: "09:00",
    examRoom: "Room 404",
    moduleName: "PayPal Payment",
    moduleAbbreviation: "PP",
    supervisor: "Emma",
    order: "4",
    nbrSE: "1",
    nbrSS: "1",
    email: "emma@example.com"
  },
  {
    level: "M2",
    specialty: "Biologie",
    semester: "S5",
    section: "E",
    date: "10/08/2022",
    time: "13:00",
    examRoom: "Room 505",
    moduleName: "Bank Transfer",
    moduleAbbreviation: "BT",
    supervisor: "Noah",
    order: "5",
    nbrSE: "2",
    nbrSS: "2",
    email: "noah@example.comefsdfsdfsdfsdsf fds fds"
  },
  {
    level: "L1",
    specialty: "Informatique",
    semester: "S6",
    section: "F",
    date: "01/09/2022",
    time: "15:00",
    examRoom: "Room 606",
    moduleName: "Crypto Payment",
    moduleAbbreviation: "CRY",
    supervisor: "Olivia",
    order: "6",
    nbrSE: "1",
    nbrSS: "3",
    email: "olivia@example.com"
  },
  {
    level: "L2",
    specialty: "Mathématiques",
    semester: "S2",
    section: "G",
    date: "18/10/2022",
    time: "14:30",
    examRoom: "Room 707",
    moduleName: "Mobile Payment",
    moduleAbbreviation: "MP",
    supervisor: "James",
    order: "7",
    nbrSE: "3",
    nbrSS: "1",
    email: "james@example.com"
  },
  {
    level: "L3",
    specialty: "Physique",
    semester: "S3",
    section: "H",
    date: "03/11/2022",
    time: "12:00",
    examRoom: "Room 808",
    moduleName: "Voucher Redemption",
    moduleAbbreviation: "VCH",
    supervisor: "Sophia",
    order: "8",
    nbrSE: "2",
    nbrSS: "2",
    email: "sophia@example.com"
  }
];

function Page1() {
  const { t } = useTranslation();

  const handlePrint = () => {
    try {
      const success = generateTestPDF();
      if (!success) {
        alert('Error generating PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <>
      <div className="teacher-management-layout">
        <Sidebar />
        <div className="teacher-management-main">
          <Header title="Exam & Scheduling" />
        </div>
      </div>

      <Tabel data={data} />
      
      <div className={styles.buttonContainer}>
        <button onClick={handlePrint} className={styles.printButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print Schedule
        </button>
        <Addbutton/>
        <Search/>
      </div>
    </>
  );
}

export default Page1;
