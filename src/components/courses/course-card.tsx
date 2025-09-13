// Ruta: src/components/courses/course-card.tsx
'use client';

import { Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteCourse } from '@/app/dashboard/courses/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

type CourseCardProps = {
  course: Course;
  onEdit: (course: Course) => void;
};

export default function CourseCard({ course, onEdit }: CourseCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este curso y todos sus datos asociados? Esta acción no se puede deshacer.')) {
      const result = await deleteCourse(course.id);
      if (result.success) {
        toast.success(result.success);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{course.name}</CardTitle>
        <CardDescription>{course.careers?.institutions?.name}</CardDescription>
        <CardDescription className="font-medium">{course.careers?.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <Badge variant="outline">{course.grades_catalog?.grade}</Badge>
        <Badge variant="outline">Sección {course.sections_catalog?.section}</Badge>
        <Badge variant="outline">{course.periods_catalog?.period}</Badge>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        <Button asChild>
            <Link href={`/dashboard/courses/${course.id}/students`}>Gestionar Estudiantes</Link>
        </Button>
        {/* CORRECCIÓN VISUAL: Se elimina el div contenedor para apilar los botones */}
        <Button variant="outline" className="w-full" onClick={() => onEdit(course)}>
            <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
        <Button variant="destructive" className="w-full" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}
