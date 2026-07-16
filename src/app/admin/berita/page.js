'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/admin/DataTable';

export default function AdminBerita() {
  const supabase = createClient();
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBerita();
  }, []);

  async function fetchBerita() {
    setLoading(true);
    const { data } = await supabase
      .from('berita')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setBerita(data);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    await supabase.from('berita').delete().eq('id', id);
    fetchBerita();
  }

  const columns = [
    { key: 'title', label: 'Judul Berita' },
    { 
      key: 'created_at', 
      label: 'Tanggal Ditambahkan',
      render: (item) => new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  ];

  return (
    <DataTable 
      title="Manajemen Berita"
      addAction={{ label: '+ Tambah Berita', href: '/admin/berita/tambah' }}
      columns={columns}
      data={berita}
      loading={loading}
      onDelete={handleDelete}
    />
  );
}
