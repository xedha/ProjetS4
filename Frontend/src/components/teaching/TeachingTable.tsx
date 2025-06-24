"use client"

import React from "react"
import styles from "../common/table.module.css"
import { useTranslation } from "react-i18next"
import type { Teaching } from "../../types/teaching"

interface TeachingTableProps {
  teachings: Teaching[]
  onEdit: (id: number) => void
  onDelete: (teaching: Teaching) => void
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
  const { t } = useTranslation();

  // Add function to get appropriate class based on teaching type
  const getTypeClass = (type: string | null | undefined = "") => {
    switch ((type || "").toUpperCase()) {
      case "COURS":
        return styles.statusCOURS
      case "TD":
        return styles.statusTD
      case "TP":
        return styles.statusTP
      default:
        return styles.statusUnknown
    }
  }

  // Use translations for table headers
  const tableHeaders = [
    t('teaching.level'),
    t('teaching.specialty'),
    t('teaching.semester'),
    t('teaching.section'),
    t('teaching.group'),
    t('teaching.type'),
    t('teaching.moduleName'),
    t('teaching.moduleAbbreviation'),
    t('teaching.teacher'),
    t('teaching.academicYear'),
    t('teaching.action')
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
            {teachings.length === 0 ? (
              <tr className={styles.tableRow}>
                <td colSpan={11} style={{ textAlign: "center", padding: "2rem" }}>
                  {t('teaching.noTeachingsFound')}
                </td>
              </tr>
            ) : (
              teachings.map((teaching) => (
                <tr key={teaching.id_charge} className={styles.tableRow}>
                  <td className={styles.tableCell}>{teaching.palier || '-'}</td>
                  <td className={styles.tableCell}>{teaching.specialite || '-'}</td>
                  <td className={styles.tableCell}>{teaching.semestre || '-'}</td>
                  <td className={styles.tableCell}>{teaching.section || '-'}</td>
                  <td className={styles.tableCell}>{teaching.groupe || '-'}</td>
                  
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${getTypeClass(teaching.type)}`}>
                      {teaching.type || '-'}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {teaching['intitulé_module'] || '-'}
                  </td>
                  <td className={styles.tableCell}>{teaching.abv_module || '-'}</td>
                  <td className={styles.tableCell}>
                    {teaching.Code_Enseignant_id || teaching.Code_Enseignant_id || '-'}
                  </td>
                  <td className={styles.tableCell}>{teaching.annee_universitaire || '-'}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.editButton}
                      onClick={() => onEdit(teaching.id_charge)}
                      aria-label={t('teaching.editTeaching')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => onDelete(teaching)}
                      aria-label={t('teaching.deleteTeaching')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      <span className={styles.tooltip}>{t('teaching.deleteConfirmation')}</span>
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
            {t('teaching.previous')}
          </button>
          <button
            className={styles.paginationButton}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            {t('teaching.next')}
          </button>
        </div>
      )}
    </>
  )
}

export default TeachingTable