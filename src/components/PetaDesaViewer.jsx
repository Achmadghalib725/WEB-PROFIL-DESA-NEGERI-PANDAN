'use client';
import { useState, useEffect, useRef } from 'react';
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
      <div
        className="spinner"
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(16, 185, 129, 0.2)',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <p style={{ fontSize: '0.9rem' }}>Memuat WebGIS Interaktif Leaflet...</p>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
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
  const touchStartDistRef = useRef(null);

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
    setZoomLevel((prev) => Math.min(Math.round((prev + 0.3) * 10) / 10, 4.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(Math.round((prev - 0.3) * 10) / 10, 0.8);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse pan handlers
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

  // Touch pan & pinch handlers for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    } else if (e.touches.length === 2) {
      // Pinch to zoom start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging && zoomLevel > 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchStartDistRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const scaleDelta = (newDist - touchStartDistRef.current) * 0.005;
      setZoomLevel((prev) => Math.min(Math.max(prev + scaleDelta, 0.8), 4.0));
      touchStartDistRef.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistRef.current = null;
  };

  return (
    <div className="peta-desa-viewer-root">
      {/* Header & Navigation Tabs */}
      <div className="viewer-header-row">
        <div className="viewer-title-group">
          <h3 className="viewer-main-title">Peta Digital & Administrasi Wilayah</h3>
          <p className="viewer-main-subtitle">
            Eksplorasi batas desa, pembagian dusun, dan sebaran fasilitas umum Desa Negeri Pandan secara interaktif.
          </p>
        </div>

        {/* Tab Buttons Container */}
        <div className="viewer-tab-bar">
          <button
            onClick={() => setActiveTab('webgis')}
            className={`viewer-tab-btn ${activeTab === 'webgis' ? 'active' : ''}`}
          >
            <i className="ph-bold ph-stack"></i>
            <span>WebGIS Interaktif</span>
          </button>
          <button
            onClick={() => setActiveTab('dokumen')}
            className={`viewer-tab-btn ${activeTab === 'dokumen' ? 'active' : ''}`}
          >
            <i className="ph-bold ph-map-trifold"></i>
            <span>Peta Cetak (PDF)</span>
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`viewer-tab-btn ${activeTab === 'google' ? 'active' : ''}`}
          >
            <i className="ph-bold ph-navigation-arrow"></i>
            <span>Google Maps</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: WEBGIS INTERAKTIF (LEAFLET) ── */}
      {activeTab === 'webgis' && (
        <div className="tab-content-fade">
          <WebGISMap />
          <div className="webgis-footer-link">
            <Link href="/peta" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              Buka Halaman Penuh Peta WebGIS →
            </Link>
          </div>
        </div>
      )}

      {/* ── TAB 2: PETA CETAK ARCGIS (PREVIEW & ZOOM MODAL) ── */}
      {activeTab === 'dokumen' && (
        <div className="tab-content-fade glass-card cetak-card-wrapper">
          {/* Action Toolbar */}
          <div className="cetak-toolbar">
            <div className="cetak-badges-group">
              <span className="badge-kkn">Dokumen Resmi KKN Unila 2026</span>
              <span className="badge-scale">Skala 1:10.000 &bull; UTM Zone 48S</span>
            </div>

            <div className="cetak-actions-group">
              <button onClick={openModal} className="btn btn-secondary cetak-btn">
                <i className="ph-bold ph-magnifying-glass-plus"></i>
                <span>Perbesar HD Zoom</span>
              </button>
              <a
                href="/documents/KKN.pdf"
                download="Peta-Desa-Negeri-Pandan.pdf"
                className="btn btn-outline cetak-btn"
              >
                <i className="ph-bold ph-download-simple"></i>
                <span>Unduh PDF</span>
              </a>
            </div>
          </div>

          {/* Interactive Image Container */}
          <div onClick={openModal} className="peta-preview-box">
            <Image
              src="/images/peta-desa.jpg"
              alt="Peta Administrasi Desa Negeri Pandan"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />

            <div className="peta-preview-badge">
              <i className="ph-bold ph-arrows-out-cardinal"></i>
              <span>Klik untuk melihat peta resolusi tinggi</span>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: GOOGLE MAPS EMBED ── */}
      {activeTab === 'google' && (
        <div className="tab-content-fade glass-card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div className="gmaps-container">
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
        <div className="modal-hd-backdrop">
          {/* Modal Header Bar */}
          <div className="modal-hd-header">
            <div className="modal-hd-title-block">
              <div className="modal-icon-badge">
                <i className="ph-bold ph-map-trifold"></i>
              </div>
              <div className="modal-text-wrap">
                <h4 className="modal-heading">Peta Administrasi Desa Negeri Pandan</h4>
                <p className="modal-subheading">
                  Format Cetak Resolusi Ultra-HD &bull; Geser/Zoom untuk detail
                </p>
              </div>
            </div>

            {/* Desktop Zoom & Action Buttons */}
            <div className="modal-hd-desktop-controls">
              <div className="zoom-pill-box">
                <button onClick={handleZoomIn} title="Perbesar" className="zoom-step-btn">
                  <i className="ph-bold ph-plus"></i>
                </button>
                <span className="zoom-percentage-text">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={handleZoomOut} title="Perkecil" className="zoom-step-btn">
                  <i className="ph-bold ph-minus"></i>
                </button>
                <button onClick={handleResetZoom} title="Reset Ukuran" className="zoom-reset-btn">
                  Reset
                </button>
              </div>

              <a
                href="/documents/KKN.pdf"
                download="Peta-Desa-Negeri-Pandan-HD.pdf"
                className="btn btn-outline modal-btn"
              >
                <i className="ph-bold ph-download-simple"></i>
                <span>Unduh PDF</span>
              </a>

              <button onClick={closeModal} className="btn btn-secondary modal-btn" title="Tutup (ESC)">
                <i className="ph-bold ph-x"></i>
                <span>Tutup</span>
              </button>
            </div>

            {/* Mobile Close Button (Top Right) */}
            <button onClick={closeModal} className="modal-mobile-close-btn" aria-label="Tutup Peta">
              <i className="ph-bold ph-x"></i>
            </button>
          </div>

          {/* Modal Pan/Zoom Canvas */}
          <div
            className={`modal-canvas-area ${zoomLevel > 1 ? (isDragging ? 'is-dragging' : 'can-drag') : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={() => (zoomLevel === 1 ? handleZoomIn() : handleResetZoom())}
          >
            <div
              className="modal-image-wrapper"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src="/images/peta-desa-hd.jpg"
                alt="Peta HD Desa Negeri Pandan"
                className="modal-hd-img"
              />
            </div>
          </div>

          {/* Mobile Floating Zoom & Download Bar (Bottom) */}
          <div className="modal-mobile-bottom-dock">
            <div className="mobile-zoom-pill">
              <button onClick={handleZoomOut} className="m-zoom-btn" title="Perkecil">
                <i className="ph-bold ph-minus"></i>
              </button>
              <span className="m-zoom-val">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={handleZoomIn} className="m-zoom-btn" title="Perbesar">
                <i className="ph-bold ph-plus"></i>
              </button>
              <button onClick={handleResetZoom} className="m-zoom-reset">
                Reset
              </button>
            </div>

            <a
              href="/documents/KKN.pdf"
              download="Peta-Desa-Negeri-Pandan-HD.pdf"
              className="mobile-download-btn"
            >
              <i className="ph-bold ph-download-simple"></i>
              <span>Unduh PDF</span>
            </a>
          </div>
        </div>
      )}

      {/* ── STYLING ── */}
      <style jsx>{`
        .peta-desa-viewer-root {
          margin-top: 1.5rem;
          width: 100%;
        }

        .tab-content-fade {
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .viewer-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .viewer-title-group {
          flex: 1;
          min-width: 260px;
        }

        .viewer-main-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--clr-text-primary, #ffffff);
          margin: 0 0 0.35rem 0;
        }

        .viewer-main-subtitle {
          color: var(--clr-text-secondary, #94a3b8);
          font-size: 0.88rem;
          margin: 0;
          line-height: 1.5;
        }

        .viewer-tab-bar {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          gap: 4px;
          flex-wrap: wrap;
        }

        .viewer-tab-btn {
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .viewer-tab-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .viewer-tab-btn.active {
          background: var(--clr-primary, #10b981);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }

        .webgis-footer-link {
          margin-top: 1rem;
          text-align: right;
        }

        /* ── Cetak Tab Styling ── */
        .cetak-card-wrapper {
          padding: 1.25rem;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }

        .cetak-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 1rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cetak-badges-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .badge-kkn {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .badge-scale {
          font-size: 0.82rem;
          color: #94a3b8;
        }

        .cetak-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cetak-btn {
          font-size: 0.82rem;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .peta-preview-box {
          position: relative;
          width: 100%;
          height: 520px;
          border-radius: 12px;
          overflow: hidden;
          cursor: zoom-in;
          background: #040d07;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
        }

        .peta-preview-badge {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .gmaps-container {
          position: relative;
          width: 100%;
          height: 520px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* ── Fullscreen HD Modal Styling ── */
        .modal-hd-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: rgba(3, 10, 6, 0.96);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-hd-header {
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(12, 26, 19, 0.85);
          backdrop-filter: blur(12px);
          gap: 16px;
        }

        .modal-hd-title-block {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }

        .modal-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .modal-text-wrap {
          min-width: 0;
        }

        .modal-heading {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-subheading {
          margin: 2px 0 0 0;
          font-size: 0.78rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-hd-desktop-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .zoom-pill-box {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 2px;
        }

        .zoom-step-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: background 0.15s ease;
        }

        .zoom-step-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .zoom-percentage-text {
          font-size: 0.82rem;
          font-weight: 600;
          color: #ffffff;
          padding: 0 10px;
          min-width: 50px;
          text-align: center;
        }

        .zoom-reset-btn {
          background: transparent;
          border: none;
          color: #34d399;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          border-left: 1px solid rgba(255, 255, 255, 0.12);
        }

        .zoom-reset-btn:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .modal-btn {
          padding: 8px 14px;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .modal-mobile-close-btn {
          display: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          flex-shrink: 0;
        }

        .modal-canvas-area {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          touch-action: none;
        }

        .modal-canvas-area.can-drag {
          cursor: grab;
        }

        .modal-canvas-area.is-dragging {
          cursor: grabbing;
        }

        .modal-image-wrapper {
          position: relative;
          width: 94vw;
          height: 84vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-hd-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          border-radius: 8px;
        }

        .modal-mobile-bottom-dock {
          display: none;
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: rgba(12, 26, 19, 0.9);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(16, 185, 129, 0.4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          border-radius: 16px;
          padding: 6px 10px;
          align-items: center;
          gap: 10px;
        }

        .mobile-zoom-pill {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 2px;
        }

        .m-zoom-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          padding: 8px 12px;
          font-size: 1rem;
          cursor: pointer;
        }

        .m-zoom-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          padding: 0 6px;
          min-width: 44px;
          text-align: center;
        }

        .m-zoom-reset {
          background: transparent;
          border: none;
          color: #34d399;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 10px;
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
        }

        .mobile-download-btn {
          background: #10b981;
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
        }

        /* ── RESPONSIVE RULES ── */
        @media (max-width: 768px) {
          .viewer-tab-bar {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
          }

          .viewer-tab-btn {
            flex: 1;
            justify-content: center;
            white-space: nowrap;
            font-size: 0.8rem;
            padding: 8px 12px;
          }

          .cetak-toolbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .cetak-actions-group {
            width: 100%;
          }

          .cetak-btn {
            flex: 1;
            justify-content: center;
          }

          .peta-preview-box,
          .gmaps-container {
            height: 380px;
          }

          .modal-hd-header {
            padding: 10px 14px;
          }

          .modal-heading {
            font-size: 0.95rem;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }

          .modal-subheading {
            display: none;
          }

          .modal-icon-badge {
            width: 32px;
            height: 32px;
            font-size: 1.1rem;
          }

          .modal-hd-desktop-controls {
            display: none;
          }

          .modal-mobile-close-btn {
            display: flex;
          }

          .modal-mobile-bottom-dock {
            display: flex;
          }

          .modal-image-wrapper {
            width: 100vw;
            height: 80vh;
          }
        }
      `}</style>
    </div>
  );
}
