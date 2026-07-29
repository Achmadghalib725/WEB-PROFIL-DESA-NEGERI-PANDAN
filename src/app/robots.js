export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://negeri-pandan.vercel.app'; // Sesuaikan jika ada domain asli

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Jangan biarkan Google mengindeks dashboard admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
