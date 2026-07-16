'use client';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ProfilPage() {
  useScrollReveal();

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="separator">/</span>
            <span>Profil Desa</span>
          </div>
          <h1>
            Profil <span className="accent">Desa</span>
          </h1>
          <p>
            Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan
            Desa Negeri Pandan.
          </p>
        </div>
      </header>

      {/* Sejarah */}
      <section className="section">
        <div className="container">
          <div className="section-label">Sejarah Desa</div>
          <h2 className="section-title">
            Jejak Langkah <span className="accent">Negeri Pandan</span>
          </h2>

          <div className="timeline" style={{ marginTop: '3rem' }}>
            <div className="timeline-item reveal">
              <div className="timeline-year">1850-an</div>
              <h3>Awal Mula Penamaan</h3>
              <p>
                Desa ini awalnya dinamakan berdasarkan banyaknya tanaman pandan
                wangi yang tumbuh liar di sepanjang sungai utama. Para pendatang
                pertama mulai menetap dan bercocok tanam.
              </p>
            </div>

            <div className="timeline-item reveal reveal-delay-1">
              <div className="timeline-year">1920</div>
              <h3>Pembentukan Dusun</h3>
              <p>
                Seiring bertambahnya penduduk, wilayah mulai dibagi menjadi empat
                dusun utama untuk mempermudah koordinasi dan gotong royong warga.
              </p>
            </div>

            <div className="timeline-item reveal reveal-delay-2">
              <div className="timeline-year">2010</div>
              <h3>Desa Wisata Rintisan</h3>
              <p>
                Pemerintah desa mulai menginisiasi program desa wisata dengan
                mengembangkan akses ke air terjun dan perbukitan sebagai destinasi
                wisata lokal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Visi Misi */}
      <section className="section">
        <div className="container">
          <div className="visi-misi-grid">
            <div className="glass-card visi-card reveal">
              <div className="section-label">Tujuan Utama</div>
              <h2 className="section-title">
                Visi <span className="accent">Desa</span>
              </h2>
              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'var(--clr-primary-light)',
                  fontStyle: 'italic',
                  lineHeight: '1.8',
                }}
              >
                &ldquo;Terwujudnya Desa Negeri Pandan yang Mandiri, Sejahtera,
                Berbudaya, dan Berwawasan Lingkungan pada tahun 2030.&rdquo;
              </p>
            </div>

            <div className="glass-card misi-card reveal reveal-delay-1">
              <div className="section-label">Langkah Strategis</div>
              <h2 className="section-title">
                Misi <span className="accent">Desa</span>
              </h2>
              <ol>
                <li>Meningkatkan kualitas infrastruktur dan fasilitas umum desa.</li>
                <li>
                  Mengembangkan potensi pertanian unggulan melalui teknologi tepat
                  guna.
                </li>
                <li>Mendorong pertumbuhan ekonomi kerakyatan dan UMKM.</li>
                <li>Melestarikan budaya gotong royong dan kearifan lokal.</li>
                <li>Mengelola sumber daya alam secara berkelanjutan.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
