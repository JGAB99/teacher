// Ruta: src/app/dashboard/courses/actions.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const courseSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  career_id: z.string().uuid({ message: "Por favor, seleccione una carrera válida." }),
  grade_id: z.string().uuid({ message: "Por favor, seleccione un grado válido." }),
  section_id: z.string().uuid({ message: "Por favor, seleccione una sección válida." }),
  period_id: z.string().uuid({ message: "Por favor, seleccione un período válido." }),
});

export async function createCourse(prevState: any, formData: FormData) {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { _form: ["No autorizado"] }};

  const validatedFields = courseSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { error } = await supabase.from('courses').insert({
    ...validatedFields.data,
    teacher_id: user.id,
  });

  if (error) {
    console.error('Error creating course:', error);
    return { error: { _form: ["No se pudo crear el curso."] } };
  }

  revalidatePath('/dashboard/courses');
  return { success: 'Curso creado exitosamente.' };
}

export async function updateCourse(courseId: string, prevState: any, formData: FormData) {
    // ✅ CORRECCIÓN: Se añade 'await'
    const supabase = await createSupabaseServerClient();
    const validatedFields = courseSchema.safeParse(Object.fromEntries(formData.entries()));
  
    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors };
    }
  
    const { error } = await supabase
      .from('courses')
      .update({ ...validatedFields.data, updated_at: new Date().toISOString() })
      .eq('id', courseId);
  
    if (error) {
      console.error('Error updating course:', error);
      return { error: { _form: ["No se pudo actualizar el curso."] } };
    }
  
    revalidatePath('/dashboard/courses');
    return { success: 'Curso actualizado exitosamente.' };
}

export async function deleteCourse(courseId: string) {
    // ✅ CORRECCIÓN: Se añade 'await'
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('courses').delete().eq('id', courseId);

    if (error) {
        console.error("Error deleting course:", error);
        return { error: 'No se pudo eliminar el curso.' };
    }
    
    revalidatePath('/dashboard/courses');
    return { success: 'Curso eliminado exitosamente.' };
}
