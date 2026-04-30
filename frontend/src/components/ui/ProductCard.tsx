import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { getImageUrl } from '../../api';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const images = (() => { try { return JSON.parse(product.images) || []; } catch { return []; } })();
  
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 border border-rose-50/50">
      <Link to={`/product/${product.id}`} className="block aspect-[4/5] w-full overflow-hidden bg-rose-50/30">
        {images.length > 0 ? (
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            alt={product.name}
            src={getImageUrl(images[0])}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <span className="font-display text-4xl text-rose-300">EG</span>
          </div>
        )}
        
        {/* Badges */}
        {product.is_new && (
          <div className="absolute top-4 left-4 bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-rose-200">
            New Piece
          </div>
        )}
      </Link>
      
      <div className="glass-card absolute bottom-0 left-0 right-0 p-5 m-3 rounded-xl border border-white/40 shadow-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/product/${product.id}`} className="text-headline-md text-base text-primary hover:text-rose-600 transition-colors line-clamp-1">{product.name}</Link>
          <span className="text-body-md text-primary font-semibold">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-[9px] text-secondary tracking-widest uppercase mb-4 opacity-60">{product.category?.name || 'Collection'}</p>
        <button className="w-full py-2.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-widest hover:bg-rose-200 transition-colors duration-300">
          View Detail
        </button>
      </div>
    </div>
  );
}
