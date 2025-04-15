"use client"

import React, { useState, useEffect } from "react"
import { Header } from "../common/Header"
import { Sidebar } from "../common/Sidebar"
import { api } from "../../services/api"
import type { Teacher } from "../../types/teacher"
import Search from "../common/Search"
import AddButton from "../common/AddButton"
import TeacherTable from "./TeacherTable"
import "./TeacherManagementPage.css"

// Map API teacher data to your Teacher interface
const transformTeacherData = (item: any): Teacher => {
  return {
    id: item.id,
    code_enseignant: item.code_enseignant || item.code,
    firstName: item.prenom,
    lastName: item.nom,
    birthName: item.nom_jeune_fille || "",
    gender: item.genre,
    department: item.departement || item.faculte || "",
    grade: item.grade || "",
    email: item.email1 || "",
    phone: item.tel1 || "",
    status: item.etat || "Unknown",
  };
};
export const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalTeachers, setTotalTeachers] = useState<number>(0)
  const [itemsPerPage] = useState<number>(10)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  // Log component mount
  useEffect(() => {
    console.log("TeacherManagementPage mounted")
  }, [])

  // Debounce the search term to reduce unnecessary API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timerId)
  }, [searchTerm])

  // Fetch teachers whenever page, itemsPerPage, or debouncedSearchTerm changes
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true)
        console.log("Fetching teacher data with parameters:", {
          page: currentPage,
          itemsPerPage,
          search: debouncedSearchTerm,
        })

        const response = await api.getModelData("Teachers", {
          page: currentPage,
          itemsPerPage,
          search: debouncedSearchTerm,
        })

        console.log("Raw teacher data from server:", response)

        // Transform the data from API response to the expected Teacher structure.
        const rawData = Array.isArray(response) ? response : response.data || []
        const teachersData = rawData.map(transformTeacherData)
        
        setTeachers(teachersData)
        setTotalTeachers(teachersData.length)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching teachers:", err)
        setError(
          "Failed to fetch teachers. Please try again later. Error: " +
            err.message
        )
        setTeachers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  // Pagination change handler
  const handlePageChange = (page: number) => {
    console.log("Changing page to:", page)
    setCurrentPage(page)
  }

  // Delete teacher handler that now receives the entire teacher object.
const handleDeleteTeacher = async (teacher: Teacher) => {
  // Make sure the teacher object is defined.
  if (!teacher) {
    console.error("handleDeleteTeacher was called without a valid teacher object");
    return;
  }

  if (window.confirm("Are you sure you want to delete this teacher?")) {
    try {
      console.log("Deleting teacher:", teacher);
      // Pass the whole teacher object to deleteModel.
      // The API method should internally extract the primary key.
      await api.deleteModel("Teachers", teacher);

      // Refresh teacher list after deletion
      const response = await api.getModelData("Teachers", {
        page: currentPage,
        itemsPerPage,
        search: debouncedSearchTerm,
      });

      console.log("Data after deletion:", response);
      const rawData = Array.isArray(response) ? response : response.data || [];
      const teachersData = rawData.map(transformTeacherData);
      setTeachers(teachersData);
      setTotalTeachers(teachersData.length);
    } catch (err: any) {
      console.error("Error deleting teacher:", err);
      alert("Failed to delete teacher. Please try again later. Error: " + err.message);
    }
  }
};

  // Edit teacher handler; redirect to edit page
  const handleEditTeacher = (id: number) => {
    console.log("Editing teacher with id:", id)
    window.location.href = `/teachers/edit/${id}`
  }

  // Calculate the total number of pages for pagination
  const totalPages = Math.ceil(totalTeachers / itemsPerPage)

  // Handle add teacher action; typically open a modal or navigate to a form page
  const handleAddTeacher = () => {
    console.log("Add teacher action triggered")
    alert("Add teacher functionality would open a form here")
  }

  return (
    <div className="teacher-management-layout">
      <Sidebar />
      <div className="teacher-management-main">
        <Header title="Teacher Management" />
        <main className="teacher-management-content">
          <div className="teacher-management-wrapper">
            {/* Actions section: search field and add button */}
            <div className="search-and-actions">
              <Search
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <AddButton text="Add Teacher" onClick={handleAddTeacher} />
            </div>

            {/* Conditional rendering based on data fetching states */}
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
                    setDebouncedSearchTerm(searchTerm)
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <TeacherTable
                teachers={teachers}
                onEdit={handleEditTeacher}
                onDelete={handleDeleteTeacher}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
