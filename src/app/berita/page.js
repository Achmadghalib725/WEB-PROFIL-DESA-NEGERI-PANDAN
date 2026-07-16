'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function BeritaPage() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollReveal([berita]);

  useEffect(() => {
    async function fetchBerita() {
      const { data } = await supabase
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setBerita(data);
      setLoading(false);
    }
    fetchBerita();
  }, []);

  return (
    <div className="section" style={{ paddingTop: '150px', minHeight: '80vh', position: 'relative' }}>
      <div className="orb orb-green" style={{ width: '500px', height: '500px', top: '-100px', left: '-200px', opacity: 0.4 }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Berita Terkini</div>
          <h1 className="section-title">Berita <span className="accent">Desa</span></h1>
          <p className="text-muted" style={{ fontSize: '18px', marginTop: '10px' }}>Informasi dan kabar terbaru seputar Desa Negeri Pandan</p>
        </div>

        {loading ? (
          <p className="text-muted" style={{ textAlign: 'center' }}>Memuat berita...</p>
        ) : berita.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center' }}>Belum ada berita untuk saat ini.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {berita.map((item) => (
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
                    <span style={{ color: 'var(--primary-color, #10b981)', fontWeight: '500', fontSize: '14px', marginTop: '15px', display: 'inline-block' }}>
                      Baca selengkapnya →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
