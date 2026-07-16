'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/admin/DataTable';

export default function AdminPotensi() {
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
      .from('potensi')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      if (error.code === '42P01') {
        setErrorMsg('Tabel "potensi" belum ada di database Supabase Anda. Silakan buat tabel dengan kolom: id, title, description, image_url, category, created_at.');
      } else {
        setErrorMsg(error.message);
      }
    } else if (result) {
      setData(result);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    await supabase.from('potensi').delete().eq('id', id);
    fetchData();
  }

  const columns = [
    { key: 'title', label: 'Nama Potensi' },
    { key: 'category', label: 'Kategori' },
    { 
      key: 'created_at', 
      label: 'Tanggal Ditambahkan',
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
      title="Manajemen Potensi Desa (UMKM)"
      addAction={{ label: '+ Tambah Potensi', href: '/admin/potensi/tambah' }}
      columns={columns}
      data={data}
      loading={loading}
      onDelete={handleDelete}
      editBasePath="/admin/potensi/edit"
    />
  );
}
