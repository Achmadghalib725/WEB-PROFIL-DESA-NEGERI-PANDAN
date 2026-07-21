'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminForm({ 
  title, 
  fields, 
  onSubmit, 
  submitLabel = 'Simpan',
  cancelHref,
  stayOnSuccess = false
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Initialize state based on fields
  const initialState = {};
  fields.forEach(f => {
    initialState[f.name] = f.defaultValue || '';
  });
  
  const [formData, setFormData] = useState(initialState);
  const [fileData, setFileData] = useState({});

  const handleInputChange = (e, field) => {
    let value = e.target.value;
    if (field.maxLength && value.length > field.maxLength) {
      value = value.slice(0, field.maxLength);
    }
    setFormData(prev => ({ ...prev, [field.name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Batasi ukuran file (default 500KB)
      const maxSize = field.maxSize || 500 * 1024; 
      if (file.size > maxSize) {
        setErrorMsg(`Ukuran file terlalu besar! Maksimal ${maxSize / 1024}KB.`);
        e.target.value = ''; // Reset input file
        return;
      }
      setErrorMsg('');
      setFileData(prev => ({ ...prev, [field.name]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const msg = await onSubmit(formData, fileData);
      setSuccessMsg(msg || 'Data berhasil disimpan!');
      setLoading(false);
      
      // Delay redirect agar notifikasi sukses terlihat (jika tidak stayOnSuccess)
      if (!stayOnSuccess) {
        setTimeout(() => {
          if (cancelHref) {
            router.push(cancelHref);
          } else {
            router.back();
          }
        }, 1500);
      } else {
        // Jika stayOnSuccess, sembunyikan pesan sukses setelah beberapa detik
        setTimeout(() => {
          setSuccessMsg('');
        }, 3000);
      }
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: 'var(--radius-sm)', 
    border: '1px solid var(--clr-border)', 
    backgroundColor: 'var(--clr-surface)', 
    color: 'var(--clr-text)', 
    outline: 'none',
    transition: 'var(--transition)',
    fontFamily: 'var(--ff-body)',
    fontSize: 'var(--fs-body)'
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <button 
          onClick={() => cancelHref ? router.push(cancelHref) : router.back()} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 'var(--space-sm)', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--fs-small)' }}
          type="button"
        >
          <i className="ph ph-arrow-left"></i> Kembali
        </button>
        <div className="section-label">Formulir Data</div>
        <h1 className="section-title">
          {title.split(' ').map((word, i, arr) => 
            i === arr.length - 1 ? <span key={i} className="accent">{word}</span> : <span key={i}>{word} </span>
          )}
        </h1>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {fields.map((field) => (
            <div key={field.name}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-small)' }}>
                {field.label} {field.required && <span style={{color: '#ef4444'}}>*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea 
                  value={formData[field.name]}
                  onChange={(e) => handleInputChange(e, field)}
                  required={field.required}
                  rows={field.rows || 5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={field.placeholder || ''}
                  onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
                ></textarea>
              ) : field.type === 'file' ? (
                <input 
                  type="file" 
                  accept={field.accept || 'image/*'}
                  onChange={(e) => handleFileChange(e, field)}
                  required={field.required}
                  style={inputStyle}
                />
              ) : field.type === 'select' ? (
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setOpenDropdown(openDropdown === field.name ? null : field.name)}
                    style={{
                      ...inputStyle,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderColor: openDropdown === field.name ? 'var(--clr-primary)' : 'var(--clr-border)',
                      color: formData[field.name] ? 'var(--text-light, #f8fafc)' : 'var(--clr-text-muted)'
                    }}
                  >
                    <span>
                      {formData[field.name] 
                        ? field.options?.find(o => o.value === formData[field.name])?.label 
                        : `Pilih ${field.label}`}
                    </span>
                    <i className="ph-bold ph-caret-down" style={{ 
                      transition: 'transform 0.3s',
                      transform: openDropdown === field.name ? 'rotate(180deg)' : 'none'
                    }}></i>
                  </div>

                  {openDropdown === field.name && (
                    <>
                      {/* Layar transparan penangkap klik di luar dropdown */}
                      <div 
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                        onClick={() => setOpenDropdown(null)}
                      />
                      
                      {/* Menu Dropdown */}
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '8px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '8px',
                        zIndex: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                      }}>
                        {field.options?.map((opt, idx) => {
                          const isSelected = formData[field.name] === opt.value;
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                handleInputChange({ target: { name: field.name, value: opt.value } }, field);
                                setOpenDropdown(null);
                              }}
                              style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                color: isSelected ? 'var(--clr-primary-light)' : 'var(--clr-text-dim)',
                                background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.target.style.background = 'rgba(255,255,255,0.05)';
                                  e.target.style.color = '#fff';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.target.style.background = 'transparent';
                                  e.target.style.color = 'var(--clr-text-dim)';
                                }
                              }}
                            >
                              {opt.label}
                              {isSelected && <i className="ph-bold ph-check"></i>}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <input 
                  type={field.type || 'text'} 
                  value={formData[field.name]}
                  onChange={(e) => handleInputChange(e, field)}
                  required={field.required}
                  maxLength={field.maxLength}
                  max={field.maxLength ? Math.pow(10, field.maxLength) - 1 : undefined}
                  style={inputStyle}
                  placeholder={field.placeholder || ''}
                  onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
                />
              )}
            </div>
          ))}

          {errorMsg && (
            <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)' }}>
              <i className="ph-bold ph-check-circle" style={{ marginRight: '8px' }}></i>
              {successMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 'var(--space-sm)' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ opacity: loading ? 0.7 : 1, padding: '12px 32px' }}
            >
              {loading ? (
                <>
                  <i className="ph ph-spinner-gap" style={{ animation: 'spin 1s linear infinite' }}></i> Memproses...
                </>
              ) : submitLabel}
            </button>
          </div>
        </form>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
