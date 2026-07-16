'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/admin/DataTable';

export default function AdminLayanan() {
  const supabase = createClient();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: result, error } = await supabase
      .from('layanan')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      if (error.code === '42P01') {
        setErrorMsg('Tabel "layanan" belum ada di database Supabase Anda. Silakan buat tabel dengan kolom: id, name, nik, service_type, description, status, created_at.');
      } else {
        setErrorMsg(error.message);
      }
    } else if (result) {
      setData(result);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data layanan ini?')) return;
    await supabase.from('layanan').delete().eq('id', id);
    fetchData();
  }

  const columns = [
    { key: 'name', label: 'Nama Pemohon' },
    { key: 'service_type', label: 'Jenis Layanan' },
    { 
      key: 'status', 
      label: 'Status',
      render: (item) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: item.status === 'Selesai' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
          color: item.status === 'Selesai' ? '#34d399' : '#fbbf24'
        }}>
          {item.status || 'Menunggu'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Tanggal',
      render: (item) => new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  ];

  if (errorMsg) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px' }}>
        <strong>Error:</strong> {errorMsg}
      </div>
    );
  }

  return (
    <DataTable 
      title="Permintaan Layanan Publik"
      addAction={{ label: '+ Tambah Permintaan (Manual)', href: '/admin/layanan/tambah' }}
      columns={columns}
      data={data}
      loading={loading}
      onDelete={handleDelete}
    />
  );
}
