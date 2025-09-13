// Ruta: src/components/settings/avatar-uploader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { uploadAvatar } from '@/app/settings/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Profile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function AvatarUploader({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setAvatarUrl(profile.avatar_url);
  }, [profile.avatar_url]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const { error, publicUrl } = await uploadAvatar(formData);

    if (error) {
      toast.error(`Error al subir la imagen: ${error}`);
    } else if (publicUrl) {
      toast.success('Avatar actualizado exitosamente.');
      // Forzamos la recarga de la caché del navegador para la nueva imagen.
      const newUrl = `${publicUrl}?t=${new Date().getTime()}`;
      setAvatarUrl(newUrl);
      router.refresh(); // Refresca los datos del servidor en el layout
    }
    setIsUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto de Perfil</CardTitle>
        <CardDescription>Sube o actualiza tu avatar.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {avatarUrl ? (
          <Image
            width={128}
            height={128}
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full object-cover aspect-square"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
            <span className="text-sm text-muted-foreground">Sin foto</span>
          </div>
        )}
        <div>
          <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? 'Subiendo...' : 'Subir Foto'}
          </Button>
          <Input
            type="file"
            name="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            disabled={isUploading}
          />
        </div>
      </CardContent>
    </Card>
  );
}