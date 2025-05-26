"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { api } from "../../services/api"
import type { Teaching } from "../../types/teaching"
import styles from "./EditTeachingForm.module.css"

interface EditFormProps {
  teaching: Teaching
  setShowPopup: (show: boolean) => void
  onEdited?: () => void
}

const EditTeachingForm: React.FC<EditFormProps> = ({ teaching, setShowPopup, onEdited }) => {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Use the received teaching id directly as the original id
  const originalId = teaching.id_charge

  // Data for dropdowns
  const [teachers, setTeachers] = useState<any[]>([])
  const [formations, setFormations] = useState<any[]>([])

  // Controlled inputs initialized from teaching prop - matching the exact field names
  const [formData, setFormData] = useState({
    // Don't include id_charge in formData since it's the primary key
    palier: teaching.palier || "",
    specialite: teaching.specialite || "",
    semestre: teaching.semestre || "",
    section: teaching.section || "",
    groupe: teaching.groupe || "",
    type: teaching.type || "",
    'intitulé_module': teaching['intitulé_module'] || "",
    abv_module: teaching.abv_module || "",
    Code_Enseignant_id_id: teaching.Code_Enseignant_id_id || teaching.Code_Enseignant_id || "",
    annee_universitaire: teaching.annee_universitaire || ""
  })
  
  // Store the ID separately for display purposes only
  const teachingId = teaching.id_charge

  // Load teachers and formations data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch teachers
        const teachersData = await api.getModelData('Enseignants', {
          page: 1,
          itemsPerPage: 1000,
          search: '',
        })
        
        if (teachersData) {
          let teachersArray = []
          if (Array.isArray(teachersData)) {
            teachersArray = teachersData
          } else if (teachersData.results && Array.isArray(teachersData.results)) {
            teachersArray = teachersData.results
          } else if (teachersData.data && Array.isArray(teachersData.data)) {
            teachersArray = teachersData.data
          }
          
          console.log('Teachers loaded:', teachersArray.length)
          setTeachers(teachersArray)
        }
        
        // Fetch formations
        const formationsData = await api.getModelData('Formations', {
          page: 1,
          itemsPerPage: 1000,
          search: '',
        })
        
        if (formationsData) {
          let formationsArray = []
          if (Array.isArray(formationsData)) {
            formationsArray = formationsData
          } else if (formationsData.results && Array.isArray(formationsData.results)) {
            formationsArray = formationsData.results
          } else if (formationsData.data && Array.isArray(formationsData.data)) {
            formationsArray = formationsData.data
          }
          
          console.log('Formations loaded:', formationsArray.length)
          setFormations(formationsArray)
        }
        
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load form options: ' + (err instanceof Error ? err.message : 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle formation selection change
  const handleFormationChange = (formationId: string) => {
    const formation = formations.find(f => f.id?.toString() === formationId)
    if (formation && formation.modules) {
      setFormData(prev => ({
        ...prev,
        'intitulé_module': formation.modules,
        abv_module: formation.abv_module || prev.abv_module
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!originalId) {
      setError("Cannot edit teaching assignment: missing id")
      return
    }

    setIsSubmitting(true)

    // Build updates payload - only include changed fields
    const updates: Record<string, any> = {}
    
    // Compare each field and only include changed ones (excluding primary key)
    Object.keys(formData).forEach(key => {
      if (formData[key as keyof typeof formData] !== teaching[key as keyof Teaching]) {
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
      console.log("Updating teaching assignment with ID:", originalId)
      console.log("Updates to be applied:", updates)

      const res = await api.editModel(
        "ChargesEnseignement",
        "id_charge",
        originalId,
        updates
      )

      console.log("Teaching assignment updated successfully:", res)
      
      if (onEdited) {
        onEdited()
      }
      setShowPopup(false)
    } catch (err: any) {
      console.error("Error updating teaching assignment:", err)
      setError(err.message || "Failed to update teaching assignment")
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
        <div className={styles.title}>{t("teaching.editTeaching") || "Edit Teaching Assignment"}</div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {loading && <div className={styles.loading}>Loading form data...</div>}

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.userDetails}>
              {/* Teaching ID (read-only - display only) */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.id") || "Teaching ID"}</span>
                <input
                  value={teachingId}
                  disabled={true}
                  readOnly
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              {/* Level */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.level") || "Level (Palier)"}</span>
                <select
                  name="palier"
                  className={styles.selectbox}
                  value={formData.palier}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select Level</option>
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                  <option value="M1">M1</option>
                  <option value="M2">M2</option>
                </select>
              </div>

              {/* Specialty */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.specialty") || "Specialty"}</span>
                <input
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter specialty"
                />
              </div>

              {/* Semester */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.semester") || "Semester"}</span>
                <select
                  name="semestre"
                  className={styles.selectbox}
                  value={formData.semestre}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select Semester</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                </select>
              </div>

              {/* Section */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.section") || "Section"}</span>
                <input
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter section"
                />
              </div>

              {/* Group */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.group") || "Group"}</span>
                <input
                  name="groupe"
                  value={formData.groupe}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter group"
                />
              </div>

              {/* Type */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.type") || "Type"}</span>
                <select
                  name="type"
                  className={styles.selectbox}
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select Type</option>
                  <option value="COURS">Course (COURS)</option>
                  <option value="TD">TD</option>
                  <option value="TP">TP</option>
                </select>
              </div>

              {/* Module Name */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.moduleName") || "Module Name"}</span>
                <input
                  name="intitulé_module"
                  value={formData['intitulé_module']}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter module name"
                />
              </div>

              {/* Module Abbreviation */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.moduleAbbreviation") || "Module Abbreviation"}</span>
                <input
                  name="abv_module"
                  value={formData.abv_module}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter abbreviation"
                />
              </div>

              {/* Teacher Selection */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.teacher") || "Teacher"}</span>
                <select
                  name="Code_Enseignant_id_id"
                  className={styles.selectbox}
                  value={formData.Code_Enseignant_id_id}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading || teachers.length === 0}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => {
                    const code = teacher.Code_Enseignant || teacher.code_enseignant || ''
                    const name = teacher.nom || 'Unknown'
                    const firstName = teacher.prenom || ''
                    return (
                      <option key={code} value={code}>
                        {code} - {name} {firstName}
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Academic Year */}
              <div className={styles.inputBox}>
                <span className={styles.details}>{t("teaching.academicYear") || "Academic Year"}</span>
                <input
                  name="annee_universitaire"
                  value={formData.annee_universitaire}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="e.g., 2023-2024"
                />
              </div>

              {/* Formation Selection (optional) */}
              {formations.length > 0 && (
                <div className={styles.inputBox} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.details}>{t("teaching.formation") || "Select from Formation (Optional)"}</span>
                  <select
                    className={styles.selectbox}
                    onChange={(e) => handleFormationChange(e.target.value)}
                    disabled={isSubmitting || loading}
                    defaultValue=""
                  >
                    <option value="">Choose a formation to auto-fill module</option>
                    {formations.map((formation) => {
                      const formationId = formation.id || ''
                      const filiere = formation.filière || formation.filiere || 'Unknown'
                      const niveau = formation.niveau_cycle || 'Unknown'
                      const modules = formation.modules || 'Unknown'
                      return (
                        <option key={formationId} value={formationId}>
                          {filiere} - {niveau} - {modules}
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}
            </div>

            <div className={styles.button}>
              <input
                type="submit"
                value={isSubmitting ? (t("teaching.saving") || "Saving...") : (t("teaching.saveChanges") || "Save Changes")}
                disabled={isSubmitting || !originalId || loading}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditTeachingForm