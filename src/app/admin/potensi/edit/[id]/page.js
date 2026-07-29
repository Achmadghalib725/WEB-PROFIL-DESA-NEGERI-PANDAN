'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';
import { logActivity } from '@/utils/logActivity';

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
    { name: 'title', label: 'Nama Potensi / UMKM', type: 'text', required: true, maxLength: 100, defaultValue: data.title },
    { 
      name: 'category', 
      label: 'Kategori', 
      type: 'select', 
      required: true, 
      defaultValue: data.category,
      options: [
        { label: 'UMKM', value: 'UMKM' },
        { label: 'Pertanian', value: 'Pertanian' },
        { label: 'Pariwisata', value: 'Pariwisata' },
        { label: 'Kesenian', value: 'Kesenian' }
      ]
    },
    { name: 'image', label: 'Gambar Potensi Baru (Kosongkan jika tidak diubah)', type: 'file', required: false },
    { name: 'description', label: 'Deskripsi Singkat', type: 'textarea', required: true, maxLength: 2000, rows: 6, defaultValue: data.description }
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

      // Hapus gambar lama jika ada
      if (data.image_url) {
        try {
          const oldUrlParts = data.image_url.split('/assets/');
          if (oldUrlParts.length === 2) {
            const oldPath = oldUrlParts[1];
            await supabase.storage.from('assets').remove([oldPath]);
          }
        } catch (e) {
          console.error('Error deleting old image:', e);
        }
      }
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
    logActivity('Edit', 'Potensi UMKM', formData.title, 'ph-storefront');
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
