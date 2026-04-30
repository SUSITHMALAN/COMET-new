import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container w-full py-32 mt-auto border-t border-outline/10">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-20">
        <div className="space-y-10">
          <Link to="/" className="text-3xl font-display text-on-background">
            COMET
          </Link>
          <p className="text-body text-[14px] opacity-40 leading-relaxed max-w-xs">
            Refined technical gear for the modern move. Engineered with precision, designed for timelessness.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-label-caps text-[10px] opacity-40">Collection</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-body text-[13px] hover:text-primary transition-all">All Products</Link></li>
              <li><Link to="/shop?filter=new" className="text-body text-[13px] hover:text-primary transition-all">New Arrivals</Link></li>
              <li><Link to="/shop?filter=featured" className="text-body text-[13px] hover:text-primary transition-all">Featured</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-label-caps text-[10px] opacity-40">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-body text-[13px] hover:text-primary transition-all">Shipping</a></li>
              <li><a href="#" className="text-body text-[13px] hover:text-primary transition-all">Returns</a></li>
              <li><a href="#" className="text-body text-[13px] hover:text-primary transition-all">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-label-caps text-[10px] opacity-40">Contact</h4>
          <a href="https://wa.me/94771758395" className="block text-headline-md text-xl hover:text-primary transition-all">
            +94 77 175 8395
          </a>
          <div className="flex gap-6">
            <Link to="/admin/login" className="text-[10px] text-label-caps opacity-30 hover:opacity-100 transition-all">Portal</Link>
          </div>
        </div>
      </div>
      
      <div className="container mt-32 pt-10 border-t border-outline/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[11px] text-label-caps opacity-30 tracking-widest">
          © {new Date().getFullYear()} COMET PERFORMANCE.
        </p>
        <p className="text-[11px] text-label-caps opacity-30 tracking-widest">
          MADE WITH PRECISION.
        </p>
      </div>
    </footer>
  );
}
