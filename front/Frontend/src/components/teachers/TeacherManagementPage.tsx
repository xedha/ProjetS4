// TeacherManagementPage.tsx

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

export const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalTeachers, setTotalTeachers] = useState<number>(0)
  const [itemsPerPage] = useState<number>(10)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  // Log when the component mounts
  useEffect(() => {
    console.log("TeacherManagementPage mounted")
  }, [])

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => {
      clearTimeout(timerId)
    }
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
          itemsPerPage: itemsPerPage,
          search: debouncedSearchTerm,
        })

        // Log the raw response to see what the server returned
        console.log("Raw teacher data from server:", response)

        // Adjust according to your response structure
        const teachersData = Array.isArray(response)
          ? response
          : response.data || []
          
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

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    console.log("Changing page to:", page)
    setCurrentPage(page)
  }

  // Handle teacher deletion
  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        console.log("Deleting teacher with id:", id)
        await api.deleteModel("Teachers", id)
        // Refresh teacher list after deletion
        const response = await api.getModelData("Teachers", {
          page: currentPage,
          itemsPerPage: itemsPerPage,
          search: debouncedSearchTerm,
        })
        console.log("Data after deletion:", response)

        const teachersData = Array.isArray(response)
          ? response
          : response.data || []
        setTeachers(teachersData)
        setTotalTeachers(teachersData.length)
      } catch (err: any) {
        console.error("Error deleting teacher:", err)
        alert("Failed to delete teacher. Please try again later. Error: " + err.message)
      }
    }
  }

  // Handle teacher editing: navigate to edit page
  const handleEditTeacher = (id: number) => {
    console.log("Editing teacher with id:", id)
    window.location.href = `/teachers/edit/${id}`
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalTeachers / itemsPerPage)

  // Handle adding a teacher (this would normally open a form/modal)
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
          <div className="teacher-management-actions">
            <div className="search-and-actions">
              <Search
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <AddButton text="Add Teacher" onClick={handleAddTeacher} />
            </div>
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
        </main>
      </div>
    </div>
  )
}
