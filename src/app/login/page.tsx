// Ruta: src/app/login/page.tsx
'use client'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'

// ✅ CORRECCIÓN: Se define un tipo explícito para el estado del formulario.
type FormState = {
  error?: string | null;
} | null;

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm">
        <form action={formAction}>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
               <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tu correo para acceder a tu panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="nombre@ejemplo.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            <p className="text-xs text-center text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:underline">
                Regístrate
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
      {pending ? 'Ingresando...' : 'Ingresar'}
    </Button>
  )
}
