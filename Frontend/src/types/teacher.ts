export interface Teacher {
   
  Code_Enseignant?: string;       // Original backend field name (needed for API operations)
  nom: string;
  prenom: string;
  nom_jeune_fille: string;
  genre: string;
  departement: string;
  grade: string;
  email1: string;
  email2: string
  tel1: string;
  tel2: string;
  status: string;
}

// Response from the API
export interface TeacherResponse {
  teachers: Teacher[]
  total: number
}