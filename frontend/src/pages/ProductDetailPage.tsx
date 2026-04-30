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
    <main className="pt-32 pb-20 px-16 max-w-[1440px] mx-auto animate-fade-in-slide selection:bg-rose-100">
      {/* Breadcrumbs */}
      <nav className="mb-12 flex items-center gap-2 text-label-sm text-secondary">
        <Link to="/" className="hover:text-rose-400">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link to="/shop" className="hover:text-rose-400">Collection</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-primary font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Gallery */}
        <div className="flex-1 space-y-6">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-rose-50/30 border border-rose-100 shadow-soft group relative">
            <img 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt={product.name}
              src={getImageUrl(images[imgIndex]) || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"}
            />
            {images.length > 1 && (
              <div className="absolute inset-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setImgIndex(i)}
                  className={`w-24 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-rose-300' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 max-w-xl">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              {product.is_new && <span className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">New Piece</span>}
              {discount > 0 && <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Special Offer</span>}
            </div>
            <h1 className="text-headline-xl text-primary mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-light text-rose-400">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-xl text-secondary/40 line-through">${product.original_price.toFixed(2)}</span>
              )}
            </div>
          </header>

          <div className="space-y-12">
            {/* Options */}
            {colors.length > 0 && (
              <div>
                <h3 className="text-label-sm text-primary mb-4 uppercase tracking-widest">Selected Color</h3>
                <div className="flex gap-4">
                  {colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === c ? 'border-rose-400 p-1' : 'border-transparent'}`}
                    >
                      <div className="w-full h-full rounded-full border border-rose-100" style={{ backgroundColor: c.toLowerCase() }}></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-label-sm text-primary uppercase tracking-widest">Select Size</h3>
                  <button className="text-[11px] text-rose-400 border-b border-rose-200">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-8 py-3 rounded-full border text-sm transition-all duration-300 ${selectedSize === s ? 'bg-primary text-white border-primary shadow-soft' : 'border-rose-100 text-primary hover:bg-rose-50/50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-label-sm text-primary mb-4 uppercase tracking-widest">Quantity</h3>
              <div className="flex items-center gap-6 glass-card w-fit px-2 py-1 rounded-full border border-rose-100">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-8 text-center font-medium text-primary">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-5 rounded-full text-label-sm uppercase tracking-widest shadow-soft hover:opacity-90 transition-opacity"
              >
                Add to Bag
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="flex-1 glass border border-rose-100 text-primary py-5 rounded-full text-label-sm uppercase tracking-widest hover:bg-rose-50/50 transition-colors"
              >
                Concierge Order
              </button>
            </div>

            {/* Description */}
            <div className="pt-12 border-t border-rose-100">
              <h3 className="text-label-sm text-primary mb-4 uppercase tracking-widest">The Story</h3>
              <p className="text-body-md text-secondary leading-relaxed font-light italic">
                {product.description || "Each stitch is a whisper of grace. Designed for comfort and crafted for timeless elegance, this piece embodies the spirit of our Ethereal collection."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
