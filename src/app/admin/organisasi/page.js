'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const ROLES = [
  { id: 'kepala_desa', label: 'Kepala Desa' },
  { id: 'sekdes', label: 'Sekretaris Desa' },
  { id: 'bpd', label: 'BPD (Lembaga)' },
  { id: 'lpm', label: 'LPM (Lembaga)' },
  { id: 'kasi_pemerintahan', label: 'Kasi Pemerintahan' },
  { id: 'kasi_kesejahteraan', label: 'Kasi Kesejahteraan' },
  { id: 'kasi_pelayanan', label: 'Kasi Pelayanan' },
  { id: 'pengurus_barang', label: 'Pengurus Inventarisir Barang' },
  { id: 'operator_desa', label: 'Staf / Operator Desa' },
  { id: 'kaur_tu', label: 'Kaur Tata Usaha dan Umum' },
  { id: 'kaur_keuangan', label: 'Kaur Keuangan' },
  { id: 'kaur_perencanaan', label: 'Kaur Perencanaan' }
];

export default function AdminOrganisasi() {
  const supabase = createClient();
  const [data, setData] = useState({});
  const [dusuns, setDusuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: result, error } = await supabase
      .from('pengaturan_halaman')
      .select('value')
      .eq('id', 'struktur_organisasi')
      .single();

    if (!error && result?.value) {
      try {
        const parsed = typeof result.value === 'string' ? JSON.parse(result.value) : result.value;
        setData(parsed || {});
        if (parsed?.dusuns && Array.isArray(parsed.dusuns)) {
          setDusuns(parsed.dusuns);
        } else {
          // Default fallback
          setDusuns([
            { id: 'kadus_1', jabatan: 'KADUS I\nWAY TEMAGA', name: 'NURDIN USMAN', image_url: '', rts: ['1. MIN HUSNI', '2. M. RIZA'] },
            { id: 'kadus_2', jabatan: 'KADUS II\nWAY SALAK', name: 'SAIPUL', image_url: '', rts: ['3. -', '4. ANSORI'] },
            { id: 'kadus_3', jabatan: 'KADUS III\nWAY HANAU', name: 'ASHAR', image_url: '', rts: ['5. ZAINL RJ', '6. TOPAN BASIRUN'] },
            { id: 'kadus_4', jabatan: 'KADUS IV\nWAY PANDAN', name: 'JONI SAHRIZAL', image_url: '', rts: ['7. -'] },
            { id: 'kadus_5', jabatan: 'KADUS V\nKUMBANG TANJUNG', name: 'SAHIDAN', image_url: '', rts: ['8. SARIFUDDIN', '9. WARSITO'] },
            { id: 'kadus_6', jabatan: 'KADUS VI\nLUBUK JUKUNG', name: 'KHOLIJAN MAULANA', image_url: '', rts: ['11. YUSMUNAZI', '12. ROJANI'] }
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setDusuns([]);
    }
    setLoading(false);
  }

  const handleNameChange = (id, value) => {
    setData(prev => ({
      ...prev,
      [id]: { ...prev[id], name: value }
    }));
  };

  const uploadImage = async (id, file, folder = 'organisasi') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public_assets')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public_assets')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const deleteImageFromStorage = async (url) => {
    if (!url) return;
    try {
      const urlParts = url.split('/public_assets/');
      if (urlParts.length === 2) {
        const path = urlParts[1];
        await supabase.storage.from('public_assets').remove([path]);
      }
    } catch (e) {
      console.error('Error deleting old image:', e);
    }
  };

  const handleFileChange = async (id, file) => {
    if (!file) return;
    try {
      setSaving(true);
      if (data[id]?.image_url) {
        await deleteImageFromStorage(data[id].image_url);
      }
      const publicUrl = await uploadImage(id, file);
      setData(prev => ({
        ...prev,
        [id]: { ...prev[id], image_url: publicUrl }
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengunggah foto');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = async (id) => {
    if (data[id]?.image_url) {
      await deleteImageFromStorage(data[id].image_url);
    }
    setData(prev => {
      const newData = { ...prev };
      if (newData[id]) {
        newData[id].image_url = '';
      }
      return newData;
    });
  };

  // --- DUSUN HANDLERS ---
  const handleAddDusun = () => {
    const newId = `kadus_${Date.now()}`;
    setDusuns([...dusuns, { id: newId, jabatan: 'KADUS BARU', name: '', image_url: '', rts: [] }]);
  };

  const handleRemoveDusun = async (index) => {
    if (confirm('Yakin ingin menghapus dusun ini?')) {
      if (dusuns[index]?.image_url) {
        await deleteImageFromStorage(dusuns[index].image_url);
      }
      const newDusuns = [...dusuns];
      newDusuns.splice(index, 1);
      setDusuns(newDusuns);
    }
  };

  const handleDusunChange = (index, field, value) => {
    const newDusuns = [...dusuns];
    newDusuns[index][field] = value;
    setDusuns(newDusuns);
  };

  const handleAddRT = (dusunIndex) => {
    const newDusuns = [...dusuns];
    newDusuns[dusunIndex].rts.push(`RT ${newDusuns[dusunIndex].rts.length + 1}. NAMA`);
    setDusuns(newDusuns);
  };

  const handleRemoveRT = (dusunIndex, rtIndex) => {
    const newDusuns = [...dusuns];
    newDusuns[dusunIndex].rts.splice(rtIndex, 1);
    setDusuns(newDusuns);
  };

  const handleRTChange = (dusunIndex, rtIndex, value) => {
    const newDusuns = [...dusuns];
    newDusuns[dusunIndex].rts[rtIndex] = value;
    setDusuns(newDusuns);
  };

  const handleDusunFileChange = async (index, file) => {
    if (!file) return;
    try {
      setSaving(true);
      if (dusuns[index]?.image_url) {
        await deleteImageFromStorage(dusuns[index].image_url);
      }
      const publicUrl = await uploadImage(dusuns[index].id, file, 'dusun');
      handleDusunChange(index, 'image_url', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengunggah foto');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...data,
        dusuns: dusuns
      };
      
      const { error } = await supabase
        .from('pengaturan_halaman')
        .upsert({ id: 'struktur_organisasi', value: payload });

      if (error) throw error;
      setMessage('Perubahan berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage('Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#fff' }}>Memuat data struktur organisasi...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Manajemen Struktur Organisasi</h1>
        <button 
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--clr-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)'
          }}
          onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = 'var(--clr-primary-dark)')}
          onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = 'var(--clr-primary)')}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '16px', marginBottom: '24px', backgroundColor: message.includes('berhasil') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('berhasil') ? '#4ade80' : '#ef4444', borderRadius: '8px', border: `1px solid ${message.includes('berhasil') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
          {message}
        </div>
      )}

      <div className="admin-card" style={{ padding: '30px', background: 'var(--clr-bg-alt)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '24px', color: '#fff', fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Pengaturan Umum</h2>
        <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--clr-text-dim)', fontWeight: '500' }}>Periode Jabatan</label>
          <input 
            type="text" 
            value={data.periode || ''} 
            onChange={(e) => setData(prev => ({ ...prev, periode: e.target.value }))}
            placeholder="Contoh: Periode 2019 - 2025"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              background: 'rgba(0, 0, 0, 0.2)', 
              color: '#fff', 
              outline: 'none', 
              transition: 'all 0.3s ease' 
            }}
            onFocus={(e) => { e.target.style.border = '1px solid var(--clr-primary-light)'; e.target.style.background = 'rgba(255, 255, 255, 0.05)' }}
            onBlur={(e) => { e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(0, 0, 0, 0.2)' }}
          />
        </div>
      </div>

      <div className="admin-card" style={{ padding: '30px', background: 'var(--clr-bg-alt)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ marginBottom: '24px', color: '#fff', fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Pengurus Inti & Lembaga</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {ROLES.map(role => (
            <div 
              key={role.id} 
              style={{ 
                padding: '24px', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '16px', 
                background: 'rgba(255,255,255,0.02)', 
                transition: 'all 0.3s ease', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '1.15rem', color: 'var(--clr-primary-light)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>{role.label}</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--clr-text-dim)', fontWeight: '500' }}>Nama Pejabat</label>
                <input 
                  type="text" 
                  value={data[role.id]?.name || ''} 
                  onChange={(e) => handleNameChange(role.id, e.target.value)}
                  placeholder="Masukkan nama lengkap..."
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    background: 'rgba(0, 0, 0, 0.2)', 
                    color: '#fff', 
                    outline: 'none', 
                    transition: 'all 0.3s ease' 
                  }}
                  onFocus={(e) => { e.target.style.border = '1px solid var(--clr-primary-light)'; e.target.style.background = 'rgba(255, 255, 255, 0.05)' }}
                  onBlur={(e) => { e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(0, 0, 0, 0.2)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--clr-text-dim)', fontWeight: '500' }}>Foto Profil (Opsional)</label>
                {data[role.id]?.image_url ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <img 
                      src={data[role.id].image_url} 
                      alt="Profil" 
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--clr-primary-light)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }} 
                    />
                    <button 
                      onClick={() => handleRemoveImage(role.id)}
                      style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444' }}
                    >
                      Hapus Foto
                    </button>
                  </div>
                ) : (
                  <div>
                    <input 
                      type="file" 
                      id={`file-${role.id}`}
                      accept="image/*"
                      onChange={(e) => handleFileChange(role.id, e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    <label 
                      htmlFor={`file-${role.id}`}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '8px', 
                        padding: '12px 16px', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px dashed rgba(255,255,255,0.2)', 
                        borderRadius: '8px', 
                        color: 'var(--clr-text-dim)', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--clr-primary-light)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--clr-text-dim)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    >
                      Unggah Foto
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* DUSUN SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>Manajemen Kepala Dusun (Kadus)</h2>
          <button 
            onClick={handleAddDusun}
            style={{ padding: '8px 16px', background: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Tambah Dusun
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {dusuns.map((dusun, dIdx) => (
            <div 
              key={dusun.id} 
              style={{ 
                padding: '24px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '16px', 
                background: 'rgba(0,0,0,0.15)', 
                position: 'relative'
              }}
            >
              <button 
                onClick={() => handleRemoveDusun(dIdx)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                title="Hapus Dusun"
              >
                Hapus
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>Nama Dusun / Jabatan</label>
                  <input 
                    type="text" 
                    value={dusun.jabatan} 
                    onChange={(e) => handleDusunChange(dIdx, 'jabatan', e.target.value)}
                    placeholder="Contoh: KADUS I WAY TEMAGA"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', outline: 'none' }}
                  />
                  <small style={{ color: 'var(--clr-text-dim)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>Gunakan "\n" untuk baris baru di bagan</small>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>Nama Pejabat</label>
                  <input 
                    type="text" 
                    value={dusun.name} 
                    onChange={(e) => handleDusunChange(dIdx, 'name', e.target.value)}
                    placeholder="Nama Lengkap..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>Foto Profil</label>
                  {dusun.image_url ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={dusun.image_url} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt="Foto" />
                      <button onClick={() => handleDusunChange(dIdx, 'image_url', '')} style={{ padding: '6px 12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Hapus Foto</button>
                    </div>
                  ) : (
                    <div>
                      <input type="file" id={`dusun-file-${dusun.id}`} accept="image/*" onChange={(e) => handleDusunFileChange(dIdx, e.target.files[0])} style={{ display: 'none' }} />
                      <label htmlFor={`dusun-file-${dusun.id}`} style={{ display: 'inline-block', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}>Pilih Foto</label>
                    </div>
                  )}
                </div>
              </div>

              {/* RT LIST */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, color: 'var(--clr-primary-light)' }}>Daftar RT di {(dusun.jabatan || '').split('\n')[0]}</h4>
                  <button onClick={() => handleAddRT(dIdx)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Tambah RT</button>
                </div>
                
                {dusun.rts.length === 0 ? (
                  <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>Belum ada RT. Klik "+ Tambah RT" untuk menambahkan.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {dusun.rts.map((rt, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          value={rt}
                          onChange={(e) => handleRTChange(dIdx, rIdx, e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                        />
                        <button 
                          onClick={() => handleRemoveRT(dIdx, rIdx)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', width: '32px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Hapus RT"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {dusuns.length === 0 && (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--clr-text-dim)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px' }}>
              Belum ada data Dusun. Klik "+ Tambah Dusun" untuk mulai menambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
