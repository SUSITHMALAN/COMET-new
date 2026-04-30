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
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-container mb-6 rounded-[24px] transition-all duration-500">
        {images.length > 0 ? (
          <img
            src={getImageUrl(images[0])}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
            <span className="font-display text-4xl text-outline/20 tracking-widest opacity-20">COMET</span>
          </div>
        )}
        
        {/* Badges */}
        {product.is_new && (
          <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 text-[9px] font-bold tracking-widest rounded-full">
            NEW DROP
          </div>
        )}
        
        {/* Sold Out Overlay */}
        {product.is_active === false && (
          <div className="absolute top-4 right-4 bg-on-background text-white px-3 py-1 text-[9px] font-bold tracking-widest rounded-full">
            SOLD OUT
          </div>
        )}

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="text-body font-medium text-on-background group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase tracking-widest font-medium">
            {product.category?.name || 'ESSENTIALS'}
          </p>
        </div>
        <span className="text-body font-semibold text-on-background/80">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
