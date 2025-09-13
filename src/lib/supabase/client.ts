// Ruta: src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// ESTE CLIENTE SE USA EN COMPONENTES DE CLIENTE ('use client')
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}