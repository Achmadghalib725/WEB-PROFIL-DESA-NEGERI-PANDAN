// Data Spasial & Fasilitas WebGIS Desa Negeri Pandan, Kec. Kalianda, Kab. Lampung Selatan
// Berdasarkan Hasil Pemetaan GIS KKN Unila 2026 & Referensi BIG

export const PETA_CONFIG = {
  center: [-5.7188, 105.6345],
  zoom: 15,
  minZoom: 13,
  maxZoom: 19,
};

// Batas Luar Mask (Inverted Polygon) untuk menggelapkan area luar desa
export const MASK_LUAR_DESA = [
  // Outer world polygon bounding box
  [
    [-80, -180],
    [-80, 180],
    [80, 180],
    [80, -180],
  ],
  // Inner hole (Polygon Desa Negeri Pandan)
  [
    [-5.7042, 105.6265],
    [-5.7078, 105.6352],
    [-5.7125, 105.6448],
    [-5.7182, 105.6515],
    [-5.7258, 105.6492],
    [-5.7335, 105.6438],
    [-5.7352, 105.6365],
    [-5.7328, 105.6275],
    [-5.7265, 105.6228],
    [-5.7185, 105.6212],
    [-5.7108, 105.6225],
    [-5.7042, 105.6265],
  ],
];

// Polygon Batas Desa Negeri Pandan
export const BATAS_DESA_POLYGON = [
  [-5.7042, 105.6265],
  [-5.7078, 105.6352],
  [-5.7125, 105.6448],
  [-5.7182, 105.6515],
  [-5.7258, 105.6492],
  [-5.7335, 105.6438],
  [-5.7352, 105.6365],
  [-5.7328, 105.6275],
  [-5.7265, 105.6228],
  [-5.7185, 105.6212],
  [-5.7108, 105.6225],
  [-5.7042, 105.6265],
];

// Garis / Polygon Batas Dusun
export const BATAS_DUSUN_DATA = [
  {
    id: 'dusun-1',
    name: 'Dusun I - Way Temaga',
    color: '#10b981',
    polygon: [
      [-5.7042, 105.6265],
      [-5.7078, 105.6352],
      [-5.7135, 105.6345],
      [-5.7118, 105.6248],
      [-5.7042, 105.6265],
    ],
  },
  {
    id: 'dusun-2',
    name: 'Dusun II - Way Salak',
    color: '#3b82f6',
    polygon: [
      [-5.7078, 105.6352],
      [-5.7125, 105.6448],
      [-5.7175, 105.6425],
      [-5.7135, 105.6345],
      [-5.7078, 105.6352],
    ],
  },
  {
    id: 'dusun-3',
    name: 'Dusun III - Way Hanau',
    color: '#f59e0b',
    polygon: [
      [-5.7125, 105.6448],
      [-5.7182, 105.6515],
      [-5.7238, 105.6465],
      [-5.7175, 105.6425],
      [-5.7125, 105.6448],
    ],
  },
  {
    id: 'dusun-4',
    name: 'Dusun IV - Way Pandan',
    color: '#8b5cf6',
    polygon: [
      [-5.7135, 105.6345],
      [-5.7175, 105.6425],
      [-5.7238, 105.6465],
      [-5.7225, 105.6335],
      [-5.7135, 105.6345],
    ],
  },
  {
    id: 'dusun-5',
    name: 'Dusun V - Kumbang Tanjung',
    color: '#ec4899',
    polygon: [
      [-5.7225, 105.6335],
      [-5.7238, 105.6465],
      [-5.7258, 105.6492],
      [-5.7335, 105.6438],
      [-5.7285, 105.6322],
      [-5.7225, 105.6335],
    ],
  },
  {
    id: 'dusun-6',
    name: 'Dusun VI - Lubuk Jukung',
    color: '#06b6d4',
    polygon: [
      [-5.7118, 105.6248],
      [-5.7225, 105.6335],
      [-5.7285, 105.6322],
      [-5.7352, 105.6365],
      [-5.7328, 105.6275],
      [-5.7265, 105.6228],
      [-5.7185, 105.6212],
      [-5.7118, 105.6248],
    ],
  },
];

// Garis Batas RT
export const BATAS_RT_LINES = [
  {
    id: 'rt-line-1',
    name: 'Batas RT 01 - RT 02 (Way Temaga)',
    coordinates: [
      [-5.7065, 105.6295],
      [-5.7102, 105.6325],
    ],
  },
  {
    id: 'rt-line-2',
    name: 'Batas RT 03 - RT 04 (Way Salak)',
    coordinates: [
      [-5.7105, 105.6385],
      [-5.7152, 105.6402],
    ],
  },
  {
    id: 'rt-line-3',
    name: 'Batas RT 05 - RT 06 (Kedaton / Way Hanau)',
    coordinates: [
      [-5.7155, 105.6455],
      [-5.7198, 105.6472],
    ],
  },
  {
    id: 'rt-line-4',
    name: 'Batas RT 07 - RT 08 (Way Pandan)',
    coordinates: [
      [-5.7172, 105.6362],
      [-5.7215, 105.6388],
    ],
  },
  {
    id: 'rt-line-5',
    name: 'Batas RT 09 - RT 10 (Kumbang Tanjung)',
    coordinates: [
      [-5.7245, 105.6385],
      [-5.7295, 105.6408],
    ],
  },
  {
    id: 'rt-line-6',
    name: 'Batas RT 11 - RT 12 (Lubuk Jukung)',
    coordinates: [
      [-5.7215, 105.6265],
      [-5.7285, 105.6285],
    ],
  },
];

// Titik-titik Fasilitas & Bangunan Penting
export const FASILITAS_DESA = [
  // Pemerintahan & Fasilitas Umum
  {
    id: 'kantor-desa',
    name: 'Kantor Balai Desa Negeri Pandan',
    category: 'pemerintahan',
    categoryLabel: 'Pemerintahan',
    coords: [-5.719889, 105.632639],
    icon: 'ph-bank',
    color: '#2563eb', // Blue
    bgColor: '#3b82f6',
    address: 'JL. Kedaton, RT.05/RW.03, Negeri Pandan',
    description: 'Pusat pelayanan administrasi pemerintahan Desa Negeri Pandan.',
  },
  {
    id: 'lapas-kalianda',
    name: 'Lapas Kelas IIA Kalianda',
    category: 'pemerintahan',
    categoryLabel: 'Pemerintahan & Hukum',
    coords: [-5.7235, 105.6265],
    icon: 'ph-shield-check',
    color: '#475569',
    bgColor: '#64748b',
    address: 'Jl. Lintas Sumatera, Kec. Kalianda',
    description: 'Lembaga Pemasyarakatan Kelas IIA Kalianda.',
  },
  {
    id: 'pln-gardu',
    name: 'PLN PT (Persero) Gardu Induk Kalianda',
    category: 'pemerintahan',
    categoryLabel: 'Infrastruktur Publik',
    coords: [-5.7272, 105.6288],
    icon: 'ph-lightning',
    color: '#d97706',
    bgColor: '#f59e0b',
    address: 'Wilayah Desa Negeri Pandan',
    description: 'Gardu Induk transmisi dan distribusi listrik wilayah Kalianda.',
  },
  {
    id: 'tower-xl',
    name: 'Tower XL Negeri Pandan',
    category: 'pemerintahan',
    categoryLabel: 'Telekomunikasi',
    coords: [-5.7165, 105.6342],
    icon: 'ph-broadcast',
    color: '#7c3aed',
    bgColor: '#8b5cf6',
    address: 'Dusun Way Pandan',
    description: 'Menara pemancar jaringan telekomunikasi seluler.',
  },
  {
    id: 'mata-air',
    name: 'Sumber Mata Air Desa',
    category: 'pemerintahan',
    categoryLabel: 'Sumber Daya Alam',
    coords: [-5.7118, 105.6415],
    icon: 'ph-drop',
    color: '#0284c7',
    bgColor: '#0ea5e9',
    address: 'Dusun Way Hanau',
    description: 'Sumber mata air alami penghidupan dan irigasi pertanian masyarakat.',
  },
  {
    id: 'makam-desa',
    name: 'Area Makam Umum Desa',
    category: 'pemerintahan',
    categoryLabel: 'Fasilitas Umum',
    coords: [-5.7251, 105.6368],
    icon: 'ph-cross',
    color: '#4b5563',
    bgColor: '#6b7280',
    address: 'Dusun Kumbang Tanjung',
    description: 'Tempat Pemakaman Umum (TPU) warga Desa Negeri Pandan.',
  },

  // Tempat Ibadah
  {
    id: 'masjid-nurul-falah',
    name: 'Masjid Nurul Falah',
    category: 'ibadah',
    categoryLabel: 'Tempat Ibadah',
    coords: [-5.7175, 105.6338],
    icon: 'ph-mosque',
    color: '#059669', // Emerald
    bgColor: '#10b981',
    address: 'Dusun Way Temaga / Way Pandan',
    description: 'Masjid jami pusat ibadah dan kegiatan keagamaan masyarakat.',
  },
  {
    id: 'masjid-nurul-yaqin',
    name: 'Masjid Nurul Yaqin',
    category: 'ibadah',
    categoryLabel: 'Tempat Ibadah',
    coords: [-5.7212, 105.6355],
    icon: 'ph-mosque',
    color: '#059669',
    bgColor: '#10b981',
    address: 'Dusun Kumbang Tanjung',
    description: 'Masjid tempat sholat berjamaah dan pengajian warga.',
  },
  {
    id: 'masjid-nurul-amal',
    name: 'Masjid Nurul Amal',
    category: 'ibadah',
    categoryLabel: 'Tempat Ibadah',
    coords: [-5.7142, 105.6385],
    icon: 'ph-mosque',
    color: '#059669',
    bgColor: '#10b981',
    address: 'Dusun Way Salak',
    description: 'Masjid lingkungan pemukiman Dusun Way Salak.',
  },

  // Pendidikan
  {
    id: 'sdn-negeri-pandan',
    name: 'SDN Negeri Pandan',
    category: 'pendidikan',
    categoryLabel: 'Pendidikan Dasar',
    coords: [-5.7188, 105.6321],
    icon: 'ph-graduation-cap',
    color: '#ea580c', // Orange
    bgColor: '#f97316',
    address: 'JL. Kedaton, Negeri Pandan',
    description: 'Sekolah Dasar Negeri pusat pendidikan dasar anak-anak desa.',
  },
  {
    id: 'paud-restu-bunda',
    name: 'PAUD Restu Bunda',
    category: 'pendidikan',
    categoryLabel: 'Pendidikan Usia Dini',
    coords: [-5.7205, 105.6349],
    icon: 'ph-baby',
    color: '#ea580c',
    bgColor: '#f97316',
    address: 'Negeri Pandan',
    description: 'Lembaga Pendidikan Anak Usia Dini (PAUD) & Taman Kanak-Kanak.',
  },

  // Kesehatan
  {
    id: 'bidan-desa',
    name: 'Praktik Bidan Desa',
    category: 'kesehatan',
    categoryLabel: 'Layanan Kesehatan',
    coords: [-5.7191, 105.6351],
    icon: 'ph-first-aid',
    color: '#dc2626', // Red
    bgColor: '#ef4444',
    address: 'Negeri Pandan',
    description: 'Pelayanan kesehatan ibu & anak, persalinan, dan imunisasi warga.',
  },
  {
    id: 'poskesdes',
    name: 'Poskesdes / Posyandu Desa',
    category: 'kesehatan',
    categoryLabel: 'Layanan Kesehatan',
    coords: [-5.7201, 105.6332],
    icon: 'ph-heartbeat',
    color: '#dc2626',
    bgColor: '#ef4444',
    address: 'Kompleks Balai Desa Negeri Pandan',
    description: 'Pos Kesehatan Desa untuk pemeriksaan rutin balita dan lansia.',
  },
];
