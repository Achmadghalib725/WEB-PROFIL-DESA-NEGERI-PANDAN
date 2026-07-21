'use client';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';

export default function TambahLayanan() {
  const supabase = createClient();

  const fields = [
    { name: 'title', label: 'Judul Layanan', type: 'text', required: true, placeholder: 'Misal: Pembuatan KTP' },
    { 
      name: 'icon', 
      label: 'Jenis Ikon Layanan', 
      type: 'select', 
      required: true, 
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
    { name: 'requirements', label: 'Syarat Berkas (Satu per baris)', type: 'textarea', required: true, rows: 5, placeholder: '1. Fotokopi KK\n2. Surat Pengantar RT/RW' },
    { name: 'procedures', label: 'Tata Cara (Satu per baris)', type: 'textarea', required: true, rows: 5, placeholder: '1. Datang ke Balai Desa\n2. Ambil nomor antrean' }
  ];

  const handleSubmit = async (formData) => {
    // 1. Ambil data lama
    const { data: existingData, error: fetchError } = await supabase
      .from('pengaturan_halaman')
      .select('value')
      .eq('id', 'layanan_publik_data')
      .single();

    let layananArray = [];
    if (!fetchError && existingData?.value) {
      try {
        layananArray = typeof existingData.value === 'string' ? JSON.parse(existingData.value) : existingData.value;
        if (!Array.isArray(layananArray)) layananArray = [];
      } catch (e) {
        layananArray = [];
      }
    }

    // 2. Tambah data baru
    const newItem = {
      id: Date.now().toString(),
      title: formData.title,
      icon: formData.icon,
      requirements: formData.requirements,
      procedures: formData.procedures,
      created_at: new Date().toISOString()
    };
    
    layananArray.push(newItem);

    // 3. Simpan kembali
    const { error: saveError } = await supabase
      .from('pengaturan_halaman')
      .upsert({ 
        id: 'layanan_publik_data', 
        value: JSON.stringify(layananArray),
        updated_at: new Date()
      });

    if (saveError) throw saveError;
  };

  return (
    <AdminForm 
      title="Tambah Daftar Layanan Publik"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Simpan Layanan"
      cancelHref="/admin/layanan"
    />
  );
}
