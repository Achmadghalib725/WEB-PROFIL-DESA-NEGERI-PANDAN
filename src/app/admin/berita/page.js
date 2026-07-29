'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import DataTable from '@/components/admin/DataTable';

export default function AdminBerita() {
  const supabase = createClient();
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  useEffect(() => {
    fetchBerita();
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from('pengaturan_halaman').select('value').eq('id', 'kategori_berita').single();
    if (data?.value) {
      try {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        if (Array.isArray(parsed)) {
          setCategories(parsed);
        }
      } catch(e) {}
    }
  }

  async function fetchBerita() {
    setLoading(true);
    const { data } = await supabase
      .from('berita')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setBerita(data);
    setLoading(false);
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsSavingCategory(true);
    const updated = [...categories, newCategory.trim()];
    
    // Check if kategori_berita row exists
    const { data } = await supabase.from('pengaturan_halaman').select('id').eq('id', 'kategori_berita').single();
    if (data) {
      await supabase.from('pengaturan_halaman').update({ value: JSON.stringify(updated) }).eq('id', 'kategori_berita');
    } else {
      await supabase.from('pengaturan_halaman').insert([{ id: 'kategori_berita', value: JSON.stringify(updated) }]);
    }
    
    setCategories(updated);
    setNewCategory('');
    setIsSavingCategory(false);
  }

  async function handleDeleteCategory(index) {
    const updated = categories.filter((_, i) => i !== index);
    await supabase.from('pengaturan_halaman').update({ value: JSON.stringify(updated) }).eq('id', 'kategori_berita');
    setCategories(updated);
  }

  async function handleDelete(id) {
    const itemToDelete = berita.find(item => item.id === id);
    
    // Hapus data dari tabel
    const { error } = await supabase.from('berita').delete().eq('id', id);
    
    // Jika berhasil dihapus dan ada gambar, hapus juga dari storage
    if (!error && itemToDelete && itemToDelete.image_url) {
      try {
        const urlParts = itemToDelete.image_url.split('/assets/');
        if (urlParts.length === 2) {
          const path = urlParts[1];
          await supabase.storage.from('assets').remove([path]);
        }
      } catch (e) {
        console.error('Error deleting image from storage:', e);
      }
    }
    
    fetchBerita();
  }

  const columns = [
    { key: 'title', label: 'Judul Berita' },
    { key: 'kategori', label: 'Kategori' },
    { 
      key: 'created_at', 
      label: 'Tanggal Ditambahkan',
      render: (item) => new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  ];

  return (
    <>
      <DataTable 
        title="Manajemen Berita"
        addAction={{ label: '+ Tambah Berita', href: '/admin/berita/tambah' }}
        extraAction={
          <button onClick={() => setShowCategoryModal(true)} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 34px', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-full)', color: 'var(--clr-text)', justifyContent: 'center' }}>
            <i className="ph-bold ph-list"></i> Kategori Berita
          </button>
        }
        columns={columns}
        data={berita}
        loading={loading}
        onDelete={handleDelete}
        editBasePath="/admin/berita/edit"
      />

      {/* Modal Kategori */}
      {showCategoryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="glass-card" style={{ padding: '30px', maxWidth: '500px', width: '90%', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--clr-text)' }}>Kelola Kategori Berita</h3>
              <button onClick={() => setShowCategoryModal(false)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-muted)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
            </div>
            
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input 
                type="text" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                placeholder="Nama kategori baru..." 
                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--clr-border)', backgroundColor: 'var(--clr-surface)', color: 'var(--clr-text)', outline: 'none' }}
                required
              />
              <button type="submit" disabled={isSavingCategory} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '8px' }}>
                {isSavingCategory ? 'Menyimpan...' : 'Tambah'}
              </button>
            </form>

            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              {categories.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--clr-text-muted)', padding: '20px' }}>Belum ada kategori</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {categories.map((cat, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--clr-border)', backgroundColor: 'var(--clr-surface)', marginBottom: '8px', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--clr-text)' }}>{cat}</span>
                      <button onClick={() => handleDeleteCategory(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', fontSize: '18px' }}>
                        <i className="ph-bold ph-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
