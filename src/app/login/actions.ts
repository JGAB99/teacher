// Ruta: src/app/login/actions.ts
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: 'Credenciales inválidas. Por favor, inténtalo de nuevo.' }
  }

  redirect('/dashboard')
}
