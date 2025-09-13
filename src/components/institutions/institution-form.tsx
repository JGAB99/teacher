// Ruta: src/components/institutions/institution-form.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Institution } from '@/lib/types';
import { createInstitution, updateInstitution } from '@/app/dashboard/institutions/actions';
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

type InstitutionFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  institution: Institution | null;
};

export default function InstitutionForm({ isOpen, setIsOpen, institution }: InstitutionFormProps) {
  const router = useRouter(); // <-- Inicializar
  const action = institution ? updateInstitution : createInstitution;
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{institution ? 'Editar Institución' : 'Nueva Institución'}</DialogTitle>
          <DialogDescription>
            {institution ? 'Actualiza el nombre de la institución.' : 'Añade una nueva institución para organizar tus carreras.'}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          {institution && <input type="hidden" name="id" value={institution.id} />}
          <div>
            <Label htmlFor="name">Nombre de la Institución</Label>
            <Input
              id="name"
              name="name"
              defaultValue={institution?.name || ''}
              required
              minLength={3}
              placeholder="Ej. Colegio ABC"
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
