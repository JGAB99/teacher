// Ruta: src/components/catalogs/catalogs-client.tsx
'use client';

import { useState } from 'react';
import { CatalogItem } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CatalogTable from './catalog-table';

type CatalogsClientProps = {
  initialGrades: CatalogItem[];
  initialSections: CatalogItem[];
  initialPeriods: CatalogItem[];
};

export default function CatalogsClient({ initialGrades, initialSections, initialPeriods }: CatalogsClientProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Catálogos</h1>
        <p className="text-muted-foreground mt-2">
          Administra los grados, secciones y períodos para tus cursos.
        </p>
      </div>
      
      <Tabs defaultValue="grades">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grades">Grados y Niveles</TabsTrigger>
          <TabsTrigger value="sections">Secciones</TabsTrigger>
          <TabsTrigger value="periods">Períodos</TabsTrigger>
        </TabsList>

        <TabsContent value="grades">
          <CatalogTable 
            title="Grados y Niveles" 
            description="Grados académicos disponibles."
            items={initialGrades}
            tableName="grades_catalog"
            isGradeCatalog={true}
          />
        </TabsContent>

        <TabsContent value="sections">
          <CatalogTable 
            title="Secciones" 
            description="Secciones disponibles para los cursos (A, B, Única, etc.)."
            items={initialSections}
            tableName="sections_catalog"
          />
        </TabsContent>

        <TabsContent value="periods">
          <CatalogTable 
            title="Períodos" 
            description="Períodos académicos (Trimestre, Semestre, etc.)."
            items={initialPeriods}
            tableName="periods_catalog"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
