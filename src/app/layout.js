import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import './globals.css';

export const metadata = {
  title: 'Desa Negeri Pandan',
  description:
    'Website resmi Desa Negeri Pandan. Menyediakan informasi terkini mengenai profil desa, layanan publik, potensi unggulan, dan berita desa.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Phosphor Icons — loaded before paint so icons are visible immediately */}
        <Script
          src="https://unpkg.com/@phosphor-icons/web"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <CursorGlow />
      </body>
    </html>
  );
}
