"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton"
import Search from "./search bar/seach"
import { api } from "../../services/api"
import type { Course } from "../../types/course"

// Import the EditCourseForm you just created
import EditCourseForm from "./addbutton/EditCourseForm"  

import "./course-management.css"

function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  const [totalCourses, setTotalCourses] = useState<number>(0)

  // New states to control edit popup
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  // Debounce search term and reset to first page on change
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getModelData("Formations", {
        page: currentPage,
        itemsPerPage,
        search: debouncedSearchTerm,
      })

      let data: Course[] = []
      let total: number = 0

      if (Array.isArray(response)) {
        data = response
        total = response.length
      } else if (response.courses && Array.isArray(response.courses)) {
        data = response.courses
        total = typeof response.total === 'number' ? response.total : response.courses.length
      } else if (response.results && Array.isArray(response.results)) {
        data = response.results
        total = typeof response.count === 'number' ? response.count : response.results.length
      } else {
        throw new Error('Unexpected response shape')
      }

      setCourses(data)
      setTotalCourses(total)
    } catch (err: any) {
      setError(`Failed to fetch courses: ${err.message}`)
      setCourses([])
      setTotalCourses(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearchTerm, itemsPerPage])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleDelete = async (course: Course) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return
    try {
      setLoading(true)
      await api.deleteModel("Formations", course)
      fetchCourses()
    } catch (err) {
      alert("Delete failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // When user clicks edit button in the table
  const handleEdit = (id: number) => {
    const courseToEdit = courses.find(c => c.id === id)
    if (courseToEdit) {
      setSelectedCourse(courseToEdit)
      setShowEditForm(true)
    } else {
      alert("Course not found")
    }
  }

  // When edit form finishes and signals update
  const handleCourseEdited = () => {
    setShowEditForm(false)
    setSelectedCourse(null)
    fetchCourses()
  }

  // Handle successful upload
  const handleUploadSuccess = () => {
    // Reset to first page and refresh the data after successful upload
    setCurrentPage(1)
    fetchCourses()
  }

  const totalPages = Math.ceil(totalCourses / itemsPerPage)

  return (
    <div className="teacher-management-layout">
      <Sidebar />
      <div className="teacher-management-main">
        <Header title="Course Management" />
        <main className="course-management-content">
          <div className="course-actions">
            <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Addbutton onUploadSuccess={handleUploadSuccess} />
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading courses...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={fetchCourses} className="retry-button">
                Retry
              </button>
            </div>
          ) : (
            <Tabel
              data={courses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {showEditForm && selectedCourse && (
            <EditCourseForm
              course={selectedCourse}
              setShowPopup={setShowEditForm}
              onEdited={handleCourseEdited}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default CoursePage