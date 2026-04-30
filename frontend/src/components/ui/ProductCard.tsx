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
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-6 border-2 border-transparent hover:border-white transition-all duration-300">
        {images.length > 0 ? (
          <img
            src={getImageUrl(images[0])}
            alt={product.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container">
            <span className="font-display text-4xl text-outline tracking-widest">COMET</span>
          </div>
        )}
        
        {/* Badges */}
        {product.is_new && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-label-caps text-[10px]">
            NEW DROP
          </div>
        )}
        
        {/* Sold Out Overlay */}
        {product.is_active === false && (
          <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 text-label-caps text-[10px]">
            SOLD OUT
          </div>
        )}
      </div>

      <div className="flex justify-between items-start">
        <div className="max-w-[70%]">
          <h3 className="text-label-caps text-white group-hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-[10px] text-on-surface-variant mt-1 uppercase font-body">
            {product.category?.name || 'ESSENTIALS'}
          </p>
        </div>
        <span className="text-label-caps text-white">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
