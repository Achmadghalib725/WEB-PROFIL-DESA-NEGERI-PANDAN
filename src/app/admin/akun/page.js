'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AkunPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userEmail, setUserEmail] = useState('Memuat email...');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('Tidak ada pengguna aktif');
      }
    }
    getUser();
  }, [supabase]);

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
    <div className="admin-page" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.6s ease-out' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--clr-text)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Pengaturan Akun</h1>
        <p style={{ color: 'var(--clr-text-muted)', fontSize: '15px' }}>Kelola informasi profil dan keamanan akun administrator Anda.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Profile Card */}
        <div style={{ 
          backgroundColor: 'var(--clr-surface)', 
          padding: '32px 24px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--clr-border)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          boxShadow: 'var(--shadow-sm)',
          animation: 'fadeInUp 0.6s ease-out 0.1s both'
        }}>
          <div style={{ 
            width: '88px', 
            height: '88px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-primary-dark))', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontSize: '40px', 
            marginBottom: '20px', 
            boxShadow: '0 8px 25px rgba(46, 204, 128, 0.25)',
            border: '4px solid var(--clr-surface)'
          }}>
            <i className="ph ph-shield-check"></i>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--clr-text)', marginBottom: '4px' }}>Administrator Utama</h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--clr-text-secondary)', 
            fontSize: '14px', 
            backgroundColor: 'var(--clr-bg-alt)', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            marginTop: '12px',
            border: '1px solid var(--clr-border)'
          }}>
            <i className="ph ph-envelope-simple" style={{ fontSize: '16px', color: 'var(--clr-primary)' }}></i>
            <span style={{ fontWeight: '500' }}>{userEmail}</span>
          </div>
          
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px dashed var(--clr-border)', width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
             <span style={{ color: 'var(--clr-text-muted)' }}>Status Hak Akses</span>
             <span style={{ color: 'var(--clr-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--clr-primary)', display: 'inline-block', boxShadow: '0 0 8px var(--clr-primary)' }}></span>
               Aktif (Full Access)
             </span>
          </div>
        </div>

        {/* Security Settings Card */}
        <div style={{ 
          backgroundColor: 'var(--clr-surface)', 
          padding: '32px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--clr-border)', 
          boxShadow: 'var(--shadow-sm)',
          animation: 'fadeInUp 0.6s ease-out 0.2s both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'rgba(46, 204, 128, 0.1)', 
              color: 'var(--clr-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '24px',
              border: '1px solid rgba(46, 204, 128, 0.2)'
            }}>
              <i className="ph ph-lock-key"></i>
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--clr-text)', marginBottom: '4px' }}>Ganti Password</h2>
              <p style={{ fontSize: '14px', color: 'var(--clr-text-muted)' }}>Pastikan keamanan akun Anda dengan password yang kuat.</p>
            </div>
          </div>
          
          {success && (
            <div style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              color: '#10b981', 
              padding: '16px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '24px', 
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="ph-fill ph-check-circle" style={{ fontSize: '24px' }}></i>
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>Berhasil!</strong>
                <span style={{ fontSize: '14px' }}>Password akun administrator berhasil diperbarui.</span>
              </div>
            </div>
          )}
          
          {errorMsg && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              padding: '16px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '24px', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="ph-fill ph-warning-circle" style={{ fontSize: '24px' }}></i>
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>Gagal</strong>
                <span style={{ fontSize: '14px' }}>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-text)', fontSize: '14px', fontWeight: '500' }}>Password Baru</label>
              <div style={{ position: 'relative' }}>
                <i className="ph ph-key" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)', fontSize: '20px' }}></i>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 48px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--clr-border)',
                    backgroundColor: 'var(--clr-bg-alt)',
                    color: 'var(--clr-text)',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--clr-primary)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(46, 204, 128, 0.1)';
                    e.target.previousSibling.style.color = 'var(--clr-primary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--clr-border)';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)';
                    e.target.previousSibling.style.color = 'var(--clr-text-muted)';
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--clr-text)', fontSize: '14px', fontWeight: '500' }}>Konfirmasi Password Baru</label>
              <div style={{ position: 'relative' }}>
                <i className="ph ph-check-square-offset" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)', fontSize: '20px' }}></i>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ketik ulang password baru"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 48px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--clr-border)',
                    backgroundColor: 'var(--clr-bg-alt)',
                    color: 'var(--clr-text)',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--clr-primary)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(46, 204, 128, 0.1)';
                    e.target.previousSibling.style.color = 'var(--clr-primary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--clr-border)';
                    e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)';
                    e.target.previousSibling.style.color = 'var(--clr-text-muted)';
                  }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '14px',
                backgroundColor: 'var(--clr-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(46, 204, 128, 0.3)'
              }}
              onMouseEnter={(e) => { if(!loading) {
                e.currentTarget.style.backgroundColor = 'var(--clr-primary-light)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 204, 128, 0.4)';
              }}}
              onMouseLeave={(e) => { if(!loading) {
                e.currentTarget.style.backgroundColor = 'var(--clr-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(46, 204, 128, 0.3)';
              }}}
            >
              {loading ? (
                <>
                  <i className="ph ph-spinner" style={{ animation: 'spin 1s linear infinite', fontSize: '20px' }}></i>
                  Menyimpan...
                </>
              ) : (
                <>
                  <i className="ph ph-floppy-disk" style={{ fontSize: '20px' }}></i>
                  Simpan Password Baru
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
