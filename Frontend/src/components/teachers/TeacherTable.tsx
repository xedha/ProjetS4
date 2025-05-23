"use client"

import React from "react"
import styles from "../common/table.module.css"
import { useTranslation } from "react-i18next"
import type { Teacher } from "../../types/teacher" // Import the Teacher type

interface TeacherTableProps {
  teachers: Teacher[]
  onEdit: (teacher: Teacher) => void
  onDelete: (teacher: Teacher) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();

  const getStatusClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ADMIN":
        return styles.statusAdmin
      case "MED":
        return styles.statusMed
      case "MUTATED":
        return styles.statusMutated
      case "RETIRED":
        return styles.statusRetired
      case "UNKNOWN":
        return styles.statusUnknown
      case "MUTATION":
        return styles.statusMUTATION
      case "RETRAITE":
        return styles.statusRETRAITE
      case "ACTIF":
        return styles.statusACTIF
      case "INACTIF":
        return styles.statusINACTIF
      case "CONGE":
        return styles.statusCONGE
      case "DEMISSION":
        return styles.statusDEMISSION
      default:
        return styles.statusUnknown
    }
  }

  const tableHeaders = [
    t('teachers.code'),
    t('teachers.firstName'),
    t('teachers.lastName'),
    t('teachers.birthName'),
    t('teachers.gender'),
    t('teachers.status'),
    t('teachers.department'),
    t('teachers.grade'),
    t('teachers.email1'),
    t('teachers.email2'),
    t('teachers.tel1'),
    t('teachers.tel2'),
    t('teachers.action')
  ];

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              {tableHeaders.map((header, index) => (
                <th key={index} className={styles.tableHeaderCell}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr className={styles.tableRow}>
                <td colSpan={tableHeaders.length} style={{ textAlign: "center", padding: "2rem" }}>
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => {
                console.log('Teacher department:', teacher.departement);
                return (
                <tr key={teacher.Code_Enseignant} className={styles.tableRow}>
                  <td className={styles.tableCell}>{teacher.Code_Enseignant}</td>
                  <td className={styles.tableCell}>{teacher.prenom}</td>
                  <td className={styles.tableCell}>{teacher.nom}</td>
                  <td className={styles.tableCell}>{teacher.nom_jeune_fille}</td>
                  <td className={styles.tableCell}>{teacher.genre}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${getStatusClass(teacher.status)}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{teacher.departement}</td>
                  <td className={styles.tableCell}>{teacher.grade}</td>
                  <td className={styles.tableCell}>{teacher.email1}</td>
                  <td className={styles.tableCell}>{teacher.email2}</td>
                  <td className={styles.tableCell}>{teacher.tel1}</td>
                  <td className={styles.tableCell}>{teacher.tel2}</td>
                  <td className={styles.actionCell}>
                    <button 
                      className={styles.editButton} 
                      onClick={() => onEdit(teacher)} 
                      aria-label="Edit teacher"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => onDelete(teacher)}
                      aria-label="Delete teacher"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      <span className={styles.tooltip}>Are you sure?</span>
                    </button>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Show first page, last page, and pages around current page
              return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
            })
            .map((page, index, array) => {
              // Add ellipsis if there are gaps
              if (index > 0 && array[index - 1] !== page - 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className={styles.paginationEllipsis}>...</span>
                    <button
                      className={`${styles.paginationNumber} ${currentPage === page ? styles.active : ""}`}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                )
              }
              return (
                <button
                  key={page}
                  className={`${styles.paginationNumber} ${currentPage === page ? styles.active : ""}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )
            })}
          <button
            className={styles.paginationButton}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

export default TeacherTable