'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function BeritaPage() {
  const [berita, setBerita] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useScrollReveal([berita, categories, selectedCategory]);

  useEffect(() => {
    async function fetchData() {
      // Fetch berita
      const { data: beritaData } = await supabase
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (beritaData) setBerita(beritaData);

      // Fetch categories
      const { data: catData } = await supabase.from('pengaturan_halaman').select('value').eq('id', 'kategori_berita').maybeSingle();
      if (catData?.value) {
        try {
          const parsed = typeof catData.value === 'string' ? JSON.parse(catData.value) : catData.value;
          if (Array.isArray(parsed)) {
            setCategories(parsed);
          }
        } catch(e) {}
      }

      setLoading(false);
    }
    fetchData();
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

        {/* Filter Kategori */}
        {!loading && categories.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }} className="reveal">
            <button 
              onClick={() => setSelectedCategory('Semua')}
              className={selectedCategory === 'Semua' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '50px', border: selectedCategory !== 'Semua' ? '1px solid var(--clr-border)' : 'none', color: selectedCategory !== 'Semua' ? 'var(--clr-text)' : '#fff' }}
            >
              Semua
            </button>
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '50px', border: selectedCategory !== cat ? '1px solid var(--clr-border)' : 'none', color: selectedCategory !== cat ? 'var(--clr-text)' : '#fff' }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-muted" style={{ textAlign: 'center' }}>Memuat berita...</p>
        ) : berita.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center' }}>Belum ada berita untuk saat ini.</p>
        ) : (
          <>
            {berita.filter(item => selectedCategory === 'Semua' || item.kategori === selectedCategory).length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center' }}>Tidak ada berita untuk kategori ini.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {berita.filter(item => selectedCategory === 'Semua' || item.kategori === selectedCategory).map((item) => (
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
                        <Image 
                          src={item.image_url} 
                          alt={item.title} 
                          width={400}
                          height={200}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div style={{ width: '100%', height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="text-muted">Tidak ada gambar</span>
                        </div>
                      )}
                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>
                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          {item.kategori && (
                            <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', backgroundColor: 'var(--clr-primary)', color: '#fff', borderRadius: '4px', textTransform: 'uppercase' }}>
                              {item.kategori}
                            </span>
                          )}
                        </div>
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
          </>
        )}
      </div>
    </div>
  );
}
