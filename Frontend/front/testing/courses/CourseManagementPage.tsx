"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Header } from "../../front/Frontend/src/components/common/Header";
import { Sidebar } from "../../front/Frontend/src/components/common/Sidebar";
import { courseApi } from "../../front/Frontend/src/services/api";
import type { Course } from "../../front/Frontend/src/types/course";
import Search from "../../front/Frontend/src/components/common/Search";
import AddButton from "../../front/Frontend/src/components/common/AddButton";
import CourseTable from "./CourseTable";
import ModuleForm from "./ModuleForm";
import SpecialtyForm from "./SpecialtyForm";
import "./CourseManagementPage.css";

/**
 * CourseManagementPage Component
 *
 * This component is responsible for displaying and managing the list of courses.
 * It includes functionality for:
 * - Fetching courses from the API
 * - Searching courses
 * - Pagination
 * - Adding new modules and specialties
 * - Deleting courses
 * - Displaying course details in a table
 */
export const CourseManagementPage: React.FC = () => {
  // State variables for managing courses data and UI
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [itemsPerPage] = useState<number>(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [showModuleForm, setShowModuleForm] = useState<boolean>(false);
  const [showSpecialtyForm, setShowSpecialtyForm] = useState<boolean>(false);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch courses when page, items per page, or search term changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseApi.getCourses(
          currentPage,
          itemsPerPage,
          debouncedSearchTerm
        );
        setCourses(response.courses);
        setTotalCourses(response.total);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, itemsPerPage, debouncedSearchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle course deletion
  const handleDeleteCourse = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseApi.deleteCourse(id);
        // Refresh the course list
        const response = await courseApi.getCourses(
          currentPage,
          itemsPerPage,
          debouncedSearchTerm
        );
        setCourses(response.courses);
        setTotalCourses(response.total);
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course. Please try again later.");
      }
    }
  };

  // Handle editing a course
  const handleEditCourse = (id: number) => {
    // In a real app, this would open a form or navigate to an edit page
    setShowModuleForm(true);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCourses / itemsPerPage);

  // Handle adding a new module
  const handleAddModule = () => {
    setShowModuleForm(true);
  };

  // Handle adding a new specialty
  const handleAddSpecialty = () => {
    setShowSpecialtyForm(true);
  };

  return (
    <div className="course-management-layout">
      <Sidebar />
      <div className="course-management-main">
        <Header title="Course Management" />
        <main className="course-management-content">
          <div className="course-management-actions">
            <div className="search-and-actions">
              <Search
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="buttons-container">
                <AddButton text="Add Module" onClick={handleAddModule} />
                <AddButton text="Add Specialty" onClick={handleAddSpecialty} />
              </div>
            </div>
          </div>

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
                  setCurrentPage(1);
                  setDebouncedSearchTerm(searchTerm);
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <CourseTable
              courses={courses}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>

      {/* Module Form Modal */}
      {showModuleForm && <ModuleForm setShowPopup={setShowModuleForm} />}

      {/* Specialty Form Modal */}
      {showSpecialtyForm && (
        <SpecialtyForm setShowPopup={setShowSpecialtyForm} />
      )}
    </div>
  );
};

export default CourseManagementPage;
