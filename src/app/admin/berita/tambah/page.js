'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';

export default function TambahBerita() {
  const supabase = createClient();
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('pengaturan_halaman').select('value').eq('id', 'kategori_berita').maybeSingle();
      if (data?.value) {
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          if (Array.isArray(parsed)) {
            setCategoryOptions(parsed.map(cat => ({ label: cat, value: cat })));
          }
        } catch(e) {}
      }
    }
    fetchCategories();
  }, [supabase]);

  const fields = [
    { name: 'title', label: 'Judul Berita', type: 'text', required: true, maxLength: 100, placeholder: 'Masukkan judul berita...' },
    { name: 'kategori', label: 'Kategori Berita', type: 'select', options: categoryOptions, required: false },
    { name: 'image', label: 'Gambar Cover (Opsional)', type: 'file', accept: 'image/*', required: false },
    { name: 'content', label: 'Isi Berita', type: 'textarea', required: true, maxLength: 5000, rows: 10, placeholder: 'Tulis isi berita di sini...' }
  ];

  const handleSubmit = async (formData, fileData) => {
    let imageUrl = '';
    
    // Upload gambar jika ada
    if (fileData.image) {
      const file = fileData.image;
      const fileExt = file.name.split('.').pop();
      const fileName = `berita-${Math.random()}.${fileExt}`;
      const filePath = `berita/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
        
      imageUrl = publicUrl;
    }

    // Simpan berita ke database
    const { error: insertError } = await supabase
      .from('berita')
      .insert([
        { 
          title: formData.title, 
          kategori: formData.kategori || null,
          content: formData.content, 
          image_url: imageUrl 
        }
      ]);

    if (insertError) throw insertError;
  };

  return (
    <AdminForm 
      title="Tambah Berita Baru"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Simpan Berita"
      cancelHref="/admin/berita"
    />
  );
}
