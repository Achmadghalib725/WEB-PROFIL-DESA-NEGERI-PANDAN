'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically load WebGISMap without SSR to avoid Leaflet window errors
const WebGISMap = dynamic(() => import('@/components/WebGISMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '650px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--clr-bg-card, #0c1a13)',
        borderRadius: '16px',
        border: '1px solid var(--clr-border, rgba(255,255,255,0.08))',
        color: 'var(--clr-text-secondary)',
        gap: '16px',
      }}
    >
      <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <p style={{ fontSize: '0.95rem' }}>Memuat WebGIS Peta Digital Desa Negeri Pandan...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  ),
});

export default function PetaPage() {
  return (
    <main className="page-wrapper" style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container">
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem' }}>
            <Link href="/" style={{ color: 'var(--clr-text-muted)', textDecoration: 'none' }}>Beranda</Link>
            <span>/</span>
            <span style={{ color: 'var(--clr-primary-light)' }}>Peta Digital Desa</span>
          </div>
          <div className="section-label">WebGIS Interaktif</div>
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
            Peta Digital <span className="accent">Desa Negeri Pandan</span>
          </h1>
          <p style={{ color: 'var(--clr-text-secondary)', maxWidth: '750px', fontSize: '0.95rem' }}>
            Peta digital persebaran fasilitas umum, batas administrasi 6 dusun, dan infrastruktur Desa Negeri Pandan, Kec. Kalianda, Kab. Lampung Selatan yang disusun oleh Kelompok KKN Universitas Lampung Tahun 2026.
          </p>
        </div>

        {/* ── INTERACTIVE WEBGIS MAP ── */}
        <div style={{ marginBottom: '3rem' }}>
          <WebGISMap />
        </div>

        {/* ── BOTTOM INFO CARDS (Cara Menggunakan & Catatan) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Cara Menggunakan */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              background: 'rgba(16, 185, 129, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#10b98122',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                <i className="ph-bold ph-info"></i>
              </span>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--clr-text-primary)' }}>
                Cara Menggunakan Peta
              </h3>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--clr-text-secondary)' }}>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--clr-primary-light)', fontWeight: 'bold' }}>1.</span>
                <span><strong>Filter Layer:</strong> Centang/hilangkan centang pada panel samping untuk menampilkan batas wilayah, dusun, atau kelompok fasilitas.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--clr-primary-light)', fontWeight: 'bold' }}>2.</span>
                <span><strong>Informasi Pin:</strong> Klik pada pin fasilitas di peta untuk melihat nama, deskripsi, alamat, dan tombol rute Google Maps.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--clr-primary-light)', fontWeight: 'bold' }}>3.</span>
                <span><strong>Ubah Tampilan:</strong> Pilih mode <em>Satelit</em>, <em>Jalan</em>, atau <em>Dark</em> di pojok atas, serta gunakan <em>Buka Layar Penuh</em> untuk pengalaman maksimal.</span>
              </li>
            </ul>
          </div>

          {/* Catatan & Referensi BIG */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              background: 'rgba(245, 158, 11, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#f59e0b22',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                <i className="ph-bold ph-newspaper-clipping"></i>
              </span>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--clr-text-primary)' }}>
                Catatan & Sumber Data
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--clr-text-secondary)', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
              Peta ini disusun pada tahun 2026 melalui survei lapangan dan pengolahan data Sistem Informasi Geografis (ArcGIS/QGIS) oleh Kelompok KKN Desa Negeri Pandan Universitas Lampung. Batas administrasi desa mengacu pada data referensi Badan Informasi Geospasial (BIG).
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href="/documents/KKN.pdf"
                download="Peta-Desa-Negeri-Pandan-ArcGIS.pdf"
                className="btn btn-outline"
                style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              >
                <i className="ph-bold ph-file-pdf"></i> Unduh File Peta Cetak (PDF)
              </a>
              <Link
                href="/profil"
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              >
                Lihat Profil Desa →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
