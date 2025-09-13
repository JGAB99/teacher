// Ruta: src/app/dashboard/courses/[courseId]/students/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { StudentDataTable } from '@/components/students/student-data-table';
import { columns } from '@/components/students/columns';
import { Student } from '@/lib/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export const revalidate = 0;

async function getCourseDetails(supabase: any, courseId: string) {
  const { data, error } = await supabase.from('courses').select(`id, name, careers(name, institutions(name))`).eq('id', courseId).single();
  if (error) console.error("Error fetching course details:", error);
  return data;
}

async function getStudentsForCourse(supabase: any, courseId: string): Promise<Student[]> {
   const { data, error } = await supabase.from('enrollments').select(`students(*)`).eq('course_id', courseId).order('last_name', { foreignTable: 'students', ascending: true });
  if (error) console.error("Error fetching students:", error);
  return data?.map((item: any) => item.students).filter(Boolean) || [];
}

// ✅ CORRECCIÓN: La función ahora es 'async'
export default async function StudentsPage({ params }: { params: { courseId: string } }) {
  // ✅ CORRECCIÓN: Se usa 'await'
  const supabase = await createSupabaseServerClient();
  const courseId = params.courseId;

  const [course, students] = await Promise.all([
    getCourseDetails(supabase, courseId),
    getStudentsForCourse(supabase, courseId)
  ]);

  if (!course) notFound();

  const institutionName = course.careers?.institutions?.name ?? 'Institución';
  const careerName = course.careers?.name ?? 'Carrera';

  return (
    <div className="space-y-8">
       <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/courses">Cursos</BreadcrumbLink></BreadcrumbItem>
           <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{course.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Estudiantes</h1>
        <p className="text-muted-foreground mt-2">Administra los estudiantes inscritos en el curso de <span className="font-semibold">{course.name}</span>.</p>
         <p className="text-sm text-muted-foreground">{institutionName} / {careerName}</p>
      </div>

      <StudentDataTable columns={columns} data={students} courseId={courseId} />
    </div>
  );
}
