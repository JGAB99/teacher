// Ruta: src/components/students/student-importer.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { read, utils } from 'xlsx';
import { importStudents } from '@/app/dashboard/courses/[courseId]/students/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

export default function StudentImporter({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const promise = new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = utils.sheet_to_json(worksheet);

                // Mapear cabeceras a las claves esperadas por el backend
                const mappedJson = json.map((row: any) => ({
                    student_code: row['Código'] || row['codigo'] || row['student_code'],
                    first_name: row['Nombre'] || row['nombre'] || row['first_name'],
                    last_name: row['Apellido'] || row['apellido'] || row['last_name'],
                    email: row['Email'] || row['email'] || row['correo'] || row['Correo'],
                }));
                
                const result = await importStudents(courseId, mappedJson);

                if (result.error) {
                    reject(new Error(result.error));
                } else {
                    setIsOpen(false);
                    router.refresh();
                    resolve();
                    toast.success(result.success);
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });

    toast.promise(promise, {
      loading: 'Importando estudiantes...',
      error: (err: any) => `Error al importar: ${err.message || 'Formato de archivo inválido.'}`,
      // El mensaje de éxito se maneja arriba
    });
    
    setIsImporting(false);
    // Resetear el input para permitir subir el mismo archivo de nuevo
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Importar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Estudiantes desde Excel</DialogTitle>
          <DialogDescription>
            Sube un archivo .xlsx o .csv. Asegúrate de que las columnas tengan cabeceras como: <br />
            <code className="bg-muted px-1 rounded-sm">Código</code>, <code className="bg-muted px-1 rounded-sm">Nombre</code>, <code className="bg-muted px-1 rounded-sm">Apellido</code>, <code className="bg-muted px-1 rounded-sm">Email</code>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            disabled={isImporting}
            accept=".xlsx, .xls, .csv" 
          />
        </div>
        <DialogFooter>
            <p className="text-xs text-muted-foreground">El proceso puede tardar unos segundos. La importación actualizará estudiantes con el mismo código.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
