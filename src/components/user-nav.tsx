// Ruta: src/components/user-nav.tsx
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/app/actions";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

// Definimos los tipos aquí para claridad
type Profile = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
} | null;

type UserNavProps = {
  user: User;
  profile: Profile;
}

export default function UserNav({ user, profile }: UserNavProps) {
  // Función para obtener las iniciales del nombre para el Avatar
  const getInitials = () => {
    if (!profile?.first_name || !profile?.last_name) return 'U';
    return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url ?? ''} alt="Avatar de usuario" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.first_name} {profile?.last_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer">
              Ajustes
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logout}>
          <button type="submit" className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              Cerrar sesión
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
