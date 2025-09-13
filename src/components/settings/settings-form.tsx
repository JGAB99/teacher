// Ruta: src/components/settings/settings-form.tsx
'use client';

import { useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Profile } from '@/lib/types';
import { updateProfile, updatePassword } from '@/app/settings/actions';
// ✅ CORRECCIÓN: Se añade 'CardFooter' a la importación.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ProfileFormState = {
  error?: {
    first_name?: string[];
    last_name?: string[];
    _form?: string;
  } | null;
  success?: string | null;
};

type PasswordFormState = {
  error?: {
    password?: string[];
    _form?: string;
  } | null;
  success?: string | null;
};

export default function SettingsForm({ profile }: { profile: Profile }) {
  const [profileState, profileFormAction] = useActionState(updateProfile, null);
  const [passwordState, passwordFormAction] = useActionState(updatePassword, null);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (profileState?.success) toast.success(profileState.success);
    if (profileState?.error?._form) toast.error(profileState.error._form);
  }, [profileState]);

  useEffect(() => {
    if (passwordState?.success) {
      toast.success(passwordState.success);
      passwordFormRef.current?.reset();
    }
    if (passwordState?.error?._form) toast.error(passwordState.error._form);
  }, [passwordState]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Actualiza tus datos personales.</CardDescription>
        </CardHeader>
        <form action={profileFormAction}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input id="first_name" name="first_name" defaultValue={profile.first_name ?? ''} />
                {profileState?.error?.first_name && <p className="text-sm text-red-500">{profileState.error.first_name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input id="last_name" name="last_name" defaultValue={profile.last_name ?? ''} />
                 {profileState?.error?.last_name && <p className="text-sm text-red-500">{profileState.error.last_name[0]}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Número de Teléfono</Label>
              <Input id="phone_number" name="phone_number" defaultValue={profile.phone_number ?? ''} />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <SubmitButton text="Guardar Cambios" />
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>Establece una nueva contraseña para tu cuenta.</CardDescription>
        </CardHeader>
        <form ref={passwordFormRef} action={passwordFormAction}>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input id="password" name="password" type="password" />
              {passwordState?.error?.password && <p className="text-sm text-red-500">{passwordState.error.password[0]}</p>}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <SubmitButton text="Actualizar Contraseña" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" aria-disabled={pending}>{pending ? 'Guardando...' : text}</Button>;
}
