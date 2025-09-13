// Ruta: src/components/catalogs/catalog-table.tsx
'use client';

import { useState } from 'react';
import { CatalogItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import CatalogForm from './catalog-form';
import { deleteCatalogItem } from '@/app/dashboard/catalogs/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type CatalogTableProps = {
  title: string;
  description: string;
  items: CatalogItem[];
  tableName: 'grades_catalog' | 'sections_catalog' | 'periods_catalog';
  isGradeCatalog?: boolean;
};

export default function CatalogTable({ title, description, items, tableName, isGradeCatalog = false }: CatalogTableProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      const result = await deleteCatalogItem(tableName, id);
      if (result.success) {
        toast.success(result.success);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Elemento
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {isGradeCatalog && <TableHead>Nivel</TableHead>}
                <TableHead>{isGradeCatalog ? 'Grado' : 'Nombre'}</TableHead>
                <TableHead className="text-right w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? items.map((item) => (
                <TableRow key={item.id}>
                  {isGradeCatalog && <TableCell>{item.level}</TableCell>}
                  <TableCell className="font-medium">{isGradeCatalog ? item.grade : item.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={isGradeCatalog ? 3 : 2} className="h-24 text-center">
                    No hay elementos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CatalogForm
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        item={editingItem}
        tableName={tableName}
        isGradeCatalog={isGradeCatalog}
      />
    </Card>
  );
}
