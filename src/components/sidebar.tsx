// Ruta: src/components/sidebar.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Building, BookCopy, Users, ClipboardList, BarChart3, GraduationCap } from 'lucide-react';

// CORRECCIÓN: Se eliminó el enlace global a "Estudiantes" para evitar el error 404.
// La gestión de estudiantes se hace desde dentro de cada curso.
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/institutions', label: 'Instituciones', icon: Building },
  { href: '/dashboard/courses', label: 'Cursos', icon: BookCopy },
  { href: '/dashboard/catalogs', label: 'Catálogos', icon: ClipboardList },
  { href: '/dashboard/reports', label: 'Reportes', icon: BarChart3 },
  { href: '/settings', label: 'Ajustes', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-white flex-col hidden lg:flex">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="text-lg">Gradebook</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 ${
                  pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
