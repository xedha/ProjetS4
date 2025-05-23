"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { api } from "../../../services/api"
import type { Course } from "../../../types/course"
import styles from "./form.module.css"

interface EditCourseFormProps {
  course: Course
  setShowPopup: (show: boolean) => void
  onEdited?: () => void
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({ course, setShowPopup, onEdited }) => {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The course ID received from props - used as read-only
  const courseId = course.id

  // Controlled inputs initialized from course prop
  const [domain, setDomain] = useState(course.domaine || "")
  const [field, setField] = useState(course["filière"] || "")
  const [cycleLevel, setCycleLevel] = useState(course.niveau_cycle || "")
  const [specialties] = useState(course["specialités"] || "")
  const [numSections, setNumSections] = useState(course.nbr_sections?.toString() || "")
  const [numGroups, setNumGroups] = useState(course.nbr_groupes?.toString() || "")
  const [semester, setSemester] = useState(course.semestre || "")
  const [modules, setModules] = useState(course.modules || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!courseId) {
      setError("Cannot edit course: missing course ID")
      return
    }

    setIsSubmitting(true)

    const updates = {
      domaine: domain,
      "filière": field,
      niveau_cycle: cycleLevel,
      "specialités": specialties,
      nbr_sections: Number(numSections),
      nbr_groupes: Number(numGroups),
      semestre: semester,
      modules: modules,
    }

    try {
      await api.editModel("Formations", "id", courseId, updates)
      onEdited?.()
      setShowPopup(false)
    } catch (err: any) {
      setError(err.message || "Failed to update course")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={styles.blurOverlay} />
      <div className={styles.container}>
        <button className={styles.close} onClick={() => setShowPopup(false)}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div className={styles.title}>{t("courses.editCourse")}</div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Read-only Course ID field */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("courses.id")}</span>
                <input
                  type="text"
                  value={courseId || ""}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>

              {/* Other editable fields */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("courses.domain")}</span>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
              </div>

              {/* Filière field */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("courses.field")}</span>
                <input
                  type="text"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  required
                />
              </div>

              {/* Modules field */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("courses.modules")}</span>
                <input
                  type="text"
                  value={modules}
                  onChange={(e) => setModules(e.target.value)}
                />
              </div>

              {/* Cycle Level field */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("courses.cycleLevel")}</span>
                <input
                  type="text"
                  value={cycleLevel}
                  onChange={(e) => setCycleLevel(e.target.value)}
                  required
                />
              </div>

              {/* Number of Sections field */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("courses.numSections")}</span>
                <input
                  type="number"
                  value={numSections}
                  onChange={(e) => setNumSections(e.target.value)}
                  min={0}
                  required
                />
              </div>

              {/* Number of Groups field */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("courses.numGroups")}</span>
                <input
                  type="number"
                  value={numGroups}
                  onChange={(e) => setNumGroups(e.target.value)}
                  min={0}
                  required
                />
              </div>

              {/* Semester field */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("courses.semester")}</span>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                />
              </div>

              {/* ...remaining form fields... */}
            </div>

            <div className={styles.button}>
              <input
                type="submit"
                value={isSubmitting ? t("courses.saving") : t("courses.saveChanges")}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditCourseForm