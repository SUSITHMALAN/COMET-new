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
      <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-32 container">
      <h2 className="text-headline-lg">PRODUCT NOT FOUND</h2>
      <Link to="/shop" className="btn-brutalist mt-8">BACK TO CATALOG</Link>
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
    <main className="container py-12 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-surface-container-low border-2 border-white/10 overflow-hidden relative">
            {images.length > 0 ? (
              <img 
                src={getImageUrl(images[imgIndex])} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-container">
                <span className="font-display text-7xl text-outline tracking-widest opacity-20">COMET</span>
              </div>
            )}
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <div className="absolute inset-0 flex justify-between items-center px-4">
                <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="w-10 h-10 bg-black/50 text-white flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="w-10 h-10 bg-black/50 text-white flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setImgIndex(i)}
                  className={`flex-shrink-0 w-20 aspect-[3/4] border-2 transition-all ${i === imgIndex ? 'border-primary' : 'border-transparent opacity-50'}`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="sticky top-24">
          <div className="flex items-center gap-4 mb-6">
            {product.is_new && <span className="bg-primary text-white px-3 py-1 text-label-caps text-[10px]">NEW ARRIVAL</span>}
            {discount > 0 && <span className="bg-white text-black px-3 py-1 text-label-caps text-[10px]">-{discount}%</span>}
          </div>

          <h1 className="text-headline-lg text-white mb-4">{product.name.toUpperCase()}</h1>
          <p className="text-label-caps text-on-surface-variant mb-8">{product.category?.name || 'CORE COLLECTION'}</p>

          <div className="flex items-center gap-6 mb-12">
            <span className="text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-2xl text-on-surface-variant line-through opacity-50">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="space-y-12">
            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <p className="text-label-caps text-xs mb-4">COLOR / {selectedColor}</p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-6 py-2 border-2 text-xs font-bold transition-all ${selectedColor === c ? 'border-primary bg-primary text-white' : 'border-white/10 text-on-surface-variant hover:border-white'}`}
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
                <p className="text-label-caps text-xs mb-4">SIZE / {selectedSize}</p>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 border-2 flex items-center justify-center text-xs font-bold transition-all ${selectedSize === s ? 'border-primary bg-primary text-white' : 'border-white/10 text-on-surface-variant hover:border-white'}`}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-label-caps text-xs mb-4">QUANTITY</p>
              <div className="flex items-center border-2 border-white/10 w-fit">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors">−</button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              <button 
                onClick={handleAddToCart}
                className="btn-brutalist py-5 text-sm"
              >
                ADD TO CART
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="btn-brutalist-outline py-5 text-sm border-secondary text-secondary hover:bg-secondary hover:text-black"
              >
                ORDER VIA WHATSAPP
              </button>
            </div>
            
            {/* Description */}
            <div className="pt-12 border-t-2 border-white/5">
              <p className="text-label-caps text-xs mb-4">DETAILS</p>
              <div className="text-on-surface-variant leading-relaxed text-sm whitespace-pre-line">
                {product.description || 'No description available for this technical item.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
