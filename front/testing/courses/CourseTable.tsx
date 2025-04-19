"use client"

import React from "react"
import styles from "../common/table.module.css"

interface Course {
  id: number
  level: string
  specialty: string
  semester: string
  moduleTitle: string
  moduleAbbreviation: string
  coefficient: number
  credits: number
  unit: string
  lectureHours: number
  tutorialHours: number
  practicalHours: number
}

interface CourseTableProps {
  courses: Course[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>Level</th>
              <th className={styles.tableHeaderCell}>Specialty</th>
              <th className={styles.tableHeaderCell}>Semester</th>
              <th className={styles.tableHeaderCell}>Module Title</th>
              <th className={styles.tableHeaderCell}>Module Abbreviation</th>
              <th className={styles.tableHeaderCell}>Coefficient</th>
              <th className={styles.tableHeaderCell}>Credits</th>
              <th className={styles.tableHeaderCell}>Unit</th>
              <th className={styles.tableHeaderCell}>Lecture Hours (VHC)</th>
              <th className={styles.tableHeaderCell}>Tutorial Hours (VHTD)</th>
              <th className={styles.tableHeaderCell}>Practical Hours (VHTP)</th>
              <th className={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr className={styles.tableRow}>
                <td colSpan={12} style={{ textAlign: "center", padding: "2rem" }}>
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{course.level}</td>
                  <td className={styles.tableCell}>{course.specialty}</td>
                  <td className={styles.tableCell}>{course.semester}</td>
                  <td className={styles.tableCell}>{course.moduleTitle}</td>
                  <td className={styles.tableCell}>{course.moduleAbbreviation}</td>
                  <td className={styles.tableCell}>{course.coefficient}</td>
                  <td className={styles.tableCell}>{course.credits}</td>
                  <td className={styles.tableCell}>{course.unit}</td>
                  <td className={styles.tableCell}>{course.lectureHours}</td>
                  <td className={styles.tableCell}>{course.tutorialHours}</td>
                  <td className={styles.tableCell}>{course.practicalHours}</td>
                  <td className={styles.actionCell}>
                    <button className={styles.editButton} onClick={() => onEdit(course.id)} aria-label="Edit course">
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
                      onClick={() => onDelete(course.id)}
                      aria-label="Delete course"
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

export default CourseTable
