'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function RiwayatAdminPage() {
  const supabase = createClient();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

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

      setHistory(logs); // Simpan semua riwayat tanpa dibatasi
    } catch (e) {
      console.error('Error fetching history:', e);
    }
    setLoadingHistory(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--clr-surface)', color: 'var(--clr-text)', textDecoration: 'none', transition: 'background-color 0.2s' }}>
          <i className="ph-bold ph-arrow-left"></i>
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--clr-text)' }}>Semua Riwayat Aktivitas</h1>
      </div>

      <div className="glass-card" style={{ padding: '0', borderRadius: '12px', overflow: 'hidden' }}>
        {loadingHistory ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--clr-text-muted)' }}>
            <i className="ph ph-spinner-gap" style={{ animation: 'spin 1s linear infinite', fontSize: '24px', marginBottom: '10px', display: 'inline-block' }}></i>
            <br />
            Memuat seluruh riwayat...
          </div>
        ) : history.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--clr-text-muted)' }}>Belum ada riwayat aktivitas.</div>
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
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  <i className={`ph-bold ${item.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--clr-text)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
