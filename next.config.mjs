// Ruta: /next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // ¡ASEGÚRATE DE QUE ESTE SEA TU HOSTNAME!
        hostname: 'sqnanqzunlsbyqemiqqs.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  },
};

export default nextConfig;
