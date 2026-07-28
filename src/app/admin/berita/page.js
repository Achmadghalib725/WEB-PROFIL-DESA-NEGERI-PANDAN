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
    const itemToDelete = berita.find(item => item.id === id);
    
    // Hapus data dari tabel
    const { error } = await supabase.from('berita').delete().eq('id', id);
    
    // Jika berhasil dihapus dan ada gambar, hapus juga dari storage
    if (!error && itemToDelete && itemToDelete.image_url) {
      try {
        const urlParts = itemToDelete.image_url.split('/assets/');
        if (urlParts.length === 2) {
          const path = urlParts[1];
          await supabase.storage.from('assets').remove([path]);
        }
      } catch (e) {
        console.error('Error deleting image from storage:', e);
      }
    }
    
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
      editBasePath="/admin/berita/edit"
    />
  );
}
