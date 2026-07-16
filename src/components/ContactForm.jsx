'use client';
import { useState } from 'react';

/**
 * Replicates initContactForm() from main.js.
 * Handles form submission feedback: shows "✓ Pesan Terkirim!" then resets.
 */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      e.target.reset();
    }, 3500);
  };

  return (
    <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nama Lengkap</label>
        <input type="text" id="name" placeholder="Masukkan nama Anda" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email / No. HP</label>
        <input type="text" id="email" placeholder="Masukkan kontak Anda" required />
      </div>
      <div className="form-group">
        <label>Keperluan</label>
        <div className="radio-group">
          <input
            type="radio"
            id="opt-admin"
            name="subject"
            value="Administrasi"
            required
            className="visually-hidden"
          />
          <label htmlFor="opt-admin" className="radio-pill">
            Administrasi Kependudukan
          </label>

          <input
            type="radio"
            id="opt-info"
            name="subject"
            value="Informasi"
            className="visually-hidden"
          />
          <label htmlFor="opt-info" className="radio-pill">
            Permintaan Informasi
          </label>

          <input
            type="radio"
            id="opt-pengaduan"
            name="subject"
            value="Pengaduan"
            className="visually-hidden"
          />
          <label htmlFor="opt-pengaduan" className="radio-pill">
            Pengaduan Masyarakat
          </label>

          <input
            type="radio"
            id="opt-lainnya"
            name="subject"
            value="Lainnya"
            className="visually-hidden"
          />
          <label htmlFor="opt-lainnya" className="radio-pill">
            Lainnya
          </label>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="message">Pesan</label>
        <textarea
          id="message"
          placeholder="Tuliskan pesan Anda di sini..."
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        style={{
          width: '100%',
          marginTop: '1rem',
          background: submitted
            ? 'linear-gradient(135deg, hsl(152, 70%, 40%), hsl(85, 65%, 50%))'
            : undefined,
        }}
      >
        {submitted ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            ✓ Pesan Terkirim!
          </span>
        ) : (
          'Kirim Pesan'
        )}
      </button>
    </form>
  );
}
