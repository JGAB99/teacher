// Ruta: src/components/catalogs/catalog-form.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { CatalogItem } from '@/lib/types';
import { createCatalogItem, updateCatalogItem } from '@/app/dashboard/catalogs/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type CatalogFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: CatalogItem | null;
  tableName: 'grades_catalog' | 'sections_catalog' | 'periods_catalog';
  isGradeCatalog?: boolean;
};

export default function CatalogForm({ isOpen, setIsOpen, item, tableName, isGradeCatalog = false }: CatalogFormProps) {
  const router = useRouter();
  const action = item ? updateCatalogItem : createCatalogItem;
  const [state, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      router.refresh();
      setIsOpen(false);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, setIsOpen, router]);
  
  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
    }
  }, [isOpen]);

  const title = item ? 'Editar Elemento' : 'Nuevo Elemento';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {item ? 'Actualiza la información de este elemento.' : 'Añade un nuevo elemento al catálogo.'}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={item?.id || ''} />
          <input type="hidden" name="tableName" value={tableName} />
          
          {isGradeCatalog ? (
            <>
              <div>
                <Label htmlFor="level">Nivel</Label>
                <Input id="level" name="level" defaultValue={item?.level || ''} required placeholder="Ej. Primaria" />
              </div>
              <div>
                <Label htmlFor="grade">Grado</Label>
                <Input id="grade" name="grade" defaultValue={item?.grade || ''} required placeholder="Ej. 1ro Primaria" />
              </div>
            </>
          ) : (
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                defaultValue={item?.name || ''}
                required
                placeholder={tableName === 'sections_catalog' ? 'Ej. Sección A' : 'Ej. Trimestre 1'}
              />
            </div>
          )}

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
