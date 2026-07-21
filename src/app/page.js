'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTiltEffect } from '@/hooks/useTiltEffect';
import ParticlesCanvas from '@/components/ParticlesCanvas';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function BerandaPage() {
  const [heroImage, setHeroImage] = useState('/images/hero-village.png');
  const [latestNews, setLatestNews] = useState([]);
  const [stats, setStats] = useState({
    stat_penduduk: 5240,
    stat_kk: 1250,
    stat_lahan: 850,
    stat_petani: 450,
    stat_dusun: 4,
    stat_sekolah: 3
  });

  useScrollReveal([latestNews]);
  useTiltEffect();

  useEffect(() => {
    async function fetchData() {
      // Fetch Hero Image
      const { data: heroData } = await supabase
        .from('pengaturan_halaman')
        .select('value')
        .eq('id', 'hero_image')
        .single();
      if (heroData) setHeroImage(heroData.value);

      // Fetch Latest News
      const { data: newsData } = await supabase
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (newsData) setLatestNews(newsData);

      // Fetch Stats
      const statIds = ['stat_penduduk', 'stat_kk', 'stat_lahan', 'stat_petani', 'stat_dusun', 'stat_sekolah'];
      const { data: statsData } = await supabase
        .from('pengaturan_halaman')
        .select('id, value')
        .in('id', statIds);

      if (statsData && statsData.length > 0) {
        setStats(prev => {
          const newStats = { ...prev };
          statsData.forEach(item => {
            newStats[item.id] = parseInt(item.value, 10) || prev[item.id];
          });
          return newStats;
        });
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img
            src={heroImage}
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
                  <AnimatedCounter target={stats.stat_penduduk} />
                </div>
                <div className="stat-label">Penduduk</div>
              </div>
              <div className="hero-stat">
                <div className="stat-value">
                  <AnimatedCounter target={stats.stat_kk} />
                </div>
                <div className="stat-label">Kepala Keluarga</div>
              </div>
              <div className="hero-stat">
                <div className="stat-value">
                  <AnimatedCounter target={stats.stat_lahan} />
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
                src="/images/tentang-kami.png"
                alt="Kehidupan masyarakat Desa Negeri Pandan"
              />
              <div className="floating-badge">
                <span className="badge-icon">
                  <i className="ph-bold ph-house-line"></i>
                </span>
                <div className="badge-text">
                  Sejak 1957
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
                    <i className="ph-bold ph-house"></i>
                  </span>
                  <div className="stat-number">
                    <AnimatedCounter target={stats.stat_dusun} />
                  </div>
                  <div className="stat-text">Dusun</div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">
                    <i className="ph-bold ph-graduation-cap"></i>
                  </span>
                  <div className="stat-number">
                    <AnimatedCounter target={stats.stat_sekolah} />
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
                <img src="/images/potensi-pertanian.png" alt="Pertanian Desa Negeri Pandan" />
                <span className="card-badge">Unggulan</span>
              </div>
              <div className="card-body">
                <div className="card-icon">
                  <i className="ph-bold ph-plant"></i>
                </div>
                <h3 className="card-title">Pertanian</h3>
                <p className="card-desc">
                  Pertanian di Desa Negeri Pandan didominasi oleh petani padi dan jagung,
                  memanfaatkan lahan subur yang menjadi tulang punggung ekonomi desa.
                </p>
                <Link href="/potensi" className="card-link">
                  Selengkapnya →
                </Link>
              </div>
            </div>



            {/* Komunitas */}
            <div className="feature-card glass-card reveal reveal-delay-2">
              <div className="card-image">
                <img src="/images/budaya-1.jpeg" alt="Komunitas Desa Negeri Pandan" />
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

      {/* ═══ BERITA TERBARU ═══ */}
      <section className="section" id="berita" style={{ position: 'relative' }}>
        <div
          className="orb orb-green"
          style={{ width: '400px', height: '400px', top: '-100px', right: '-150px', opacity: 0.5 }}
        ></div>

        <div className="container text-center">
          <div className="section-label" style={{ justifyContent: 'center' }}>
            Kabar Terkini
          </div>
          <h2 className="section-title">
            Berita <span className="accent">Terbaru</span>
          </h2>
        </div>
        <div className="container" style={{ marginTop: '40px', position: 'relative', zIndex: 1 }}>
          {latestNews.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center' }}>Belum ada berita terbaru.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
              {latestNews.map((item) => (
                <Link href={`/berita/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                  <div className="glass-card reveal" style={{
                    padding: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="text-muted">Tidak ada gambar</span>
                      </div>
                    )}
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p className="text-muted" style={{ fontSize: '12px', marginBottom: '12px' }}>
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-light, #f8fafc)', marginBottom: '12px', lineHeight: '1.4' }}>
                        {item.title}
                      </h3>
                      <p className="text-muted" style={{ fontSize: '14px', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.6' }}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link href="/berita" className="btn btn-outline">
              Lihat Semua Berita
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

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
