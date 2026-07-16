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
          <h1>
            Hubungi <span className="accent">Kami</span>
          </h1>
          <p>
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
                      Jl. Utama Desa No. 1, Kecamatan Kedamaian,
                      <br />
                      Kabupaten Makmur, Kode Pos 12345
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
                      Kantor: (0631) 123-4567
                      <br />
                      WA Center: 0812-3456-7890
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
                      info@negeripandan.desa.id
                      <br />
                      pelayanan@negeripandan.desa.id
                    </p>
                  </div>
                </div>
              </div>

              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.57311654129782!3d-6.903444341687889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
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
