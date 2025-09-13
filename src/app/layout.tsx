// Ruta: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Importamos el Toaster para las notificaciones

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teacher's Gradebook",
  description: "Gestiona tus calificaciones de forma sencilla.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

