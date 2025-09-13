// Ruta: src/components/courses/course-form.tsx
'use client';

import { useEffect, useActionState, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Course, Institution, Career, GradeCatalog, SectionCatalog, PeriodCatalog } from '@/lib/types';
import { createCourse, updateCourse } from '@/app/dashboard/courses/actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CourseFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  course: Course | null;
  institutions: Institution[];
  careers: Career[];
  grades: GradeCatalog[];
  sections: SectionCatalog[];
  periods: PeriodCatalog[];
};

const initialState = { error: {}, success: null };

export default function CourseForm({ isOpen, setIsOpen, course, institutions, careers, grades, sections, periods }: CourseFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [selectedInstitution, setSelectedInstitution] = useState(course?.careers?.institutions?.id || '');
  
  const action = course ? updateCourse.bind(null, course.id) : createCourse;
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      setIsOpen(false);
      router.refresh();
    }
    if (state?.error?._form) {
      toast.error(state.error._form[0]);
    }
  }, [state, setIsOpen, router]);
  
  useEffect(() => {
    if (!isOpen) {
        formRef.current?.reset();
        setSelectedInstitution('');
    } else {
       setSelectedInstitution(course?.careers?.institutions?.id || '');
    }
  }, [isOpen, course]);

  const availableCareers = selectedInstitution ? careers.filter(c => c.institution_id === selectedInstitution) : [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <form ref={formRef} action={formAction} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{course ? 'Editar Curso' : 'Crear Nuevo Curso'}</DialogTitle>
            <DialogDescription>{course ? 'Actualiza los detalles de este curso.' : 'Completa los detalles para crear un nuevo curso.'}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Label htmlFor="institution_id">Institución</Label>
            <Select name="institution_id" value={selectedInstitution} onValueChange={setSelectedInstitution} required>
              <SelectTrigger id="institution_id"><SelectValue placeholder="Selecciona una institución" /></SelectTrigger>
              <SelectContent>
                {institutions.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {state?.error?.institution_id && <p className="text-red-500 text-sm mt-1">{state.error.institution_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="career_id">Carrera</Label>
            <Select name="career_id" defaultValue={course?.career_id} disabled={!selectedInstitution} required>
              <SelectTrigger id="career_id"><SelectValue placeholder="Selecciona una carrera" /></SelectTrigger>
              <SelectContent>
                {availableCareers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
             {state?.error?.career_id && <p className="text-red-500 text-sm mt-1">{state.error.career_id[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Curso</Label>
            <Input id="name" name="name" defaultValue={course?.name ?? ''} placeholder="Ej. Matemática I" required />
            {state?.error?.name && <p className="text-red-500 text-sm mt-1">{state.error.name[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade_id">Grado/Nivel</Label>
              <Select name="grade_id" defaultValue={course?.grade_id} required>
                <SelectTrigger id="grade_id"><SelectValue placeholder="Grado" /></SelectTrigger>
                <SelectContent>
                  {grades.map(g => <SelectItem key={g.id} value={g.id}>{g.grade}</SelectItem>)}
                </SelectContent>
              </Select>
               {state?.error?.grade_id && <p className="text-red-500 text-sm mt-1">{state.error.grade_id[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="section_id">Sección</Label>
               <Select name="section_id" defaultValue={course?.section_id} required>
                <SelectTrigger id="section_id"><SelectValue placeholder="Sección" /></SelectTrigger>
                <SelectContent>
                  {sections.map(s => <SelectItem key={s.id} value={s.id}>{s.section}</SelectItem>)}
                </SelectContent>
              </Select>
               {state?.error?.section_id && <p className="text-red-500 text-sm mt-1">{state.error.section_id[0]}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="period_id">Período</Label>
             <Select name="period_id" defaultValue={course?.period_id} required>
              <SelectTrigger id="period_id"><SelectValue placeholder="Selecciona un período" /></SelectTrigger>
              <SelectContent>
                {periods.map(p => <SelectItem key={p.id} value={p.id}>{p.period}</SelectItem>)}
              </SelectContent>
            </Select>
             {state?.error?.period_id && <p className="text-red-500 text-sm mt-1">{state.error.period_id[0]}</p>}
          </div>

          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" aria-disabled={pending}>{pending ? 'Guardando...' : 'Guardar Curso'}</Button>;
}
