// Ruta: src/components/courses/courses-client.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Course, Institution, Career, GradeCatalog, SectionCatalog, PeriodCatalog } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CourseCard from './course-card';
import CourseForm from './course-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

type CoursesClientProps = {
  initialCourses: Course[];
  institutions: Institution[];
  careers: Career[];
  grades: GradeCatalog[];
  sections: SectionCatalog[];
  periods: PeriodCatalog[];
};

export default function CoursesClient({ initialCourses, institutions, careers, grades, sections, periods }: CoursesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [institutionFilter, setInstitutionFilter] = useState(searchParams.get('institutionId') || 'all');
  const [careerFilter, setCareerFilter] = useState(searchParams.get('careerId') || 'all');

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (institutionFilter !== 'all') params.set('institutionId', institutionFilter);
    else params.delete('institutionId');
    
    params.delete('careerId');
    setCareerFilter('all');
    router.replace(`${pathname}?${params.toString()}`);
  }, [institutionFilter]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
     if (careerFilter !== 'all') params.set('careerId', careerFilter);
    else params.delete('careerId');
    router.replace(`${pathname}?${params.toString()}`);
  }, [careerFilter]);

  const availableCareers = institutionFilter === 'all'
    ? careers
    : careers.filter(c => c.institution_id === institutionFilter);

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-4 flex-wrap">
          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filtrar por institución" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las instituciones</SelectItem>
              {institutions.map(inst => (<SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={careerFilter} onValueChange={setCareerFilter} disabled={availableCareers.length === 0}>
            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filtrar por carrera" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las carreras</SelectItem>
              {availableCareers.map(career => (<SelectItem key={career.id} value={career.id}>{career.name}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Curso
        </Button>
      </div>

      {initialCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {initialCourses.map(course => (
            <CourseCard key={course.id} course={course} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No se encontraron cursos con los filtros seleccionados.</p>
          <p className="text-sm text-muted-foreground mt-2">Intenta ajustar tu búsqueda o crea un nuevo curso.</p>
        </div>
      )}

      <CourseForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        course={editingCourse}
        institutions={institutions}
        careers={careers}
        grades={grades}
        sections={sections}
        periods={periods}
      />
    </div>
  );
}
