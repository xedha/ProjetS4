"use client"

import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import { useTranslation } from 'react-i18next';
import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton";
import Search from "./search bar/seach";
import styles from './page1.module.css';
import { useState, useEffect, useCallback } from 'react';
import { examApi, PlanningWithDetails } from '../../services/ExamApi'; // Adjust path as needed
import PDFOptionsModal from './tabel1/PDFOptionsModal';

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

// Remove the SpecialtyPDFSelector component as we're using a modal now

function Page1() {
  const { t } = useTranslation();
  const [plannings, setPlannings] = useState<PlanningWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Fetch plannings function as a callback so it can be passed to child components
  const fetchPlannings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await examApi.getPlanningsWithDetails();
      setPlannings(response);
    } catch (err) {
      console.error('Error fetching plannings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch plannings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch plannings on component mount
  useEffect(() => {
    fetchPlannings();
  }, [fetchPlannings]);

  // Handle search input
  const handleSearchChange = (searchValue: string) => {
    setSearchTerm(searchValue.toLowerCase());
  };

  // Convert API data to the format expected by the table
  const convertPlanningsToTableData = (plannings: PlanningWithDetails[]) => {
    return plannings.map((planning) => ({
      level: planning.formation.niveau_cycle,
      specialty: planning.formation.filière,
      semester: planning.formation.semestre,
      section: planning.section,
      date: planning.creneau.date_creneau,
      time: planning.creneau.heure_creneau,
      examRoom: planning.creneau.salle,
      moduleName: planning.formation.modules,
      moduleAbbreviation: planning.formation.modules.slice(0, 3).toUpperCase(),
      supervisor: "View Teachers", // Changed to a button label
      order: planning.id_planning.toString(),
      nbrSE: planning.nombre_surveillant.toString(),
      nbrSS: "1", // This might need to be calculated differently
      email: planning.surveillants?.[0]?.code_enseignant || "" // First surveillant's email
    }));
  };

  const handlePrint = () => {
    setShowPDFModal(true);
  };

  // Filter and get table data
  const getTableData = () => {
    let filteredPlannings = plannings;
    
    // Apply search filter if searchTerm is not empty
    if (searchTerm) {
      filteredPlannings = plannings.filter(planning => 
        planning.formation.modules.toLowerCase().includes(searchTerm) ||
        planning.formation.filière.toLowerCase().includes(searchTerm) ||
        planning.formation.niveau_cycle.toLowerCase().includes(searchTerm) ||
        planning.section.toLowerCase().includes(searchTerm) ||
        planning.creneau.date_creneau.toLowerCase().includes(searchTerm) ||
        planning.creneau.salle.toLowerCase().includes(searchTerm)
      );
    }
    
    return convertPlanningsToTableData(filteredPlannings);
  };

  // Handle add new planning
  const handleAddPlanning = () => {
    // After adding a new planning, refresh the data
    fetchPlannings();
  };

  return (
    <>
      <div className="teacher-management-layout">
        <Sidebar />
        <div className="teacher-management-main">
          <Header title="Exam & Scheduling" />
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <p>API Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className={styles.loadingBanner}>
          <p>Loading exam schedules from API...</p>
        </div>
      )}

      <Tabel 
        data={getTableData()} 
        planningsRaw={plannings} // Pass the raw data to Tabel
        onDataRefresh={fetchPlannings} 
      />
      
      <div className={styles.buttonContainer}>
        <button onClick={handlePrint} className={styles.printButton}>
          <span className={styles.printerWrapper}>
            <span className={styles.printerContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 92 75">
                <path
                  strokeWidth="5"
                  stroke="black"
                  d="M12 37.5H80C85.2467 37.5 89.5 41.7533 89.5 47V69C89.5 70.933 87.933 72.5 86 72.5H6C4.067 72.5 2.5 70.933 2.5 69V47C2.5 41.7533 6.75329 37.5 12 37.5Z"
                ></path>
                <mask fill="white" id="path-2-inside-1_30_7">
                  <path
                    d="M12 12C12 5.37258 17.3726 0 24 0H57C70.2548 0 81 10.7452 81 24V29H12V12Z"
                  ></path>
                </mask>
                <path
                  mask="url(#path-2-inside-1_30_7)"
                  fill="black"
                  d="M7 12C7 2.61116 14.6112 -5 24 -5H57C73.0163 -5 86 7.98374 86 24H76C76 13.5066 67.4934 5 57 5H24C20.134 5 17 8.13401 17 12H7ZM81 29H12H81ZM7 29V12C7 2.61116 14.6112 -5 24 -5V5C20.134 5 17 8.13401 17 12V29H7ZM57 -5C73.0163 -5 86 7.98374 86 24V29H76V24C76 13.5066 67.4934 5 57 5V-5Z"
                ></path>
                <circle fill="black" r="3" cy="49" cx="78"></circle>
              </svg>
            </span>
            <span className={styles.printerPageWrapper}>
              <span className={styles.printerPage}></span>
            </span>
          </span>
          Print
        </button>
        
        <Addbutton onAddSuccess={handleAddPlanning} />
        <Search onSearch={handleSearchChange} />
      </div>
      
      {/* PDF Options Modal */}
      <PDFOptionsModal 
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        data={getTableData()}
        planningsRaw={plannings}
      />
    </>
  );
}

export default Page1;