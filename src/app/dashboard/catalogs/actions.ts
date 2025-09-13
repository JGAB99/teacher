// Ruta: src/app/dashboard/catalogs/actions.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// --- Esquemas de Validación ---

const gradeSchema = z.object({
  level: z.string().min(1, "El nivel es requerido."),
  grade: z.string().min(1, "El grado es requerido."),
});

const sectionSchema = z.object({
  section: z.string().min(1, "La sección es requerida."),
});

const periodSchema = z.object({
  period: z.string().min(1, "El período es requerido."),
});

// --- Función Genérica para CRUD ---

type CatalogTableName = 'grades_catalog' | 'sections_catalog' | 'periods_catalog';

export async function createCatalogItem(prevState: any, formData: FormData) {
  const tableName = formData.get('tableName') as CatalogTableName;
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  let dataToInsert: any;
  
  try {
    switch (tableName) {
      case 'grades_catalog':
        const validatedGrades = gradeSchema.safeParse({
          level: formData.get('level'),
          grade: formData.get('grade'),
        });
        if (!validatedGrades.success) throw new Error(validatedGrades.error.flatten().fieldErrors.level?.[0] || validatedGrades.error.flatten().fieldErrors.grade?.[0]);
        dataToInsert = validatedGrades.data;
        break;
      case 'sections_catalog':
         const validatedSections = sectionSchema.safeParse({ section: formData.get('name') });
         if (!validatedSections.success) throw new Error(validatedSections.error.flatten().fieldErrors.section?.[0]);
         dataToInsert = { section: validatedSections.data.section };
        break;
      case 'periods_catalog':
         const validatedPeriods = periodSchema.safeParse({ period: formData.get('name') });
         if (!validatedPeriods.success) throw new Error(validatedPeriods.error.flatten().fieldErrors.period?.[0]);
         dataToInsert = { period: validatedPeriods.data.period };
        break;
      default:
        throw new Error("Nombre de tabla inválido.");
    }

    const { error } = await supabase.from(tableName).insert(dataToInsert);
    if (error) throw error;

    revalidatePath('/dashboard/catalogs');
    return { success: "Elemento creado exitosamente." };
  } catch (e: any) {
    return { error: e.message || "No se pudo crear el elemento." };
  }
}

export async function updateCatalogItem(prevState: any, formData: FormData) {
  const tableName = formData.get('tableName') as CatalogTableName;
  const id = formData.get('id') as string;
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  let dataToUpdate: any;

  try {
     switch (tableName) {
      case 'grades_catalog':
        const validatedGrades = gradeSchema.safeParse({
          level: formData.get('level'),
          grade: formData.get('grade'),
        });
        if (!validatedGrades.success) throw new Error(validatedGrades.error.flatten().fieldErrors.level?.[0] || validatedGrades.error.flatten().fieldErrors.grade?.[0]);
        dataToUpdate = validatedGrades.data;
        break;
      case 'sections_catalog':
         const validatedSections = sectionSchema.safeParse({ section: formData.get('name') });
         if (!validatedSections.success) throw new Error(validatedSections.error.flatten().fieldErrors.section?.[0]);
         dataToUpdate = { section: validatedSections.data.section };
        break;
      case 'periods_catalog':
         const validatedPeriods = periodSchema.safeParse({ period: formData.get('name') });
         if (!validatedPeriods.success) throw new Error(validatedPeriods.error.flatten().fieldErrors.period?.[0]);
         dataToUpdate = { period: validatedPeriods.data.period };
        break;
      default:
        throw new Error("Nombre de tabla inválido.");
    }
    
    const { error } = await supabase.from(tableName).update(dataToUpdate).eq('id', id);
    if (error) throw error;
    
    revalidatePath('/dashboard/catalogs');
    return { success: "Elemento actualizado exitosamente." };
  } catch (e: any) {
    return { error: e.message || "No se pudo actualizar el elemento." };
  }
}


export async function deleteCatalogItem(tableName: CatalogTableName, id: string) {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/dashboard/catalogs');
    return { success: "Elemento eliminado exitosamente." };
  } catch(e: any) {
    return { error: e.message || "No se pudo eliminar el elemento." };
  }
}
