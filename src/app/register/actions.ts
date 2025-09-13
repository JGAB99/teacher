// Ruta: src/app/register/actions.ts
'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function signup(prevState: any, formData: FormData) {
  // ✅ CORRECCIÓN: Se maneja 'headers()' de forma asíncrona.
  const headersList = headers();
  const origin = headersList.get('origin');

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('first-name') as string
  const lastName = formData.get('last-name') as string
  
  const supabase = await createSupabaseServerClient()

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (error) {
    console.error("Signup Error:", error);
    return { error: 'No se pudo registrar al usuario. El correo puede estar en uso.' }
  }

  return { 
    success: true, 
    message: '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.' 
  }
}
