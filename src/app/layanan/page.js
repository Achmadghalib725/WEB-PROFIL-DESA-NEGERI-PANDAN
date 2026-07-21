'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { createClient } from '@/utils/supabase/client';

export default function LayananPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useScrollReveal([services, loading]);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('pengaturan_halaman')
        .select('value')
        .eq('id', 'layanan_publik_data')
        .single();
      
      if (!error && data?.value) {
        try {
          const arr = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          if (Array.isArray(arr)) {
            setServices(arr);
          }
        } catch(e) {}
      }
      setLoading(false);
    }
    fetchServices();
  }, [supabase]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span className="separator">/</span>
            <span>Layanan Publik</span>
          </div>
          <div className="section-label">Pusat Pelayanan</div>
          <h1 className="section-title" style={{ marginTop: '0.5rem' }}>
            Layanan <span className="accent">Publik</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '18px', marginTop: '10px' }}>
            Informasi layanan administrasi dan publik untuk mempermudah kebutuhan
            masyarakat Desa Negeri Pandan.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-text-muted)' }}>Memuat layanan...</div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-text-muted)' }}>Belum ada data layanan publik.</div>
          ) : (
            <div className="accordion-container reveal">
              {services.map((service, index) => {
                const isOpen = openIndex === index;
                const reqArray = service.requirements ? service.requirements.split('\n').filter(Boolean) : [];
                const procArray = service.procedures ? service.procedures.split('\n').filter(Boolean) : [];
                
                return (
                  <div 
                    key={index} 
                    className={`glass-card ${isOpen ? 'accordion-open' : ''}`}
                    style={{ marginBottom: '16px', padding: '0', overflow: 'hidden', transition: 'var(--transition)' }}
                  >
                    <button 
                      onClick={() => toggleAccordion(index)}
                      style={{
                        width: '100%',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--clr-text)',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="service-icon" style={{ 
                          marginBottom: 0, 
                          padding: '12px', 
                          flexShrink: 0, 
                          borderRadius: '12px', 
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          <i className={`ph-bold ${service.icon || 'ph-file-text'}`} style={{ color: 'var(--clr-primary-light)' }}></i>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>{service.title}</h3>
                      </div>
                      <i 
                        className="ph-bold ph-caret-down" 
                        style={{ 
                          fontSize: '20px', 
                          transition: 'transform 0.3s ease',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      ></i>
                    </button>

                    <div 
                      style={{
                        maxHeight: isOpen ? '1000px' : '0',
                        opacity: isOpen ? 1 : 0,
                        transition: 'all 0.3s ease-in-out',
                        padding: isOpen ? '0 24px 24px 24px' : '0 24px',
                      }}
                    >
                      <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        
                        {/* Persyaratan */}
                        <div>
                          <h4 style={{ color: 'var(--clr-primary-light)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ph-bold ph-folder"></i> Syarat Berkas yang Dibutuhkan
                          </h4>
                          <ul style={{ paddingLeft: '24px', color: 'var(--clr-text-dim)', lineHeight: '1.6' }}>
                            {reqArray.map((req, i) => (
                              <li key={i} style={{ marginBottom: '8px' }}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Tata Cara */}
                        <div>
                          <h4 style={{ color: 'var(--clr-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ph-bold ph-steps"></i> Tata Cara Pengajuan
                          </h4>
                          <ol style={{ paddingLeft: '24px', color: 'var(--clr-text-dim)', lineHeight: '1.6' }}>
                            {procArray.map((proc, i) => (
                              <li key={i} style={{ marginBottom: '8px' }}>{proc}</li>
                            ))}
                          </ol>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
