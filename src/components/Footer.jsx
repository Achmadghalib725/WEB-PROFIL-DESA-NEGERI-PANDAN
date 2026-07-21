'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

/**
 * Footer
 */
export default function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/logo-lamsel.png" alt="Logo Kabupaten Lampung Selatan" width="34" height="34" style={{ objectFit: 'contain' }} />
              </div>
              <div className="brand-text" style={{ margin: 0 }}>
                Negeri <span>Pandan</span>
              </div>
            </div>
            <p>
              Website resmi Desa Negeri Pandan. Menyediakan informasi terkini
              mengenai profil desa, layanan publik, potensi unggulan, dan berita
              desa.
            </p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/share/18QMSBzBNP/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="ph-bold ph-facebook-logo"></i>
              </a>
              <a href="#" aria-label="WhatsApp">
                <i className="ph-bold ph-whatsapp-logo"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigasi</h4>
            <Link href="/">Beranda</Link>
            <Link href="/profil">Profil Desa</Link>
            <Link href="/layanan">Layanan Publik</Link>
            <Link href="/potensi">Potensi Desa</Link>
            <Link href="/berita">Berita Desa</Link>
          </div>

          <div className="footer-col">
            <h4>Informasi</h4>
            <Link href="/kontak">Hubungi Kami</Link>
            <a href="#">Peta Desa</a>
          </div>

          <div className="footer-col">
            <h4>Kontak</h4>
            <a href="#">
              <i className="ph-bold ph-map-pin" style={{ marginRight: '6px' }}></i>{' '}
              Desa Negeri Pandan
            </a>
            <a href="#">
              <i className="ph-bold ph-phone" style={{ marginRight: '6px' }}></i>{' '}
              (0631) 123-4567
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=desanegeripandan12@gmail.com" target="_blank" rel="noopener noreferrer">
              <i className="ph-bold ph-envelope" style={{ marginRight: '6px' }}></i>{' '}
              desanegeripandan12@gmail.com
            </a>
          </div>
        </div>

        <div className="footer-bottom" style={{ justifyContent: 'center' }}>
          <p>&copy; 2026 Desa Negeri Pandan. Seluruh hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
