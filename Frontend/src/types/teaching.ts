// Teaching interface that matches the Django ChargesEnseignement model
export interface Teaching {
  id_charge: number                   // Primary key
  palier?: string | null              // PALIER field
  specialite?: string | null          // SPECIALITE field
  semestre?: string | null            // SEMESTRE field
  section?: string | null             // SECTION field
  groupe?: string | null              // Groupe field
  type?: string | null                // Type field (COURS, TD, TP)
  'intitulé_module'?: string | null   // Intitulé MODULE field (exact Django field name with accent)
  abv_module?: string | null          // Abv MODULE field
  Code_Enseignant_id?: string | null  // Foreign key field (with capital C as in db_column)
  annee_universitaire: string         // Academic year (required)
  formation?: number | null           // Foreign key to Formations
}

// API response structure
export interface TeachingResponse {
  teachings: Teaching[]
  total: number
  total_count?: number
  page?: number
  items_per_page?: number
}