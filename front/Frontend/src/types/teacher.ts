// Define the Teacher interface based on your SQL database schema
export interface Teacher {
  id: number;             // or string if your ID is a string
  code_enseignant: string;           // if "code_enseignant" is mapped into "code"
  firstName: string;
  lastName: string;
  birthName?: string;
  gender?: string;
  department?: string;
  grade?: string;
  email?: string;
  phone?: string;
  status?: string;        // or union type, e.g. "Active" | "Inactive" | "Unknown"
}
  // Response from the API
  export interface TeacherResponse {
    teachers: Teacher[]
    total: number
  }
  
  