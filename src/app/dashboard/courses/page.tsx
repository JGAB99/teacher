// Ruta: src/app/dashboard/courses/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CoursesClient from '@/components/courses/courses-client';
import { Institution, Career, Course, GradeCatalog, SectionCatalog, PeriodCatalog } from '@/lib/types';

export const revalidate = 0;

async function fetchData(supabase: any, searchParams: { institutionId?: string, careerId?: string }) {
  const { institutionId, careerId } = searchParams;

  const [institutionsData, careersData, coursesData, gradesData, sectionsData, periodsData] = await Promise.all([
    supabase.from('institutions').select('id, name'),
    supabase.from('careers').select('id, name, institution_id'),
    (() => {
      let query = supabase.from('courses').select(`
        id, name, created_at, career_id, grade_id, section_id, period_id,
        careers ( id, name, institutions ( id, name ) ),
        grades_catalog ( grade ),
        sections_catalog ( section ),
        periods_catalog ( period )
      `).order('created_at', { ascending: false });
      
      if (institutionId && institutionId !== 'all') query = query.eq('careers.institution_id', institutionId);
      if (careerId && careerId !== 'all') query = query.eq('career_id', careerId);
      return query;
    })(),
    supabase.from('grades_catalog').select('*').order('grade', { ascending: true }),
    supabase.from('sections_catalog').select('*').order('section', { ascending: true }),
    supabase.from('periods_catalog').select('*').order('period', { ascending: true }),
  ]);

  return {
    institutions: (institutionsData.data as Institution[]) || [],
    careers: (careersData.data as Career[]) || [],
    courses: (coursesData.data as Course[]) || [],
    grades: (gradesData.data as GradeCatalog[]) || [],
    sections: (sectionsData.data as SectionCatalog[]) || [],
    periods: (periodsData.data as PeriodCatalog[]) || [],
    error: institutionsData.error || careersData.error || coursesData.error || gradesData.error || sectionsData.error || periodsData.error
  };
}

// ✅ CORRECCIÓN: La función ahora es 'async'
export default async function CoursesPage({ searchParams }: { searchParams: { institutionId?: string, careerId?: string } }) {
  // ✅ CORRECCIÓN: Se usa 'await'
  const supabase = await createSupabaseServerClient();
  const { institutions, careers, courses, grades, sections, periods, error } = await fetchData(supabase, searchParams);

  if (error) {
    console.error("Error fetching courses data:", error);
    return <div>Error al cargar los datos. Por favor, intente de nuevo.</div>;
  }

  return (
    <div className="space-y-8">
       <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Cursos</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Cursos</h1>
        <p className="text-muted-foreground mt-2">Crea, visualiza y administra todos tus cursos.</p>
      </div>

      <CoursesClient
        initialCourses={courses}
        institutions={institutions}
        careers={careers}
        grades={grades}
        sections={sections}
        periods={periods}
      />
    </div>
  );
}
