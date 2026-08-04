'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTiltEffect } from '@/hooks/useTiltEffect';

export default function PotensiPage() {
  useScrollReveal();
  useTiltEffect();

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="separator">/</span>
            <span>Potensi Desa</span>
          </div>
          <div className="section-label">Kekayaan Desa</div>
          <h1 className="section-title" style={{ marginTop: '0.5rem' }}>
            Potensi <span className="accent">Unggulan</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '18px', marginTop: '10px' }}>
            Mengenal lebih dalam kekayaan sumber daya alam dan pertanian
            yang menjadi pilar kebangkitan ekonomi Desa Negeri Pandan.
          </p>
        </div>
      </header>

      <section className="section" style={{ position: 'relative' }}>
        <div
          className="orb orb-green"
          style={{ width: '500px', height: '500px', top: '10%', right: '-10%' }}
        ></div>
        <div className="container">
          {/* Potensi 1: Pertanian */}
          <div className="potensi-detail">
            <div className="potensi-image reveal" style={{ position: 'relative', minHeight: '400px' }}>
              <Image src="/images/potensi-pertanian.png" alt="Sektor Pertanian Desa" fill style={{ objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} />
            </div>
            <div className="reveal reveal-delay-1">
              <div className="section-label">Sektor Utama</div>
              <h3>Pertanian &amp; Agrobisnis</h3>
              <p>
                Sektor pertanian menjadi salah satu pilar utama perekonomian bagi sebagian besar
                masyarakat Desa Negeri Pandan. Dengan lahan pertanian dan perkebunan yang
                membentang luas, kesuburan tanah yang terjaga memungkinkan para petani
                untuk menghasilkan panen yang melimpah dan berkualitas.
              </p>
              <p>
                Masyarakat desa secara aktif mengolah lahan mereka untuk menghasilkan
                berbagai komoditi unggulan seperti padi, sayur-mayur, serta hasil kebun
                lainnya. Gotong royong dan ketekunan warga terus mendorong sektor ini
                untuk semakin maju demi kesejahteraan bersama.
              </p>
              <div className="tag-list" style={{ marginTop: '1.5rem' }}>
                <span className="tag">Padi</span>
                <span className="tag">Sayur-mayur</span>
                <span className="tag">Hasil Kebun</span>
                <span className="tag">Ketahanan Pangan</span>
              </div>
            </div>
          </div>

          <div className="section-divider" style={{ margin: '4rem 0' }}></div>

          {/* Potensi 2: Komunitas */}
          <div className="potensi-detail reverse">
            <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px', height: '420px' }}>
              <div style={{ gridRow: '1 / 3', height: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative' }}>
                <Image src="/images/budaya-1.jpeg" alt="Gotong Royong 1" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ height: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative' }}>
                <Image src="/images/budaya-2.jpeg" alt="Gotong Royong 2" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ height: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative' }}>
                <Image src="/images/budaya-3.jpeg" alt="Gotong Royong 3" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="section-label">Budaya</div>
              <h3>Komunitas &amp; Kearifan Lokal</h3>
              <p>
                Semangat gotong royong dan kearifan lokal yang kuat menjadikan
                masyarakat Desa Negeri Pandan sebagai komunitas yang solid.
                Kebersamaan ini tercermin dalam berbagai kegiatan warga sehari-hari.
              </p>
              <p>
                Masyarakat secara aktif menjaga tradisi, adat istiadat, dan nilai-nilai 
                budaya warisan leluhur. Kegiatan musyawarah dan gotong royong dalam 
                membangun fasilitas desa menjadi bukti nyata kuatnya ikatan persaudaraan 
                di Negeri Pandan.
              </p>
              <div className="tag-list" style={{ marginTop: '1.5rem' }}>
                <span className="tag">Gotong Royong</span>
                <span className="tag">Musyawarah</span>
                <span className="tag">Tradisi Desa</span>
                <span className="tag">Kearifan Lokal</span>
              </div>
            </div>
          </div>

          <div className="section-divider" style={{ margin: '4rem 0' }}></div>

          {/* Potensi 3: Usaha Lokal & Peternakan */}
          <div className="potensi-detail">
            <div className="potensi-image reveal" style={{ position: 'relative', minHeight: '400px' }}>
               <Image src="/images/usaha lokal.jpeg" alt="Usaha Lokal Desa" fill style={{ objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} />
            </div>
            <div className="reveal reveal-delay-1">
              <div className="section-label">Penggerak Ekonomi</div>
              <h3>Usaha Lokal &amp; Peternakan</h3>
              <p>
                 Selain mengandalkan hasil bumi, perekonomian Desa Negeri Pandan didorong oleh usaha lokal, termasuk peternakan unggas seperti ayam dan kalkun, yang aktif beroperasi.
              </p>
              <p>
                 Di desa ini terdapat sentra pembuatan tahu, serta sekitar 3 hingga 4 pabrik penggilingan jagung yang mendukung aktivitas warga. Selain itu, peternakan ayam dan kalkun menjadi komoditas penting dalam memenuhi kebutuhan pangan masyarakat sekitar.
              </p>
              <div className="tag-list" style={{ marginTop: '1.5rem' }}>
                <span className="tag">Pabrik Tahu</span>
                <span className="tag">Giling Jagung</span>
                <span className="tag">Ayam Petelur</span>
                <span className="tag">Kalkun</span>
                <span className="tag">UMKM Desa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
