'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const supabase = createClient();
  const [currentHero, setCurrentHero] = useState('/images/hero-village.png');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHero();
  }, []);

  async function fetchHero() {
    const { data, error } = await supabase
      .from('pengaturan_halaman')
      .select('value')
      .eq('id', 'hero_image')
      .single();
    
    if (data) {
      setCurrentHero(data.value);
    }
  }

  async function handleUpload(event) {
    try {
      setUploading(true);
      setMessage('');
      
      const file = event.target.files[0];
      if (!file) return;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      // Save to database
      const { error: updateError } = await supabase
        .from('pengaturan_halaman')
        .upsert({ id: 'hero_image', value: publicUrl, updated_at: new Date() });

      if (updateError) {
        throw updateError;
      }

      setCurrentHero(publicUrl);
      setMessage('Gambar pahlawan berhasil diperbarui!');
    } catch (error) {
      setMessage('Gagal mengupload gambar: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-light, #f8fafc)' }}>Dashboard Admin</h1>
      
      <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-light, #f8fafc)' }}>Gambar Utama Halaman Beranda (Hero)</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p className="text-muted" style={{ marginBottom: '10px' }}>Gambar saat ini:</p>
          <img 
            src={currentHero} 
            alt="Hero Saat Ini" 
            style={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} 
          />
        </div>

        <div>
          <label 
            htmlFor="hero-upload"
            style={{
              display: 'inline-block',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? 'Mengupload...' : 'Ganti Gambar Hero'}
          </label>
          <input 
            type="file" 
            id="hero-upload" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={uploading}
            style={{ display: 'none' }} 
          />
        </div>

        {message && (
          <p style={{ marginTop: '15px', padding: '10px', backgroundColor: message.includes('Gagal') ? '#fef2f2' : '#f0fdf4', color: message.includes('Gagal') ? '#ef4444' : '#16a34a', borderRadius: '6px' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
