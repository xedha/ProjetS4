import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface TableData {
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
}

export const generateTablePDF = (data: TableData[], fileName: string = 'exam-schedule.pdf') => {
  try {
    console.log('Starting PDF generation...');
    
    // Create PDF in landscape mode for better table fit
    const doc = new jsPDF('l', 'mm', 'a4');
    console.log('PDF document created');

    // Add header with date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Add institution name
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Faculté d'Informatique", 148, 15, { align: 'center' });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80); // Dark blue color
    doc.text('Exam Schedule', 148, 25, { align: 'center' });

    // Add date
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141); // Gray color
    doc.text(`Generated on: ${formattedDate}`, 148, 32, { align: 'center' });

    // Prepare table data
    const tableHeaders = [
      'Level',
      'Specialty',
      'Semester',
      'Section',
      'Date',
      'Time',
      'Exam Room',
      'Module Name',
      'Module Abbr.',
      'Nbr SE'
    ];

    // Convert data to table rows (excluding email, order, and supervisor fields)
    const tableRows = data.map(row => [
      row.level,
      row.specialty,
      row.semester,
      row.section,
      row.date,
      row.time,
      row.examRoom,
      row.moduleName,
      row.moduleAbbreviation,
      row.nbrSE
    ]);

    // Add table
    console.log('Adding table...');
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [44, 62, 80],
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [245, 246, 250],
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' }, // Level
        1: { cellWidth: 40 }, // Specialty
        2: { cellWidth: 20, halign: 'center' }, // Semester
        3: { cellWidth: 20, halign: 'center' }, // Section
        4: { cellWidth: 25, halign: 'center' }, // Date
        5: { cellWidth: 20, halign: 'center' }, // Time
        6: { cellWidth: 25, halign: 'center' }, // Exam Room
        7: { cellWidth: 50 }, // Module Name
        8: { cellWidth: 30, halign: 'center' }, // Module Abbreviation
        9: { cellWidth: 20, halign: 'center' } // Nbr SE
      },
      margin: { top: 40, left: 10, right: 10 },
      didDrawPage: function(data: any) {
        // Add footer with page number
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(127, 140, 141);
        
        // Footer text
        doc.text(
          'This is an official document. Please keep it for your records.',
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
        
        // Page number
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - data.settings.margin.right - 30,
          doc.internal.pageSize.height - 10
        );
      }
    });
    console.log('Table added');

    // Save PDF
    console.log('Saving PDF...');
    doc.save(fileName);
    console.log('PDF saved successfully');
    
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
};

// The generateTablePDF function is now ready to be used in your Tabel component
// Import this function in your Tabel.tsx and use it directly with a button

// New function to generate PDF filtered by level
export const generateTablePDFByLevel = (
  data: TableData[], 
  level: string, 
  fileName?: string
) => {
  // Filter data by level
  const filteredData = data.filter(row => 
    row.level.toLowerCase() === level.toLowerCase()
  );
  
  if (filteredData.length === 0) {
    alert(`No exams found for level: ${level}`);
    return false;
  }
  
  // Generate filename with level if not provided
  const pdfFileName = fileName || `exam-schedule-${level.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  
  try {
    console.log(`Generating PDF for level: ${level}`);
    
    // Create PDF in landscape mode for better table fit
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Add header with date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Add institution name
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Faculté d'Informatique", 148, 15, { align: 'center' });

    // Add title with level
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80); // Dark blue color
    doc.text(`Exam Schedule - ${level}`, 148, 25, { align: 'center' });

    // Add date
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141); // Gray color
    doc.text(`Generated on: ${formattedDate}`, 148, 32, { align: 'center' });

    // Prepare table data
    const tableHeaders = [
      'Specialty',
      'Semester',
      'Section',
      'Date',
      'Time',
      'Exam Room',
      'Module Name',
      'Module Abbr.',
      'Nbr SE'
    ];

    // Convert data to table rows (excluding level since we're filtering by it)
    const tableRows = filteredData.map(row => [
      row.specialty,
      row.semester,
      row.section,
      row.date,
      row.time,
      row.examRoom,
      row.moduleName,
      row.moduleAbbreviation,
      row.nbrSE
    ]);

    // Add table
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [44, 62, 80],
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [245, 246, 250],
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Specialty
        1: { cellWidth: 25, halign: 'center' }, // Semester
        2: { cellWidth: 25, halign: 'center' }, // Section
        3: { cellWidth: 30, halign: 'center' }, // Date
        4: { cellWidth: 25, halign: 'center' }, // Time
        5: { cellWidth: 30, halign: 'center' }, // Exam Room
        6: { cellWidth: 50 }, // Module Name
        7: { cellWidth: 30, halign: 'center' }, // Module Abbreviation
        8: { cellWidth: 20, halign: 'center' } // Nbr SE
      },
      margin: { top: 40, left: 10, right: 10 },
      didDrawPage: function(data: any) {
        // Add footer with page number
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(127, 140, 141);
        
        // Footer text
        doc.text(
          `${level} Exam Schedule - Official Document`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
        
        // Page number
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - data.settings.margin.right - 30,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // Save PDF
    doc.save(pdfFileName);
    console.log(`PDF for ${level} saved successfully`);
    
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return false;
  }
};

// Function to get all unique levels from data
export const getUniqueLevels = (data: TableData[]): string[] => {
  const levels = new Set(data.map(row => row.level));
  return Array.from(levels).sort();
};

// Updated function to generate Monitoring Planning PDF using API
export const generateMonitoringPlanningPDF = async (
  data: TableData[], 
  planningsRaw: any[],
  fileName: string = 'monitoring-planning.pdf'
) => {
  try {
    console.log('Generating Monitoring Planning PDF...');
    
    // Import the API method
    const { getMonitoringPlanning } = await import('../../../services/ExamApi');
    
    // Fetch monitoring data from API
    console.log('Fetching monitoring planning data from API...');
    const monitoringData = await getMonitoringPlanning();
    console.log(`Received ${monitoringData.length} monitoring assignments`);
    
    // Create PDF in portrait mode
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Add header with date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Add institution name
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.text("Faculté d'Informatique", 105, 15, { align: 'center' });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Monitoring Planning', 105, 25, { align: 'center' });

    // Add date
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141);
    doc.text(`Generated on: ${formattedDate}`, 105, 32, { align: 'center' });

    // Convert API data to table rows
    const monitoringRows = monitoringData.map(item => [
      item.teacher_name,
      item.module,
      item.room,
      item.date,
      item.time,
      item.level,
      item.specialty,
      item.role
    ]);

    // If no data, add a message row
    if (monitoringRows.length === 0) {
      monitoringRows.push([
        'No monitoring data available',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-'
      ]);
    }

    // Table headers
    const tableHeaders = [
      'Teacher',
      'Module',
      'Room',
      'Date',
      'Time',
      'Level',
      'Specialty',
      'Role'
    ];

    // Add table
    (doc as any).autoTable({
      head: [tableHeaders],
      body: monitoringRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [44, 62, 80],
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [245, 246, 250],
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Teacher
        1: { cellWidth: 35 }, // Module
        2: { cellWidth: 20, halign: 'center' }, // Room
        3: { cellWidth: 22, halign: 'center' }, // Date
        4: { cellWidth: 18, halign: 'center' }, // Time
        5: { cellWidth: 18, halign: 'center' }, // Level
        6: { cellWidth: 28 }, // Specialty
        7: { cellWidth: 20, halign: 'center' } // Role
      },
      margin: { top: 40, left: 10, right: 10 },
      didDrawPage: function(data: any) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(127, 140, 141);
        
        doc.text(
          'Monitoring Planning - Official Document',
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
        
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.width - data.settings.margin.right - 20,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // Save PDF
    doc.save(fileName);
    console.log('Monitoring Planning PDF saved successfully');
    
    return true;
  } catch (error) {
    console.error('Monitoring Planning PDF Error:', error);
    
    // If API fails, show a simple fallback
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      doc.setFontSize(16);
      doc.setTextColor(200, 0, 0);
      doc.text('Error generating monitoring planning', 105, 50, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Please check your connection and try again', 105, 60, { align: 'center' });
      
      doc.save(fileName);
    } catch (fallbackError) {
      console.error('Fallback PDF generation failed:', fallbackError);
    }
    
    return false;
  }
};

export const generatePVPDF = async (
  planningId: number,
  surveillants: any[],
  planningDetails: any,
  selectedTeacher?: any
): Promise<boolean> => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Get teacher name
    const teacherName = selectedTeacher 
      ? `${selectedTeacher.enseignant?.prenom || ''} ${selectedTeacher.enseignant?.nom || ''}`
      : 'Responsable du module';

    // Prepare data
    const pvData = {
      date_document: new Date().toLocaleDateString('fr-FR'),
      nom_enseignant: teacherName,
      semestre: planningDetails?.formation?.semestre || 'Premier Semestre',
      session: planningDetails?.session || 'Session Normale',
      annee_universitaire: getCurrentAcademicYear(),
      module: planningDetails?.formation?.modules || '',
      module_nom: planningDetails?.formation?.modules?.split('-')[0]?.trim() || 'MOD',
      niveau: planningDetails?.formation?.niveau_cycle || 'L1',
      section: planningDetails?.section || 'A',
      date_exam: formatDate(planningDetails?.creneau?.date_creneau),
      time_exam: planningDetails?.creneau?.heure_debut || '09:00',
      locaux: planningDetails?.creneau?.salle || 'À déterminer'
    };

    // Header
    doc.setFontSize(10);
    doc.text('République Algérienne Démocratique et Populaire', 14, 20);
    doc.text('Ministère de l\'Enseignement Supérieur', 14, 25);
    doc.text('et de la Recherche Scientifique', 14, 30);
    doc.text('Université des Sciences et de la', 14, 35);
    doc.text('Technologie Houari Boumediene USTHB', 14, 40);
    
    // Faculty title
    doc.setFontSize(14);
    doc.setFont("Arial", 'bold');
    doc.text('FACULTÉ D\'INFORMATIQUE', 105, 50, { align: 'center' });
    
    // Date
    doc.setFont("Arial", 'normal');
    doc.setFontSize(10);
    doc.text(`USTHB Le, ${pvData.date_document}`, 140, 60);
    
    // Title
    doc.setFontSize(16);
    doc.setFont("Arial", 'bold');
    doc.text('P.V d\'examen', 105, 75, { align: 'center' });
    
    // Session info
    doc.setFontSize(12);
    doc.setFont("Arial", 'normal');
    doc.text(`${pvData.semestre} ${pvData.session} – Année ${pvData.annee_universitaire}`, 105, 85, { align: 'center' });
    
    // Box with teacher info
    doc.rect(50, 95, 110, 25);
    doc.setFontSize(11);
    doc.text(pvData.nom_enseignant, 105, 103, { align: 'center' });
    doc.text(pvData.module, 105, 110, { align: 'center' });
    doc.text(`${pvData.niveau} ${pvData.section}`, 105, 117, { align: 'center' });
    
    // Exam details header - Fixed layout
    const startY = 130;
    doc.setFillColor(227, 242, 253);
    doc.rect(14, startY, 182, 20, 'F');
    doc.rect(14, startY, 182, 20);
    doc.setFontSize(10);
    
    // First line of exam details
    doc.text(`Date: ${pvData.date_exam}`, 20, startY + 8);
    doc.text(`Heure: ${pvData.time_exam}`, 80, startY + 8);
    doc.text(`Local: ${pvData.locaux}`, 140, startY + 8);
    
    // Second line of exam details
    doc.text(`Module: ${pvData.module_nom}`, 20, startY + 15);
    doc.text(`Niveau: ${pvData.niveau}`, 80, startY + 15);
    doc.text(`Section: ${pvData.section}`, 140, startY + 15);
    
    // Prepare table data
    const tableData = [];
    surveillants.forEach(s => {
      if (!s.enseignant) return;
      const role = s.est_charge_cours === 1 ? ' (Responsable)' : '';
      const name = `${s.enseignant.prenom} ${s.enseignant.nom}${role}`;
      tableData.push([name, '', '']);
    });
    
    // Add empty rows to reach minimum 15
    const remainingRows = Math.max(0, 15 - surveillants.length);
    for (let i = 0; i < remainingRows; i++) {
      tableData.push(['', '', '']);
    }
    
    // Add table
    (doc as any).autoTable({
      head: [['Surveillants', 'Emargement', 'Nombre d\'étudiants présents']],
      body: tableData,
      startY: startY + 25,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 45 },
        2: { cellWidth: 47 }
      }
    });
    
    // Total
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFont("Arial", 'bold');
    doc.text('Total : _________________', 140, finalY + 10);
    
    // Observations
    doc.setFont("Arial", 'bold');
    doc.setFontSize(11);
    doc.text('Observations et Remarques :', 14, finalY + 25);
    doc.setFont("Arial", 'normal');
    doc.setFontSize(10);
    doc.text('…………………………………………………………………………………………………………………………………………', 14, finalY + 35);
    doc.text('…………………………………………………………………………………………………………………………………………', 14, finalY + 42);
    doc.text('…………………………………………………………………………………………………………………………………………', 14, finalY + 49);
    
    // Signature
    doc.setFont("Arial", 'italic');
    doc.text('Signature du Responsable du Module', 120, finalY + 70);
    doc.text('_______________________________', 120, finalY + 85);
    
    // Notes
    doc.setFontSize(9);
    doc.setFont("Arial", 'normal');
    doc.text('• Les consignes particulières, s\'il y en a, sont à transmettre aux surveillants par mail avant l\'examen.', 14, finalY + 100);
    doc.text('• Ce PV est à remplir par le responsable du module et à remettre au département juste après l\'examen.', 14, finalY + 106);
    doc.text('• Il faut signaler les cas de remplacement.', 14, finalY + 112);
    
    // Save PDF
    const filename = `PV_${pvData.module_nom}_${pvData.section}_${pvData.date_exam.replace(/\//g, '_')}.pdf`;
    doc.save(filename);

    return true;
  } catch (error) {
    console.error('Error generating PV PDF:', error);
    return false;
  }
};

// Helper function for date formatting
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Helper function for academic year
const getCurrentAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  if (month >= 8) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
};