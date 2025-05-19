import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateTestPDF = () => {
  try {
    console.log('Starting PDF generation...');
    
    // Create PDF
    const doc = new jsPDF('l', 'mm', 'a4');
    console.log('PDF document created');

    // Add header with date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Add logo or institution name
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Faculté d'Informatique", 140, 15, { align: 'center' });

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80); // Dark blue color
    doc.text('Exam Schedule', 140, 25, { align: 'center' });

    // Add date
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141); // Gray color
    doc.text(`Generated on: ${formattedDate}`, 140, 32, { align: 'center' });

    // Add simple table
    console.log('Adding table...');
    (doc as any).autoTable({
      head: [['Level', 'Specialty', 'Semester', 'Section', 'Date', 'Time', 'Room', 'Module', 'Supervisor', 'Email']],
      body: [
        ['L1', 'Informatique', 'S1', 'A', '13/05/2022', '10:00', 'Room 101', 'Transfer Bank', 'Matt Dickerson', 'matt@example.com'],
        ['L2', 'Mathématiques', 'S2', 'B', '22/05/2022', '11:00', 'Room 202', 'Cash on Delivery', 'Wiktoria', 'wiktoria@example.com'],
        ['L3', 'Physique', 'S3', 'C', '15/06/2022', '08:30', 'Room 303', 'Credit Card Payment', 'Liam', 'liam@example.com'],
        ['M1', 'Chimie', 'S4', 'D', '30/07/2022', '09:00', 'Room 404', 'PayPal Payment', 'Emma', 'emma@example.com'],
        ['M2', 'Biologie', 'S5', 'E', '10/08/2022', '13:00', 'Room 505', 'Bank Transfer', 'Noah', 'noah@example.com']
      ],
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [44, 62, 80],
      },
      alternateRowStyles: {
        fillColor: [245, 246, 250],
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 15, halign: 'center' },
        6: { cellWidth: 20, halign: 'center' },
        7: { cellWidth: 25 },
        8: { cellWidth: 25 },
        9: { cellWidth: 35 }
      },
      margin: { top: 40 },
      didDrawPage: function(data: any) {
        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(127, 140, 141);
        doc.text(
          'This is an official document. Please keep it for your records.',
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });
    console.log('Table added');

    // Save PDF
    console.log('Saving PDF...');
    doc.save('exam-schedule.pdf');
    console.log('PDF saved successfully');
    
    return true;
  } catch (error) {
    console.error('Test PDF Error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
}; 