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
  const [teacherCode, setTeacherCode] = useState<string>(teacher.Code_Enseignant || "")
  const [lastName, setLastName] = useState<string>(teacher.nom || "")
  const [firstName, setFirstName] = useState<string>(teacher.prenom || "")
  const [birthName, setBirthName] = useState<string>(teacher.nom_jeune_fille || "")
  const [gender, setGender] = useState<string>(teacher.genre || "")
  const [status, setStatus] = useState<string>(teacher.status || "")
  const [department, setDepartment] = useState<string>(teacher.departement || "")
  const [grade, setGrade] = useState<string>(teacher.grade || "")
  const [email1, setEmail1] = useState<string>(teacher.email1 || "")
  const [email2, setEmail2] = useState<string>(teacher.email2 || "")
  const [phone1, setPhone1] = useState<string>(teacher.tel1 || "")
  const [phone2, setPhone2] = useState<string>(teacher.tel2 || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!originalCode) {
      setError("Cannot edit teacher: missing teacher code")
      return
    }

    setIsSubmitting(true)

    // Build updates payload - map form fields to API fields
    const updates: Record<string, any> = {
      Code_Enseignant: teacherCode,
      prenom: firstName,
      nom: lastName,
      nom_jeune_fille: birthName,
      genre: gender,
      departement: department,
      etat: status, // Note: using 'etat' instead of 'status' to match backend field
      grade: grade,
      email1: email1,
      email2: email2,
      tel1: phone1,
      tel2: phone2,
    }

    try {
      console.log("Updating teacher with ID:", originalCode)

      // Use originalCode as the primary key value
      const res = await api.editModel(
        "Enseignants",
        "Code_Enseignant", // Make sure this field name matches what's expected by the API
        originalCode,
        updates,
      )

      console.log("Teacher updated successfully:", res)
      if (onEdited) {
        onEdited()
      } else {
        setShowPopup(false)
      }
    } catch (err: any) {
      console.error("Error updating teacher:", err)
      setError(err.message || "Failed to update teacher")
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
        <div className={styles.title}>{t("teachers.editTeacher") || "Edit Teacher"}</div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Teacher Code */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.teacherCode") || "Teacher Code"}</span>
                <input
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.lastName") || "Last Name"}</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.firstName") || "First Name"}</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.birthName") || "Birth Name"}</span>
                <input value={birthName} onChange={(e) => setBirthName(e.target.value)} disabled={isSubmitting} />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.gender") || "Gender"}</span>
                <select
                  className={styles.selectbox}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">{t("teachers.selectGender") || "Select Gender"}</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.status") || "Status"}</span>
                <select
                  className={styles.selectbox}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">{t("teachers.selectStatus") || "Select Status"}</option>
                  <option value="ACTIF">{t("teachers.statusActive") || "Active"}</option>
                  <option value="RETIRED">{t("teachers.statusRetired") || "Retired"}</option>
                  <option value="MUTATED">{t("teachers.statusMutated") || "Mutated"}</option>
                  <option value="MED">{t("teachers.statusMed") || "Medical Leave"}</option>
                  <option value="ADMIN">{t("teachers.statusAdmin") || "Administrative"}</option>
                </select>
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.department") || "Department"}</span>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.grade") || "Grade"}</span>
                <input value={grade} onChange={(e) => setGrade(e.target.value)} required disabled={isSubmitting} />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.email") || "Email"}</span>
                <input
                  type="email"
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.email2") || "Secondary Email"}</span>
                <input
                  type="email"
                  value={email2}
                  onChange={(e) => setEmail2(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.phone") || "Phone"}</span>
                <input value={phone1} onChange={(e) => setPhone1(e.target.value)} required disabled={isSubmitting} />
              </div>
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teachers.phone2") || "Secondary Phone"}</span>
                <input value={phone2} onChange={(e) => setPhone2(e.target.value)} disabled={isSubmitting} />
              </div>
            </div>
            <div className={styles.button}>
              <input
                type="submit"
                value={isSubmitting ? t("teachers.saving") || "Saving..." : t("teachers.saveChanges") || "Save Changes"}
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
