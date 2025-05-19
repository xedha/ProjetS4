import axios from "axios"
import type { TeacherResponse } from "../types/teacher"
import type { TeachingResponse } from "../types/teaching"
import type { Teacher } from "../types/teacher"
import type { Teaching } from "../types/teaching"
import type { Course } from "../types/course"
import type { CourseResponse } from "../types/course"

// Create an axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Teacher API endpoints
export const teacherApi = {
  // Get all teachers with pagination and search
  getTeachers: async (page = 1, limit = 10, search = ""): Promise<TeacherResponse> => {
    const response = await api.get("/teachers", {
      params: { page, limit, search },
    })
    return response.data
  },

  // Get a single teacher by ID
  getTeacher: async (id: number) => {
    const response = await api.get(`/teachers/${id}`)
    return response.data
  },

  // Create a new teacher
  createTeacher: async (teacherData: Omit<Teacher, "id">) => {
    const response = await api.post("/teachers", teacherData)
    return response.data
  },

  // Update an existing teacher
  updateTeacher: async (id: number, teacherData: Partial<Teacher>) => {
    const response = await api.put(`/teachers/${id}`, teacherData)
    return response.data
  },

  // Delete a teacher
  deleteTeacher: async (id: number) => {
    const response = await api.delete(`/teachers/${id}`)
    return response.data
  },
}

// Teaching API endpoints
export const teachingApi = {
  // Get all teaching assignments with pagination and search
  getTeachings: async (page = 1, limit = 10, search = ""): Promise<TeachingResponse> => {
    const response = await api.get("/teachings", {
      params: { page, limit, search },
    })
    return response.data
  },

  // Get a single teaching assignment by ID
  getTeaching: async (id: number) => {
    const response = await api.get(`/teachings/${id}`)
    return response.data
  },

  // Create a new teaching assignment
  createTeaching: async (teachingData: Omit<Teaching, "id">) => {
    const response = await api.post("/teachings", teachingData)
    return response.data
  },

  // Update an existing teaching assignment
  updateTeaching: async (id: number, teachingData: Partial<Teaching>) => {
    const response = await api.put(`/teachings/${id}`, teachingData)
    return response.data
  },

  // Delete a teaching assignment
  deleteTeaching: async (id: number) => {
    const response = await api.delete(`/teachings/${id}`)
    return response.data
  },
}

// Course API endpoints
export const courseApi = {
  // Get all courses with pagination and search
  getCourses: async (page = 1, limit = 10, search = ""): Promise<CourseResponse> => {
    const response = await api.get("/courses", {
      params: { page, limit, search },
    })
    return response.data
  },

  // Get a single course by ID
  getCourse: async (id: number) => {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  // Create a new course
  createCourse: async (courseData: Omit<Course, "id">) => {
    const response = await api.post("/courses", courseData)
    return response.data
  },

  // Update an existing course
  updateCourse: async (id: number, courseData: Partial<Course>) => {
    const response = await api.put(`/courses/${id}`, courseData)
    return response.data
  },

  // Delete a course
  deleteCourse: async (id: number) => {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  },
}

export default api
