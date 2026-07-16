'use client';
import Link from 'next/link';
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
          <h1>
            Potensi <span className="accent">Unggulan</span>
          </h1>
          <p>
            Mengenal lebih dalam kekayaan sumber daya alam, pertanian, dan
            pariwisata yang menjadi pilar kebangkitan ekonomi Desa Negeri Pandan.
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
            <div className="potensi-image reveal">
              <img src="/images/agriculture.png" alt="Sektor Pertanian Desa" />
            </div>
            <div className="reveal reveal-delay-1">
              <div className="section-label">Sektor Utama</div>
              <h3>Pertanian &amp; Agrobisnis</h3>
              <p>
                Dengan luas lahan pertanian lebih dari 850 hektar, sektor pertanian
                menjadi tulang punggung perekonomian masyarakat Desa Negeri Pandan.
                Kesuburan tanah vulkanik dan irigasi pegunungan yang terjaga
                memungkinkan para petani memanen hasil bumi berkualitas tinggi.
              </p>
              <p>
                Produk unggulan desa meliputi padi organik, sayur-mayur segar, dan
                palawija. Saat ini, pemerintah desa sedang mengembangkan program
                hilirisasi produk pertanian agar memiliki nilai jual yang lebih
                tinggi di pasar.
              </p>
              <div className="tag-list" style={{ marginTop: '1.5rem' }}>
                <span className="tag">Padi Organik</span>
                <span className="tag">Sayur-mayur</span>
                <span className="tag">Palawija</span>
                <span className="tag">Pupuk Kompos</span>
              </div>
            </div>
          </div>

          <div className="section-divider" style={{ margin: '4rem 0' }}></div>

          {/* Potensi 2: Pariwisata */}
          <div className="potensi-detail reverse">
            <div className="potensi-image reveal">
              <img src="/images/tourism.png" alt="Sektor Pariwisata Desa" />
            </div>
            <div className="reveal reveal-delay-1">
              <div className="section-label">Pariwisata Alam</div>
              <h3>Ekowisata &amp; Pesona Alam</h3>
              <p>
                Dikelilingi oleh perbukitan yang hijau dan udara yang sejuk, Desa
                Negeri Pandan menyimpan potensi ekowisata yang luar biasa. Destinasi
                utama kami adalah Air Terjun Pandan Wangi dan area camping ground di
                kaki bukit.
              </p>
              <p>
                Konsep wisata yang diusung adalah ekowisata, di mana pengunjung tidak
                hanya menikmati keindahan alam, tetapi juga berinteraksi dengan
                kehidupan masyarakat desa, belajar bertani, dan menikmati kuliner
                tradisional.
              </p>
              <div className="tag-list" style={{ marginTop: '1.5rem' }}>
                <span className="tag">Air Terjun</span>
                <span className="tag">Camping Ground</span>
                <span className="tag">Tracking Hill</span>
                <span className="tag">Kuliner Desa</span>
              </div>
            </div>
          </div>

          <div className="section-divider" style={{ margin: '4rem 0' }}></div>

          {/* Potensi 3: UMKM */}
          <div className="potensi-detail">
            <div className="potensi-image reveal">
              <img src="/images/community.png" alt="UMKM dan Kerajinan Desa" />
            </div>
            <div className="reveal reveal-delay-1">
              <div className="section-label">Ekonomi Kreatif</div>
              <h3>UMKM &amp; Kerajinan Lokal</h3>
              <p>
                Selain bertani, masyarakat desa juga aktif dalam mengembangkan Usaha
                Mikro, Kecil, dan Menengah (UMKM). Kearifan lokal dan kreativitas
                warga menghasilkan berbagai produk kerajinan dan makanan olahan yang
                khas.
              </p>
              <p>
                Kerajinan anyaman pandan, batik tulis dengan pewarna alami, serta
                aneka keripik dan jajanan tradisional menjadi suvenir favorit bagi
                para wisatawan yang berkunjung ke desa kami.
              </p>
              <div className="tag-list" style={{ marginTop: '1.5rem' }}>
                <span className="tag">Anyaman Pandan</span>
                <span className="tag">Batik Tulis</span>
                <span className="tag">Keripik Sayur</span>
                <span className="tag">Oleh-oleh Khas</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
