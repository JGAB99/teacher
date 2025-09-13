// Ruta: src/components/dashboard/dashboard-client.tsx
'use client';

import { InstitutionStudentCount, Institution } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, GraduationCap, BookCopy, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

type DashboardClientProps = {
  stats: {
    institutions: number;
    careers: number;
    courses: number;
    students: number;
  };
  chartData: InstitutionStudentCount[];
  recentInstitutions: Institution[];
};

export default function DashboardClient({ stats, chartData, recentInstitutions }: DashboardClientProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Un resumen de toda tu actividad académica.
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Instituciones" value={stats.institutions} icon={Building} />
        <StatCard title="Carreras" value={stats.careers} icon={GraduationCap} />
        <StatCard title="Cursos Activos" value={stats.courses} icon={BookCopy} />
        <StatCard title="Estudiantes Totales" value={stats.students} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Barras */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribución de Estudiantes por Institución</CardTitle>
            <CardDescription>
              Visualiza cuántos estudiantes gestionas en cada institución.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="institution_name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="student_count" name="Estudiantes" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                No hay datos para mostrar en el gráfico.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instituciones Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Instituciones Recientes</CardTitle>
            <CardDescription>
              Tus instituciones añadidas más recientemente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInstitutions.length > 0 ? (
              recentInstitutions.map((inst) => (
                <div key={inst.id} className="flex items-center">
                  <Building className="h-5 w-5 mr-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{inst.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Creada: {new Date(inst.created_at).toLocaleDateString()}
                    </p>
                  </div>
                   <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/institutions`}>Gestionar</Link>
                   </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aún no has creado ninguna institución.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente auxiliar para las tarjetas de estadísticas
function StatCard({ title, value, icon: Icon }: { title: string; value: number | string; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}