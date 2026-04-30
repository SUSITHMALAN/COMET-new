import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api';
import { Product } from '../types';
import { useCartStore } from '../store';
import { showToast } from '../hooks/useToast';
import { getImageUrl } from '../api';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    if (!id) return;
    productsApi.getOne(Number(id))
      .then(res => {
        setProduct(res.data);
        const sizes = JSON.parse(res.data.sizes || '[]');
        const colors = JSON.parse(res.data.colors || '[]');
        if (sizes[0]) setSelectedSize(sizes[0]);
        if (colors[0]) setSelectedColor(colors[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="spinner"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-40 container animate-soft-fade">
      <h2 className="text-headline-lg">PRODUCT NOT FOUND</h2>
      <Link to="/shop" className="btn-pill btn-pill-outline mt-12">BACK TO CATALOG</Link>
    </div>
  );

  const images = JSON.parse(product.images || '[]');
  const sizes = JSON.parse(product.sizes || '[]');
  const colors = JSON.parse(product.colors || '[]');
  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) { showToast('Please select a size', 'error'); return; }
    if (colors.length > 0 && !selectedColor) { showToast('Please select a color', 'error'); return; }
    addItem(product, selectedSize || 'One Size', selectedColor || 'Default', quantity);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleWhatsAppOrder = () => {
    const msg = `Hi COMET! I'd like to order:\n\n*${product.name}*\nSize: ${selectedSize}\nColor: ${selectedColor}\nQty: ${quantity}\n\nPlease confirm.`;
    window.open(`https://wa.me/94771758395?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <main className="container py-24 animate-soft-fade">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-[3/4] bg-surface-container rounded-[40px] overflow-hidden relative group">
            {images.length > 0 ? (
              <img 
                src={getImageUrl(images[imgIndex])} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                <span className="font-display text-7xl text-outline tracking-widest opacity-20">COMET</span>
              </div>
            )}
            
            {/* Navigation Overlay */}
            {images.length > 1 && (
              <div className="absolute inset-0 flex justify-between items-center px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setImgIndex(i)}
                  className={`flex-shrink-0 w-24 aspect-[3/4] rounded-[20px] overflow-hidden border-2 transition-all duration-300 ${i === imgIndex ? 'border-on-background opacity-100' : 'border-transparent opacity-40 hover:opacity-70'}`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-32">
          <div className="flex items-center gap-4 mb-8">
            {product.is_new && <span className="bg-primary text-on-primary px-4 py-1.5 text-[9px] font-bold tracking-[0.2em] rounded-full">NEW DROP</span>}
            {discount > 0 && <span className="bg-on-background text-white px-4 py-1.5 text-[9px] font-bold tracking-[0.2em] rounded-full">-{discount}%</span>}
          </div>

          <h1 className="text-headline-lg mb-4">{product.name}</h1>
          <p className="text-label-caps text-on-surface-variant opacity-60 mb-10 tracking-[0.2em]">{product.category?.name || 'CORE COLLECTION'}</p>

          <div className="flex items-end gap-6 mb-16">
            <span className="text-4xl font-semibold text-on-background">${product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-xl text-on-surface-variant line-through opacity-30 pb-1">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="space-y-16">
            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <p className="text-label-caps text-[10px] mb-6 opacity-40">Available Colors</p>
                <div className="flex flex-wrap gap-4">
                  {colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-8 py-3 rounded-full border text-[11px] font-semibold tracking-wider transition-all duration-300 ${selectedColor === c ? 'border-on-background bg-on-background text-white' : 'border-outline/10 text-on-surface-variant hover:border-outline/30'}`}
                    >
                      {c.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <p className="text-label-caps text-[10px] mb-6 opacity-40">Select Size</p>
                <div className="flex flex-wrap gap-4">
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-14 h-14 rounded-full border flex items-center justify-center text-[12px] font-semibold transition-all duration-300 ${selectedSize === s ? 'border-on-background bg-on-background text-white' : 'border-outline/10 text-on-surface-variant hover:border-outline/30'}`}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-label-caps text-[10px] mb-6 opacity-40">Quantity</p>
              <div className="flex items-center bg-surface-container rounded-full w-fit p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-background transition-all text-xl">−</button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-background transition-all text-xl">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10">
              <button 
                onClick={handleAddToCart}
                className="btn-pill btn-pill-primary h-16 text-[13px] tracking-widest font-bold"
              >
                ADD TO CART
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="btn-pill btn-pill-outline h-16 text-[13px] tracking-widest font-bold border-secondary/50 text-secondary hover:bg-secondary hover:text-white"
              >
                ORDER VIA WHATSAPP
              </button>
            </div>
            
            {/* Description */}
            <div className="pt-16 border-t border-outline/10">
              <p className="text-label-caps text-[10px] mb-6 opacity-40">Product Details</p>
              <div className="text-on-background/70 leading-relaxed text-[15px] whitespace-pre-line font-light">
                {product.description || 'A masterpiece of contemporary engineering and style. Designed for those who value precision and refinement in every detail.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
