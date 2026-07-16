'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('Admin');

  // If we are on login page, don't show the admin sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Fetch admin user
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminEmail(user.email);
      }
    }
    getUser();
  }, [supabase]);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh(); // Force refresh to clear state
  };

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/admin', label: 'Dashboard Overview', active: pathname === '/admin', icon: 'ph-squares-four' },
    { href: '/admin/berita', label: 'Berita / Artikel', active: pathname.startsWith('/admin/berita'), icon: 'ph-newspaper' },
    { href: '/admin/potensi', label: 'Potensi Desa (UMKM)', active: pathname.startsWith('/admin/potensi'), icon: 'ph-storefront' },
    { href: '/admin/layanan', label: 'Permintaan Layanan', active: pathname.startsWith('/admin/layanan'), icon: 'ph-files' },
    { href: '/admin/statistik', label: 'Statistik Desa', active: pathname.startsWith('/admin/statistik'), icon: 'ph-chart-bar' }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      
      {/* Mobile Header (Hamburger) */}
      <div className="admin-mobile-header">
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Admin Panel</div>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>
          ☰
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40
          }}
          className="admin-overlay"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`admin-sidebar ${isMobileOpen ? 'open' : ''}`}
        style={{ 
          width: '260px', 
          backgroundColor: 'var(--clr-bg-alt)', 
          borderRight: '1px solid var(--clr-border)', 
          display: 'flex', 
          flexDirection: 'column',
          zIndex: 50,
          transition: 'var(--transition)',
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="nav-brand">
            <div className="brand-icon">
              <i className="ph ph-shield-check"></i>
            </div>
            <div className="brand-text">Admin<span>Panel</span></div>
          </div>
          <button className="mobile-close-btn" onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'var(--clr-text)', fontSize: '20px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        
        <nav style={{ flex: 1, padding: '20px 10px', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    color: item.active ? 'var(--clr-primary-light)' : 'var(--clr-text-dim)',
                    textDecoration: 'none',
                    backgroundColor: item.active ? 'var(--clr-surface-active)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: item.active ? '600' : '500',
                    transition: 'var(--transition)',
                    borderLeft: item.active ? '4px solid var(--clr-glow)' : '4px solid transparent'
                  }}
                >
                  <i className={`ph ${item.icon}`} style={{ fontSize: '18px' }}></i>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link 
                href="/" 
                target="_blank"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  color: 'var(--clr-text-muted)',
                  textDecoration: 'none',
                  borderLeft: '4px solid transparent',
                  marginTop: '10px',
                  fontWeight: '500',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--clr-text-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--clr-text-muted)'}
              >
                <i className="ph ph-arrow-square-out" style={{ fontSize: '18px' }}></i>
                Lihat Website ↗
              </Link>
            </li>
          </ul>
        </nav>

        {/* Profile & Logout Section */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--clr-border)', backgroundColor: 'var(--clr-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--clr-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              <i className="ph ph-user"></i>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '600', fontSize: 'var(--fs-small)', color: 'var(--clr-text)' }}>Administrator</div>
              <div style={{ fontSize: 'var(--fs-xxs)', color: 'var(--clr-text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {adminEmail}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: 'var(--fs-small)',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#ef4444';
            }}
          >
            <i className="ph ph-sign-out"></i>
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Injected CSS for responsive admin layout */}
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-close-btn { display: none !important; }
        .admin-mobile-header { display: none !important; }
        
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            background-color: rgba(11, 19, 16, 0.95) !important;
            backdrop-filter: blur(10px);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .mobile-close-btn { display: block !important; }
          .admin-mobile-header {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background-color: rgba(11, 19, 16, 0.85); /* Matches body dark theme */
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            color: white;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 30;
          }
          .admin-main {
            padding: 20px !important;
            padding-top: 80px !important;
          }
        }
      `}} />
    </div>
  );
}
