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
      const { data } = await supabase.from('pengaturan_halaman').select('value').eq('id', 'activity_logs').single();
      
      let logs = [];
      if (data && data.value) {
        logs = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      }
      
      if (!Array.isArray(logs)) {
        logs = [];
      }
      
      // Ensure all dates are parsed correctly
      logs = logs.map(log => ({
        ...log,
        date: new Date(log.date)
      }));

      setHistory(logs.slice(0, 10)); // Tampilkan 10 aktivitas terbaru
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
                    backgroundColor: item.action === 'Tambah' ? 'rgba(16, 185, 129, 0.1)' : item.action === 'Hapus' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                    color: item.action === 'Tambah' ? '#10b981' : item.action === 'Hapus' ? '#ef4444' : '#3b82f6', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    <i className={`ph-bold ${item.icon}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--clr-text)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: item.action === 'Tambah' ? 'rgba(16, 185, 129, 0.15)' : item.action === 'Hapus' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: item.action === 'Tambah' ? '#10b981' : item.action === 'Hapus' ? '#ef4444' : '#3b82f6',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {item.action}
                      </span>
                      {item.target}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--clr-text-secondary)', marginBottom: '4px' }}>
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
