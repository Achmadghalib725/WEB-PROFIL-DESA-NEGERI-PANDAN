'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminForm({ 
  title, 
  fields, 
  onSubmit, 
  submitLabel = 'Simpan',
  cancelHref
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Initialize state based on fields
  const initialState = {};
  fields.forEach(f => {
    initialState[f.name] = f.defaultValue || '';
  });
  
  const [formData, setFormData] = useState(initialState);
  const [fileData, setFileData] = useState({});

  const handleInputChange = (e, field) => {
    setFormData(prev => ({ ...prev, [field.name]: e.target.value }));
  };

  const handleFileChange = (e, field) => {
    setFileData(prev => ({ ...prev, [field.name]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await onSubmit(formData, fileData);
      if (cancelHref) {
        router.push(cancelHref);
      } else {
        router.back();
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
                <select 
                  value={formData[field.name]}
                  onChange={(e) => handleInputChange(e, field)}
                  required={field.required}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--clr-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
                >
                  <option value="" disabled>Pilih {field.label}</option>
                  {field.options && field.options.map(opt => (
                    <option key={opt.value} value={opt.value} style={{ color: '#0f172a' }}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type={field.type || 'text'} 
                  value={formData[field.name]}
                  onChange={(e) => handleInputChange(e, field)}
                  required={field.required}
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
