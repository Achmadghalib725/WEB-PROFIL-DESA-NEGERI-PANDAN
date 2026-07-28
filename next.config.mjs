/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eqohmoxtvwnncqygcqgx.supabase.co',
      },
    ],
  },
};

export default nextConfig;
