// Ruta: src/app/actions.ts
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return redirect('/login');
}
