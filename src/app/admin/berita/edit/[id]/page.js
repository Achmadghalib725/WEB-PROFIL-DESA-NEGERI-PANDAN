'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';

export default function EditBerita() {
  const { id } = useParams();
  const supabase = createClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const { data: result } = await supabase
        .from('berita')
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
    { name: 'title', label: 'Judul Berita', type: 'text', required: true, maxLength: 100, defaultValue: data.title },
    { name: 'kategori', label: 'Kategori / Tag (Opsional)', type: 'text', required: false, maxLength: 30, defaultValue: data.kategori || '' },
    { name: 'image', label: 'Gambar Cover Baru (Biarkan kosong jika tidak mengubah)', type: 'file', accept: 'image/*', required: false },
    { name: 'content', label: 'Isi Berita', type: 'textarea', required: true, maxLength: 5000, rows: 10, defaultValue: data.content }
  ];

  const handleSubmit = async (formData, fileData) => {
    let imageUrl = data.image_url;
    
    // Upload gambar jika ada file baru
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

    // Update berita ke database
    const { error: updateError } = await supabase
      .from('berita')
      .update({ 
        title: formData.title,
        kategori: formData.kategori || null,
        content: formData.content, 
        image_url: imageUrl 
      })
      .eq('id', id);

    if (updateError) throw updateError;
  };

  return (
    <AdminForm 
      title="Edit Berita"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Update Berita"
      cancelHref="/admin/berita"
    />
  );
}
