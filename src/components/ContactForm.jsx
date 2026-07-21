'use client';
import { useState, useEffect } from 'react';

/**
 * Replicates initContactForm() from main.js.
 * Handles form submission feedback: shows "✓ Pesan Terkirim!" then resets.
 */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const options = [
    { value: 'Administrasi Kependudukan', label: 'Administrasi Kependudukan' },
    { value: 'Permintaan Informasi', label: 'Permintaan Informasi' },
    { value: 'Pengaduan Masyarakat', label: 'Pengaduan Masyarakat' },
    { value: 'Lainnya', label: 'Lainnya (Tulis sendiri)' }
  ];

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || cooldown > 0) return;

    const name = e.target.name.value;
    const email = e.target.email.value;
    const subject = selectedSubject === 'Lainnya' ? e.target.customSubject.value : selectedSubject;
    const message = e.target.message.value;

    const waNumber = '6283147158593';
    const text = `Halo Admin Desa Negeri Pandan, saya ingin menyampaikan pesan:\n\n*Nama*: ${name}\n*Kontak*: ${email}\n*Keperluan*: ${subject}\n*Pesan*:\n${message}`;
    const encodedText = encodeURIComponent(text);
    
    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');

    setSubmitted(true);
    setCooldown(60); // Jeda 60 detik sebelum bisa mengirim lagi
    setTimeout(() => {
      setSubmitted(false);
      e.target.reset();
    }, 3500);
  };

  return (
    <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nama Lengkap</label>
        <input type="text" id="name" name="name" placeholder="Masukkan nama Anda" maxLength={50} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email / No. HP</label>
        <input type="text" id="email" name="email" placeholder="Masukkan kontak Anda" maxLength={50} required />
      </div>
      <div className="form-group" style={{ position: 'relative' }}>
        <label>Keperluan</label>
        
        {/* Hidden input for form validation */}
        <input 
          type="text" 
          name="subject" 
          value={selectedSubject} 
          readOnly 
          required 
          style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} 
        />
        
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.8rem 1rem',
            background: 'var(--clr-bg-alt, rgba(255, 255, 255, 0.03))',
            border: isDropdownOpen ? '1px solid var(--clr-primary)' : '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-full)',
            color: selectedSubject ? 'var(--clr-text-primary)' : 'var(--clr-text-muted)',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            boxShadow: isDropdownOpen ? '0 0 0 3px rgba(16, 185, 129, 0.2)' : 'none'
          }}
        >
          <span>{selectedSubject ? options.find(o => o.value === selectedSubject)?.label : 'Pilih Keperluan...'}</span>
          <i className={`ph-bold ph-caret-${isDropdownOpen ? 'up' : 'down'}`}></i>
        </div>

        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0, right: 0,
            background: '#0d1511', /* Solid dark green/gray background */
            border: '1px solid var(--clr-border)',
            borderRadius: '16px',
            padding: '8px',
            zIndex: 50,
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            {options.map((opt) => (
              <div 
                key={opt.value}
                onClick={() => {
                  setSelectedSubject(opt.value);
                  setIsDropdownOpen(false);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: selectedSubject === opt.value ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  color: selectedSubject === opt.value ? 'var(--clr-primary-light)' : 'var(--clr-text-primary)',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedSubject !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (selectedSubject !== opt.value) e.currentTarget.style.background = 'transparent';
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSubject === 'Lainnya' && (
        <div className="form-group">
          <label htmlFor="customSubject">Sebutkan Keperluan Anda</label>
          <input 
            type="text" 
            id="customSubject" 
            name="customSubject" 
            placeholder="Misal: Undangan kegiatan..." 
            maxLength={100}
            required 
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="message">Pesan</label>
        <textarea
          id="message"
          name="message"
          placeholder="Tuliskan pesan Anda di sini..."
          maxLength={500}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitted || cooldown > 0}
        style={{
          width: '100%',
          marginTop: '1rem',
          background: submitted
            ? 'linear-gradient(135deg, hsl(152, 70%, 40%), hsl(85, 65%, 50%))'
            : (cooldown > 0 ? 'var(--clr-border)' : undefined),
          cursor: (submitted || cooldown > 0) ? 'not-allowed' : 'pointer',
          color: (cooldown > 0 && !submitted) ? 'var(--clr-text-muted)' : 'white'
        }}
      >
        {submitted ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            ✓ Pesan Terkirim!
          </span>
        ) : cooldown > 0 ? (
          `Tunggu ${cooldown} detik`
        ) : (
          'Kirim Pesan'
        )}
      </button>
    </form>
  );
}
