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
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-rose-100/20 shadow-[0_8px_32px_rgba(250,218,221,0.2)] flex justify-between items-center px-16 py-6 transition-colors duration-300">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-light italic text-rose-400 font-display hover:opacity-80 transition-opacity">
            Ethereal Grace
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-display tracking-wide transition-colors duration-300 ${
                  location.pathname === link.href 
                  ? 'text-rose-500 border-b border-rose-300 pb-1' 
                  : 'text-rose-400/80 hover:text-rose-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-rose-300">search</span>
            <input
              type="text"
              placeholder="Search collection..."
              className="bg-rose-50/50 border border-rose-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 w-64 transition-all"
            />
          </div>
          
          <Link to="/wishlist" className="text-rose-400 hover:text-rose-600 transition-colors">
            <span className="material-symbols-outlined">favorite</span>
          </Link>

          <Link to="/cart" className="text-rose-400 hover:text-rose-600 transition-colors relative">
            <span className="material-symbols-outlined">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          <Link to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'} className="text-rose-400 hover:text-rose-600 transition-colors">
            <span className="material-symbols-outlined">person</span>
          </Link>
        </div>
      </nav>
      {/* Spacer */}
      <div className="h-[84px]" />
    </>
  );
}
