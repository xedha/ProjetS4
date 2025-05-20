declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableOptions {
    head?: string[][];
    body?: any[][];
    startY?: number;
    theme?: string;
    headStyles?: {
      fillColor?: number[];
      textColor?: number;
      fontStyle?: string;
      halign?: string;
    };
    alternateRowStyles?: {
      fillColor?: number[];
    };
    styles?: {
      cellPadding?: number;
      fontSize?: number;
      halign?: string;
    };
    margin?: {
      left?: number;
      right?: number;
    };
  }

  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }
} 