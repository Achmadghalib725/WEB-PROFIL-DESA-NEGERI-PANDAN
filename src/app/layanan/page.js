'use client';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function LayananPage() {
  useScrollReveal();

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="separator">/</span>
            <span>Layanan Publik</span>
          </div>
          <h1>
            Layanan <span className="accent">Publik</span>
          </h1>
          <p>
            Informasi layanan administrasi dan publik untuk mempermudah kebutuhan
            masyarakat Desa Negeri Pandan.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="services-grid">
            <div className="glass-card service-card reveal">
              <div className="service-icon">
                <i className="ph-bold ph-file-text"></i>
              </div>
              <div>
                <h3>Administrasi Kependudukan</h3>
                <p>
                  Layanan pembuatan KTP, Kartu Keluarga, Akta Kelahiran, dan surat
                  keterangan domisili.
                </p>
              </div>
            </div>

            <div className="glass-card service-card reveal reveal-delay-1">
              <div className="service-icon">
                <i className="ph-bold ph-hospital"></i>
              </div>
              <div>
                <h3>Layanan Kesehatan</h3>
                <p>
                  Informasi jadwal Posyandu, program kesehatan desa, dan rujukan ke
                  Puskesmas.
                </p>
              </div>
            </div>

            <div className="glass-card service-card reveal reveal-delay-2">
              <div className="service-icon">
                <i className="ph-bold ph-certificate"></i>
              </div>
              <div>
                <h3>Surat Keterangan Usaha</h3>
                <p>
                  Pembuatan surat keterangan untuk keperluan izin usaha dan
                  pengajuan bantuan modal UMKM.
                </p>
              </div>
            </div>

            <div className="glass-card service-card reveal">
              <div className="service-icon">
                <i className="ph-bold ph-plant"></i>
              </div>
              <div>
                <h3>Penyuluhan Pertanian</h3>
                <p>
                  Layanan konsultasi dan informasi bantuan bibit/pupuk bagi kelompok
                  tani desa.
                </p>
              </div>
            </div>

            <div className="glass-card service-card reveal reveal-delay-1">
              <div className="service-icon">
                <i className="ph-bold ph-crane"></i>
              </div>
              <div>
                <h3>Pengaduan Infrastruktur</h3>
                <p>
                  Layanan pelaporan kerusakan fasilitas umum, jalan desa, atau
                  saluran irigasi.
                </p>
              </div>
            </div>

            <div className="glass-card service-card reveal reveal-delay-2">
              <div className="service-icon">
                <i className="ph-bold ph-handshake"></i>
              </div>
              <div>
                <h3>Bantuan Sosial</h3>
                <p>
                  Pendataan dan informasi penyaluran program bantuan sosial dari
                  pemerintah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="cta-banner reveal">
            <h2>Butuh Layanan Lainnya?</h2>
            <p>
              Datang langsung ke Balai Desa Negeri Pandan pada jam operasional
              kerja (Senin - Jumat, 08:00 - 15:00 WIB).
            </p>
            <Link href="/kontak" className="btn btn-primary">
              Hubungi Kami →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
