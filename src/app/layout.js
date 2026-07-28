import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import ThemeProvider from '@/components/ThemeProvider';
import { SpeedInsights } from "@vercel/speed-insights/next";
import './globals.css';

export const metadata = {
  title: 'Desa Negeri Pandan',
  description:
    'Website resmi Desa Negeri Pandan. Menyediakan informasi terkini mengenai profil desa, layanan publik, potensi unggulan, dan berita desa.',
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
