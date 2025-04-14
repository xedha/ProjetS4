"use client"

import React from "react"
import styles from "../common/table.module.css"

interface Teacher {
  id: number
  code: string
  firstName: string
  lastName: string
  birthName: string
  gender: string
  department: string
  grade: string
  email: string
  phone: string
  // Marking status as optional to guard against missing values.
  status?: string
}

interface TeacherTableProps {
  teachers: Teacher[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
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
  // Adjusted getStatusClass to handle undefined status.
  const getStatusClass = (status?: string) => {
    if (!status) {
      return ""
    }
    switch (status.toUpperCase()) {
      case "ADMIN":
        return styles.statusAdmin
      case "MED":
        return styles.statusMed
      case "MUTATED":
        return styles.statusMutated
      case "RETIRED":
        return styles.statusRetired
      default:
        return ""
    }
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>Teacher Code</th>
              <th className={styles.tableHeaderCell}>First & last name</th>
              <th className={styles.tableHeaderCell}>Birth Name</th>
              <th className={styles.tableHeaderCell}>Gender</th>
              <th className={styles.tableHeaderCell}>Department</th>
              <th className={styles.tableHeaderCell}>Grade</th>
              <th className={styles.tableHeaderCell}>Email</th>
              <th className={styles.tableHeaderCell}>Phone</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr className={styles.tableRow}>
                <td colSpan={10} style={{ textAlign: "center", padding: "2rem" }}>
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.teacherCode}>
                      <div className={styles.teacherAvatar}></div>
                      {teacher.code}
                    </div>
                  </td>
                  <td className={styles.tableCell}>{`${teacher.firstName} ${teacher.lastName}`}</td>
                  <td className={styles.tableCell}>{teacher.birthName}</td>
                  <td className={styles.tableCell}>{teacher.gender}</td>
                  <td className={styles.tableCell}>{teacher.department}</td>
                  <td className={styles.tableCell}>{teacher.grade}</td>
                  <td className={styles.tableCell}>{teacher.email}</td>
                  <td className={styles.tableCell}>{teacher.phone}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${getStatusClass(teacher.status)}`}>
                      {teacher.status || "Unknown"}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <button className={styles.editButton} onClick={() => onEdit(teacher.id)} aria-label="Edit teacher">
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
                      onClick={() => onDelete(teacher.id)}
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

export default TeacherTable
