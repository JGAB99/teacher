// Ruta: src/app/dashboard/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import DashboardClient from '@/components/dashboard/dashboard-client';
import { InstitutionStudentCount, Institution } from '@/lib/types';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    institutionsCount,
    careersCount,
    coursesCount,
    studentsCount,
    chartDataResult,
    recentInstitutionsData
  ] = await Promise.all([
    supabase.from('institutions').select('id', { count: 'exact', head: true }),
    supabase.from('careers').select('id', { count: 'exact', head: true }),
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.rpc('get_student_count_by_institution', { p_owner_id: user!.id }),
    supabase.from('institutions').select('id, name, created_at').order('created_at', { ascending: false }).limit(5)
  ]);

  const stats = {
    institutions: institutionsCount.count ?? 0,
    careers: careersCount.count ?? 0,
    courses: coursesCount.count ?? 0,
    students: studentsCount.count ?? 0,
  };
  
  // ✅ CORRECCIÓN: Se añade un tipo explícito al parámetro 'item' para eliminar el error 'any'.
  const chartData: InstitutionStudentCount[] = chartDataResult.data?.map((item: { institution_name: string; student_count: number | string; }) => ({
    institution_name: item.institution_name,
    student_count: Number(item.student_count)
  })) || [];

  const recentInstitutions: Institution[] = recentInstitutionsData.data || [];

  return (
    <DashboardClient 
      stats={stats} 
      chartData={chartData} 
      recentInstitutions={recentInstitutions}
    />
  );
}
