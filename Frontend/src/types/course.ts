// Define the Course interface based on your SQL database schema
// Updated Course interface to match Formations JSON fields
export interface Course {
  id?: number;
  domaine?: string;
  'filière'?: string;
  niveau_cycle?: string;
  'specialités'?: string;
  nbr_sections?: number;
  nbr_groupes?: number;
  semestre?: string;
  modules?: string;
}

// Response from the API (array of Formations)
export interface CourseResponse {
  courses: Course[];
  total: number;
}