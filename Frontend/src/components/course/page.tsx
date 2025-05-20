"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "../common/Sidebar"
import { Header } from "../common/Header"
import Tabel from "./tabel1/Tabel"
import Addbutton from "./addbutton/Addbutton"
import Search from "./search bar/seach"
import { api } from "../../services/api"
import type { Course } from "../../types/course"

// Styles
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

  // Debounce search term and reset to first page on change
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchCourses = useCallback(async () => {
    console.log(
      `[DEBUG] Fetching courses (page: ${currentPage}, perPage: ${itemsPerPage}, search: '${debouncedSearchTerm}')`
    )
    try {
      setLoading(true)
      setError(null)
      const response = await api.getModelData("Formations", {
        page: currentPage,
        itemsPerPage,
        search: debouncedSearchTerm,
      })
      console.log("[DEBUG] API response:", response)

      let data: Course[] = []
      let total: number = 0

      if (Array.isArray(response)) {
        // If API returns array directly
        data = response
        total = response.length
      } else if (response.courses && Array.isArray(response.courses)) {
        data = response.courses
        total = typeof response.total === 'number' ? response.total : response.courses.length
      } else if (response.results && Array.isArray(response.results)) {
        // DRF-style pagination
        data = response.results
        total = typeof response.count === 'number' ? response.count : response.results.length
      } else {
        throw new Error('Unexpected response shape')
      }

      setCourses(data)
      setTotalCourses(total)
    } catch (err: any) {
      console.error("[ERROR] fetchCourses failed:", err)
      setError(`Failed to fetch courses: ${err.message}`)
      setCourses([])
      setTotalCourses(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearchTerm])

  // Fetch on mount and whenever dependencies change
  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return
    try {
      setLoading(true)
      await api.deleteModel("Formations", id)
      // After delete, refetch current page
      fetchCourses()
    } catch (err) {
      console.error("[ERROR] delete failed:", err)
      alert("Delete failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: number) => {
    alert(`Edit course with ID: ${id}`)
  }

  const totalPages = Math.ceil(totalCourses / itemsPerPage)

  return (
    <div className="teacher-management-layout">
      <Sidebar />
      <div className="teacher-management-main">
        <Header title="Course Management" />
        <main className="course-management-content">
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
        </main>
        <div className="course-actions">
          <Search  />
          <Addbutton />
        </div>
      </div>
    </div>
  )
}

export default CoursePage