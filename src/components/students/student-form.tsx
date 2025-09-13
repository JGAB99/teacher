// Ruta: src/components/students/student-form.tsx
'use client';
import { useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Student } from '@/lib/types';
import { createStudent, updateStudent } from '@/app/dashboard/courses/[courseId]/students/actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type StudentFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  student: Student | null;
  courseId: string;
};

// ✅ CORRECCIÓN: Se define un tipo explícito para el estado del formulario.
type FormState = {
  error?: {
    first_name?: string[];
    last_name?: string[];
    student_code?: string[];
    email?: string[];
    _form?: string;
  } | null;
  success?: string | null;
};

const initialState: FormState = { error: null, success: null };

export default function StudentForm({ isOpen, setIsOpen, student, courseId }: StudentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  const action = student ? updateStudent.bind(null, student.id, courseId) : createStudent.bind(null, courseId);
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      setIsOpen(false);
      router.refresh();
    }
    if (state?.error?._form) {
      toast.error(state.error._form);
    }
  }, [state, setIsOpen, router]);
  
  useEffect(() => {
    if (!isOpen) formRef.current?.reset();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form ref={formRef} action={formAction}>
          <DialogHeader>
            <DialogTitle>{student ? 'Editar Estudiante' : 'Añadir Nuevo Estudiante'}</DialogTitle>
            <DialogDescription>{student ? 'Actualiza los datos del estudiante.' : 'Completa los datos para añadir un nuevo estudiante al curso.'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student_code" className="text-right">Código</Label>
              <Input id="student_code" name="student_code" defaultValue={student?.student_code ?? ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">Nombre</Label>
              <Input id="first_name" name="first_name" defaultValue={student?.first_name ?? ''} className="col-span-3" required />
            </div>
            {state?.error?.first_name && <p className="col-span-4 text-red-500 text-sm text-right -mt-2">{state.error.first_name[0]}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">Apellido</Label>
              <Input id="last_name" name="last_name" defaultValue={student?.last_name ?? ''} className="col-span-3" required />
            </div>
            {state?.error?.last_name && <p className="col-span-4 text-red-500 text-sm text-right -mt-2">{state.error.last_name[0]}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Correo</Label>
              <Input id="email" name="email" type="email" defaultValue={student?.email ?? ''} className="col-span-3" />
            </div>
             {state?.error?.email && <p className="col-span-4 text-red-500 text-sm text-right -mt-2">{state.error.email[0]}</p>}
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
  return <Button type="submit" aria-disabled={pending}>{pending ? 'Guardando...' : 'Guardar Cambios'}</Button>;
}