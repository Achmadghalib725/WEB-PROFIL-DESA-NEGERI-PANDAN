'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="theme-toggle-btn" aria-label="Toggle Theme" disabled>
        <span style={{ width: '20px', height: '20px' }}></span>
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      className={`theme-toggle-btn ${isDark ? 'dark' : 'light'}`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle Theme"
      title={isDark ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
    >
      <div className="theme-toggle-icon">
        {isDark ? (
          <i className="ph-bold ph-moon"></i>
        ) : (
          <i className="ph-bold ph-sun"></i>
        )}
      </div>
    </button>
  );
}
