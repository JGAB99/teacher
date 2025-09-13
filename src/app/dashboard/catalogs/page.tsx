// Ruta: src/app/dashboard/catalogs/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import CatalogsClient from '@/components/catalogs/catalogs-client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export const revalidate = 0;

export default async function CatalogsPage() {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();

  const [gradesData, sectionsData, periodsData] = await Promise.all([
    supabase.from('grades_catalog').select('id, level, grade').order('level').order('grade'),
    supabase.from('sections_catalog').select('id, section').order('section'),
    supabase.from('periods_catalog').select('id, period').order('period')
  ]);

  const grades = gradesData.data?.map(item => ({ id: item.id, name: `${item.level} - ${item.grade}`, level: item.level, grade: item.grade })) || [];
  const sections = sectionsData.data?.map(item => ({ id: item.id, name: item.section, section: item.section })) || [];
  const periods = periodsData.data?.map(item => ({ id: item.id, name: item.period, period: item.period })) || [];

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Catálogos</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Catálogos</h1>
        <p className="text-muted-foreground mt-2">
          Administra los grados, secciones y períodos para tus cursos.
        </p>
      </div>

      <CatalogsClient
        initialGrades={grades}
        initialSections={sections}
        initialPeriods={periods}
      />
    </div>
  );
}