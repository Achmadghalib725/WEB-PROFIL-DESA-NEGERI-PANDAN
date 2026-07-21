'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminForm from '@/components/admin/AdminForm';

export default function AdminStatistik() {
  const supabase = createClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kumpulan ID statistik yang akan dikelola
  const statIds = [
    'stat_penduduk', 
    'stat_kk', 
    'stat_lahan', 
    'stat_dusun', 
    'stat_sekolah'
  ];

  // Default values just in case they don't exist in DB yet
  const defaultValues = {
    'stat_penduduk': '5240',
    'stat_kk': '1250',
    'stat_lahan': '850',
    'stat_dusun': '4',
    'stat_sekolah': '3'
  };

  useEffect(() => {
    async function fetchData() {
      const { data: result } = await supabase
        .from('pengaturan_halaman')
        .select('id, value')
        .in('id', statIds);

      // Convert array of {id, value} to an object
      const dbValues = {};
      if (result) {
        result.forEach(row => {
          dbValues[row.id] = row.value;
        });
      }

      // Merge with default values if not found in DB
      const finalData = {};
      statIds.forEach(id => {
        finalData[id] = dbValues[id] || defaultValues[id];
      });

      setData(finalData);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: 'var(--clr-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="ph ph-spinner-gap" style={{ animation: 'spin 1s linear infinite' }}></i>
        Memuat data...
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  const fields = [
    { name: 'stat_penduduk', label: 'Jumlah Penduduk', type: 'number', required: true, defaultValue: data['stat_penduduk'], maxLength: 6 },
    { name: 'stat_kk', label: 'Jumlah Kepala Keluarga (KK)', type: 'number', required: true, defaultValue: data['stat_kk'], maxLength: 6 },
    { name: 'stat_lahan', label: 'Total Hektar Lahan', type: 'number', required: true, defaultValue: data['stat_lahan'], maxLength: 6 },
    { name: 'stat_dusun', label: 'Jumlah Dusun', type: 'number', required: true, defaultValue: data['stat_dusun'], maxLength: 6 },
    { name: 'stat_sekolah', label: 'Jumlah Sekolah', type: 'number', required: true, defaultValue: data['stat_sekolah'], maxLength: 6 }
  ];

  const handleSubmit = async (formData) => {
    // Siapkan data untuk di-upsert (update atau insert)
    const upsertData = Object.keys(formData).map(key => ({
      id: key,
      value: formData[key]
    }));

    const { error: upsertError } = await supabase
      .from('pengaturan_halaman')
      .upsert(upsertData, { onConflict: 'id' });

    if (upsertError) throw upsertError;
    
    return 'Data statistik berhasil diperbarui!';
  };

  return (
    <AdminForm 
      title="Pengaturan Statistik Beranda"
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Simpan Perubahan"
      cancelHref="/admin"
      stayOnSuccess={true}
    />
  );
}
