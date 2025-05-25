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

function Page1() {
  const { t } = useTranslation();
  const [plannings, setPlannings] = useState<PlanningWithDetails[]>([]);
  const [filteredPlannings, setFilteredPlannings] = useState<PlanningWithDetails[]>([]);
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
      setFilteredPlannings(response); // Initialize filtered plannings
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

  // Handle search results from the Search component
  const handleSearchResults = useCallback((results: any[]) => {
    console.log('Search results received:', results);
    
    // Since we're doing local filtering, we can ignore the API results
    // The handleSearchChange function will handle the filtering
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search is cleared, show all plannings
    if (!value.trim()) {
      setFilteredPlannings(plannings);
      return;
    }
    
    // Perform local filtering
    const lowerSearchTerm = value.toLowerCase();
    const filtered = plannings.filter(planning => {
      // Search in formation fields
      const formationMatch = 
        planning.formation.modules?.toLowerCase().includes(lowerSearchTerm) ||
        planning.formation.filière?.toLowerCase().includes(lowerSearchTerm) ||
        planning.formation.niveau_cycle?.toLowerCase().includes(lowerSearchTerm) ||
        planning.formation.specialités?.toLowerCase().includes(lowerSearchTerm) ||
        planning.formation.domaine?.toLowerCase().includes(lowerSearchTerm) ||
        planning.formation.semestre?.toLowerCase().includes(lowerSearchTerm);
      
      // Search in planning fields
      const planningMatch = 
        planning.section?.toLowerCase().includes(lowerSearchTerm) ||
        planning.session?.toLowerCase().includes(lowerSearchTerm) ||
        planning.nombre_surveillant?.toString().includes(lowerSearchTerm);
      
      // Search in creneau fields
      const creneauMatch = 
        planning.creneau.date_creneau?.toLowerCase().includes(lowerSearchTerm) ||
        planning.creneau.heure_creneau?.toLowerCase().includes(lowerSearchTerm) ||
        planning.creneau.salle?.toLowerCase().includes(lowerSearchTerm);
      
      // Search in ID
      const idMatch = planning.id_planning?.toString().includes(lowerSearchTerm);
      
      return formationMatch || planningMatch || creneauMatch || idMatch;
    });
    
    setFilteredPlannings(filtered);
  }, [plannings]);

  // Remove the duplicate useEffect for local filtering since we handle it in handleSearchChange
  // The search is now handled entirely in the handleSearchChange function

  // Convert API data to the format expected by the table
  const convertPlanningsToTableData = (planningsToConvert: PlanningWithDetails[]) => {
    return planningsToConvert.map((planning) => ({
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

  // Get table data from filtered plannings
  const getTableData = () => {
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
          <p>Loading...</p>
        </div>
      )}

      {!loading && (
        <>
          <Tabel 
            data={getTableData()} 
            planningsRaw={filteredPlannings}
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
            
            {/* Search Component - using local filtering */}
            <Search 
              value={searchTerm}
              onChange={handleSearchChange}
              onSearchResults={handleSearchResults}
              placeholder="Search by module, level, room, date..."
              modelName="Planning"
              debounceDelay={300}
            />
          </div>
          
          {/* Show search info */}
          {searchTerm && (
            <div className={styles.searchInfo}>
              <p>
                {filteredPlannings.length === 0 
                  ? `No results found for "${searchTerm}"`
                  : `Showing ${filteredPlannings.length} result${filteredPlannings.length !== 1 ? 's' : ''} for "${searchTerm}"`
                }
              </p>
              {filteredPlannings.length === 0 && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredPlannings(plannings);
                  }}
                  className={styles.clearSearchButton}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
          
          {/* PDF Options Modal */}
          <PDFOptionsModal 
            isOpen={showPDFModal}
            onClose={() => setShowPDFModal(false)}
            data={getTableData()}
            planningsRaw={filteredPlannings}
          />
        </>
      )}
    </>
  );
}

export default Page1;