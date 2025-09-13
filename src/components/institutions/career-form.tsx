// Ruta: src/components/institutions/career-form.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Career } from '@/lib/types';
import { createCareer, updateCareer } from '@/app/dashboard/institutions/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'; // <-- Importar

type CareerFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  career: Career | null;
  institutionId: string | null;
};

export default function CareerForm({ isOpen, setIsOpen, career, institutionId }: CareerFormProps) {
  const router = useRouter(); // <-- Inicializar
  const action = career ? updateCareer : createCareer;
  const [state, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      router.refresh(); // <-- Refrescar datos
      setIsOpen(false);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, setIsOpen, router]); // <-- Añadir router a dependencias
  
  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
    }
  }, [isOpen]);

  if (!career && !institutionId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{career ? 'Editar Carrera' : 'Nueva Carrera'}</DialogTitle>
          <DialogDescription>
            {career ? 'Actualiza el nombre de la carrera.' : 'Añade una nueva carrera a la institución.'}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={career?.id || ''} />
          <input type="hidden" name="institution_id" value={career?.institution_id || institutionId || ''} />
          
          <div>
            <Label htmlFor="name">Nombre de la Carrera</Label>
            <Input
              id="name"
              name="name"
              defaultValue={career?.name || ''}
              required
              minLength={3}
              placeholder="Ej. Bachillerato en Ciencias y Letras"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? 'Guardando...' : 'Guardar'}
    </Button>
  );
}
