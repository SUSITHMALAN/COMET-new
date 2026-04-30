import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black w-full py-20 border-t-4 border-white mt-auto">
      <div className="flex flex-col items-center gap-8 container text-center">
        <Link to="/" className="text-4xl font-black italic text-white font-display">
          COMET
        </Link>
        
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="font-body uppercase font-medium text-xs tracking-widest text-on-surface-variant hover:text-white hover:underline underline-offset-4 transition-all">WHATSAPP</a>
          <a href="#" className="font-body uppercase font-medium text-xs tracking-widest text-on-surface-variant hover:text-white hover:underline underline-offset-4 transition-all">SHIPPING</a>
          <a href="#" className="font-body uppercase font-medium text-xs tracking-widest text-on-surface-variant hover:text-white hover:underline underline-offset-4 transition-all">RETURNS</a>
          <a href="#" className="font-body uppercase font-medium text-xs tracking-widest text-on-surface-variant hover:text-white hover:underline underline-offset-4 transition-all">TERMS</a>
          <Link to="/admin/login" className="font-body uppercase font-medium text-xs tracking-widest text-on-surface-variant hover:text-white hover:underline underline-offset-4 transition-all">ADMIN</Link>
        </div>
        
        <p className="font-body uppercase font-medium text-xs tracking-widest text-on-surface-variant/50 mt-8">
          © {new Date().getFullYear()} COMET PERFORMANCE. ENGINEERED FOR SPEED.
        </p>
      </div>
    </footer>
  );
}
