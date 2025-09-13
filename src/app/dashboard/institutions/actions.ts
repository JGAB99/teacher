// Ruta: src/app/dashboard/institutions/actions.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// --- Esquemas de Validación con Zod ---

const institutionSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
});

const careerSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  institution_id: z.string().uuid({ message: "Se requiere una institución válida." }),
});


// --- Funciones CRUD para Instituciones ---

export async function createInstitution(prevState: any, formData: FormData) {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado." };

  const validatedFields = institutionSchema.safeParse({ name: formData.get('name') });
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.name?.[0] };
  }

  const { error } = await supabase
    .from('institutions')
    .insert({ name: validatedFields.data.name, owner_id: user.id });

  if (error) {
    console.error("Create institution error:", error);
    return { error: "No se pudo crear la institución." };
  }

  revalidatePath('/dashboard/institutions');
  return { success: "Institución creada exitosamente." };
}

export async function updateInstitution(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return { error: "ID de institución no proporcionado." };
  
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const validatedFields = institutionSchema.safeParse({ name: formData.get('name') });
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.name?.[0] };
  }

  const { error } = await supabase
    .from('institutions')
    .update({ name: validatedFields.data.name, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error("Update institution error:", error);
    return { error: "No se pudo actualizar la institución." };
  }

  revalidatePath('/dashboard/institutions');
  return { success: "Institución actualizada exitosamente." };
}

export async function deleteInstitution(id: string) {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('institutions').delete().eq('id', id);

  if (error) {
    console.error("Delete institution error:", error);
    return { error: "No se pudo eliminar la institución." };
  }

  revalidatePath('/dashboard/institutions');
  return { success: "Institución eliminada exitosamente." };
}


// --- Funciones CRUD para Carreras ---

export async function createCareer(prevState: any, formData: FormData) {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const validatedFields = careerSchema.safeParse({
    name: formData.get('name'),
    institution_id: formData.get('institution_id'),
  });
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.name?.[0] };
  }

  const { error } = await supabase
    .from('careers')
    .insert(validatedFields.data);

  if (error) {
    console.error("Create career error:", error);
    return { error: "No se pudo crear la carrera." };
  }

  revalidatePath('/dashboard/institutions');
  return { success: "Carrera creada exitosamente." };
}

export async function updateCareer(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return { error: "ID de carrera no proporcionado." };

  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const validatedFields = careerSchema.safeParse({
    name: formData.get('name'),
    institution_id: formData.get('institution_id'),
  });
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.name?.[0] };
  }

  const { error } = await supabase
    .from('careers')
    .update({ name: validatedFields.data.name, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) {
    console.error("Update career error:", error);
    return { error: "No se pudo actualizar la carrera." };
  }

  revalidatePath('/dashboard/institutions');
  return { success: "Carrera actualizada exitosamente." };
}

export async function deleteCareer(id: string) {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('careers').delete().eq('id', id);

  if (error) {
    console.error("Delete career error:", error);
    return { error: "No se pudo eliminar la carrera." };
  }

  revalidatePath('/dashboard/institutions');
  return { success: "Carrera eliminada exitosamente." };
}
