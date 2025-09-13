// Ruta: src/components/students/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Student } from '@/lib/types';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteStudentFromCourse } from '@/app/dashboard/courses/[courseId]/students/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Esta función es un componente que se renderizará en el encabezado de la columna.
const SortableHeader = ({ column, title }: { column: any; title: string }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};


export const columns: ColumnDef<Student>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
  {
    accessorKey: 'student_code',
    header: 'Código',
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => <SortableHeader column={column} title="Nombre" />,
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => <SortableHeader column={column} title="Apellido" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const student = row.original;
      const router = useRouter();
      // Obtenemos el courseId del metadata que pasamos a la tabla
      const courseId = table.options.meta?.courseId as string;

      const handleDelete = async () => {
        if (confirm(`¿Estás seguro de que quieres desinscribir a ${student.first_name} de este curso?`)) {
          const result = await deleteStudentFromCourse(student.id, courseId);
          if (result.success) {
            toast.success(result.success);
            router.refresh();
          } else {
            toast.error(result.error);
          }
        }
      }

      const handleEdit = () => {
         // Llamamos a la función que abre el modal, pasada a través del metadata
         (table.options.meta as any)?.openEditForm(student);
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEdit}>
              Editar Estudiante
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Desinscribir del Curso
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
