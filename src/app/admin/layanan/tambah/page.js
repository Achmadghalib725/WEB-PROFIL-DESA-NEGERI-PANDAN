'use client';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';

export default function TambahLayanan() {
  const supabase = createClient();

  const fields = [
    { name: 'name', label: 'Nama Pemohon', type: 'text', required: true, placeholder: 'Misal: Budi Santoso' },
    { name: 'nik', label: 'NIK Pemohon', type: 'text', required: true, placeholder: 'Ketik NIK 16 digit' },
    { name: 'service_type', label: 'Jenis Layanan', type: 'select', required: true, options: [
      { label: 'Surat Pengantar KTP', value: 'Surat Pengantar KTP' },
      { label: 'Surat Keterangan Usaha', value: 'Surat Keterangan Usaha' },
      { label: 'Surat Pindah', value: 'Surat Pindah' },
      { label: 'Lainnya', value: 'Lainnya' }
    ]},
    { name: 'status', label: 'Status', type: 'select', required: true, defaultValue: 'Menunggu', options: [
      { label: 'Menunggu Diproses', value: 'Menunggu' },
      { label: 'Sedang Diproses', value: 'Diproses' },
      { label: 'Selesai', value: 'Selesai' }
    ]},
    { name: 'description', label: 'Keperluan / Keterangan', type: 'textarea', required: true, rows: 4, placeholder: 'Detail keperluan surat...' }
  ];

  const handleSubmit = async (formData) => {
    // Insert ke tabel layanan
    const { error } = await supabase
      .from('layanan')
      .insert([
        { 
          name: formData.name, 
          nik: formData.nik,
          service_type: formData.service_type,
          status: formData.status,
          description: formData.description
        }
      ]);

    if (error) throw error;
  };

  return (
    <AdminForm 
      title="Input Permintaan Layanan (Manual)"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Simpan Layanan"
      cancelHref="/admin/layanan"
    />
  );
}
