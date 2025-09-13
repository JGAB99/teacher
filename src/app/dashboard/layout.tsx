// Ruta: src/app/dashboard/layout.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Sidebar from '@/components/sidebar';
import UserNav from '@/components/user-nav';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-end border-b bg-white px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline">
              {profile?.first_name} {profile?.last_name}
            </span>
            <UserNav user={user} profile={profile} />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}