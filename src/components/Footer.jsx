import Link from 'next/link';

/**
 * Footer — static server component, no interactivity needed.
 * Identical markup to all 5 original HTML pages.
 */
export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-text">
              Negeri <span>Pandan</span>
            </div>
            <p>
              Website resmi Desa Negeri Pandan. Menyediakan informasi terkini
              mengenai profil desa, layanan publik, potensi unggulan, dan berita
              desa.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <i className="ph-bold ph-facebook-logo"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="ph-bold ph-instagram-logo"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="ph-bold ph-youtube-logo"></i>
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
          </div>

          <div className="footer-col">
            <h4>Informasi</h4>
            <Link href="/kontak">Hubungi Kami</Link>
            <a href="#">Peta Desa</a>
            <a href="#">Galeri</a>
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
            <a href="#">
              <i className="ph-bold ph-envelope" style={{ marginRight: '6px' }}></i>{' '}
              info@negeripandan.desa.id
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Desa Negeri Pandan. Seluruh hak dilindungi.</p>
          <p>Dibangun dengan ❤️ untuk masyarakat desa</p>
        </div>
      </div>
    </footer>
  );
}
