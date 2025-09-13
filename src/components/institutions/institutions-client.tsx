// Ruta: src/components/institutions/institutions-client.tsx
'use client';

import { useState } from 'react';
import { Institution, Career } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, MoreVertical, GraduationCap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InstitutionForm from './institution-form';
import CareerForm from './career-form';
import { deleteInstitution, deleteCareer } from '@/app/dashboard/institutions/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'; // <-- 1. Importar el router

type InstitutionsClientProps = {
  initialInstitutions: Institution[];
};

export default function InstitutionsClient({ initialInstitutions }: InstitutionsClientProps) {
  const router = useRouter(); // <-- 2. Inicializar el router
  
  // Estados para controlar los modales (diálogos)
  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);

  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [currentInstitutionId, setCurrentInstitutionId] = useState<string | null>(null);


  const handleEditInstitution = (institution: Institution) => {
    setEditingInstitution(institution);
    setIsInstitutionModalOpen(true);
  };

  const handleDeleteInstitution = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta institución? Todas las carreras y cursos asociados también serán eliminados.')) {
      const result = await deleteInstitution(id);
      if (result.success) {
        toast.success(result.success);
        router.refresh(); // <-- 3. Refrescar los datos del servidor
      } else {
        toast.error(result.error);
      }
    }
  };
  
  const handleEditCareer = (career: Career) => {
    setEditingCareer(career);
    setIsCareerModalOpen(true);
  };
  
  const handleDeleteCareer = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta carrera? Todos los cursos asociados también serán eliminados.')) {
      const result = await deleteCareer(id);
      if (result.success) {
        toast.success(result.success);
        router.refresh(); // <-- 4. Refrescar los datos del servidor
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instituciones y Carreras</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus instituciones educativas y las carreras que impartes en ellas.
          </p>
        </div>
        <Button onClick={() => { setEditingInstitution(null); setIsInstitutionModalOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Institución
        </Button>
      </div>

      {initialInstitutions.length > 0 ? ( // <-- 5. Usar directamente las props
        <div className="space-y-6">
          {initialInstitutions.map((institution) => ( // <-- 5. Usar directamente las props
            <Card key={institution.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{institution.name}</CardTitle>
                  <CardDescription>
                    Creada el {new Date(institution.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditInstitution(institution)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar Institución
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteInstitution(institution.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar Institución
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Carreras</h4>
                <div className="space-y-2">
                  {institution.careers.length > 0 ? (
                    institution.careers.map(career => (
                      <div key={career.id} className="flex items-center justify-between p-2 rounded-md border">
                        <div className="flex items-center gap-3">
                           <GraduationCap className="h-5 w-5 text-muted-foreground" />
                           <span className="font-medium">{career.name}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCareer(career)}>
                               <Edit className="mr-2 h-4 w-4" /> Editar Carrera
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteCareer(career.id)}>
                               <Trash2 className="mr-2 h-4 w-4" /> Eliminar Carrera
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay carreras en esta institución.</p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => { setEditingCareer(null); setCurrentInstitutionId(institution.id); setIsCareerModalOpen(true); }}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Carrera
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold">Aún no hay instituciones</h3>
          <p className="text-muted-foreground mt-2">
            Crea tu primera institución para empezar a organizar tus carreras y cursos.
          </p>
        </div>
      )}

      {/* Modales para crear/editar */}
      <InstitutionForm
        isOpen={isInstitutionModalOpen}
        setIsOpen={setIsInstitutionModalOpen}
        institution={editingInstitution}
      />
      
      <CareerForm
        isOpen={isCareerModalOpen}
        setIsOpen={setIsCareerModalOpen}
        career={editingCareer}
        institutionId={currentInstitutionId}
      />
    </div>
  );
}