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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 ${scrolled ? 'bg-black/90 backdrop-blur-md border-white/10' : 'bg-black border-white'}`}
           style={{ height: 'var(--nav-height)' }}>
        <div className="container h-full flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/Comet%20white.png" alt="COMET" className="h-8 md:h-10 object-contain" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-10 items-center">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-label-caps uppercase font-bold tracking-widest text-[13px] transition-colors duration-200 ${
                  location.pathname === link.href ? 'text-primary border-b-2 border-primary pb-1' : 'text-white hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="SEARCH SPEED..." 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-[12px] font-label-caps uppercase tracking-widest px-10 py-2 w-56 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <Link to="/cart" className="text-white hover:text-primary transition-all relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'} className="text-white hover:text-primary transition-all">
              <span className="material-symbols-outlined">person</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom NavBar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 bg-black/95 border-t-2 border-white pb-safe">
        <Link to="/" className={`flex flex-col items-center justify-center px-4 py-2 transition-all ${location.pathname === '/' ? 'text-primary' : 'text-white'}`}>
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold tracking-widest mt-1">HOME</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center justify-center px-4 py-2 transition-all ${location.pathname === '/shop' ? 'text-primary' : 'text-white'}`}>
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-bold tracking-widest mt-1">SHOP</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center justify-center text-white px-4 py-2">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-bold tracking-widest mt-1">SEARCH</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center justify-center px-4 py-2 relative ${location.pathname === '/cart' ? 'text-primary' : 'text-white'}`}>
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-bold tracking-widest mt-1">CART</span>
          {totalItems > 0 && (
            <span className="absolute top-2 right-4 bg-primary text-white text-[8px] font-bold w-3 h-3 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
        <Link to="/login" className="flex flex-col items-center justify-center text-white px-4 py-2">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold tracking-widest mt-1">ME</span>
        </Link>
      </div>

      {/* Spacer to prevent content from going under the fixed navbar */}
      <div style={{ height: 'var(--nav-height)' }} />
    </>
  );
}
