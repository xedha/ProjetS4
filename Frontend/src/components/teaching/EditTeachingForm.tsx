"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { api } from "../../services/api"
import type { Teaching } from "../../types/teaching"
import styles from "./Form2.module.css"

interface EditFormProps {
  teaching: Teaching
  setShowPopup: (show: boolean) => void
  onEdited?: () => void
}

const EditTeachingForm: React.FC<EditFormProps> = ({ teaching, setShowPopup, onEdited }) => {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use the received teaching id directly as the original id
  const originalId = teaching.id_charge

  // Controlled inputs initialized from teaching prop
  const [teachingId, setTeachingId] = useState<number>(teaching.id_charge)
  const [level, setLevel] = useState<string>(teaching.palier || "")
  const [specialty, setSpecialty] = useState<string>(teaching.specialite || "")
  const [semester, setSemester] = useState<string>(teaching.semestre || "")
  const [section, setSection] = useState<string>(teaching.section || "")
  const [group, setGroup] = useState<string>(teaching.groupe || "")
  const [type, setType] = useState<string>(teaching.type || "")
  const [moduleName, setModuleName] = useState<string>(teaching.intitule_module || "")
  const [moduleAbbreviation, setModuleAbbreviation] = useState<string>(teaching.abv_module || "")
  const [teacherCode, setTeacherCode] = useState<string>(teaching.teacher || "")
  const [academicYear, setAcademicYear] = useState<string>(teaching.annee_universitaire || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!originalId) {
      setError("Cannot edit teaching assignment: missing id")
      return
    }

    setIsSubmitting(true)

    // Build updates payload - map form fields to API fields
    const updates: Record<string, any> = {
      id_charge: teachingId,
      palier: level,
      specialite: specialty,
      semestre: semester,
      section: section,
      groupe: group,
      type: type,
      "intitulé_module": moduleName,
      abv_module: moduleAbbreviation,
      code_enseignant: teacherCode,
      annee_universitaire: academicYear
    }

    try {
      console.log("Updating teaching assignment with ID:", originalId)

      // Use originalId as the primary key value
      const res = await api.editModel(
        "ChargesEnseignement",
        "id_charge", // Make sure this field name matches what's expected by the API
        originalId,
        updates,
      )

      console.log("Teaching assignment updated successfully:", res)
      if (onEdited) {
        onEdited()
      } else {
        setShowPopup(false)
      }
    } catch (err: any) {
      console.error("Error updating teaching assignment:", err)
      setError(err.message || "Failed to update teaching assignment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={styles.blurOverlay} />
      <div className={styles.container}>
        <button
          className={styles.close}
          onClick={() => setShowPopup(false)}
          disabled={isSubmitting}
          aria-label="Close form"
        >
          <svg
            className={styles.svg}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81108 17.7748C4.42056 18.1653 4.42056 18.7984 4.81108 19.1889C5.20161 19.5794 5.83477 19.5794 6.2253 19.1889L12 13.4142L17.7748 19.1889C18.1653 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1653 19.1889 17.7748L13.4142 12L19.1889 6.2253C19.5794 5.83477 19.5794 5.20161 19.1889 4.81108C18.7984 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <div className={styles.title}>{t("teaching.editTeaching") || "Edit Teaching Assignment"}</div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Teaching ID (disabled as it's a primary key) */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.id") || "Teaching ID"}</span>
                <input
                  value={teachingId}
                  onChange={(e) => setTeachingId(Number(e.target.value))}
                  required
                  disabled={true}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.level") || "Level"}</span>
                <input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.specialty") || "Specialty"}</span>
                <input
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.semester") || "Semester"}</span>
                <input 
                  value={semester} 
                  onChange={(e) => setSemester(e.target.value)} 
                  required
                  disabled={isSubmitting} 
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.section") || "Section"}</span>
                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.group") || "Group"}</span>
                <input
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.type") || "Type"}</span>
                <select
                  className={styles.selectbox}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">{t("teaching.selectType") || "Select Type"}</option>
                  <option value="COURS">{t("teaching.typeCOURS") || "Course"}</option>
                  <option value="TD">{t("teaching.typeTD") || "TD"}</option>
                  <option value="TP">{t("teaching.typeTP") || "TP"}</option>
                </select>
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.moduleName") || "Module Name"}</span>
                <input
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.moduleAbbreviation") || "Module Abbreviation"}</span>
                <input 
                  value={moduleAbbreviation} 
                  onChange={(e) => setModuleAbbreviation(e.target.value)} 
                  required
                  disabled={isSubmitting} 
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.teacher") || "Teacher Code"}</span>
                <input
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.academicYear") || "Academic Year"}</span>
                <input 
                  value={academicYear} 
                  onChange={(e) => setAcademicYear(e.target.value)} 
                  required
                  disabled={isSubmitting} 
                />
              </div>
            </div>
            <div className={styles.button}>
              <input
                type="submit"
                value={isSubmitting ? t("teaching.saving") || "Saving..." : t("teaching.saveChanges") || "Save Changes"}
                disabled={isSubmitting || !originalId}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditTeachingForm