"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton"
import Search from "./search bar/seach"
import { courseApi } from "../../services/api"
import type { Course } from "../../types/course"
// Add this import at the top of the file
import "./course-management.css"

function CoursePage() {
  // State variables for managing courses data and UI
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalCourses, setTotalCourses] = useState<number>(0)
  const [itemsPerPage] = useState<number>(10)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  // Fetch courses when page, items per page, or search term changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await courseApi.getCourses(currentPage, itemsPerPage, debouncedSearchTerm)
        setCourses(response.courses)
        setTotalCourses(response.total)
        setError(null)
      } catch (err) {
        console.error("Error fetching courses:", err)
        setError("Failed to fetch courses. Please try again later.")
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [currentPage, itemsPerPage, debouncedSearchTerm])

  // Handle course deletion
  const handleDeleteCourse = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseApi.deleteCourse(id)
        // Refresh the course list
        const response = await courseApi.getCourses(currentPage, itemsPerPage, debouncedSearchTerm)
        setCourses(response.courses)
        setTotalCourses(response.total)
      } catch (err) {
        console.error("Error deleting course:", err)
        alert("Failed to delete course. Please try again later.")
      }
    }
  }

  // Handle editing a course
  const handleEditCourse = (id: number) => {
    // In a real app, this would open a form or navigate to an edit page
    alert(`Edit course with ID: ${id}`)
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalCourses / itemsPerPage)

  return (
    <>
      <div className="teacher-management-layout">
        <Sidebar />
        <div className="teacher-management-main">
          <Header title="Course Management" />
          <main className="course-management-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading courses...</p>
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
              <Tabel
                data={courses}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </main>
        </div>
      </div>

      <Addbutton />
      <Search />
    </>
  )
}

export default CoursePage
