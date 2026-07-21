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
      .from('pengaturan_halaman')
      .select('value')
      .eq('id', 'layanan_publik_data')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      setErrorMsg(error.message);
    } else if (result && result.value) {
      try {
        let parsed = typeof result.value === 'string' ? JSON.parse(result.value) : result.value;
        setData(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setData([]);
      }
    } else {
      setData([]);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    const newData = data.filter(item => item.id !== id);
    
    const { error } = await supabase
      .from('pengaturan_halaman')
      .upsert({ 
        id: 'layanan_publik_data', 
        value: JSON.stringify(newData),
        updated_at: new Date()
      });
      
    if (!error) {
      setData(newData);
    } else {
      alert('Gagal menghapus data: ' + error.message);
    }
  }

  const columns = [
    { 
      key: 'icon', 
      label: 'Ikon',
      render: (item) => <i className={`ph-bold ${item.icon}`} style={{ fontSize: '24px', color: 'var(--clr-text-muted)' }}></i>
    },
    { key: 'title', label: 'Nama Layanan' },
    { 
      key: 'requirements', 
      label: 'Syarat',
      render: (item) => {
        const count = item.requirements ? item.requirements.split('\n').filter(Boolean).length : 0;
        return `${count} Syarat`;
      }
    },
    { 
      key: 'procedures', 
      label: 'Tata Cara',
      render: (item) => {
        const count = item.procedures ? item.procedures.split('\n').filter(Boolean).length : 0;
        return `${count} Langkah`;
      }
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
      title="Manajemen Layanan Publik (Syarat & Tata Cara)"
      addAction={{ label: '+ Tambah Layanan', href: '/admin/layanan/tambah' }}
      columns={columns}
      data={data}
      loading={loading}
      onDelete={handleDelete}
      editBasePath="/admin/layanan/edit"
    />
  );
}
