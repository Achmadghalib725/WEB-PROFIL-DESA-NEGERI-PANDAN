'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';

export default function EditLayanan() {
  const { id } = useParams();
  const supabase = createClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const { data: result } = await supabase
        .from('layanan')
        .select('*')
        .eq('id', id)
        .single();
        
      if (result) setData(result);
      setLoading(false);
    }
    fetchData();
  }, [id, supabase]);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--clr-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="ph ph-spinner-gap" style={{ animation: 'spin 1s linear infinite' }}></i>
        Memuat data...
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
      </div>
    );
  }
  
  if (!data) {
    return <div style={{ padding: '40px', color: 'var(--clr-text)' }}>Data tidak ditemukan.</div>;
  }

  const fields = [
    { name: 'name', label: 'Nama Lengkap Pemohon', type: 'text', required: true, defaultValue: data.name },
    { name: 'nik', label: 'Nomor Induk Kependudukan (NIK)', type: 'text', required: true, defaultValue: data.nik },
    { 
      name: 'service_type', 
      label: 'Jenis Surat / Layanan', 
      type: 'select', 
      required: true, 
      defaultValue: data.service_type,
      options: [
        { value: 'Surat Keterangan Usaha (SKU)', label: 'Surat Keterangan Usaha (SKU)' },
        { value: 'Surat Keterangan Domisili', label: 'Surat Keterangan Domisili' },
        { value: 'Surat Pengantar SKCK', label: 'Surat Pengantar SKCK' },
        { value: 'Surat Keterangan Tidak Mampu (SKTM)', label: 'Surat Keterangan Tidak Mampu (SKTM)' },
        { value: 'Lainnya', label: 'Lainnya' }
      ]
    },
    { 
      name: 'status', 
      label: 'Status Permintaan', 
      type: 'select', 
      required: true, 
      defaultValue: data.status,
      options: [
        { value: 'Menunggu', label: 'Menunggu / Diproses' },
        { value: 'Selesai', label: 'Selesai / Siap Diambil' }
      ]
    },
    { name: 'description', label: 'Keterangan / Keperluan (Opsional)', type: 'textarea', required: false, rows: 4, defaultValue: data.description }
  ];

  const handleSubmit = async (formData) => {
    const { error: updateError } = await supabase
      .from('layanan')
      .update({ 
        name: formData.name, 
        nik: formData.nik,
        service_type: formData.service_type,
        status: formData.status,
        description: formData.description
      })
      .eq('id', id);

    if (updateError) throw updateError;
  };

  return (
    <AdminForm 
      title="Edit Permintaan Layanan"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Update Status Layanan"
      cancelHref="/admin/layanan"
    />
  );
}
