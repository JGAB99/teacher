// Ruta: src/app/dashboard/courses/[courseId]/students/actions.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const studentSchema = z.object({
  student_code: z.string().transform(val => val.trim() === '' ? null : val).optional().nullable(),
  first_name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }).trim(),
  last_name: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres.' }).trim(),
  email: z.string().email({ message: 'Por favor, ingrese un correo válido.' }).optional().or(z.literal('')),
});

export async function createStudent(courseId: string, prevState: any, formData: FormData) {
  // ✅ CORRECCIÓN: Se añade 'await'
  const supabase = await createSupabaseServerClient();
  
  const validatedFields = studentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) return { error: validatedFields.error.flatten().fieldErrors };
  
  const dataToInsert = { ...validatedFields.data, email: validatedFields.data.email === '' ? null : validatedFields.data.email };
  const { data: newStudent, error: studentError } = await supabase.from('students').insert(dataToInsert).select().single();

  if (studentError) {
    console.error('Error creating student:', studentError);
    return { error: { _form: 'No se pudo crear el estudiante. El correo o código ya podría existir.' } };
  }

  const { error: enrollmentError } = await supabase.from('enrollments').insert({ student_id: newStudent.id, course_id: courseId });
  
  if (enrollmentError) {
    console.error('Error creating enrollment:', enrollmentError);
    await supabase.from('students').delete().eq('id', newStudent.id);
    return { error: { _form: 'Se creó el estudiante, pero no se pudo inscribir en el curso. Verifique los permisos.' } };
  }
  
  revalidatePath(`/dashboard/courses/${courseId}/students`);
  return { success: 'Estudiante creado e inscrito exitosamente.' };
}

export async function updateStudent(studentId: string, courseId: string, prevState: any, formData: FormData) {
    // ✅ CORRECCIÓN: Se añade 'await'
    const supabase = await createSupabaseServerClient();
    const validatedFields = studentSchema.safeParse(Object.fromEntries(formData.entries()));
  
    if (!validatedFields.success) return { error: validatedFields.error.flatten().fieldErrors };
  
    const dataToUpdate = {
      ...validatedFields.data,
      email: validatedFields.data.email === '' ? null : validatedFields.data.email,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('students').update(dataToUpdate).eq('id', studentId);
  
    if (error) {
      console.error('Error updating student:', error);
      return { error: { _form: 'No se pudo actualizar el estudiante.' } };
    }
  
    revalidatePath(`/dashboard/courses/${courseId}/students`);
    return { success: 'Estudiante actualizado exitosamente.' };
}

export async function deleteStudentFromCourse(studentId: string, courseId: string) {
    // ✅ CORRECCIÓN: Se añade 'await'
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('enrollments').delete().match({ student_id: studentId, course_id: courseId });

    if (error) {
        console.error('Error deleting enrollment:', error);
        return { error: 'No se pudo desinscribir al estudiante.' };
    }
    
    revalidatePath(`/dashboard/courses/${courseId}/students`);
    return { success: 'Estudiante desinscrito del curso exitosamente.' };
}

const studentImportSchema = z.array(z.object({
    student_code: z.any().transform(val => val ? String(val) : null).optional(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email().optional().nullable(),
}));

export async function importStudents(courseId: string, students: unknown[]) {
    // ✅ CORRECCIÓN: Se añade 'await'
    const supabase = await createSupabaseServerClient();
    const validatedStudents = studentImportSchema.safeParse(students);

    if (!validatedStudents.success) {
        return { error: 'Los datos de los estudiantes no son válidos. Revisa el formato del archivo.' };
    }

    const studentsWithCode = validatedStudents.data.filter(s => s.student_code);
    const studentsWithoutCode = validatedStudents.data.filter(s => !s.student_code);

    let allUpsertedIds: { id: string }[] = [];

    if (studentsWithCode.length > 0) {
      const { data, error } = await supabase.from('students').upsert(studentsWithCode, { onConflict: 'student_code' }).select('id');
      if (error) return { error: 'Ocurrió un error al guardar los estudiantes con código.' };
      allUpsertedIds.push(...data);
    }
    
    if (studentsWithoutCode.length > 0) {
      const { data, error } = await supabase.from('students').insert(studentsWithoutCode).select('id');
      if (error) return { error: 'Ocurrió un error al guardar los estudiantes sin código.' };
      allUpsertedIds.push(...data);
    }

    if (allUpsertedIds.length === 0) return { error: 'No se pudieron procesar los estudiantes.' };

    const enrollments = allUpsertedIds.map(student => ({ course_id: courseId, student_id: student.id }));
    
    const { error: enrollmentError } = await supabase
        .from('enrollments')
        .upsert(enrollments, { onConflict: 'student_id, course_id', ignoreDuplicates: false });

    if (enrollmentError) {
        console.error('Error enrolling students:', enrollmentError);
        return { error: 'Se guardaron los estudiantes, pero hubo un error al inscribirlos.' };
    }

    revalidatePath(`/dashboard/courses/${courseId}/students`);
    return { success: `${allUpsertedIds.length} estudiantes importados e inscritos exitosamente.` };
}
