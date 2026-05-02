import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCartStore, useAuthStore } from '../../store';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore(s => s.totalItems());
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'New In', href: '/shop?filter=new' },
    { label: 'Sale', href: '/shop?filter=sale' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      height: 'var(--nav-height)',
      background: scrolled ? 'rgba(10,10,10,0.97)' : '#0a0a0a',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            letterSpacing: '0.12em',
            color: 'var(--white)',
          }}>COMET</span>
          <span style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--accent)',
            marginLeft: 3,
            marginBottom: 16,
          }} />
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                color: location.pathname === link.href.split('?')[0] ? 'var(--white)' : 'var(--grey-400)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={e => (e.currentTarget.style.color = location.pathname === link.href.split('?')[0] ? 'var(--white)' : 'var(--grey-400)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/shop" style={{ padding: '8px', color: 'var(--grey-400)', display: 'flex', borderRadius: 'var(--radius)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--grey-400)')}>
            <Search size={20} />
          </Link>

          {user && (
            <Link to={user.role === 'admin' ? '/admin' : '/account'} style={{ padding: '8px', color: 'var(--grey-400)', display: 'flex', borderRadius: 'var(--radius)', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--grey-400)')}>
              <User size={20} />
            </Link>
          )}

          <Link
            to="/cart"
            style={{ position: 'relative', padding: '8px', color: 'var(--white)', display: 'flex', borderRadius: 'var(--radius)', transition: 'color 0.2s' }}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: 4, right: 4,
                width: 16, height: 16,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: 'var(--white)',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            style={{ padding: '8px', color: 'var(--white)', display: 'none' }}
            className="mobile-menu-btn"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0, right: 0, bottom: 0,
          background: 'var(--black)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 999,
        }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px',
                letterSpacing: '0.06em',
                color: 'var(--white)',
                padding: '8px 0',
                borderBottom: '1px solid var(--grey-800)',
              }}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link
              to="/admin/login"
              style={{ marginTop: 24, fontSize: '14px', color: 'var(--grey-500)' }}
            >
              Admin Login
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
