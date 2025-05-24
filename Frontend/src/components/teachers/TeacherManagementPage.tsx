"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import { api } from "../../services/api"
import type { Teacher } from "../../types/teacher"
import Search from "../common/Search"
import AddButton from "./Addbutton"
import TeacherTable from "./TeacherTable"
import EditTeacherForm from "./EditTeacherForm"
import "./TeacherManagementPage.css"

/**
 * TeacherManagementPage Component
 *
 * This component is responsible for displaying and managing the list of teachers.
 * It includes functionality for:
 * - Fetching teachers from the API
 * - Searching teachers
 * - Pagination
 * - Deleting teachers
 * - Displaying teacher details in a table
 * - Uploading teachers via Excel file
 */
const transformTeacherData = (item: any): Teacher => {
  return {
    // Correctly map the backend fields to frontend interface
    Code_Enseignant: item.Code_Enseignant || "",
    prenom: item.prenom || "",
    nom: item.nom || "",
    nom_jeune_fille: item.nom_jeune_fille || "",
    genre: item.genre || "",
    departement: item.département || "",
    status: item.etat || item.status || "", // Map 'etat' from backend to 'status' in frontend
    grade: item.grade || "",
    email1: item.email1 || "",
    email2: item.email2 || "",
    tel1: item.tel1 || "",
    tel2: item.tel2 || "",
  }
}

export const TeacherManagementPage: React.FC = () => {
  // Data + UI state
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalTeachers, setTotalTeachers] = useState<number>(0)
  const [itemsPerPage] = useState<number>(10)

  // Edit form state
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  // Fetch function for re-use
  const fetchTeachers = useCallback(async (search: string = "") => {
    try {
      setLoading(true)
      console.log("Fetching teacher data with:", {
        page: currentPage,
        itemsPerPage,
        search: search,
      })

      // Use the API from the provided file
      const response = await api.getModelData("Enseignants", {
        page: currentPage,
        itemsPerPage,
        search: search,
      })

      if (!response) {
        throw new Error("Empty response received from API")
      }

      console.log("Raw teacher data:", response)

      // Handle different response formats
      const rawData = Array.isArray(response)
        ? response
        : response.data && Array.isArray(response.data)
          ? response.data
          : []

      const teachersData = rawData.map(transformTeacherData)

      setTeachers(teachersData)

      // Set total count from response or use array length if not available
      const total = response.total_count || teachersData.length
      setTotalTeachers(total)

      setError(null)
    } catch (err: any) {
      console.error("Error fetching teachers:", err)
      setError("Failed to fetch teachers. Please try again later. Error: " + (err.message || "Unknown error"))
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage])

  // Initial fetch
  useEffect(() => {
    fetchTeachers(searchTerm)
  }, [currentPage]) // Only re-fetch when page changes

  // Handle search results from Search component
  const handleSearchResults = useCallback((results: any[]) => {
    console.log("Search results received:", results)
    
    // Transform the search results
    const teachersData = results.map(transformTeacherData)
    setTeachers(teachersData)
    setTotalTeachers(results.length)
    setCurrentPage(1) // Reset to first page on new search
    setLoading(false)
    setError(null)
  }, [])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // If search is cleared, fetch all teachers
    if (!value.trim()) {
      fetchTeachers("")
    }
  }

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Delete handler
  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!teacher || !teacher.Code_Enseignant) {
      console.error("Cannot delete teacher: missing teacher code")
      return
    }

    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        console.log("Deleting teacher:", teacher)

        // Use the deleteModel function from the provided API
        await api.deleteModel("Enseignants", teacher)

        setTeachers((prev) => prev.filter((t) => t.Code_Enseignant !== teacher.Code_Enseignant))
        setTotalTeachers((prev) => prev - 1)
      } catch (err: any) {
        console.error("Error deleting teacher:", err)
        alert("Failed to delete teacher. Please try again later. Error: " + (err.message || "Unknown error"))
      }
    }
  }

  // EDIT handler: show popup form with the full teacher object
  const handleEditTeacher = (teacher: Teacher) => {
    if (teacher) {
      setSelectedTeacher(teacher)
      setShowEditForm(true)
    } else {
      console.error("Invalid teacher object provided to handleEditTeacher")
    }
  }

  const handleTeacherEdited = () => {
    setShowEditForm(false)
    setSelectedTeacher(null)
    fetchTeachers(searchTerm) // Refresh the teacher list
  }

  const handleTeacherAdded = () => {
    fetchTeachers(searchTerm) // Refresh the teacher list after adding
  }

  const handleUploadSuccess = () => {
    // Reset to first page and refresh the data after successful upload
    setCurrentPage(1)
    setSearchTerm("")
    fetchTeachers("")
  }

  const totalPages = Math.ceil(totalTeachers / itemsPerPage)

  return (
    <div className="teacher-management-layout">
      <Sidebar />
      <div className="teacher-management-main">
        <Header title="Teacher Management" />
        <main className="teacher-management-content">
          <div className="teacher-management-actions">
            <div className="search-and-actions">
              <Search 
                modelName="Enseignants"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={handleSearchChange}
                onSearchResults={handleSearchResults}
              />
            </div>
            <AddButton onUploadSuccess={handleUploadSuccess} />
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading teachers...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button
                className="retry-button"
                onClick={() => {
                  setCurrentPage(1)
                  setSearchTerm("")
                  fetchTeachers("")
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="teacher-table-container">
              <TeacherTable
                teachers={teachers}
                onEdit={handleEditTeacher}
                onDelete={handleDeleteTeacher}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {showEditForm && selectedTeacher && (
            <EditTeacherForm teacher={selectedTeacher} setShowPopup={setShowEditForm} onEdited={handleTeacherEdited} />
          )}
        </main>
      </div>
    </div>
  )
}

export default TeacherManagementPage