// Ruta: src/app/dashboard/institutions/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Institution } from '@/lib/types';
import InstitutionsClient from '@/components/institutions/institutions-client';

export const revalidate = 0;

export default async function InstitutionsPage() {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Obtenemos las instituciones y, anidadas, sus carreras.
  const { data: institutions, error } = await supabase
    .from('institutions')
    .select(`
      id,
      name,
      created_at,
      careers ( id, name, institution_id, created_at )
    `)
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching institutions:", error);
    // Podríamos mostrar una página de error aquí
    return <div>Error al cargar las instituciones.</div>;
  }

  return (
    <InstitutionsClient initialInstitutions={institutions as Institution[] || []} />
  );
}
