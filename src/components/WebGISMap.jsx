'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  PETA_CONFIG,
  MASK_LUAR_DESA,
  BATAS_DESA_POLYGON,
  BATAS_DUSUN_DATA,
  BATAS_RT_LINES,
  FASILITAS_DESA,
} from '@/data/petaDesaData';
import 'leaflet/dist/leaflet.css';

export default function WebGISMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef({});

  // Layer Visibility State
  const [layers, setLayers] = useState({
    maskLuar: true,
    batasDesa: true,
    batasDusun: {
      'dusun-1': false,
      'dusun-2': false,
      'dusun-3': false,
      'dusun-4': false,
      'dusun-5': false,
      'dusun-6': false,
    },
    batasRT: true,
    categories: {
      pemerintahan: true,
      ibadah: true,
      pendidikan: true,
      kesehatan: true,
    },
    facilityItems: FASILITAS_DESA.reduce((acc, f) => {
      acc[f.id] = true;
      return acc;
    }, {}),
  });

  // Collapsible Groups in Sidebar
  const [openGroups, setOpenGroups] = useState({
    wilayah: true,
    pemerintahan: true,
    ibadah: true,
    pendidikan: true,
    kesehatan: true,
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  // Active Tile Layer ('satellite' | 'osm' | 'dark')
  const [baseTile, setBaseTile] = useState('satellite');
  // Live Cursor Coordinates
  const [cursorCoords, setCursorCoords] = useState({
    lat: PETA_CONFIG.center[0],
    lng: PETA_CONFIG.center[1],
  });
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef(null);

  // Toggle Collapse
  const toggleGroup = (grp) => {
    setOpenGroups((prev) => ({ ...prev, [grp]: !prev[grp] }));
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean existing instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // 1. Create Map
      const map = L.map(mapContainerRef.current, {
        center: PETA_CONFIG.center,
        zoom: PETA_CONFIG.zoom,
        minZoom: PETA_CONFIG.minZoom,
        maxZoom: PETA_CONFIG.maxZoom,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // 2. Add Zoom control to top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // 3. Tile Layers
      const tileLayers = {
        satellite: L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          }
        ),
        osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }),
        dark: L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 19,
            attribution: '&copy; CartoDB',
          }
        ),
      };

      tileLayers[baseTile].addTo(map);
      layersGroupRef.current.tileLayers = tileLayers;
      layersGroupRef.current.currentTile = tileLayers[baseTile];

      // 4. Mouse Move Tracker
      map.on('mousemove', (e) => {
        setCursorCoords({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      });

      // 5. Inverted Mask (Gelapkan area luar batas desa)
      const maskLayer = L.polygon(MASK_LUAR_DESA, {
        color: 'transparent',
        fillColor: '#000000',
        fillOpacity: 0.55,
      });
      layersGroupRef.current.maskLayer = maskLayer;
      if (layers.maskLuar) maskLayer.addTo(map);

      // 6. Batas Desa Polygon (Outline utama)
      const batasDesaLayer = L.polygon(BATAS_DESA_POLYGON, {
        color: '#10b981',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '8, 6',
        fillColor: '#10b981',
        fillOpacity: 0.08,
      }).bindTooltip('<b>Batas Wilayah Desa Negeri Pandan</b>', {
        sticky: true,
        direction: 'top',
        className: 'custom-leaflet-tooltip',
      });
      layersGroupRef.current.batasDesaLayer = batasDesaLayer;
      if (layers.batasDesa) batasDesaLayer.addTo(map);

      // 7. Batas Dusun Polygons
      const dusunLayerGroups = {};
      BATAS_DUSUN_DATA.forEach((d) => {
        const poly = L.polygon(d.polygon, {
          color: d.color,
          weight: 2,
          opacity: 0.85,
          fillColor: d.color,
          fillOpacity: 0.22,
        }).bindTooltip(`<b>${d.name}</b>`, {
          sticky: true,
          direction: 'center',
          className: 'custom-leaflet-tooltip',
        });
        dusunLayerGroups[d.id] = poly;
        if (layers.batasDusun[d.id]) poly.addTo(map);
      });
      layersGroupRef.current.dusunLayerGroups = dusunLayerGroups;

      // 8. Batas RT Lines
      const rtLineGroup = L.layerGroup();
      BATAS_RT_LINES.forEach((line) => {
        const pline = L.polyline(line.coordinates, {
          color: '#f97316',
          weight: 2.2,
          opacity: 0.9,
          dashArray: '4, 4',
        }).bindTooltip(`<b>${line.name}</b>`, {
          sticky: true,
          className: 'custom-leaflet-tooltip',
        });
        pline.addTo(rtLineGroup);
      });
      layersGroupRef.current.rtLineGroup = rtLineGroup;
      if (layers.batasRT) rtLineGroup.addTo(map);

      // 9. Facilities / Markers Group
      const facilityMarkers = {};
      FASILITAS_DESA.forEach((item) => {
        // Icon rendering
        const getIconSVG = (iconName) => {
          switch (iconName) {
            case 'ph-bank':
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M224,208H32a8,8,0,0,1,0-16H224a8,8,0,0,1,0,16ZM48,176H208a8,8,0,0,0,8-8V112a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56A8,8,0,0,0,48,176Zm16-56H88v40H64Zm40,0h24v40H104Zm40,0h24v40H144Zm40,0h24v40H184ZM237.66,85.66l-104-56a8,8,0,0,0-7.32,0l-104,56A8,8,0,0,0,24,96v8a8,8,0,0,0,8,8H224a8,8,0,0,0,8-8V96A8,8,0,0,0,237.66,85.66Z"/></svg>';
            case 'ph-mosque':
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M240,112H224V88a8,8,0,0,0-8-8H200a8,8,0,0,0-8,8v24H184V72a56.06,56.06,0,0,0-56-56h0A56.06,56.06,0,0,0,72,72v40H56V88a8,8,0,0,0-8-8H32a8,8,0,0,0-8,8v24H8a8,8,0,0,0-8,8v96a8,8,0,0,0,8,8H248a8,8,0,0,0,8-8V120A8,8,0,0,0,240,112ZM128,32a40,40,0,0,1,40,40v40H88V72A40,40,0,0,1,128,32Zm112,176H16V128H32v72a8,8,0,0,0,16,0V96H48v16a8,8,0,0,0,8,8H72v80a8,8,0,0,0,16,0V128h80v72a8,8,0,0,0,16,0V120h16a8,8,0,0,0,8-8V96h0v104a8,8,0,0,0,16,0V128h16Z"/></svg>';
            case 'ph-graduation-cap':
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a32.16,32.16,0,0,0,12.7,25.64l64,48a32,32,0,0,0,38.6,0l64-48A32.16,32.16,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM208,166.29a16.08,16.08,0,0,1-6.35,12.82l-64,48a16,16,0,0,1-19.3,0l-64-48A16.08,16.08,0,0,1,48,166.29V126.4l76.24,40.66a8,8,0,0,0,7.52,0L208,126.4ZM128,150.62,28.63,96,128,41.38,227.37,96Z"/></svg>';
            case 'ph-first-aid':
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40A16,16,0,0,0,24,64V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,200H40V64H216V200Zm-80-96H112a8,8,0,0,0-8,8v16H88a8,8,0,0,0-8,8v16a8,8,0,0,0,8,8h16v16a8,8,0,0,0,8,8h16a8,8,0,0,0,8-8V160h16a8,8,0,0,0,8-8V136a8,8,0,0,0-8-8H144V112A8,8,0,0,0,136,104Z"/></svg>';
            case 'ph-lightning':
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M215.79,118.17a8,8,0,0,0-7.79-6.17H144V32a8,8,0,0,0-13.66-5.66l-96,96a8,8,0,0,0,5.66,13.66H112v80a8,8,0,0,0,13.66,5.66l96-96A8,8,0,0,0,215.79,118.17Z"/></svg>';
            case 'ph-broadcast':
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M128,144a16,16,0,1,0-16-16A16,16,0,0,0,128,144Zm0-64a48,48,0,0,0-48,48,8,8,0,0,0,16,0,32,32,0,0,1,32-32,8,8,0,0,0,0-16Zm48,48a48.05,48.05,0,0,0-48-48,8,8,0,0,0,0,16,32,32,0,0,1,32,32,8,8,0,0,0,16,0Zm32,0a80.09,80.09,0,0,0-80-80,8,8,0,0,0,0,16,64.07,64.07,0,0,1,64,64,8,8,0,0,0,16,0ZM48,128a80.09,80.09,0,0,0,80,80,8,8,0,0,0,0-16,64.07,64.07,0,0,1-64-64,8,8,0,0,0-16,0Z"/></svg>';
            default:
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,120a32,32,0,1,1,32-32A32,32,0,0,1,128,136Z"/></svg>';
          }
        };

        const customIcon = L.divIcon({
          className: 'custom-webgis-marker',
          html: `
            <div class="webgis-pin-bubble" style="background: ${item.color}; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px ${item.color}88;">
              ${getIconSVG(item.icon)}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -20],
        });

        const popupHTML = `
          <div style="font-family: 'Inter', sans-serif; min-width: 220px; color: #1e293b; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="background: ${item.color}; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 9999px; text-transform: uppercase;">
                ${item.categoryLabel}
              </span>
            </div>
            <h4 style="font-size: 14px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a; line-height: 1.3;">
              ${item.name}
            </h4>
            <p style="font-size: 12px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
              ${item.description}
            </p>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 10px;">
              📍 ${item.address}
            </div>
            <a href="https://maps.google.com/?q=${item.coords[0]},${item.coords[1]}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: #2563eb; color: #ffffff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600;">
              Navigasi Google Maps ↗
            </a>
          </div>
        `;

        const marker = L.marker(item.coords, { icon: customIcon }).bindPopup(popupHTML);

        facilityMarkers[item.id] = marker;
        if (layers.categories[item.category] && layers.facilityItems[item.id]) {
          marker.addTo(map);
        }
      });
      layersGroupRef.current.facilityMarkers = facilityMarkers;
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Layer when `baseTile` changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const { tileLayers, currentTile } = layersGroupRef.current;
    if (!map || !tileLayers) return;

    if (currentTile) map.removeLayer(currentTile);
    const nextTile = tileLayers[baseTile];
    if (nextTile) {
      nextTile.addTo(map);
      layersGroupRef.current.currentTile = nextTile;
    }
  }, [baseTile]);

  // Update Layers when state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const { maskLayer, batasDesaLayer, dusunLayerGroups, rtLineGroup, facilityMarkers } =
      layersGroupRef.current;
    if (!map) return;

    // Mask
    if (maskLayer) {
      if (layers.maskLuar) maskLayer.addTo(map);
      else map.removeLayer(maskLayer);
    }

    // Batas Desa
    if (batasDesaLayer) {
      if (layers.batasDesa) batasDesaLayer.addTo(map);
      else map.removeLayer(batasDesaLayer);
    }

    // Batas Dusun
    if (dusunLayerGroups) {
      Object.keys(dusunLayerGroups).forEach((did) => {
        const poly = dusunLayerGroups[did];
        if (layers.batasDusun[did]) poly.addTo(map);
        else map.removeLayer(poly);
      });
    }

    // Batas RT
    if (rtLineGroup) {
      if (layers.batasRT) rtLineGroup.addTo(map);
      else map.removeLayer(rtLineGroup);
    }

    // Facility Markers
    if (facilityMarkers) {
      FASILITAS_DESA.forEach((item) => {
        const m = facilityMarkers[item.id];
        if (!m) return;
        const isCatActive = layers.categories[item.category];
        const isItemActive = layers.facilityItems[item.id];
        const matchesSearch =
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.address.toLowerCase().includes(searchQuery.toLowerCase());

        if (isCatActive && isItemActive && matchesSearch) {
          m.addTo(map);
        } else {
          map.removeLayer(m);
        }
      });
    }
  }, [layers, searchQuery]);

  // Fly to item on click
  const focusLocation = (coords) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 17, { duration: 1.2 });
    }
  };

  // Master Category Checkbox handler
  const handleCategoryToggle = (categoryKey) => {
    const nextVal = !layers.categories[categoryKey];
    setLayers((prev) => {
      const updatedCat = { ...prev.categories, [categoryKey]: nextVal };
      const updatedItems = { ...prev.facilityItems };
      FASILITAS_DESA.filter((f) => f.category === categoryKey).forEach((f) => {
        updatedItems[f.id] = nextVal;
      });
      return {
        ...prev,
        categories: updatedCat,
        facilityItems: updatedItems,
      };
    });
  };

  const handleItemToggle = (itemId, categoryKey) => {
    setLayers((prev) => {
      const updatedItems = { ...prev.facilityItems, [itemId]: !prev.facilityItems[itemId] };
      const catItems = FASILITAS_DESA.filter((f) => f.category === categoryKey);
      const allChecked = catItems.every((f) => updatedItems[f.id]);
      return {
        ...prev,
        categories: { ...prev.categories, [categoryKey]: allChecked },
        facilityItems: updatedItems,
      };
    });
  };

  return (
    <div
      ref={wrapperRef}
      className={`webgis-container ${isFullscreen ? 'webgis-fullscreen' : ''}`}
      style={{
        width: '100%',
        background: 'var(--clr-bg-card, #0c1a13)',
        borderRadius: isFullscreen ? '0' : 'var(--radius-lg, 16px)',
        border: isFullscreen ? 'none' : '1px solid var(--clr-border, rgba(255,255,255,0.08))',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top App Sub-Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid var(--clr-border, rgba(255,255,255,0.06))',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image
            src="/images/logo-lamsel.png"
            alt="Logo Kabupaten Lampung Selatan"
            width={28}
            height={28}
            style={{ objectFit: 'contain' }}
          />
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-primary-light)' }}>
              Peta Digital Desa Negeri Pandan
            </span>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>
              Kec. Kalianda, Lampung Selatan &bull; Sistem Informasi Geografis Spasial
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Base Layer Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => setBaseTile('satellite')}
              style={{
                background: baseTile === 'satellite' ? 'var(--clr-primary, #10b981)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🛰️ Satelit
            </button>
            <button
              onClick={() => setBaseTile('osm')}
              style={{
                background: baseTile === 'osm' ? 'var(--clr-primary, #10b981)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🗺️ Jalan
            </button>
            <button
              onClick={() => setBaseTile('dark')}
              style={{
                background: baseTile === 'dark' ? 'var(--clr-primary, #10b981)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🌙 Dark
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="btn btn-outline"
            style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '8px' }}
          >
            <i className={`ph-bold ${isFullscreen ? 'ph-corners-in' : 'ph-corners-out'}`}></i>{' '}
            {isFullscreen ? 'Tutup Fullscreen' : 'Buka Layar Penuh'}
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Map */}
      <div
        className="webgis-main-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          minHeight: isFullscreen ? 'calc(100vh - 60px)' : '650px',
          height: isFullscreen ? 'calc(100vh - 60px)' : '650px',
        }}
      >
        {/* ── LEFT SIDEBAR: LAYER PETA ── */}
        <div
          className="webgis-sidebar"
          style={{
            background: 'var(--clr-bg, #08130d)',
            borderRight: '1px solid var(--clr-border, rgba(255,255,255,0.08))',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--clr-border, rgba(255,255,255,0.06))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--clr-primary-light)',
              }}
            >
              <i className="ph-bold ph-stack" style={{ marginRight: '6px' }}></i> Layer Peta
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                background: 'rgba(255, 255, 255, 0.06)',
                padding: '2px 8px',
                borderRadius: '9999px',
                color: 'var(--clr-text-muted)',
              }}
            >
              {FASILITAS_DESA.length} Titik
            </span>
          </div>

          {/* Search box */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '6px 10px',
                gap: '6px',
              }}
            >
              <i className="ph-bold ph-magnifying-glass" style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}></i>
              <input
                type="text"
                placeholder="Cari fasilitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.82rem',
                  width: '100%',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--clr-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Tree Layers */}
          <div
            className="webgis-layers-list"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 1. Batas Wilayah Group */}
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => toggleGroup('wilayah')}
                style={{
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#10b98122',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                    }}
                  >
                    <i className="ph-bold ph-map-trifold"></i>
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)' }}>
                    Batas Wilayah
                  </span>
                </div>
                <i
                  className={`ph-bold ${openGroups.wilayah ? 'ph-caret-up' : 'ph-caret-down'}`}
                  style={{ color: 'var(--clr-text-muted)', fontSize: '0.8rem' }}
                ></i>
              </div>

              {openGroups.wilayah && (
                <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Mask */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--clr-text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={layers.maskLuar}
                      onChange={(e) => setLayers((prev) => ({ ...prev, maskLuar: e.target.checked }))}
                      style={{ accentColor: '#10b981' }}
                    />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#475569', display: 'inline-block' }}></span>
                    Area Luar Batas Desa (Dim)
                  </label>

                  {/* Batas Desa */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--clr-text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={layers.batasDesa}
                      onChange={(e) => setLayers((prev) => ({ ...prev, batasDesa: e.target.checked }))}
                      style={{ accentColor: '#10b981' }}
                    />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    Batas Desa Negeri Pandan
                  </label>

                  {/* 6 Dusun Items */}
                  {BATAS_DUSUN_DATA.map((d) => (
                    <label
                      key={d.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.78rem',
                        color: 'var(--clr-text-secondary)',
                        paddingLeft: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={layers.batasDusun[d.id] || false}
                        onChange={(e) =>
                          setLayers((prev) => ({
                            ...prev,
                            batasDusun: { ...prev.batasDusun, [d.id]: e.target.checked },
                          }))
                        }
                        style={{ accentColor: d.color }}
                      />
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: d.color,
                          display: 'inline-block',
                        }}
                      ></span>
                      {d.name}
                    </label>
                  ))}

                  {/* Batas RT */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--clr-text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={layers.batasRT}
                      onChange={(e) => setLayers((prev) => ({ ...prev, batasRT: e.target.checked }))}
                      style={{ accentColor: '#f97316' }}
                    />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }}></span>
                    Batas RT (RT 01 - RT 12)
                  </label>
                </div>
              )}
            </div>

            {/* Category Groups: Pemerintahan, Ibadah, Pendidikan, Kesehatan */}
            {[
              { key: 'pemerintahan', label: 'Pemerintahan & Umum', icon: 'ph-bank', color: '#2563eb' },
              { key: 'ibadah', label: 'Tempat Ibadah', icon: 'ph-mosque', color: '#059669' },
              { key: 'pendidikan', label: 'Pendidikan', icon: 'ph-graduation-cap', color: '#ea580c' },
              { key: 'kesehatan', label: 'Layanan Kesehatan', icon: 'ph-first-aid', color: '#dc2626' },
            ].map((cat) => {
              const catItems = FASILITAS_DESA.filter((f) => f.category === cat.key);
              if (catItems.length === 0) return null;

              return (
                <div
                  key={cat.key}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={layers.categories[cat.key] || false}
                        onChange={() => handleCategoryToggle(cat.key)}
                        style={{ accentColor: cat.color }}
                      />
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: `${cat.color}22`,
                          color: cat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                        }}
                      >
                        <i className={`ph-bold ${cat.icon}`}></i>
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)' }}>
                        {cat.label}
                      </span>
                    </label>

                    <button
                      onClick={() => toggleGroup(cat.key)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--clr-text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <i className={`ph-bold ${openGroups[cat.key] ? 'ph-caret-up' : 'ph-caret-down'}`}></i>
                    </button>
                  </div>

                  {openGroups[cat.key] && (
                    <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingLeft: '6px',
                          }}
                        >
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '0.78rem',
                              color: 'var(--clr-text-secondary)',
                              cursor: 'pointer',
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={layers.facilityItems[item.id] || false}
                              onChange={() => handleItemToggle(item.id, cat.key)}
                              style={{ accentColor: item.color }}
                            />
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: item.color,
                                flexShrink: 0,
                              }}
                            ></span>
                            <span title={item.name}>{item.name}</span>
                          </label>

                          <button
                            onClick={() => focusLocation(item.coords)}
                            title="Arahkan Peta ke Titik Ini"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--clr-primary-light)',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              padding: '2px 4px',
                            }}
                          >
                            <i className="ph-bold ph-crosshair"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT MAP CANVAS ── */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Leaflet DOM container */}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

          {/* Top Left Watermark Card inside Map (Matching user screenshot) */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              zIndex: 1000,
              background: 'rgba(3, 15, 9, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              maxWidth: '380px',
            }}
          >
            <Image
              src="/images/logo-lamsel.png"
              alt="Logo KKN Unila & Lampung Selatan"
              width={34}
              height={34}
              style={{ objectFit: 'contain' }}
            />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                WebGIS by KKN Unila 2026
              </h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--clr-text-secondary, #94a3b8)' }}>
                Peta digital bangunan, fasilitas & batas wilayah Desa Negeri Pandan
              </p>
            </div>
          </div>

          {/* Top Right "Unduh Peta" Quick Button */}
          <div style={{ position: 'absolute', top: '14px', right: '54px', zIndex: 1000 }}>
            <a
              href="/documents/KKN.pdf"
              download="Peta-Desa-Negeri-Pandan.pdf"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(3, 15, 9, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <i className="ph-bold ph-download-simple"></i> Unduh Peta (PDF)
            </a>
          </div>

          {/* Bottom Left Cursor Coordinates Box (Like in screenshot) */}
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              zIndex: 1000,
              background: 'rgba(3, 15, 9, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: '#38bdf8',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            {cursorCoords.lat.toFixed(6)}, {cursorCoords.lng.toFixed(6)}
          </div>
        </div>
      </div>

      {/* Global CSS for Leaflet & Custom Markers */}
      <style jsx global>{`
        .custom-webgis-marker {
          background: transparent;
          border: none;
        }
        .webgis-pin-bubble {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .webgis-pin-bubble:hover {
          transform: scale(1.25);
        }
        .custom-leaflet-tooltip {
          background: rgba(3, 15, 9, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
          border-radius: 6px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
        }
        .custom-leaflet-tooltip::before {
          border-top-color: rgba(3, 15, 9, 0.9) !important;
        }
        .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
          padding: 6px !important;
        }
        .leaflet-popup-tip {
          background: #ffffff !important;
        }
        .webgis-fullscreen {
          position: fixed !important;
          inset: 0 !important;
          z-index: 99999 !important;
          width: 100vw !important;
          height: 100vh !important;
          border-radius: 0 !important;
        }
        @media (max-width: 900px) {
          .webgis-main-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .webgis-sidebar {
            max-height: 280px;
          }
        }
      `}</style>
    </div>
  );
}
