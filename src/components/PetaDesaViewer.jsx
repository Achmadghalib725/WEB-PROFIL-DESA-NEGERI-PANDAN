'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const WebGISMap = dynamic(() => import('@/components/WebGISMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '600px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--clr-bg-card, #0c1a13)',
        borderRadius: '16px',
        color: 'var(--clr-text-secondary)',
        gap: '16px',
      }}
    >
      <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <p style={{ fontSize: '0.9rem' }}>Memuat WebGIS Interaktif Leaflet...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  ),
});

export default function PetaDesaViewer() {
  const [activeTab, setActiveTab] = useState('webgis'); // 'webgis' | 'dokumen' | 'google'
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
    <div className="peta-desa-wrapper" style={{ marginTop: '1.5rem' }}>
      {/* Header & Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--clr-text-primary)', margin: '0 0 0.4rem 0' }}>
            Peta Digital & Administrasi Wilayah
          </h3>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Eksplorasi batas desa, pembagian dusun, dan sebaran fasilitas umum Desa Negeri Pandan secara interaktif.
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveTab('webgis')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'webgis' ? 'var(--clr-primary)' : 'transparent',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="ph-bold ph-stack"></i> WebGIS Interaktif (Leaflet)
          </button>
          <button
            onClick={() => setActiveTab('dokumen')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'dokumen' ? 'var(--clr-primary)' : 'transparent',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="ph-bold ph-map-trifold"></i> Peta Cetak ArcGIS (PDF)
          </button>
          <button
            onClick={() => setActiveTab('google')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'google' ? 'var(--clr-primary)' : 'transparent',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="ph-bold ph-navigation-arrow"></i> Google Maps
          </button>
        </div>
      </div>

      {/* ── TAB 1: WEBGIS INTERAKTIF (LEAFLET) ── */}
      {activeTab === 'webgis' && (
        <div>
          <WebGISMap />
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <Link href="/peta" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              Buka Halaman Penuh Peta WebGIS →
            </Link>
          </div>
        </div>
      )}

      {/* ── TAB 2: PETA CETAK ARCGIS (PREVIEW & ZOOM MODAL) ── */}
      {activeTab === 'dokumen' && (
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Action Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '1rem',
              paddingBottom: '0.8rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--clr-primary-light)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                Dokumen Resmi KKN Unila 2026
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                Skala 1:10.000 &bull; UTM Zone 48S
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={openModal}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="ph-bold ph-magnifying-glass-plus"></i> Perbesar (HD Zoom)
              </button>
              <a
                href="/documents/KKN.pdf"
                download="Peta-Desa-Negeri-Pandan.pdf"
                className="btn btn-outline"
                style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="ph-bold ph-download-simple"></i> Unduh PDF
              </a>
            </div>
          </div>

          {/* Interactive Image Container */}
          <div
            onClick={openModal}
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'zoom-in',
              background: '#040d07',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            className="peta-preview-box"
          >
            <Image
              src="/images/peta-desa.jpg"
              alt="Peta Administrasi Desa Negeri Pandan"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />

            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none',
              }}
            >
              <i className="ph-bold ph-arrows-out-cardinal"></i> Klik untuk melihat peta resolusi tinggi
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: GOOGLE MAPS EMBED ── */}
      {activeTab === 'google' && (
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=7JCJ%2BF3X,+Negeri+Pandan,+Kec.+Kalianda,+Kabupaten+Lampung+Selatan&t=k&z=15&ie=UTF8&iwloc=&output=embed"
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

      {/* ── MODAL VIEWER HD FULLSCREEN ── */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(3, 10, 6, 0.95)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Modal Header Bar */}
          <div
            style={{
              padding: '12px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="ph-bold ph-map-trifold" style={{ fontSize: '1.5rem', color: 'var(--clr-primary-light)' }}></i>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff' }}>
                  Peta Administrasi Desa Negeri Pandan (Resolusi Ultra-HD)
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
                  Gunakan scroll atau tombol zoom untuk memperbesar, klik & tahan untuk menggeser.
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '2px',
                }}
              >
                <button
                  onClick={handleZoomIn}
                  title="Perbesar"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '1rem',
                  }}
                >
                  <i className="ph-bold ph-plus"></i>
                </button>
                <span style={{ fontSize: '0.8rem', color: '#fff', padding: '0 8px', minWidth: '45px', textAlign: 'center' }}>
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomOut}
                  title="Perkecil"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '1rem',
                  }}
                >
                  <i className="ph-bold ph-minus"></i>
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Reset Ukuran"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Reset
                </button>
              </div>

              <a
                href="/documents/KKN.pdf"
                download="Peta-Desa-Negeri-Pandan-HD.pdf"
                className="btn btn-outline"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <i className="ph-bold ph-download-simple"></i> Unduh Asli
              </a>

              <button
                onClick={closeModal}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                title="Tutup (ESC)"
              >
                <i className="ph-bold ph-x"></i> Tutup
              </button>
            </div>
          </div>

          {/* Modal Pan/Zoom Canvas */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                position: 'relative',
                width: '92vw',
                height: '84vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/images/peta-desa-hd.jpg"
                alt="Peta HD Desa Negeri Pandan"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
