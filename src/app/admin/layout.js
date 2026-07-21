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
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
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
    { href: '/admin/layanan', label: 'Layanan Publik', active: pathname.startsWith('/admin/layanan'), icon: 'ph-files' },
    { href: '/admin/organisasi', label: 'Struktur Organisasi', active: pathname.startsWith('/admin/organisasi'), icon: 'ph-users-three' },
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
        className={`admin-sidebar ${isMobileOpen ? 'open' : ''} ${isDesktopCollapsed ? 'collapsed' : ''}`}
        style={{ 
          width: isDesktopCollapsed ? '80px' : '260px', 
          backgroundColor: 'var(--clr-bg-alt)', 
          borderRight: '1px solid var(--clr-border)', 
          display: 'flex', 
          flexDirection: 'column',
          zIndex: 50,
          transition: 'width 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          overflowX: 'hidden'
        }}
      >
        <div className="sidebar-header" style={{ padding: '24px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'padding 0.4s ease' }}>
          <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px' }}>
              <img src="/images/logo-lamsel.png" alt="Logo Lamsel" width="32" height="32" style={{ objectFit: 'contain' }} />
            </div>
            <div className="brand-text sidebar-text">Admin<span>Panel</span></div>
          </div>
          <button className="desktop-collapse-btn" onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-muted)', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
            <i className={`ph ${isDesktopCollapsed ? 'ph-caret-right' : 'ph-caret-left'}`}></i>
          </button>
          <button className="mobile-close-btn" onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'var(--clr-text)', fontSize: '20px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        
        <nav style={{ flex: 1, padding: '20px 10px', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item, index) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className="admin-nav-item"
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
                    transition: 'all 0.3s ease',
                    borderLeft: item.active ? '4px solid var(--clr-glow)' : '4px solid transparent',
                    animationDelay: `${index * 0.08}s`
                  }}
                  title={isDesktopCollapsed ? item.label : ''}
                >
                  <i className={`ph ${item.icon}`} style={{ fontSize: '20px', minWidth: '20px', textAlign: 'center' }}></i>
                  <span className="sidebar-text">{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link 
                href="/" 
                target="_blank"
                className="admin-nav-item"
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
                  transition: 'all 0.3s ease',
                  animationDelay: `${navItems.length * 0.08}s`
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--clr-text-dim)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--clr-text-muted)'}
                title={isDesktopCollapsed ? 'Lihat Website' : ''}
              >
                <i className="ph ph-arrow-square-out" style={{ fontSize: '20px', minWidth: '20px', textAlign: 'center' }}></i>
                <span className="sidebar-text">Lihat Website ↗</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Profile & Logout Section */}
        <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid var(--clr-border)', backgroundColor: 'var(--clr-surface)', transition: 'padding 0.4s ease' }}>
          <div className="profile-info" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--clr-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
              <i className="ph ph-user"></i>
            </div>
            <div className="sidebar-text" style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: '600', fontSize: 'var(--fs-small)', color: 'var(--clr-text)' }}>Administrator</div>
              <div style={{ fontSize: 'var(--fs-xxs)', color: 'var(--clr-text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {adminEmail}
              </div>
            </div>
          </div>
          
          <button 
            className="logout-btn"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: 'var(--fs-small)',
              transition: 'all 0.3s ease'
            }}
            title={isDesktopCollapsed ? 'Keluar (Logout)' : ''}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#ef4444';
            }}
          >
            <i className="ph ph-sign-out" style={{ fontSize: '20px', minWidth: '20px', textAlign: 'center' }}></i>
            <span className="sidebar-text">Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Injected CSS for responsive admin layout & animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sidebarSlideIn {
          0% { opacity: 0; transform: translateX(-15px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .admin-nav-item {
          opacity: 0;
          animation: sidebarSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .admin-nav-item:hover {
          transform: translateX(6px);
          background-color: rgba(255, 255, 255, 0.04) !important;
          color: var(--clr-text) !important;
        }
        
        .desktop-collapse-btn { display: block; transition: all 0.3s; }
        .desktop-collapse-btn:hover { color: var(--clr-primary-light) !important; transform: scale(1.1); }
        .mobile-close-btn { display: none !important; }
        .admin-mobile-header { display: none !important; }
        
        /* Smooth Collapse Animation Styles */
        .sidebar-text {
          white-space: nowrap;
          transition: opacity 0.3s ease, max-width 0.3s ease, margin 0.3s ease, padding 0.3s ease;
          opacity: 1;
          max-width: 250px;
          overflow: hidden;
        }
        .admin-sidebar.collapsed .sidebar-text {
          opacity: 0;
          max-width: 0;
          margin: 0 !important;
          padding: 0 !important;
          pointer-events: none;
        }
        .admin-sidebar.collapsed .desktop-collapse-btn {
          margin: 0 auto;
        }
        .admin-sidebar.collapsed .sidebar-header {
          padding: 24px 0 !important;
          flex-direction: column;
          gap: 16px;
        }
        .admin-sidebar.collapsed .sidebar-footer {
          padding: 20px 0 !important;
        }
        /* Eliminate gaps that push items off-center */
        .admin-sidebar.collapsed .nav-brand,
        .admin-sidebar.collapsed .profile-info,
        .admin-sidebar.collapsed .admin-nav-item,
        .admin-sidebar.collapsed .logout-btn {
          gap: 0 !important;
        }
        .admin-sidebar.collapsed .admin-nav-item {
          padding-left: 0 !important;
          /* Balance the 4px left border so the icon centers perfectly */
          padding-right: 4px !important;
          justify-content: center;
        }
        .admin-sidebar.collapsed .logout-btn {
          padding-left: 0 !important;
          padding-right: 0 !important;
          justify-content: center;
        }
        .admin-sidebar.collapsed .profile-info {
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .desktop-collapse-btn { display: none !important; }
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
