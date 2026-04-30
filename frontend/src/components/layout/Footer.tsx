import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-rose-50/30 w-full py-24 mt-auto border-t border-rose-100">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="md:col-span-1 space-y-8">
          <Link to="/" className="text-2xl font-light italic text-rose-400 font-display">
            Ethereal Grace
          </Link>
          <p className="text-body-md text-secondary opacity-60 leading-relaxed italic font-light">
            Crafting memories, one stitch at a time. Designed with love for the little dreamers.
          </p>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-label-sm text-primary uppercase tracking-widest">Boutique</h4>
          <ul className="space-y-4">
            <li><Link to="/shop" className="text-sm text-secondary hover:text-rose-400 transition-all">Shop All</Link></li>
            <li><Link to="/collections" className="text-sm text-secondary hover:text-rose-400 transition-all">Collections</Link></li>
            <li><Link to="/lookbook" className="text-sm text-secondary hover:text-rose-400 transition-all">Lookbook</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-label-sm text-primary uppercase tracking-widest">Care</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm text-secondary hover:text-rose-400 transition-all">Shipping Info</a></li>
            <li><a href="#" className="text-sm text-secondary hover:text-rose-400 transition-all">Returns & Exchanges</a></li>
            <li><a href="#" className="text-sm text-secondary hover:text-rose-400 transition-all">Sizing Guide</a></li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-label-sm text-primary uppercase tracking-widest">Contact</h4>
          <a href="https://wa.me/94771758395" className="block text-lg text-rose-400 hover:text-rose-600 transition-all font-light">
            +94 77 175 8395
          </a>
          <div className="flex gap-4">
            <Link to="/admin/login" className="text-[10px] text-primary/30 hover:text-primary transition-all uppercase tracking-widest">Partner Portal</Link>
          </div>
        </div>
      </div>
      
      <div className="container mt-20 pt-10 border-t border-rose-100/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[11px] text-secondary opacity-40 tracking-widest uppercase">
          © {new Date().getFullYear()} Ethereal Grace Boutique.
        </p>
        <div className="flex gap-8 text-[11px] text-secondary opacity-40 uppercase tracking-widest">
          <a href="#" className="hover:text-rose-400">Privacy</a>
          <a href="#" className="hover:text-rose-400">Terms</a>
        </div>
      </div>
    </footer>
  );
}
