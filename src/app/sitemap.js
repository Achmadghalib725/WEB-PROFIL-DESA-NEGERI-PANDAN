import { createClient } from '@supabase/supabase-js';

// Setup Supabase client directly since this runs on the server during build/request
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap() {
  // Ganti URL_UTAMA dengan domain asli website Anda
  // Atau gunakan environment variable
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://web-profil-desa-negeri-pandan.vercel.app'; 

  // 1. Halaman statis (Menu Utama)
  const staticPages = [
    '',
    '/profil',
    '/berita',
    '/layanan',
    '/potensi',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Halaman Dinamis: Berita
  let beritaPages = [];
  try {
    const { data: berita } = await supabase
      .from('berita')
      .select('id, updated_at, created_at');

    if (berita) {
      beritaPages = berita.map((item) => ({
        url: `${baseUrl}/berita/${item.id}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : new Date(item.created_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Sitemap: Gagal memuat berita', error);
  }

  // Gabungkan semua rute
  return [...staticPages, ...beritaPages];
}
