'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function DetailBerita() {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      const { data } = await supabase
        .from('berita')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setBerita(data);
      setLoading(false);
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '150px 20px', textAlign: 'center', minHeight: '80vh' }}>Memuat berita...</div>;
  }

  if (!berita) {
    return (
      <div style={{ padding: '150px 20px', textAlign: 'center', minHeight: '80vh' }}>
        <h2>Berita tidak ditemukan</h2>
        <Link href="/berita" style={{ color: '#10b981', textDecoration: 'underline', marginTop: '10px', display: 'inline-block' }}>
          Kembali ke daftar berita
        </Link>
      </div>
    );
  }

  return (
    <div className="section" style={{ paddingTop: '150px', minHeight: '80vh', position: 'relative' }}>
      <div className="orb orb-green" style={{ width: '400px', height: '400px', top: '0', right: '-150px', opacity: 0.3 }}></div>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        <Link href="/berita" className="text-muted" style={{ textDecoration: 'none', marginBottom: '20px', display: 'inline-block', transition: 'color 0.2s' }}>
          ← Kembali ke Berita
        </Link>

        <div className="glass-card" style={{ padding: 0, borderRadius: '16px', overflow: 'hidden', marginBottom: '60px' }}>
          {berita.image_url && (
            <img 
              src={berita.image_url} 
              alt={berita.title} 
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
            />
          )}
          
          <div style={{ padding: '40px' }}>
            <p style={{ color: 'var(--primary-color, #10b981)', fontWeight: '500', marginBottom: '10px' }}>
              {new Date(berita.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-light, #f8fafc)', marginBottom: '30px', lineHeight: '1.4' }}>
              {berita.title}
            </h1>
            
            <div style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {berita.content}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
