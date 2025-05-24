"use client"

import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import { useTranslation } from 'react-i18next';
import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton";
import Search from "./search bar/seach";
import styles from './page1.module.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print PDF
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