export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://web-profil-desa-negeri-pandan.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Jangan biarkan Google mengindeks dashboard admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
