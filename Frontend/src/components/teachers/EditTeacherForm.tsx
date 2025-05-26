"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { api } from "../../services/api"
import type { Teacher } from "../../types/teacher"
import styles from "./Form2.module.css"

interface EditFormProps {
  teacher: Teacher
  setShowPopup: (show: boolean) => void
  onEdited?: () => void
}

const EditTeacherForm: React.FC<EditFormProps> = ({ teacher, setShowPopup, onEdited }) => {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use the received teacher code directly as the original code
  const originalCode = teacher.Code_Enseignant

  // Controlled inputs initialized from teacher prop
  const [formData, setFormData] = useState({
    // Don't include Code_Enseignant in formData at all since it shouldn't be updated
    nom: teacher.nom || "",
    prenom: teacher.prenom || "",
    nom_jeune_fille: teacher.nom_jeune_fille || "",
    genre: teacher.genre || "",
    etat: teacher.status || "",  // Map status to etat (Python field name)
    département: teacher.departement || "",  // Python field name has accent
    grade: teacher.grade || "",
    email1: teacher.email1 || "",
    email2: teacher.email2 || "",
    tel1: teacher.tel1 || "",
    tel2: teacher.tel2 || ""
  })

  // Store the code separately for display purposes only
  const teacherCode = teacher.Code_Enseignant || ""

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!originalCode) {
      setError("Cannot edit teacher: missing teacher code")
      return
    }

    setIsSubmitting(true)

    // Build updates payload - only include changed fields
    const updates: Record<string, any> = {}
    
    // Compare each field and only include changed ones
    const fieldMapping: Record<string, keyof Teacher> = {
      'nom': 'nom',
      'prenom': 'prenom',
      'nom_jeune_fille': 'nom_jeune_fille',
      'genre': 'genre',
      'etat': 'status',  // Backend expects 'etat', frontend uses 'status'
      'département': 'departement',  // Backend field has accent
      'grade': 'grade',
      'email1': 'email1',
      'email2': 'email2',
      'tel1': 'tel1',
      'tel2': 'tel2'
    }

    Object.keys(formData).forEach(key => {
      const teacherKey = fieldMapping[key]
      if (teacherKey && formData[key as keyof typeof formData] !== teacher[teacherKey]) {
        updates[key] = formData[key as keyof typeof formData]
      }
    })

    // If no changes were made
    if (Object.keys(updates).length === 0) {
      setError("No changes were made")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Updating teacher with Code:", originalCode)
      console.log("Updates to be applied:", updates)

      const res = await api.editModel(
        "Enseignants",
        "Code_Enseignant",
        originalCode,
        updates
      )

      console.log("Teacher updated successfully:", res)
      if (onEdited) {
        onEdited()
      }
      setShowPopup(false)
    } catch (err: any) {
      console.error("Error updating teacher:", err)
      setError(err.message || "Failed to update teacher")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={styles.blurOverlay} onClick={() => !isSubmitting && setShowPopup(false)} />
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
        <div className={styles.title}>{t("teachers.editTeacher") || "Edit Teacher"}</div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Teacher Code - Read Only (Display Only) */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.teacherCode") || "Teacher Code"}</span>
                <input
                  value={teacherCode}
                  disabled={true}  // Always disabled - primary keys should not be edited
                  readOnly
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              {/* Last Name */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.lastName") || "Last Name"}</span>
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* First Name */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.firstName") || "First Name"}</span>
                <input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Birth Name */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.birthName") || "Birth Name"}</span>
                <input 
                  name="nom_jeune_fille"
                  value={formData.nom_jeune_fille} 
                  onChange={handleInputChange} 
                  disabled={isSubmitting} 
                />
              </div>

              {/* Gender */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.gender") || "Gender"}</span>
                <select
                  name="genre"
                  className={styles.selectbox}
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">{t("teachers.selectGender") || "Select Gender"}</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              {/* Status */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.status") || "Status"}</span>
                <select
                  name="etat"
                  className={styles.selectbox}
                  value={formData.etat}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">{t("teachers.selectStatus") || "Select Status"}</option>
                  <option value="ACTIF">{t("teachers.statusActive") || "Active"}</option>
                  <option value="RETRAITE">{t("teachers.statusRetired") || "Retired"}</option>
                  <option value="MUTATION">{t("teachers.statusMutated") || "Mutated"}</option>
                  <option value="CONGE">{t("teachers.statusMed") || "Medical Leave"}</option>
                  <option value="DEMISSION">{t("teachers.statusResigned") || "Resigned"}</option>
                  <option value="INACTIF">{t("teachers.statusInactive") || "Inactive"}</option>
                </select>
              </div>

              {/* Department */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.department") || "Department"}</span>
                <input
                  name="département"
                  value={formData['département']}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Grade */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.grade") || "Grade"}</span>
                <input 
                  name="grade"
                  value={formData.grade} 
                  onChange={handleInputChange} 
                  required 
                  disabled={isSubmitting} 
                />
              </div>

              {/* Email 1 */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.email") || "Email"}</span>
                <input
                  name="email1"
                  type="email"
                  value={formData.email1}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Email 2 */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.email2") || "Secondary Email"}</span>
                <input
                  name="email2"
                  type="email"
                  value={formData.email2}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone 1 */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.phone") || "Phone"}</span>
                <input 
                  name="tel1"
                  value={formData.tel1} 
                  onChange={handleInputChange} 
                  required 
                  disabled={isSubmitting} 
                />
              </div>

              {/* Phone 2 */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.phone2") || "Secondary Phone"}</span>
                <input 
                  name="tel2"
                  value={formData.tel2} 
                  onChange={handleInputChange} 
                  disabled={isSubmitting} 
                />
              </div>
            </div>

            <div className={styles.button}>
              <input
                type="submit"
                value={isSubmitting ? (t("teachers.saving") || "Saving...") : (t("teachers.saveChanges") || "Save Changes")}
                disabled={isSubmitting || !originalCode}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditTeacherForm