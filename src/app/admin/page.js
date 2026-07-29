'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ berita: 0, layanan: 0 });
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  async function fetchStats() {
    // Fetch counts for dashboard stats
    const [
      { count: beritaCount },
      layananResponse
    ] = await Promise.all([
      supabase.from('berita').select('*', { count: 'exact', head: true }),
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
      layanan: layananCount
    });
  }

  async function fetchHistory() {
    setLoadingHistory(true);
    try {
      const [beritaRes, pengaturanRes] = await Promise.all([
        supabase.from('berita').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('pengaturan_halaman').select('id, updated_at').order('updated_at', { ascending: false }).limit(5)
      ]);

      const activities = [];
      if (beritaRes.data) {
        beritaRes.data.forEach(b => {
          activities.push({
            id: `berita-${b.id}`,
            title: `Berita ditambahkan: "${b.title}"`,
            date: new Date(b.created_at),
            type: 'berita',
            icon: 'ph-newspaper'
          });
        });
      }
      
      if (pengaturanRes.data) {
        pengaturanRes.data.forEach(p => {
          let title = '';
          let icon = 'ph-gear';
          if (p.id === 'layanan_publik_data') {
            title = 'Data Layanan Publik diperbarui';
            icon = 'ph-users';
          } else if (p.id === 'struktur_organisasi') {
            title = 'Struktur Pemerintahan diperbarui';
            icon = 'ph-users-three';
          } else if (p.id === 'statistik_desa') {
            title = 'Data Statistik Desa diperbarui';
            icon = 'ph-chart-bar';
          } else if (p.id === 'kategori_berita') {
            title = 'Kategori Berita diperbarui';
            icon = 'ph-list';
          } else if (p.id === 'kontak_desa') {
            title = 'Informasi Kontak Desa diperbarui';
            icon = 'ph-phone';
          } else {
            title = `Pengaturan "${p.id}" diperbarui`;
          }

          if (p.updated_at) {
            activities.push({
              id: `pengaturan-${p.id}`,
              title,
              date: new Date(p.updated_at),
              type: 'pengaturan',
              icon
            });
          }
        });
      }

      activities.sort((a, b) => b.date - a.date);
      setHistory(activities.slice(0, 5));
    } catch (e) {
      console.error('Error fetching history:', e);
    }
    setLoadingHistory(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--clr-text)' }}>Dashboard Admin</h1>
      
      {/* Kartu Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: 'var(--clr-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Berita / Artikel</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--clr-text)' }}>{stats.berita}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: 'var(--clr-text-muted)', fontSize: '14px', marginBottom: '8px' }}>Layanan Publik</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--clr-text)' }}>{stats.layanan}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--clr-text)' }}>Akses Cepat</h2>
        <div className="admin-dashboard-actions" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/admin/berita/tambah" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', justifyContent: 'center' }}>
            <i className="ph-bold ph-plus"></i> Tambah Berita
          </Link>
          <Link href="/admin/statistik" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)', justifyContent: 'center' }}>
            <i className="ph-bold ph-chart-bar"></i> Edit Statistik
          </Link>
        </div>
      </div>

      {/* Riwayat Perubahan */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--clr-text)' }}>Riwayat Perubahan Terakhir</h2>
        <div className="glass-card" style={{ padding: '0', borderRadius: '12px', overflow: 'hidden' }}>
          {loadingHistory ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--clr-text-muted)' }}>Memuat riwayat...</div>
          ) : history.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--clr-text-muted)' }}>Belum ada riwayat aktivitas.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {history.map((item, idx) => (
                <li key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px', 
                  padding: '20px', 
                  borderBottom: idx < history.length - 1 ? '1px solid var(--clr-border)' : 'none' 
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                    color: 'var(--clr-primary-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    <i className={`ph-bold ${item.icon}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--clr-text)', marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--clr-text-muted)' }}>
                      {item.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
