import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../../store';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore(s => s.totalItems());
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Drops', href: '/drops' },
    { label: 'Shop', href: '/shop' },
    { label: 'Collections', href: '/collections' },
    { label: 'Community', href: '/community' },
  ];

  return (
    <>
      {/* Top Desktop NavBar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'glass' : 'bg-background border-outline/10'}`}
           style={{ height: 'var(--nav-height)' }}>
        <div className="container h-full flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/Comet%20white.png" alt="COMET" className="h-8 md:h-10 object-contain brightness-0" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-12 items-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-label-caps tracking-[0.2em] transition-all duration-300 relative group ${
                  location.pathname === link.href ? 'text-on-background' : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-on-background transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-8">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="SEARCH..." 
                className="bg-surface border border-outline/10 text-on-background placeholder-on-surface-variant/50 text-[11px] font-body uppercase tracking-widest px-12 py-3 w-64 rounded-full focus:outline-none focus:border-outline/30 transition-all"
              />
            </div>
            
            <Link to="/cart" className="text-on-background hover:text-primary transition-all relative">
              <span className="material-symbols-outlined font-light">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-on-background text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'} className="text-on-background hover:text-primary transition-all">
              <span className="material-symbols-outlined font-light">person</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom NavBar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 glass border-t border-outline/10 pb-safe rounded-t-[32px]">
        <Link to="/" className={`flex flex-col items-center justify-center px-4 py-2 transition-all ${location.pathname === '/' ? 'text-on-background' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">home</span>
          <span className="text-[9px] font-bold tracking-widest mt-1">HOME</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center justify-center px-4 py-2 transition-all ${location.pathname === '/shop' ? 'text-on-background' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[9px] font-bold tracking-widest mt-1">SHOP</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[9px] font-bold tracking-widest mt-1">SEARCH</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center justify-center px-4 py-2 relative ${location.pathname === '/cart' ? 'text-on-background' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[9px] font-bold tracking-widest mt-1">CART</span>
          {totalItems > 0 && (
            <span className="absolute top-2 right-4 bg-on-background text-white text-[7px] font-bold w-3 h-3 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
        <Link to="/login" className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[9px] font-bold tracking-widest mt-1">ME</span>
        </Link>
      </div>

      {/* Spacer to prevent content from going under the fixed navbar */}
      <div style={{ height: 'var(--nav-height)' }} />
    </>
  );
}
