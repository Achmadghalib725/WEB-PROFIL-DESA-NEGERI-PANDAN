'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PetaDesaViewer() {
  const [activeTab, setActiveTab] = useState('administrasi'); // 'administrasi' | 'google'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.3, 0.8);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag / Pan in modal
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="peta-desa-wrapper" style={{ marginTop: '2rem' }}>
      {/* Tab Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveTab('administrasi')}
          className={`btn ${activeTab === 'administrasi' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            padding: '10px 22px',
            fontSize: '0.9rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
          }}
        >
          <i className="ph-bold ph-map-trifold" style={{ fontSize: '1.1rem' }}></i>
          Peta Administrasi Desa (GIS)
        </button>
        <button
          onClick={() => setActiveTab('google')}
          className={`btn ${activeTab === 'google' ? 'btn-primary' : 'btn-outline'}`}
          style={{
            padding: '10px 22px',
            fontSize: '0.9rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
          }}
        >
          <i className="ph-bold ph-globe-hemisphere-east" style={{ fontSize: '1.1rem' }}></i>
          Google Maps Satelit & Navigasi
        </button>
      </div>

      {/* Main Map Box */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {activeTab === 'administrasi' ? (
          <div>
            {/* Header info */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '1rem',
                paddingBottom: '0.8rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(46, 204, 128, 0.15)',
                    color: 'var(--clr-primary-light)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  <i className="ph-bold ph-check-circle"></i> Peta Spasial Resmi
                </span>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--clr-text)' }}>
                  Peta Wilayah Administrasi Desa Negeri Pandan
                </h3>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={openModal}
                  className="btn btn-outline"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                  }}
                  title="Klik untuk memperbesar peta"
                >
                  <i className="ph-bold ph-arrows-out"></i> Layar Penuh (Zoom)
                </button>
                <a
                  href="/documents/KKN.pdf"
                  download="Peta-Desa-Negeri-Pandan.pdf"
                  className="btn btn-primary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  <i className="ph-bold ph-download-simple"></i> Unduh PDF
                </a>
              </div>
            </div>

            {/* Interactive Image Preview Box */}
            <div
              onClick={openModal}
              style={{
                position: 'relative',
                width: '100%',
                height: '480px',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#0a1610',
              }}
              className="map-preview-container"
            >
              <Image
                src="/images/peta-desa.jpg"
                alt="Peta Administrasi Desa Negeri Pandan"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />

              {/* Overlay Prompt */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                }}
                className="map-overlay-hover"
              >
                <div
                  style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(3, 15, 9, 0.85)',
                    border: '1px solid var(--clr-primary-light)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  }}
                >
                  <i className="ph-bold ph-magnifying-glass-plus" style={{ fontSize: '1.2rem' }}></i>
                  Klik untuk Memperbesar & Zoom Detail
                </div>
              </div>

              {/* Floating Bottom Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--clr-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  pointerEvents: 'none',
                }}
              >
                <i className="ph-bold ph-hand-pointing"></i> Klik untuk navigasi / zoom
              </div>
            </div>

            {/* Map Footnote & Document details */}
            <div
              style={{
                marginTop: '1.2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                fontSize: '0.88rem',
                color: 'var(--clr-text-secondary)',
              }}
            >
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <strong style={{ color: 'var(--clr-primary-light)', display: 'block', marginBottom: '4px' }}>
                  <i className="ph-bold ph-buildings" style={{ marginRight: '6px' }}></i>
                  Cakupan Wilayah
                </strong>
                Desa Negeri Pandan, Kec. Kalianda, Kab. Lampung Selatan
              </div>

              <div
                style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <strong style={{ color: 'var(--clr-primary-light)', display: 'block', marginBottom: '4px' }}>
                  <i className="ph-bold ph-compass" style={{ marginRight: '6px' }}></i>
                  Sumber Data
                </strong>
                Pemetaan Spasial GIS KKN & Tim Desa Negeri Pandan
              </div>

              <div
                style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <strong style={{ color: 'var(--clr-primary-light)', display: 'block', marginBottom: '4px' }}>
                  <i className="ph-bold ph-file-pdf" style={{ marginRight: '6px' }}></i>
                  Format Asli
                </strong>
                <a
                  href="/documents/KKN.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--clr-primary-light)', textDecoration: 'underline' }}
                >
                  Buka Dokumen PDF (27 MB) ↗
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Google Maps View */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '1rem',
                paddingBottom: '0.8rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(46, 204, 128, 0.15)',
                    color: 'var(--clr-primary-light)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  <i className="ph-bold ph-navigation-arrow"></i> Navigasi Interaktif
                </span>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--clr-text)' }}>
                  Peta Lokasi Satelit Google Maps
                </h3>
              </div>

              <a
                href="https://maps.google.com/?q=Negeri+Pandan,+Kalianda,+Lampung+Selatan"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                <i className="ph-bold ph-arrow-square-out"></i> Buka di Google Maps
              </a>
            </div>

            <div
              style={{
                width: '100%',
                height: '480px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Negeri+Pandan,+Kec.+Kalianda,+Kabupaten+Lampung+Selatan&t=k&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Satelit Google Maps Desa Negeri Pandan"
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen HD Zoom Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={closeModal}
        >
          {/* Top Control Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              background: 'rgba(10, 20, 15, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="ph-bold ph-map-trifold" style={{ color: 'var(--clr-primary-light)', fontSize: '1.4rem' }}></i>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>
                  Peta Administrasi Desa Negeri Pandan (HD View)
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)' }}>
                  Gunakan tombol zoom atau drag untuk menggeser peta
                </span>
              </div>
            </div>

            {/* Zoom & Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleZoomIn}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}
                title="Perbesar (Zoom In)"
              >
                <i className="ph-bold ph-plus"></i>
              </button>
              <button
                onClick={handleZoomOut}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}
                title="Perkecil (Zoom Out)"
              >
                <i className="ph-bold ph-minus"></i>
              </button>
              <button
                onClick={handleResetZoom}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}
                title="Reset Ukuran"
              >
                <i className="ph-bold ph-arrows-counter-clockwise"></i> Reset ({Math.round(zoomLevel * 100)}%)
              </button>
              <a
                href="/documents/KKN.pdf"
                download="Peta-Desa-Negeri-Pandan.pdf"
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.85rem', borderRadius: '6px', textDecoration: 'none' }}
              >
                <i className="ph-bold ph-download-simple"></i> Unduh PDF
              </a>
              <button
                onClick={closeModal}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  marginLeft: '8px',
                }}
                title="Tutup (Esc)"
              >
                <i className="ph-bold ph-x"></i>
              </button>
            </div>
          </div>

          {/* Modal Map Canvas / Container */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                maxWidth: '92vw',
                maxHeight: '82vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/images/peta-desa-hd.jpg"
                alt="Peta Administrasi Desa Negeri Pandan Resolusi Tinggi"
                style={{
                  maxWidth: '100%',
                  maxHeight: '82vh',
                  objectFit: 'contain',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                  borderRadius: '8px',
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .map-preview-container:hover .map-overlay-hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
