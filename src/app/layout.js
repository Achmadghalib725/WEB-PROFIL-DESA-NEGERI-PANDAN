import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import ThemeProvider from '@/components/ThemeProvider';
import { SpeedInsights } from "@vercel/speed-insights/next";
import './globals.css';

export const metadata = {
  title: 'Desa Negeri Pandan | Website Resmi',
  description:
    'Website resmi Desa Negeri Pandan. Menyediakan informasi terkini mengenai profil desa, layanan publik, potensi unggulan UMKM, wisata, dan berita desa terkini.',
  keywords: ['Desa Negeri Pandan', 'Profil Desa', 'Layanan Publik Desa', 'Berita Desa', 'UMKM Negeri Pandan', 'Pemerintah Desa'],
  authors: [{ name: 'Desa Negeri Pandan' }],
  openGraph: {
    title: 'Desa Negeri Pandan',
    description: 'Portal informasi resmi, layanan publik, dan berita Desa Negeri Pandan.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://web-profil-desa-negeri-pandan.vercel.app',
    siteName: 'Desa Negeri Pandan',
    locale: 'id_ID',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
      </head>
      <body suppressHydrationWarning>
        {/* Phosphor Icons — loaded before paint so icons are visible immediately */}
        <Script
          src="https://unpkg.com/@phosphor-icons/web"
          strategy="beforeInteractive"
        />
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          <Navbar />
          {children}
          <Footer />
          <CursorGlow />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
