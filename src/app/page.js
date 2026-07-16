'use client';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTiltEffect } from '@/hooks/useTiltEffect';
import ParticlesCanvas from '@/components/ParticlesCanvas';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function BerandaPage() {
  useScrollReveal();
  useTiltEffect();

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img
            src="/images/hero-village.png"
            alt="Panorama Desa Negeri Pandan"
            loading="eager"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-grid"></div>
        <ParticlesCanvas />

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              Website Resmi Desa Negeri Pandan
            </div>
            <h1 className="hero-title">
              Selamat Datang di
              Desa <span className="highlight">Negeri Pandan</span>
              <span className="sub">Desa Asri, Mandiri &amp; Sejahtera</span>
            </h1>
            <p className="hero-desc">
              Sebuah desa yang kaya akan potensi alam, keindahan budaya, dan
              semangat kebersamaan masyarakat yang menjaga kearifan lokal.
            </p>
            <div className="hero-actions">
              <Link href="/profil" className="btn btn-primary">
                Jelajahi Desa →
              </Link>
              <Link href="/kontak" className="btn btn-outline">
                Hubungi Kami
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="stat-value">
                  <AnimatedCounter target={5240} />
                </div>
                <div className="stat-label">Penduduk</div>
              </div>
              <div className="hero-stat">
                <div className="stat-value">
                  <AnimatedCounter target={1250} />
                </div>
                <div className="stat-label">Kepala Keluarga</div>
              </div>
              <div className="hero-stat">
                <div className="stat-value">
                  <AnimatedCounter target={850} />
                </div>
                <div className="stat-label">Hektar Lahan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll">
          <span>scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* ═══ SEKILAS DESA ═══ */}
      <section className="section" id="sekilas" style={{ position: 'relative' }}>
        {/* Decorative orb */}
        <div
          className="orb orb-green"
          style={{ width: '500px', height: '500px', top: '-200px', right: '-200px' }}
        ></div>

        <div className="container">
          <div className="about-grid">
            <div className="about-image reveal">
              <img
                src="/images/community.png"
                alt="Kehidupan masyarakat Desa Negeri Pandan"
              />
              <div className="floating-badge">
                <span className="badge-icon">
                  <i className="ph-bold ph-house-line"></i>
                </span>
                <div className="badge-text">
                  Sejak 1800-an
                  <span>Desa Bersejarah</span>
                </div>
              </div>
            </div>
            <div className="about-text reveal reveal-delay-1">
              <div className="section-label">Tentang Kami</div>
              <h2 className="section-title">
                Sekilas Desa <span className="accent">Negeri Pandan</span>
              </h2>
              <p>
                Desa Negeri Pandan merupakan salah satu desa yang terletak di
                daerah dengan pemandangan alam yang memukau. Dikelilingi oleh
                perbukitan hijau dan lahan pertanian yang subur, desa ini menjadi
                rumah bagi masyarakat yang ramah dan penuh semangat gotong royong.
              </p>
              <p>
                Dengan potensi pertanian yang melimpah, destinasi wisata alam yang
                menakjubkan, dan kearifan lokal yang terjaga, Desa Negeri Pandan
                terus berkembang menuju desa yang mandiri dan sejahtera.
              </p>
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-icon">
                    <i className="ph-bold ph-plant"></i>
                  </span>
                  <div className="stat-number">
                    <AnimatedCounter target={450} />
                  </div>
                  <div className="stat-text">Petani Aktif</div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">
                    <i className="ph-bold ph-house"></i>
                  </span>
                  <div className="stat-number">
                    <AnimatedCounter target={4} />
                  </div>
                  <div className="stat-text">Dusun</div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">
                    <i className="ph-bold ph-graduation-cap"></i>
                  </span>
                  <div className="stat-number">
                    <AnimatedCounter target={3} />
                  </div>
                  <div className="stat-text">Sekolah</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* ═══ POTENSI UNGGULAN ═══ */}
      <section className="section" id="potensi" style={{ position: 'relative' }}>
        <div
          className="orb orb-lime"
          style={{ width: '600px', height: '600px', bottom: '-200px', left: '-300px' }}
        ></div>

        <div className="container text-center">
          <div className="section-label" style={{ justifyContent: 'center' }}>
            Keunggulan Desa
          </div>
          <h2 className="section-title">
            Potensi <span className="accent">Unggulan</span>
          </h2>
          <p className="section-desc">
            Desa Negeri Pandan memiliki beragam potensi yang menjadi kebanggaan
            dan sumber penghidupan masyarakat.
          </p>
        </div>
        <div className="container">
          <div className="features-grid">
            {/* Pertanian */}
            <div className="feature-card glass-card reveal">
              <div className="card-image">
                <img src="/images/agriculture.png" alt="Pertanian Desa Negeri Pandan" />
                <span className="card-badge">Unggulan</span>
              </div>
              <div className="card-body">
                <div className="card-icon">
                  <i className="ph-bold ph-plant"></i>
                </div>
                <h3 className="card-title">Pertanian</h3>
                <p className="card-desc">
                  Lahan pertanian yang subur menghasilkan padi, sayuran, dan hasil
                  bumi berkualitas tinggi yang menjadi tulang punggung ekonomi desa.
                </p>
                <Link href="/potensi" className="card-link">
                  Selengkapnya →
                </Link>
              </div>
            </div>

            {/* Pariwisata */}
            <div className="feature-card glass-card reveal reveal-delay-1">
              <div className="card-image">
                <img src="/images/tourism.png" alt="Pariwisata Desa Negeri Pandan" />
                <span className="card-badge">Wisata</span>
              </div>
              <div className="card-body">
                <div className="card-icon">
                  <i className="ph-bold ph-mountains"></i>
                </div>
                <h3 className="card-title">Pariwisata</h3>
                <p className="card-desc">
                  Keindahan alam berupa air terjun, perbukitan, dan panorama sawah
                  yang memikat menjadi daya tarik wisata alam yang memesona.
                </p>
                <Link href="/potensi" className="card-link">
                  Selengkapnya →
                </Link>
              </div>
            </div>

            {/* Komunitas */}
            <div className="feature-card glass-card reveal reveal-delay-2">
              <div className="card-image">
                <img src="/images/community.png" alt="Komunitas Desa Negeri Pandan" />
                <span className="card-badge">Budaya</span>
              </div>
              <div className="card-body">
                <div className="card-icon">
                  <i className="ph-bold ph-handshake"></i>
                </div>
                <h3 className="card-title">Komunitas</h3>
                <p className="card-desc">
                  Semangat gotong royong dan kearifan lokal yang kuat menjadikan
                  masyarakat Desa Negeri Pandan sebagai komunitas yang solid.
                </p>
                <Link href="/potensi" className="card-link">
                  Selengkapnya →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>Ingin Tahu Lebih Banyak?</h2>
            <p>
              Jelajahi informasi lengkap tentang layanan, potensi, dan kegiatan
              Desa Negeri Pandan.
            </p>
            <Link href="/kontak" className="btn btn-primary">
              Hubungi Kami →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
