"use client"

import React from "react"
import styles from "./Tabel.module.css"
import Button from "./deletButton"
import type { Course } from "../../../types/course"

interface TabelProps {
  data: Course[]
  totalPages: number
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  currentPage: number
  onPageChange: (page: number) => void
}

const Tabel: React.FC<TabelProps> = ({
  data,
  totalPages,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
}) => {
  const format = (value: any) => (value ?? "N/A")

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
            {data.length === 0 ? (
              <tr className={styles.lines}>
                <td colSpan={12} style={{ textAlign: "center", padding: "2rem" }}>
                  No courses found
                </td>
              </tr>
            ) : (
              data.map((course) => (
                <tr key={course.id} className={styles.lines}>
                  <td className={styles.textnormal}>{format(course.level)}</td>
                  <td className={styles.textnormal}>{format(course.specialty)}</td>
                  <td className={styles.textnormal}>{format(course.semester)}</td>
                  <td className={styles.textnormal}>{format(course.moduleTitle)}</td>
                  <td className={styles.textnormal}>{format(course.moduleAbbreviation)}</td>
                  <td className={styles.textnormal}>{format(course.coefficient)}</td>
                  <td className={styles.textnormal}>{format(course.credits)}</td>
                  <td className={styles.textnormal}>{format(course.unit)}</td>
                  <td className={styles.textnormal}>{format(course.lectureHours)}</td>
                  <td className={styles.textnormal}>{format(course.tutorialHours)}</td>
                  <td className={styles.textnormal}>{format(course.practicalHours)}</td>
                  <td className={styles.colomn}>
                    <div className={styles.buttonss}>
                      <div onClick={() => onEdit(course.id)}>
                  
                      </div>
                      <div onClick={() => onDelete(course.id)}>
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
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, idx, arr) => {
              if (idx > 0 && arr[idx - 1] !== page - 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className={styles.paginationEllipsis}>…</span>
                    <button
                      className={`${styles.paginationNumber} ${
                        currentPage === page ? styles.active : ""
                      }`}
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
                  className={`${styles.paginationNumber} ${
                    currentPage === page ? styles.active : ""
                  }`}
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










