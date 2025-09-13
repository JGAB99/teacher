// Ruta: src/app/settings/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Profile } from '@/lib/types';
import SettingsForm from '@/components/settings/settings-form';
import AvatarUploader from '@/components/settings/avatar-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';

export const revalidate = 0;

export default async function SettingsPage() {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (!profile) {
    // Esto podría pasar si el trigger falló en un inicio.
    // Podríamos crear el perfil aquí o mostrar un error más claro.
    return <div>Error: No se pudo cargar el perfil del usuario. Contacte a soporte.</div>;
  }
 
  return (
    <div className="space-y-8">
      {/* Cabecera de la página con título y botón de regreso */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona la información de tu cuenta y tu foto de perfil.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <MoveLeft className="mr-2 h-4 w-4" />
            Regresar al Dashboard
          </Link>
        </Button>
      </div>
      
      {/* Layout de columnas para el contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna de Avatar */}
        <div className="lg:col-span-1">
          <AvatarUploader profile={profile as Profile} />
        </div>

        {/* Columna de Formularios */}
        <div className="lg:col-span-2">
          <SettingsForm profile={profile as Profile} />
        </div>
      </div>
    </div>
  );
}
