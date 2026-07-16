'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';

export default function EditPotensi() {
  const { id } = useParams();
  const supabase = createClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const { data: result } = await supabase
        .from('potensi')
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
    { name: 'title', label: 'Nama Potensi / Produk', type: 'text', required: true, defaultValue: data.title },
    { 
      name: 'category', 
      label: 'Kategori', 
      type: 'select', 
      required: true, 
      defaultValue: data.category,
      options: [
        { value: 'Kuliner', label: 'Kuliner' },
        { value: 'Kerajinan', label: 'Kerajinan' },
        { value: 'Pertanian', label: 'Pertanian' },
        { value: 'Pariwisata', label: 'Pariwisata' },
        { value: 'Lainnya', label: 'Lainnya' }
      ]
    },
    { name: 'image', label: 'Gambar Produk Baru (Biarkan kosong jika tidak mengubah)', type: 'file', accept: 'image/*', required: false },
    { name: 'description', label: 'Deskripsi Singkat', type: 'textarea', required: true, rows: 5, defaultValue: data.description }
  ];

  const handleSubmit = async (formData, fileData) => {
    let imageUrl = data.image_url;
    
    // Upload gambar jika ada file baru
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

    // Update data ke database
    const { error: updateError } = await supabase
      .from('potensi')
      .update({ 
        title: formData.title, 
        description: formData.description,
        category: formData.category,
        image_url: imageUrl 
      })
      .eq('id', id);

    if (updateError) throw updateError;
  };

  return (
    <AdminForm 
      title="Edit Potensi Desa"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Update Potensi"
      cancelHref="/admin/potensi"
    />
  );
}
