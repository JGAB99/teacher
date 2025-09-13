// Ruta: src/app/settings/actions.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
  first_name: z.string().min(2, { message: 'El nombre es requerido.' }).trim(),
  last_name: z.string().min(2, { message: 'El apellido es requerido.' }).trim(),
  phone_number: z.string().optional(),
});

const passwordSchema = z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' });

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { _form: 'No autorizado' }};

  const validatedFields = profileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) return { error: validatedFields.error.flatten().fieldErrors };

  const { error } = await supabase.from('profiles').update({ ...validatedFields.data, updated_at: new Date().toISOString() }).eq('id', user.id);
  if (error) return { error: { _form: 'Error al actualizar el perfil.' } };

  revalidatePath('/settings');
  revalidatePath('/dashboard'); // Para actualizar el nombre en el layout
  return { success: 'Perfil actualizado exitosamente.' };
}

export async function updatePassword(prevState: any, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const password = formData.get('password') as string;
  
  const validatedPassword = passwordSchema.safeParse(password);
  if (!validatedPassword.success) return { error: { password: validatedPassword.error.flatten().formErrors }};

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: { _form: 'Error al actualizar la contraseña.' }};

  return { success: 'Contraseña actualizada exitosamente.' };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado', publicUrl: null };

  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { error: 'No se seleccionó ningún archivo.', publicUrl: null };

  const filePath = `${user.id}/avatar.${file.name.split('.').pop()}`;
  const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
  if (uploadError) return { error: `Error al subir la imagen: ${uploadError.message}`, publicUrl: null };

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  const { error: dbError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() }).eq('id', user.id);
  if (dbError) return { error: 'Error al guardar la URL de la imagen.', publicUrl: null };
  
  revalidatePath('/settings');
  revalidatePath('/dashboard'); // Para actualizar el avatar en el layout
  return { error: null, publicUrl: data.publicUrl };
}
