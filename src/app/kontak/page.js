'use client';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import ContactForm from '@/components/ContactForm';

export default function KontakPage() {
  useScrollReveal();

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="separator">/</span>
            <span>Kontak</span>
          </div>
          <div className="section-label">Pusat Bantuan</div>
          <h1 className="section-title" style={{ marginTop: '0.5rem' }}>
            Hubungi <span className="accent">Kami</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '18px', marginTop: '10px' }}>
            Punya pertanyaan, saran, atau keperluan administrasi? Silakan hubungi
            kami melalui formulir di bawah ini atau kunjungi Balai Desa.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="glass-card reveal">
              <h3 style={{ marginBottom: '1.5rem', fontSize: 'var(--fs-h3)' }}>
                Kirim Pesan
              </h3>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="reveal reveal-delay-1">
              <h3 style={{ marginBottom: '1.5rem', fontSize: 'var(--fs-h3)' }}>
                Informasi Kontak
              </h3>
              <div className="contact-info-cards">
                <div className="glass-card contact-info-card">
                  <div className="info-icon">
                    <i className="ph-bold ph-map-pin"></i>
                  </div>
                  <div>
                    <h4>Alamat Balai Desa</h4>
                    <p>
                      JL. Kedaton,RT.05/RW.03, Negeri Pandan
                      <br />
                      Kec. Kalianda, Kabupaten Lampung Selatan, Lampung 35551
                    </p>
                  </div>
                </div>
                <div className="glass-card contact-info-card">
                  <div className="info-icon">
                    <i className="ph-bold ph-phone"></i>
                  </div>
                  <div>
                    <h4>Telepon / WhatsApp</h4>
                    <p>
                      WA Center: 0831-4715-8593
                    </p>
                  </div>
                </div>
                <div className="glass-card contact-info-card">
                  <div className="info-icon">
                    <i className="ph-bold ph-envelope"></i>
                  </div>
                  <div>
                    <h4>Email Resmi</h4>
                    <p>
                      desanegeripandan12@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="map-container">
                <iframe
                  src="https://maps.google.com/maps?q=7JCJ%2BF3X,+Negeri+Pandan,+Kec.+Kalianda,+Kabupaten+Lampung+Selatan&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Desa Negeri Pandan"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
