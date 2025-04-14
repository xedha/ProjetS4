"use client"

import React from "react"
import styles from "../common/table.module.css"

interface Teaching {
  id: number
  level?: string
  specialty?: string
  semester?: string
  section?: string
  group?: string
  type?: string
  moduleName?: string
  moduleAbbreviation?: string
  teacher?: string
  hours?: string
}

interface TeachingTableProps {
  teachings: Teaching[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const TeachingTable: React.FC<TeachingTableProps> = ({
  teachings,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Helper function to display a value or fallback to "N/A"
  const displayValue = (value?: string) => {
    return value && value.trim() !== "" ? value : "N/A"
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>Level</th>
              <th className={styles.tableHeaderCell}>Specialty</th>
              <th className={styles.tableHeaderCell}>Semester</th>
              <th className={styles.tableHeaderCell}>Section</th>
              <th className={styles.tableHeaderCell}>Group</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Module Name</th>
              <th className={styles.tableHeaderCell}>Module Abbreviation</th>
              <th className={styles.tableHeaderCell}>Teacher</th>
              <th className={styles.tableHeaderCell}>Hours</th>
              <th className={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachings.length === 0 ? (
              <tr className={styles.tableRow}>
                <td colSpan={11} style={{ textAlign: "center", padding: "2rem" }}>
                  No teaching assignments found
                </td>
              </tr>
            ) : (
              teachings.map((teaching) => (
                <tr key={teaching.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{displayValue(teaching.level)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.specialty)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.semester)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.section)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.group)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.type)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.moduleName)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.moduleAbbreviation)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.teacher)}</td>
                  <td className={styles.tableCell}>{displayValue(teaching.hours)}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.editButton}
                      onClick={() => onEdit(teaching.id)}
                      aria-label="Edit teaching"
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
                      onClick={() => onDelete(teaching.id)}
                      aria-label="Delete teaching"
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
              ))
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

export default TeachingTable
