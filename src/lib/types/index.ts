// Ruta: src/lib/types/index.ts
// Nota: Reemplaza el contenido completo de este archivo.

// Catálogos
export type GradeCatalog = { id: string; level: string; grade: string; };
export type SectionCatalog = { id: string; section: string; };
export type PeriodCatalog = { id: string; period: string; };
export type CatalogItem = { id: string; name: string };
export type CatalogType = 'grades' | 'sections' | 'periods';

// Estructuras Académicas
export type Institution = { id: string; name: string; created_at: string; };
export type Career = { id: string; name: string; institution_id: string; };
export type Course = { 
  id: string; 
  name: string; 
  created_at: string;
  career_id: string;
  grade_id: string;
  section_id: string;
  period_id: string;
  careers: { 
    id: string;
    name: string;
    institutions: { id: string; name: string; } | null;
  } | null;
  grades_catalog: { grade: string } | null;
  sections_catalog: { section: string } | null;
  periods_catalog: { period: string } | null;
};

// Estudiantes
export type Student = {
  id: string;
  student_code: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  grades: Grade[];
};

// Tareas y Calificaciones
export type Task = { id: string; course_id: string; title: string; description: string | null; max_points: number; due_date: string | null; created_at: string; };
export type Grade = { id: string; student_id: string; task_id: string; points_awarded: number; comment: string | null; };

// Perfil y Dashboard
export type Profile = { first_name: string | null; last_name: string | null; phone_number: string | null; avatar_url: string | null; };
export type InstitutionStudentCount = { institution_name: string; student_count: number; };
