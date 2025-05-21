export interface Teaching {
  id_charge: number                   // corresponds to id_charge PK in ChargesEnseignement
  palier?: string | null              // nullable string, max length 20
  specialite?: string | null          // nullable string, max length 50
  semestre?: string | null            // nullable string, max length 10
  section?: string | null             // nullable string, max length 10
  groupe?: string | null              // nullable string, max length 10
  type?: string | null                // nullable string, max length 20
  intitule_module?: string | null    // nullable string, max length 100, corresponds to "intitulé_module"
  abv_module?: string | null          // nullable string, max length 20, corresponds to "abv_module"
  teacher?: string | null             // corresponds to Code_Enseignant (one-to-one FK) simplified as string here
  annee_universitaire: string         // non-nullable string, length 7
  formation?: number | null           // formation FK id, nullable number
}

// API response structure
export interface TeachingResponse {
  teachings: Teaching[]
  total: number
}