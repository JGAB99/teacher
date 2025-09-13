// Ruta: src/app/register/page.tsx
'use client'
import { signup } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'

// ✅ CORRECCIÓN: Se define un tipo explícito para el estado del formulario.
type FormState = {
  error?: string | null;
  success?: boolean | null;
  message?: string | null;
} | null;

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(signup, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
    if (state?.success) {
      toast.success(state.message)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }, [state, router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm">
        <form action={formAction}>
          <CardHeader className="text-center">
             <div className="flex justify-center items-center mb-4">
               <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
            <CardDescription>
              Ingresa tus datos para empezar a gestionar tus cursos.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Nombre</Label>
                <Input id="first-name" name="first-name" placeholder="José" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Apellido</Label>
                <Input id="last-name" name="last-name" placeholder="Aguilar" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="nombre@ejemplo.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
             <p className="text-xs text-center text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:underline">
                Inicia Sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Creando cuenta...' : 'Crear Cuenta'}
    </Button>
  )
}
