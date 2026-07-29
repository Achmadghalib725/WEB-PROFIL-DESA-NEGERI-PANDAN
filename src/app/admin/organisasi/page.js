'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';
import { logActivity } from '@/utils/logActivity';

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
  const [sejarahKades, setSejarahKades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Custom Dialog States
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: null, index: null, title: '' });
  const [promptModal, setPromptModal] = useState({ isOpen: false, step: 1, tahunAwal: '', tahunAkhir: '' });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'info' });

  // Cropper states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [targetId, setTargetId] = useState({ type: null, id: null });

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
        
        if (parsed?.sejarah_kades && Array.isArray(parsed.sejarah_kades)) {
          setSejarahKades(parsed.sejarah_kades);
        } else {
          // Default sejarah fallback
          setSejarahKades([
            { tahun: "1957", nama: "KHADIN SINGA LANA" },
            { tahun: "1957 s/d 1976", nama: "RAJA MANGUNANG / RUSLI" },
            { tahun: "Pjs", nama: "A. RAHMAN / JURAGAN" },
            { tahun: "1977 s/d 1987", nama: "M. YUNUS KR" },
            { tahun: "1987 s/d 1997", nama: "M. UBAT" },
            { tahun: "1997 s/d 2007", nama: "SUPLIMANSYAH" },
            { tahun: "2007 s/d 2013", nama: "SUHAR PUJIANTO" },
            { tahun: "2013 s/d 2019", nama: "RIDWAN" },
            { tahun: "Pjs", nama: "KR. RAHMAN SANGUN DIRATU" }
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setDusuns([]);
      setSejarahKades([]);
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
      .from('assets')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const deleteImageFromStorage = async (url) => {
    if (!url) return;
    try {
      const urlParts = url.split('/assets/');
      if (urlParts.length === 2) {
        const path = urlParts[1];
        await supabase.storage.from('assets').remove([path]);
      }
    } catch (e) {
      console.error('Error deleting old image:', e);
    }
  };

  const handleFileChange = async (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
      setTargetId({ type: 'role', id });
      setCropModalOpen(true);
    });
    reader.readAsDataURL(file);
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

  const handleRemoveDusun = (index) => {
    setDeleteConfirm({ isOpen: true, type: 'dusun', index, title: 'Yakin ingin menghapus dusun ini?' });
  };

  const executeRemoveDusun = async (index) => {
    if (dusuns[index]?.image_url) {
      await deleteImageFromStorage(dusuns[index].image_url);
    }
    const newDusuns = [...dusuns];
    newDusuns.splice(index, 1);
    setDusuns(newDusuns);
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

  // --- SEJARAH HANDLERS ---
  const handleAddSejarah = () => {
    setSejarahKades([...sejarahKades, { tahun: '', nama: '' }]);
  };

  const handleRemoveSejarah = (index) => {
    setDeleteConfirm({ isOpen: true, type: 'sejarah', index, title: 'Yakin ingin menghapus riwayat kades ini?' });
  };

  const executeRemoveSejarah = (index) => {
    const newSejarah = [...sejarahKades];
    newSejarah.splice(index, 1);
    setSejarahKades(newSejarah);
  };

  const confirmDeleteAction = async () => {
    if (deleteConfirm.type === 'dusun') {
      await executeRemoveDusun(deleteConfirm.index);
    } else if (deleteConfirm.type === 'sejarah') {
      executeRemoveSejarah(deleteConfirm.index);
    }
    setDeleteConfirm({ isOpen: false, type: null, index: null, title: '' });
  };

  const handleSejarahChange = (index, field, value) => {
    const newSejarah = [...sejarahKades];
    newSejarah[index][field] = value;
    setSejarahKades(newSejarah);
  };

  const handleArsipKades = () => {
    setPromptModal({ isOpen: true, step: 1, tahunAwal: '', tahunAkhir: '' });
  };

  const executeArsipKades = () => {
    const { tahunAwal, tahunAkhir } = promptModal;
    if (!tahunAwal || !tahunAkhir) return;

    const namaKadesSaatIni = data['kepala_desa']?.name || 'Tidak diketahui';

    // Tambahkan ke riwayat
    const newSejarah = [...sejarahKades, { tahun: `${tahunAwal} s/d ${tahunAkhir}`, nama: namaKadesSaatIni }];
    setSejarahKades(newSejarah);

    // Kosongkan Kepala Desa saat ini
    setData(prev => ({
      ...prev,
      kepala_desa: { ...prev['kepala_desa'], name: '', image_url: '' }
    }));
    
    // Kosongkan periode untuk Kades baru
    setData(prev => ({ ...prev, periode: '' }));

    setPromptModal({ isOpen: false, step: 1, tahunAwal: '', tahunAkhir: '' });
    setAlertModal({ isOpen: true, type: 'success', message: 'Berhasil! Kades sebelumnya telah dipindah ke Riwayat. Silakan isi nama Kades yang baru terpilih.' });
  };

  const handleDusunFileChange = async (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
      setTargetId({ type: 'dusun', id: index });
      setCropModalOpen(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      setSaving(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImage], 'profile.jpg', { type: 'image/jpeg' });
      
      if (targetId.type === 'role') {
        const id = targetId.id;
        if (data[id]?.image_url) {
          await deleteImageFromStorage(data[id].image_url);
        }
        const publicUrl = await uploadImage(id, file);
        setData(prev => ({
          ...prev,
          [id]: { ...prev[id], image_url: publicUrl }
        }));
      } else if (targetId.type === 'dusun') {
        const idx = targetId.id;
        if (dusuns[idx]?.image_url) {
          await deleteImageFromStorage(dusuns[idx].image_url);
        }
        const publicUrl = await uploadImage(dusuns[idx].id, file, 'dusun');
        handleDusunChange(idx, 'image_url', publicUrl);
      }
      
      setCropModalOpen(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      setAlertModal({ isOpen: true, type: 'error', message: 'Gagal memotong gambar' });
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
        dusuns: dusuns,
        sejarah_kades: sejarahKades
      };
      
      const { error } = await supabase
        .from('pengaturan_halaman')
        .upsert([{ id: 'struktur_organisasi', value: payload, updated_at: new Date().toISOString() }], { onConflict: 'id' });

      if (error) throw error;
      
      logActivity('Edit', 'Struktur Pemerintahan', 'Pembaruan bagan perangkat desa', 'ph-users-three');
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
      <div className="admin-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Manajemen Struktur Organisasi</h1>
      </div>

      {/* Floating Save Button */}
      <button 
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          zIndex: 900,
          padding: '16px 28px',
          backgroundColor: 'var(--clr-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '1rem',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 8px 20px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(255,255,255,0.05) inset',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
        onMouseEnter={(e) => {
          if (!saving) {
            e.currentTarget.style.backgroundColor = 'var(--clr-primary-light)';
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(34, 197, 94, 0.25), 0 0 0 1px rgba(255,255,255,0.1) inset';
          }
        }}
        onMouseLeave={(e) => {
          if (!saving) {
            e.currentTarget.style.backgroundColor = 'var(--clr-primary)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(255,255,255,0.05) inset';
          }
        }}
        onClick={handleSave}
        disabled={saving}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
          <path d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Zm-96,16a16,16,0,1,1-16,16A16,16,0,0,1,112,56Zm48,144H96a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h64a8,8,0,0,1,8,8v48A8,8,0,0,1,160,200Z"></path>
        </svg>
        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>

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
            maxLength={50}
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
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>Pengurus Inti & Lembaga</h2>
          <button 
            onClick={handleArsipKades}
            style={{ padding: '8px 16px', background: 'rgba(234, 179, 8, 0.2)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.4)', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(234, 179, 8, 0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(234, 179, 8, 0.2)'; }}
            title="Klik saat pergantian Kades untuk menyimpan Kades saat ini ke riwayat"
          >
            Arsipkan Kades (Pergantian)
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {ROLES.map(role => (
            <div 
              key={role.id} 
              className="role-card"
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
                  maxLength={100}
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
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px' }}>
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

              <div className="dusun-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>Nama Dusun / Jabatan</label>
                  <input 
                    type="text" 
                    value={dusun.jabatan} 
                    onChange={(e) => handleDusunChange(dIdx, 'jabatan', e.target.value)}
                    placeholder="Contoh: KADUS I WAY TEMAGA"
                    maxLength={100}
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
                    maxLength={100}
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
                          maxLength={50}
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

        {/* SEJARAH KEPALA DESA SECTION */}
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px', marginTop: '40px' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>Riwayat Kepala Desa</h2>
          <button 
            onClick={handleAddSejarah}
            style={{ padding: '8px 16px', background: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Tambah Riwayat
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sejarahKades.map((sejarah, sIdx) => (
            <div 
              key={sIdx}
              className="sejarah-row"
              style={{ 
                display: 'flex', 
                gap: '16px', 
                alignItems: 'center', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '12px' 
              }}
            >
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--clr-text-dim)' }}>Tahun / Periode</label>
                <input 
                  type="text" 
                  value={sejarah.tahun} 
                  onChange={(e) => handleSejarahChange(sIdx, 'tahun', e.target.value)}
                  placeholder="Misal: 2013 s/d 2019"
                  maxLength={50}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.2)', color: '#fff', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--clr-text-dim)' }}>Nama Kepala Desa</label>
                <input 
                  type="text" 
                  value={sejarah.nama} 
                  onChange={(e) => handleSejarahChange(sIdx, 'nama', e.target.value)}
                  placeholder="Nama Kepala Desa..."
                  maxLength={100}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.2)', color: '#fff', outline: 'none' }}
                />
              </div>
              <div style={{ marginTop: '24px' }}>
                <button 
                  onClick={() => handleRemoveSejarah(sIdx)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', width: '42px', height: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444' }}
                  title="Hapus Riwayat"
                >
                  <i className="ph-bold ph-trash" style={{ fontSize: '1.2rem' }}></i>
                </button>
              </div>
            </div>
          ))}
          {sejarahKades.length === 0 && (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--clr-text-dim)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px' }}>
              Belum ada data riwayat Kepala Desa.
            </div>
          )}
        </div>

      </div>

      {/* Cropper Modal */}
      {cropModalOpen && imageSrc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '90%', maxWidth: '500px', background: 'var(--clr-bg-alt)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Sesuaikan Ukuran Foto (1:1)</h3>
            </div>
            
            <div style={{ position: 'relative', width: '100%', height: '400px', background: '#333' }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label style={{ color: 'var(--clr-text-dim)', fontSize: '0.9rem', fontWeight: '500' }}>Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ flex: 1, cursor: 'pointer', accentColor: 'var(--clr-primary)' }}
              />
            </div>
            
            <div style={{ padding: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button 
                onClick={() => { setCropModalOpen(false); setImageSrc(null); }}
                style={{ padding: '10px 20px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}
                disabled={saving}
              >
                Batal
              </button>
              <button 
                onClick={handleCropSave}
                style={{ padding: '10px 20px', background: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                disabled={saving}
              >
                {saving ? 'Memproses...' : 'Potong & Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ padding: '30px', maxWidth: '400px', width: '90%', borderRadius: '16px', textAlign: 'center', background: 'var(--clr-bg-alt)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>
              <i className="ph ph-warning-circle"></i>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>Hapus Data?</h3>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              {deleteConfirm.title}<br/>Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setDeleteConfirm({ isOpen: false, type: null, index: null, title: '' })}
                style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button 
                onClick={confirmDeleteAction}
                style={{ flex: 1, padding: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Modal */}
      {promptModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ padding: '30px', maxWidth: '400px', width: '90%', borderRadius: '16px', background: 'var(--clr-bg-alt)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '24px' }}>
              <i className="ph ph-archive"></i>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#fff' }}>Arsipkan Kepala Desa</h3>
            
            {promptModal.step === 1 ? (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>Tahun Awal Jabatan</label>
                <input 
                  autoFocus
                  type="text" 
                  value={promptModal.tahunAwal}
                  onChange={(e) => setPromptModal(prev => ({ ...prev, tahunAwal: e.target.value }))}
                  placeholder="Misal: 2019"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.2)', color: '#fff', outline: 'none' }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>Tahun Akhir Jabatan</label>
                <input 
                  autoFocus
                  type="text" 
                  value={promptModal.tahunAkhir}
                  onChange={(e) => setPromptModal(prev => ({ ...prev, tahunAkhir: e.target.value }))}
                  placeholder="Misal: 2026"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(0, 0, 0, 0.2)', color: '#fff', outline: 'none' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setPromptModal({ isOpen: false, step: 1, tahunAwal: '', tahunAkhir: '' })}
                style={{ padding: '10px 16px', backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}
              >
                Batal
              </button>
              {promptModal.step === 1 ? (
                <button 
                  onClick={() => {
                    if (promptModal.tahunAwal) setPromptModal(prev => ({ ...prev, step: 2 }));
                  }}
                  disabled={!promptModal.tahunAwal}
                  style={{ padding: '10px 16px', backgroundColor: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: promptModal.tahunAwal ? 'pointer' : 'not-allowed', opacity: promptModal.tahunAwal ? 1 : 0.5 }}
                >
                  Lanjut &rarr;
                </button>
              ) : (
                <button 
                  onClick={executeArsipKades}
                  disabled={!promptModal.tahunAkhir}
                  style={{ padding: '10px 16px', backgroundColor: 'var(--clr-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: promptModal.tahunAkhir ? 'pointer' : 'not-allowed', opacity: promptModal.tahunAkhir ? 1 : 0.5 }}
                >
                  Simpan & Arsipkan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ padding: '30px', maxWidth: '400px', width: '90%', borderRadius: '16px', textAlign: 'center', background: 'var(--clr-bg-alt)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: alertModal.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: alertModal.type === 'success' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>
              <i className={alertModal.type === 'success' ? 'ph ph-check-circle' : 'ph ph-info'}></i>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
              {alertModal.type === 'success' ? 'Berhasil' : 'Informasi'}
            </h3>
            <p style={{ color: 'var(--clr-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              {alertModal.message}
            </p>
            <button 
              onClick={() => setAlertModal({ isOpen: false, message: '', type: 'info' })}
              style={{ padding: '10px 32px', backgroundColor: alertModal.type === 'success' ? 'var(--clr-primary)' : '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      
      {/* Responsive CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .admin-card {
            padding: 16px !important;
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }
          .section-header h2 {
            font-size: 1.2rem !important;
          }
          .role-card {
            padding: 16px !important;
          }
          .sejarah-row {
            flex-direction: column;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .sejarah-row > div {
            width: 100%;
          }
          .sejarah-row button {
            align-self: flex-start;
            margin-top: 8px !important;
          }
          .dusun-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
