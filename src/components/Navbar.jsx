'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

/**
 * Navbar — replicates initNavbar() from main.js.
 * - Adds "scrolled" class when window.scrollY > 50
 * - Mobile menu toggle (hamburger ↔ X)
 * - Active link detection via usePathname()
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Sembunyikan navbar di halaman admin
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Click outside closes menu
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpen]);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/profil', label: 'Profil' },
    { href: '/layanan', label: 'Layanan' },
    { href: '/potensi', label: 'Potensi' },
    { href: '/berita', label: 'Berita' },
    { href: '/kontak', label: 'Kontak' },
  ];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="container">
        <Link href="/" className="nav-brand">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/images/logo-lamsel.png" alt="Logo Kabupaten Lampung Selatan" width="34" height="34" style={{ objectFit: 'contain' }} />
          </div>
          <div className="brand-text">
            Negeri <span>Pandan</span>
          </div>
        </Link>

        <div className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? 'active' : ''}
                onClick={closeMenu}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <button
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          id="navToggle"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
