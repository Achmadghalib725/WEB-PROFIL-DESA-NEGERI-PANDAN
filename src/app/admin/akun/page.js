'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AkunPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg('');

    if (formData.password.length < 6) {
      setErrorMsg('Password harus memiliki minimal 6 karakter.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      setFormData({
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMsg(error.message || 'Gagal mengubah password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--clr-text)', marginBottom: '4px' }}>Pengaturan Akun</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '14px' }}>Ubah password untuk akun administrator Anda.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--clr-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)', maxWidth: '500px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: 'var(--clr-text)' }}>Ganti Password</h2>
        
        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            Password berhasil diubah.
          </div>
        )}
        
        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-text-secondary)', fontSize: '14px', fontWeight: '500' }}>Password Baru</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--clr-border)',
                backgroundColor: 'var(--clr-bg-alt)',
                color: 'var(--clr-text)',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary-light)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-text-secondary)', fontSize: '14px', fontWeight: '500' }}>Konfirmasi Password Baru</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Ketik ulang password baru"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--clr-border)',
                backgroundColor: 'var(--clr-bg-alt)',
                color: 'var(--clr-text)',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary-light)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '12px',
              backgroundColor: 'var(--clr-primary-dark)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => { if(!loading) e.currentTarget.style.backgroundColor = 'var(--clr-primary)' }}
            onMouseLeave={(e) => { if(!loading) e.currentTarget.style.backgroundColor = 'var(--clr-primary-dark)' }}
          >
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}
