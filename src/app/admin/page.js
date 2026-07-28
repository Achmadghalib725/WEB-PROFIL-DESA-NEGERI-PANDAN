'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ berita: 0, potensi: 0, layanan: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    // Fetch counts for dashboard stats
    const [
      { count: beritaCount },
      { count: potensiCount },
      layananResponse
    ] = await Promise.all([
      supabase.from('berita').select('*', { count: 'exact', head: true }),
      supabase.from('potensi').select('*', { count: 'exact', head: true }),
      supabase.from('pengaturan_halaman').select('value').eq('id', 'layanan_publik_data').single()
    ]);

    let layananCount = 0;
    if (layananResponse.data?.value) {
      try {
        const arr = typeof layananResponse.data.value === 'string' ? JSON.parse(layananResponse.data.value) : layananResponse.data.value;
        if (Array.isArray(arr)) {
          layananCount = arr.length;
        }
      } catch(e) {}
    }

    setStats({
      berita: beritaCount || 0,
      potensi: potensiCount || 0,
      layanan: layananCount
    });
  }



  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-light, #f8fafc)' }}>Dashboard Admin</h1>
      
      {/* Kartu Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: 'var(--clr-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Berita / Artikel</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-light, #f8fafc)' }}>{stats.berita}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ color: 'var(--clr-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Potensi (UMKM)</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-light, #f8fafc)' }}>{stats.potensi}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: 'var(--clr-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Layanan Publik</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-light, #f8fafc)' }}>{stats.layanan}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-light, #f8fafc)' }}>Akses Cepat</h2>
        <div className="admin-dashboard-actions" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/admin/berita/tambah" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', justifyContent: 'center' }}>
            <i className="ph-bold ph-plus"></i> Tambah Berita
          </Link>
          <Link href="/admin/potensi/tambah" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)', justifyContent: 'center' }}>
            <i className="ph-bold ph-plus"></i> Tambah UMKM
          </Link>
          <Link href="/admin/statistik" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)', justifyContent: 'center' }}>
            <i className="ph-bold ph-chart-bar"></i> Edit Statistik
          </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .admin-dashboard-actions {
            flex-direction: column;
          }
          .admin-dashboard-actions > a {
            width: 100%;
          }
        }
      `}} />


    </div>
  );
}
