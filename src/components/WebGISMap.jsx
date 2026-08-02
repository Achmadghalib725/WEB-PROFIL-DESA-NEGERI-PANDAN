'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  DESA_INFO,
  PETA_CONFIG,
  MASK_LUAR_DESA,
  BATAS_DESA_POLYGON,
  JARINGAN_JALAN,
  JARINGAN_SUNGAI,
  FASILITAS_DESA,
} from '@/data/petaDesaData';
import 'leaflet/dist/leaflet.css';

export default function WebGISMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef({});
  const wrapperRef = useRef(null);

  // Layer Visibility State
  const [layers, setLayers] = useState({
    maskLuar: true,
    batasDesa: true,
    jalan: true,
    sungai: true,
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
    jaringan: true,
    pemerintahan: true,
    ibadah: true,
    pendidikan: true,
    kesehatan: true,
  });

  // Mobile Bottom Sheet / Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  // Desktop Sidebar Collapse state (allow user to minimize sidebar on desktop)
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

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

  // Count active facilities
  const activeFacilityCount = useMemo(() => {
    return FASILITAS_DESA.filter(
      (f) => layers.categories[f.category] && layers.facilityItems[f.id]
    ).length;
  }, [layers]);

  // Toggle Group Collapse
  const toggleGroup = (grp) => {
    setOpenGroups((prev) => ({ ...prev, [grp]: !prev[grp] }));
  };

  // Toggle All Groups
  const toggleAllGroups = (expand) => {
    setOpenGroups({
      wilayah: expand,
      jaringan: expand,
      pemerintahan: expand,
      ibadah: expand,
      pendidikan: expand,
      kesehatan: expand,
    });
  };

  // Select / Deselect All Facilities
  const toggleAllFacilities = (enable) => {
    setLayers((prev) => {
      const updatedCategories = {
        pemerintahan: enable,
        ibadah: enable,
        pendidikan: enable,
        kesehatan: enable,
      };
      const updatedItems = {};
      FASILITAS_DESA.forEach((f) => {
        updatedItems[f.id] = enable;
      });
      return {
        ...prev,
        categories: updatedCategories,
        facilityItems: updatedItems,
      };
    });
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current
        .requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Reset View to Bounds
  const resetMapView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(PETA_CONFIG.bounds, {
        padding: [30, 30],
        animate: true,
        duration: 1,
      });
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

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

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

      // Fit bounds initially
      map.fitBounds(PETA_CONFIG.bounds, { padding: [30, 30] });

      // 3. Tile Layers
      const tileLayers = {
        satellite: L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, BIG',
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

      // 5. Inverted Mask (Gelapkan area luar desa)
      const maskLayer = L.polygon(MASK_LUAR_DESA, {
        color: 'transparent',
        fillColor: '#000000',
        fillOpacity: 0.55,
      });
      layersGroupRef.current.maskLayer = maskLayer;
      if (layers.maskLuar) maskLayer.addTo(map);

      // 6. Batas Desa Polygon (Outline resmi BIG)
      const batasDesaLayer = L.polygon(BATAS_DESA_POLYGON, {
        color: '#10b981',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '8, 6',
        fillColor: '#10b981',
        fillOpacity: 0.12,
      }).bindTooltip(
        `<b>Batas Administrasi Desa Negeri Pandan</b><br/><span style="font-size: 11px;">Luas: ${DESA_INFO.luasHa} Ha &bull; Sumber: BIG</span>`,
        {
          sticky: true,
          direction: 'top',
          className: 'custom-leaflet-tooltip',
        }
      );
      layersGroupRef.current.batasDesaLayer = batasDesaLayer;
      if (layers.batasDesa) batasDesaLayer.addTo(map);

      // 7. Jaringan Jalan
      const jalanGroup = L.layerGroup();
      JARINGAN_JALAN.forEach((j) => {
        let roadColor = '#fbbf24';
        let roadWeight = 2.5;
        if (j.type.includes('Tol')) {
          roadColor = '#ef4444';
          roadWeight = 3.5;
        } else if (j.type.includes('Kolektor') || j.type.includes('Arteri')) {
          roadColor = '#f59e0b';
          roadWeight = 3;
        } else if (j.type.includes('Lokal')) {
          roadColor = '#38bdf8';
          roadWeight = 2.5;
        }

        const polyline = L.polyline(j.coordinates, {
          color: roadColor,
          weight: roadWeight,
          opacity: 0.85,
        }).bindTooltip(`<b>${j.name}</b>`, {
          sticky: true,
          className: 'custom-leaflet-tooltip',
        });
        polyline.addTo(jalanGroup);
      });
      layersGroupRef.current.jalanGroup = jalanGroup;
      if (layers.jalan) jalanGroup.addTo(map);

      // 8. Jaringan Sungai
      const sungaiGroup = L.layerGroup();
      JARINGAN_SUNGAI.forEach((s) => {
        const polyline = L.polyline(s.coordinates, {
          color: '#38bdf8',
          weight: 2.8,
          opacity: 0.9,
        }).bindTooltip(`<b>${s.name}</b>`, {
          sticky: true,
          className: 'custom-leaflet-tooltip',
        });
        polyline.addTo(sungaiGroup);
      });
      layersGroupRef.current.sungaiGroup = sungaiGroup;
      if (layers.sungai) sungaiGroup.addTo(map);

      // 9. Facilities / Markers Group
      const facilityMarkers = {};
      FASILITAS_DESA.forEach((item) => {
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
            case 'ph-shield-check':
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.54,15.54,0,0,0,10,0c15.18-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-34.34,77.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,156.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>';
            case 'ph-drop':
              return '<svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M174.63,94.34,133.66,36.08a8,8,0,0,0-13.32,0L79.37,94.34A79.4,79.4,0,0,0,64,144a64,64,0,0,0,128,0A79.4,79.4,0,0,0,174.63,94.34ZM128,192a48,48,0,0,1-48-48,63.66,63.66,0,0,1,12.35-37.45L128,56.67l35.65,49.88A63.66,63.66,0,0,1,176,144,48,48,0,0,1,128,192Z"/></svg>';
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

        const elevationBadge = item.elevation
          ? `<span style="background: #e2e8f0; color: #334155; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px;">Elevasi: ${item.elevation} m</span>`
          : '';

        const popupHTML = `
          <div style="font-family: 'Inter', sans-serif; min-width: 230px; color: #1e293b; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
              <span style="background: ${item.color}; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 9999px; text-transform: uppercase;">
                ${item.categoryLabel}
              </span>
              ${elevationBadge}
            </div>
            <h4 style="font-size: 14px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a; line-height: 1.3;">
              ${item.name}
            </h4>
            <p style="font-size: 12px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
              ${item.description}
            </p>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
              📍 ${item.address}
            </div>
            <div style="font-size: 10px; color: #94a3b8; margin-bottom: 10px; font-family: monospace;">
              Koor: ${item.coords[0].toFixed(6)}, ${item.coords[1].toFixed(6)}
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

  // Update Base Tile Layer
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
    const { maskLayer, batasDesaLayer, jalanGroup, sungaiGroup, facilityMarkers } =
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

    // Jalan
    if (jalanGroup) {
      if (layers.jalan) jalanGroup.addTo(map);
      else map.removeLayer(jalanGroup);
    }

    // Sungai
    if (sungaiGroup) {
      if (layers.sungai) sungaiGroup.addTo(map);
      else map.removeLayer(sungaiGroup);
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
      if (isMobileDrawerOpen) setIsMobileDrawerOpen(false);
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

  // Reusable Layers List Content (Used in both Desktop Sidebar and Mobile Bottom Sheet)
  const renderLayersTree = () => (
    <div className="webgis-layers-list-inner">
      {/* Search Bar */}
      <div className="webgis-search-wrapper">
        <div className="webgis-search-input-box">
          <i className="ph-bold ph-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Cari fasilitas di peta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="search-clear-btn">
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Tools */}
      <div className="webgis-quick-actions">
        <button onClick={() => toggleAllFacilities(true)} className="action-pill-btn">
          <i className="ph-bold ph-check-square"></i> Pilih Semua
        </button>
        <button onClick={() => toggleAllFacilities(false)} className="action-pill-btn">
          <i className="ph-bold ph-square"></i> Sembunyikan
        </button>
        <button
          onClick={() => toggleAllGroups(!openGroups.pemerintahan)}
          className="action-pill-btn"
        >
          <i className="ph-bold ph-arrows-out-line-vertical"></i> Lipat/Buka
        </button>
      </div>

      {/* 1. Batas Wilayah Group */}
      <div className="layer-group-card">
        <div onClick={() => toggleGroup('wilayah')} className="layer-group-header">
          <div className="group-title-left">
            <span className="group-icon-badge" style={{ background: '#10b98122', color: '#10b981' }}>
              <i className="ph-bold ph-map-trifold"></i>
            </span>
            <span className="group-label">Batas Administrasi Desa</span>
          </div>
          <i className={`ph-bold ${openGroups.wilayah ? 'ph-caret-up' : 'ph-caret-down'}`}></i>
        </div>

        {openGroups.wilayah && (
          <div className="layer-group-body">
            <label className="layer-item-row">
              <input
                type="checkbox"
                checked={layers.maskLuar}
                onChange={(e) => setLayers((prev) => ({ ...prev, maskLuar: e.target.checked }))}
                style={{ accentColor: '#10b981' }}
              />
              <span className="color-dot" style={{ background: '#475569' }}></span>
              <span>Area Luar Batas Desa (Dim)</span>
            </label>

            <label className="layer-item-row">
              <input
                type="checkbox"
                checked={layers.batasDesa}
                onChange={(e) => setLayers((prev) => ({ ...prev, batasDesa: e.target.checked }))}
                style={{ accentColor: '#10b981' }}
              />
              <span className="color-dot" style={{ background: '#10b981' }}></span>
              <span>Batas Desa (227 Titik Poligon BIG)</span>
            </label>
          </div>
        )}
      </div>

      {/* 2. Jaringan Infrastruktur (Jalan & Sungai) */}
      <div className="layer-group-card">
        <div onClick={() => toggleGroup('jaringan')} className="layer-group-header">
          <div className="group-title-left">
            <span className="group-icon-badge" style={{ background: '#f59e0b22', color: '#f59e0b' }}>
              <i className="ph-bold ph-git-branch"></i>
            </span>
            <span className="group-label">Jaringan Infrastruktur</span>
          </div>
          <i className={`ph-bold ${openGroups.jaringan ? 'ph-caret-up' : 'ph-caret-down'}`}></i>
        </div>

        {openGroups.jaringan && (
          <div className="layer-group-body">
            <label className="layer-item-row">
              <input
                type="checkbox"
                checked={layers.jalan}
                onChange={(e) => setLayers((prev) => ({ ...prev, jalan: e.target.checked }))}
                style={{ accentColor: '#fbbf24' }}
              />
              <span className="color-dot" style={{ background: '#fbbf24' }}></span>
              <span>Jaringan Jalan ({JARINGAN_JALAN.length} Segmen)</span>
            </label>

            <label className="layer-item-row">
              <input
                type="checkbox"
                checked={layers.sungai}
                onChange={(e) => setLayers((prev) => ({ ...prev, sungai: e.target.checked }))}
                style={{ accentColor: '#38bdf8' }}
              />
              <span className="color-dot" style={{ background: '#38bdf8' }}></span>
              <span>Jaringan Aliran Sungai ({JARINGAN_SUNGAI.length} Segmen)</span>
            </label>
          </div>
        )}
      </div>

      {/* Category Groups: Pemerintahan, Ibadah, Pendidikan, Kesehatan */}
      {[
        { key: 'pemerintahan', label: 'Pemerintahan & Fasilitas Umum', icon: 'ph-bank', color: '#2563eb' },
        { key: 'ibadah', label: 'Tempat Ibadah', icon: 'ph-mosque', color: '#059669' },
        { key: 'pendidikan', label: 'Sarana Pendidikan', icon: 'ph-graduation-cap', color: '#ea580c' },
        { key: 'kesehatan', label: 'Layanan Kesehatan', icon: 'ph-first-aid', color: '#dc2626' },
      ].map((cat) => {
        const catItems = FASILITAS_DESA.filter((f) => f.category === cat.key);
        if (catItems.length === 0) return null;

        return (
          <div key={cat.key} className="layer-group-card">
            <div className="layer-group-header">
              <label className="group-checkbox-label">
                <input
                  type="checkbox"
                  checked={layers.categories[cat.key] || false}
                  onChange={() => handleCategoryToggle(cat.key)}
                  style={{ accentColor: cat.color }}
                />
                <span
                  className="group-icon-badge"
                  style={{ background: `${cat.color}22`, color: cat.color }}
                >
                  <i className={`ph-bold ${cat.icon}`}></i>
                </span>
                <span className="group-label">{cat.label}</span>
              </label>

              <button
                onClick={() => toggleGroup(cat.key)}
                className="group-collapse-btn"
                aria-label="Toggle group"
              >
                <i className={`ph-bold ${openGroups[cat.key] ? 'ph-caret-up' : 'ph-caret-down'}`}></i>
              </button>
            </div>

            {openGroups[cat.key] && (
              <div className="layer-group-body">
                {catItems.map((item) => (
                  <div key={item.id} className="facility-item-row">
                    <label className="facility-checkbox-label">
                      <input
                        type="checkbox"
                        checked={layers.facilityItems[item.id] || false}
                        onChange={() => handleItemToggle(item.id, cat.key)}
                        style={{ accentColor: item.color }}
                      />
                      <span className="color-dot" style={{ background: item.color }}></span>
                      <span className="facility-name-text">{item.name}</span>
                    </label>

                    <button
                      onClick={() => focusLocation(item.coords)}
                      title="Arahkan Peta ke Lokasi"
                      className="focus-crosshair-btn"
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
  );

  return (
    <div
      ref={wrapperRef}
      className={`webgis-root-container ${isFullscreen ? 'webgis-fullscreen' : ''}`}
    >
      {/* ── TOP NAV BAR ── */}
      <div className="webgis-topbar">
        <div className="topbar-left">
          <Image
            src="/images/logo-lamsel.png"
            alt="Logo Kabupaten Lampung Selatan"
            width={32}
            height={32}
            className="topbar-logo"
          />
          <div className="topbar-info">
            <h2 className="topbar-title">WebGIS Desa {DESA_INFO.nama}</h2>
            <p className="topbar-subtitle">
              Luas: <strong>{DESA_INFO.luasHa.toLocaleString('id-ID')} Ha</strong> ({DESA_INFO.delineasi})
            </p>
          </div>
        </div>

        <div className="topbar-controls">
          {/* Base Layer Switcher (Desktop & Tablet) */}
          <div className="basemap-pill-group">
            <button
              onClick={() => setBaseTile('satellite')}
              className={`basemap-btn ${baseTile === 'satellite' ? 'active' : ''}`}
            >
              🛰️ Satelit
            </button>
            <button
              onClick={() => setBaseTile('osm')}
              className={`basemap-btn ${baseTile === 'osm' ? 'active' : ''}`}
            >
              🗺️ Jalan
            </button>
            <button
              onClick={() => setBaseTile('dark')}
              className={`basemap-btn ${baseTile === 'dark' ? 'active' : ''}`}
            >
              🌙 Dark
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={resetMapView}
            className="topbar-action-btn"
            title="Reset Peta ke Batas Desa"
          >
            <i className="ph-bold ph-arrows-out-cardinal"></i>
            <span className="btn-label-desktop">Reset View</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="topbar-action-btn"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            <i className={`ph-bold ${isFullscreen ? 'ph-corners-in' : 'ph-corners-out'}`}></i>
            <span className="btn-label-desktop">
              {isFullscreen ? 'Tutup Fullscreen' : 'Layar Penuh'}
            </span>
          </button>
        </div>
      </div>

      {/* ── MOBILE HORIZONTAL QUICK FILTER CAROUSEL (Chips) ── */}
      <div className="mobile-quick-chips-wrapper">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="chip-btn chip-highlight"
        >
          <i className="ph-bold ph-sliders-horizontal"></i>
          <span>Layer ({activeFacilityCount})</span>
        </button>
        <button
          onClick={() => setLayers((p) => ({ ...p, batasDesa: !p.batasDesa }))}
          className={`chip-btn ${layers.batasDesa ? 'chip-active-emerald' : ''}`}
        >
          🗺️ Batas Desa
        </button>
        <button
          onClick={() => setLayers((p) => ({ ...p, jalan: !p.jalan }))}
          className={`chip-btn ${layers.jalan ? 'chip-active-yellow' : ''}`}
        >
          🛣️ Jalan
        </button>
        <button
          onClick={() => setLayers((p) => ({ ...p, sungai: !p.sungai }))}
          className={`chip-btn ${layers.sungai ? 'chip-active-blue' : ''}`}
        >
          🌊 Sungai
        </button>
        <button
          onClick={() => handleCategoryToggle('pemerintahan')}
          className={`chip-btn ${layers.categories.pemerintahan ? 'chip-active-blue' : ''}`}
        >
          🏛️ Balai & Fasum
        </button>
        <button
          onClick={() => handleCategoryToggle('ibadah')}
          className={`chip-btn ${layers.categories.ibadah ? 'chip-active-emerald' : ''}`}
        >
          🕌 Masjid
        </button>
        <button
          onClick={() => handleCategoryToggle('pendidikan')}
          className={`chip-btn ${layers.categories.pendidikan ? 'chip-active-orange' : ''}`}
        >
          🏫 Sekolah
        </button>
        <button
          onClick={() => handleCategoryToggle('kesehatan')}
          className={`chip-btn ${layers.categories.kesehatan ? 'chip-active-red' : ''}`}
        >
          🏥 Kesehatan
        </button>
      </div>

      {/* ── MAIN WORKSPACE (Desktop Sidebar + Map Canvas) ── */}
      <div
        className={`webgis-workspace ${
          isDesktopSidebarCollapsed ? 'sidebar-collapsed' : ''
        }`}
      >
        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="webgis-desktop-sidebar">
          {/* Sidebar Top Header */}
          <div className="sidebar-header-fixed">
            <div className="sidebar-header-title-box">
              <span className="sidebar-title-text">
                <i className="ph-bold ph-stack"></i> Layer Peta (GIS)
              </span>
              <span className="active-badge">
                {activeFacilityCount}/{FASILITAS_DESA.length} Aktif
              </span>
            </div>
            <button
              onClick={() => setIsDesktopSidebarCollapsed(true)}
              className="sidebar-collapse-toggle-btn"
              title="Sembunyikan Panel Samping"
            >
              <i className="ph-bold ph-caret-left"></i>
            </button>
          </div>

          {/* Scrollable Tree Container */}
          <div className="webgis-layers-scroll-container">
            {renderLayersTree()}
          </div>

          {/* Sidebar Fixed Bottom Footer */}
          <div className="sidebar-footer-fixed">
            <div className="footer-meta-row">
              <span>Format Data:</span>
              <strong style={{ color: 'var(--clr-primary-light)' }}>SHP & GeoJSON (BIG)</strong>
            </div>
            <div className="footer-btn-grid">
              <a
                href="/gis/batas-desa.geojson"
                download="batas-desa-negeri-pandan.geojson"
                className="footer-dl-btn btn-geojson"
              >
                <i className="ph-bold ph-download-simple"></i> GeoJSON
              </a>
              <a
                href="/documents/KKN.pdf"
                download="Peta-Desa-Negeri-Pandan.pdf"
                className="footer-dl-btn btn-pdf"
              >
                <i className="ph-bold ph-file-pdf"></i> Peta PDF
              </a>
            </div>
          </div>
        </aside>

        {/* Collapsed Sidebar Expand Button (Floating on left when sidebar hidden) */}
        {isDesktopSidebarCollapsed && (
          <button
            onClick={() => setIsDesktopSidebarCollapsed(false)}
            className="sidebar-expand-float-btn"
            title="Tampilkan Panel Layer"
          >
            <i className="ph-bold ph-stack"></i>
            <span>Layer</span>
          </button>
        )}

        {/* ── MAP CONTAINER ── */}
        <main className="webgis-map-canvas-wrapper">
          <div ref={mapContainerRef} className="webgis-leaflet-canvas" />

          {/* Live Coordinates Floating HUD */}
          <div className="floating-hud-coords">
            <span className="hud-live-dot">●</span>
            <span>
              {cursorCoords.lat.toFixed(5)}, {cursorCoords.lng.toFixed(5)}
            </span>
          </div>

          {/* Mobile Bottom Floating Action Trigger */}
          <div className="mobile-floating-dock">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="dock-layer-btn"
            >
              <i className="ph-bold ph-stack"></i>
              <span>Kelola Layer ({activeFacilityCount})</span>
            </button>

            <div className="dock-tile-selector">
              <button
                onClick={() => setBaseTile('satellite')}
                className={`dock-tile-btn ${baseTile === 'satellite' ? 'active' : ''}`}
                title="Satelit"
              >
                🛰️
              </button>
              <button
                onClick={() => setBaseTile('osm')}
                className={`dock-tile-btn ${baseTile === 'osm' ? 'active' : ''}`}
                title="Jalan"
              >
                🗺️
              </button>
              <button
                onClick={() => setBaseTile('dark')}
                className={`dock-tile-btn ${baseTile === 'dark' ? 'active' : ''}`}
                title="Dark"
              >
                🌙
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ── MOBILE BOTTOM SHEET / DRAWER ── */}
      {isMobileDrawerOpen && (
        <div className="mobile-sheet-overlay" onClick={() => setIsMobileDrawerOpen(false)}>
          <div
            className="mobile-sheet-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="sheet-drag-handle-bar">
              <div className="sheet-drag-handle" />
            </div>

            {/* Sheet Header */}
            <div className="sheet-header">
              <div>
                <h3 className="sheet-title">Filter & Layer Peta</h3>
                <p className="sheet-subtitle">
                  {activeFacilityCount} dari {FASILITAS_DESA.length} Fasilitas Ditampilkan
                </p>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="sheet-close-btn"
                aria-label="Tutup"
              >
                <i className="ph-bold ph-x"></i>
              </button>
            </div>

            {/* Sheet Scrollable Layers Tree */}
            <div className="sheet-body-scroll">
              {renderLayersTree()}
            </div>

            {/* Sheet Footer */}
            <div className="sheet-footer">
              <div className="sheet-download-row">
                <a
                  href="/gis/batas-desa.geojson"
                  download="batas-desa-negeri-pandan.geojson"
                  className="footer-dl-btn btn-geojson"
                >
                  <i className="ph-bold ph-download-simple"></i> GeoJSON
                </a>
                <a
                  href="/documents/KKN.pdf"
                  download="Peta-Desa-Negeri-Pandan.pdf"
                  className="footer-dl-btn btn-pdf"
                >
                  <i className="ph-bold ph-file-pdf"></i> PDF
                </a>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="sheet-apply-btn"
              >
                Terapkan & Lihat Peta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GLOBAL COMPONENT STYLES ── */}
      <style jsx global>{`
        /* Root container */
        .webgis-root-container {
          width: 100%;
          background: var(--clr-bg-card, #0c1a13);
          border-radius: var(--radius-lg, 16px);
          border: 1px solid var(--clr-border, rgba(255, 255, 255, 0.08));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .webgis-root-container.webgis-fullscreen {
          border-radius: 0 !important;
          border: none !important;
          position: fixed !important;
          inset: 0 !important;
          z-index: 99999 !important;
          height: 100vh !important;
          width: 100vw !important;
        }

        /* Topbar */
        .webgis-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: rgba(12, 26, 19, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          gap: 12px;
          flex-shrink: 0;
          z-index: 10;
        }
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .topbar-logo {
          object-fit: contain;
          flex-shrink: 0;
        }
        .topbar-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--clr-primary-light, #34d399);
          margin: 0;
          line-height: 1.2;
        }
        .topbar-subtitle {
          font-size: 0.73rem;
          color: var(--clr-text-muted, #94a3b8);
          margin: 2px 0 0 0;
        }
        .topbar-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .basemap-pill-group {
          display: flex;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 2px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .basemap-btn {
          background: transparent;
          color: #cbd5e1;
          border: none;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .basemap-btn.active {
          background: var(--clr-primary, #10b981);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        }
        .topbar-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          color: #f1f5f9;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .topbar-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Mobile Quick Horizontal Chips */
        .mobile-quick-chips-wrapper {
          display: none;
          overflow-x: auto;
          white-space: nowrap;
          padding: 8px 12px;
          background: rgba(8, 19, 13, 0.98);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          gap: 6px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .mobile-quick-chips-wrapper::-webkit-scrollbar {
          display: none;
        }
        .chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.76rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.06);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .chip-btn.chip-highlight {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border-color: rgba(16, 185, 129, 0.5);
        }
        .chip-btn.chip-active-emerald {
          background: #10b981;
          color: #ffffff;
          border-color: #10b981;
        }
        .chip-btn.chip-active-yellow {
          background: #f59e0b;
          color: #000000;
          border-color: #f59e0b;
          font-weight: 700;
        }
        .chip-btn.chip-active-blue {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }
        .chip-btn.chip-active-orange {
          background: #ea580c;
          color: #ffffff;
          border-color: #ea580c;
        }
        .chip-btn.chip-active-red {
          background: #dc2626;
          color: #ffffff;
          border-color: #dc2626;
        }

        /* Workspace Grid (Sidebar + Map) */
        .webgis-workspace {
          display: grid;
          grid-template-columns: 340px 1fr;
          height: 680px;
          min-height: 0;
          position: relative;
          overflow: hidden;
        }
        .webgis-root-container.webgis-fullscreen .webgis-workspace {
          height: calc(100vh - 60px) !important;
        }
        .webgis-workspace.sidebar-collapsed {
          grid-template-columns: 0px 1fr !important;
        }

        /* Desktop Sidebar */
        .webgis-desktop-sidebar {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
          min-height: 0;
          background: var(--clr-bg, #08130d);
          border-right: 1px solid var(--clr-border, rgba(255, 255, 255, 0.08));
          overflow: hidden;
          position: relative;
          z-index: 5;
        }
        .sidebar-header-fixed {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
        }
        .sidebar-header-title-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sidebar-title-text {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: var(--clr-primary-light, #34d399);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .active-badge {
          font-size: 0.7rem;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 600;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .sidebar-collapse-toggle-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1rem;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-collapse-toggle-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* Scrollable Layers Container */
        .webgis-layers-scroll-container {
          flex: 1 1 0%;
          min-height: 0;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          padding: 12px 14px;
        }

        /* Custom Scrollbar */
        .webgis-layers-scroll-container::-webkit-scrollbar,
        .sheet-body-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .webgis-layers-scroll-container::-webkit-scrollbar-track,
        .sheet-body-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 3px;
        }
        .webgis-layers-scroll-container::-webkit-scrollbar-thumb,
        .sheet-body-scroll::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.35);
          border-radius: 3px;
        }
        .webgis-layers-scroll-container::-webkit-scrollbar-thumb:hover,
        .sheet-body-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.65);
        }

        /* Inner Tree */
        .webgis-layers-list-inner {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .webgis-search-wrapper {
          margin-bottom: 2px;
        }
        .webgis-search-input-box {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 8px;
          padding: 7px 10px;
          gap: 8px;
          color: #94a3b8;
        }
        .webgis-search-input-box input {
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 0.82rem;
          width: 100%;
        }
        .webgis-search-input-box input::placeholder {
          color: #64748b;
        }
        .search-clear-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1rem;
          cursor: pointer;
          line-height: 1;
        }

        .webgis-quick-actions {
          display: flex;
          gap: 6px;
          margin-bottom: 2px;
        }
        .action-pill-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          padding: 5px 6px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-pill-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        /* Layer Group Cards */
        .layer-group-card {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          overflow: hidden;
        }
        .layer-group-header {
          padding: 9px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.035);
          cursor: pointer;
          user-select: none;
        }
        .group-title-left,
        .group-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin: 0;
          flex: 1;
        }
        .group-icon-badge {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .group-label {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--clr-text, #f1f5f9);
        }
        .group-collapse-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px 4px;
        }
        .layer-group-body {
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }
        .layer-item-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #cbd5e1;
          cursor: pointer;
          margin: 0;
        }
        .facility-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 6px;
          border-radius: 6px;
          transition: background 0.15s;
        }
        .facility-item-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .facility-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #cbd5e1;
          cursor: pointer;
          margin: 0;
          flex: 1;
          min-width: 0;
        }
        .facility-name-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          display: inline-block;
        }
        .focus-crosshair-btn {
          background: transparent;
          border: none;
          color: #34d399;
          cursor: pointer;
          padding: 2px 4px;
          font-size: 0.9rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .focus-crosshair-btn:hover {
          color: #ffffff;
          background: rgba(16, 185, 129, 0.3);
        }

        /* Sidebar Fixed Footer */
        .sidebar-footer-fixed {
          padding: 10px 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-shrink: 0;
        }
        .footer-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          color: #94a3b8;
        }
        .footer-btn-grid {
          display: flex;
          gap: 6px;
        }
        .footer-dl-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.73rem;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-geojson {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }
        .btn-geojson:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .btn-pdf {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }
        .btn-pdf:hover {
          background: #10b981;
          color: #ffffff;
        }

        /* Sidebar Expand Floating Button */
        .sidebar-expand-float-btn {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(8, 19, 13, 0.9);
          backdrop-filter: blur(8px);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }

        /* Map Canvas */
        .webgis-map-canvas-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }
        .webgis-leaflet-canvas {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        /* Floating HUD */
        .floating-hud-coords {
          position: absolute;
          bottom: 12px;
          left: 12px;
          z-index: 990;
          background: rgba(5, 15, 10, 0.85);
          backdrop-filter: blur(8px);
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.72rem;
          color: #ffffff;
          font-family: monospace;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hud-live-dot {
          color: #34d399;
          font-size: 0.85rem;
          animation: pulseDot 2s infinite;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Mobile Floating Bottom Dock */
        .mobile-floating-dock {
          display: none;
          position: absolute;
          bottom: 14px;
          left: 12px;
          right: 12px;
          z-index: 990;
          gap: 8px;
          align-items: center;
        }
        .dock-layer-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(12, 26, 19, 0.95);
          backdrop-filter: blur(12px);
          color: #ffffff;
          border: 1.5px solid rgba(16, 185, 129, 0.6);
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }
        .dock-tile-selector {
          display: flex;
          background: rgba(12, 26, 19, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          gap: 4px;
        }
        .dock-tile-btn {
          background: transparent;
          border: none;
          font-size: 1rem;
          padding: 6px 8px;
          border-radius: 8px;
          cursor: pointer;
        }
        .dock-tile-btn.active {
          background: var(--clr-primary, #10b981);
        }

        /* Mobile Sheet Modal */
        .mobile-sheet-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease-out;
        }
        .mobile-sheet-drawer {
          background: #091710;
          border-top: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 20px 20px 0 0;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.6);
        }
        .sheet-drag-handle-bar {
          padding-top: 10px;
          display: flex;
          justify-content: center;
        }
        .sheet-drag-handle {
          width: 40px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.25);
        }
        .sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sheet-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }
        .sheet-subtitle {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }
        .sheet-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
        }
        .sheet-body-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 14px 18px;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .sheet-footer {
          padding: 12px 18px 24px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sheet-download-row {
          display: flex;
          gap: 8px;
        }
        .sheet-apply-btn {
          width: 100%;
          background: #10b981;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        /* ── RESPONSIVE STYLING ── */
        @media (max-width: 900px) {
          .webgis-workspace {
            grid-template-columns: 1fr !important;
            height: 560px !important;
          }
          .webgis-desktop-sidebar {
            display: none !important;
          }
          .mobile-quick-chips-wrapper {
            display: flex !important;
          }
          .mobile-floating-dock {
            display: flex !important;
          }
          .floating-hud-coords {
            bottom: 64px !important;
          }
          .btn-label-desktop {
            display: none;
          }
          .basemap-pill-group {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .topbar-subtitle {
            display: none;
          }
          .webgis-workspace {
            height: 500px !important;
          }
        }
      `}</style>
    </div>
  );
}
