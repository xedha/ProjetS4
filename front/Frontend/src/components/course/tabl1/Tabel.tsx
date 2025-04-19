"use client"

import styles from "./Tabel.module.css"
import React, { useState } from "react"
import Editbutton from "./editbutton"
import Button from "./deletButton"
import type { Course } from "../../../types/course"

interface TabelProps {
  data: Course[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Tabel: React.FC<TabelProps> = ({ data, onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  // Map Course objects to the format expected by the table
  const tableData = data.map((course) => ({
    name: course.level,
    type: course.specialty,
    date: course.semester,
    title: course.moduleTitle,
    abbreviation: course.moduleAbbreviation,
    coef: course.coefficient.toString(),
    credits: course.credits.toString(),
    unit: course.unit,
    lecture: course.lectureHours.toString(),
    tutorial: course.tutorialHours.toString(),
    practical: course.practicalHours.toString(),
    id: course.id, // Keep the ID for actions
  }))

  return (
    <>
      <div className={styles.varr}>
        <table className={styles.tabel}>
          <thead>
            <tr className={styles.mainraw}>
              {[
                "Level",
                "Specialty",
                "Semester",
                "Module Title",
                "Module Abbreviation",
                "Coefficient",
                "Credits",
                "Unit",
                "Lecture Hours (VHC)",
                "Tutorial Hours (VHTD)",
                "Practical Hours (VHTP)",
                "Actions",
              ].map((head) => (
                <th key={head} className={styles.headtext}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr className={styles.lines}>
                <td colSpan={12} style={{ textAlign: "center", padding: "2rem" }}>
                  No courses found
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr key={index} className={styles.lines}>
                  <td className={styles.textnormal}>{row.name}</td>
                  <td className={styles.textnormal}>{row.type}</td>
                  <td className={styles.textnormal}>{row.date}</td>
                  <td className={styles.textnormal}>{row.title}</td>
                  <td className={styles.textnormal}>{row.abbreviation}</td>
                  <td className={styles.textnormal}>{row.coef}</td>
                  <td className={styles.textnormal}>{row.credits}</td>
                  <td className={styles.textnormal}>{row.unit}</td>
                  <td className={styles.textnormal}>{row.lecture}</td>
                  <td className={styles.textnormal}>{row.tutorial}</td>
                  <td className={styles.textnormal}>{row.practical}</td>
                  <td className={styles.colomn}>
                    <div className={styles.buttonss}>
                      <div onClick={() => onEdit(row.id)}>
                        <Editbutton isOpen={isModalOpen} onClose={closeModal} />
                      </div>
                      <div onClick={() => onDelete(row.id)}>
                        <Button />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add pagination */}
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

export default Tabel
