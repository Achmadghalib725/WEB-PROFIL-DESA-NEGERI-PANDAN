import { createClient } from '@/utils/supabase/client';

export async function logActivity(action, target, title, icon = 'ph-clock') {
  try {
    const supabase = createClient();
    
    // Fetch existing logs
    const { data } = await supabase.from('pengaturan_halaman').select('value').eq('id', 'activity_logs').maybeSingle();
    
    let logs = [];
    if (data && data.value) {
      logs = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      if (!Array.isArray(logs)) logs = [];
    }

    // Add new log to the beginning
    logs.unshift({
      id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
      action, // 'Tambah', 'Edit', 'Hapus'
      target, // e.g. 'Berita', 'Layanan Publik', 'Statistik'
      title,
      icon,
      date: new Date().toISOString()
    });

    // Keep only the latest 30 logs to prevent payload size from growing too large
    if (logs.length > 30) {
      logs = logs.slice(0, 30);
    }

    // Save back to DB
    await supabase.from('pengaturan_halaman').upsert([{
      id: 'activity_logs',
      value: JSON.stringify(logs),
      updated_at: new Date().toISOString()
    }], { onConflict: 'id' });

  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}
