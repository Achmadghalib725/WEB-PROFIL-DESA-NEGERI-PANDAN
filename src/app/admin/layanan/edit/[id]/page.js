'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';
import { useParams } from 'next/navigation';

export default function EditLayanan() {
  const { id } = useParams();
  const supabase = createClient();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('pengaturan_halaman')
        .select('value')
        .eq('id', 'layanan_publik_data')
        .single();
      
      if (!error && data?.value) {
        try {
          const arr = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          if (Array.isArray(arr)) {
            const item = arr.find(x => x.id === id);
            if (item) setInitialData(item);
          }
        } catch(e) {}
      }
      setLoading(false);
    }
    fetchData();
  }, [id, supabase]);

  if (loading) return <div style={{ padding: '20px', color: 'white' }}>Memuat data...</div>;
  if (!initialData) return <div style={{ padding: '20px', color: 'white' }}>Layanan tidak ditemukan!</div>;

  const fields = [
    { name: 'title', label: 'Judul Layanan', type: 'text', required: true, defaultValue: initialData.title },
    { 
      name: 'icon', 
      label: 'Jenis Ikon Layanan', 
      type: 'select', 
      required: true, 
      defaultValue: initialData.icon,
      options: [
        { label: 'Dokumen / Surat Menyurat', value: 'ph-file-text' },
        { label: 'Sertifikat / Perizinan Usaha', value: 'ph-certificate' },
        { label: 'Kependudukan / Domisili', value: 'ph-house-line' },
        { label: 'Bantuan Sosial / Kesra', value: 'ph-handshake' },
        { label: 'Pendidikan / Sekolah', value: 'ph-graduation-cap' },
        { label: 'Kesehatan / Medis', value: 'ph-first-aid' },
        { label: 'Lainnya (Umum)', value: 'ph-folder-open' }
      ]
    },
    { name: 'requirements', label: 'Syarat Berkas (Satu per baris)', type: 'textarea', required: true, rows: 5, defaultValue: initialData.requirements },
    { name: 'procedures', label: 'Tata Cara (Satu per baris)', type: 'textarea', required: true, rows: 5, defaultValue: initialData.procedures }
  ];

  const handleSubmit = async (formData) => {
    // 1. Ambil data lama
    const { data: existingData } = await supabase
      .from('pengaturan_halaman')
      .select('value')
      .eq('id', 'layanan_publik_data')
      .single();

    let layananArray = [];
    if (existingData?.value) {
      try {
        layananArray = typeof existingData.value === 'string' ? JSON.parse(existingData.value) : existingData.value;
      } catch (e) {}
    }

    // 2. Update item
    const index = layananArray.findIndex(x => x.id === id);
    if (index !== -1) {
      layananArray[index] = {
        ...layananArray[index],
        title: formData.title,
        icon: formData.icon,
        requirements: formData.requirements,
        procedures: formData.procedures,
      };

      // 3. Simpan kembali
      const { error: saveError } = await supabase
        .from('pengaturan_halaman')
        .upsert({ 
          id: 'layanan_publik_data', 
          value: JSON.stringify(layananArray),
          updated_at: new Date()
        });

      if (saveError) throw saveError;
    } else {
      throw new Error('Data tidak ditemukan saat menyimpan.');
    }
  };

  return (
    <AdminForm 
      title="Edit Daftar Layanan Publik"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Simpan Perubahan"
      cancelHref="/admin/layanan"
    />
  );
}
