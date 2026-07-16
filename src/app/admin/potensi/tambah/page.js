'use client';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';

export default function TambahPotensi() {
  const supabase = createClient();

  const fields = [
    { name: 'title', label: 'Nama Potensi / UMKM', type: 'text', required: true, placeholder: 'Misal: Kripik Singkong Mang Jali' },
    { name: 'category', label: 'Kategori', type: 'select', required: true, options: [
      { label: 'UMKM', value: 'UMKM' },
      { label: 'Pertanian', value: 'Pertanian' },
      { label: 'Pariwisata', value: 'Pariwisata' },
      { label: 'Kesenian', value: 'Kesenian' }
    ]},
    { name: 'image', label: 'Gambar Potensi', type: 'file', required: false },
    { name: 'description', label: 'Deskripsi Singkat', type: 'textarea', required: true, rows: 6, placeholder: 'Jelaskan tentang potensi/UMKM ini...' }
  ];

  const handleSubmit = async (formData, fileData) => {
    let imageUrl = '';
    
    // Upload gambar jika ada
    if (fileData.image) {
      const file = fileData.image;
      const fileExt = file.name.split('.').pop();
      const fileName = `potensi-${Math.random()}.${fileExt}`;
      const filePath = `potensi/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
        
      imageUrl = publicUrl;
    }

    // Insert ke tabel potensi
    const { error } = await supabase
      .from('potensi')
      .insert([
        { 
          title: formData.title, 
          category: formData.category,
          description: formData.description, 
          image_url: imageUrl 
        }
      ]);

    if (error) throw error;
  };

  return (
    <AdminForm 
      title="Tambah Potensi Desa (UMKM)"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Simpan Potensi"
      cancelHref="/admin/potensi"
    />
  );
}
