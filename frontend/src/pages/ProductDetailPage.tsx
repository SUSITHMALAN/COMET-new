import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsApi } from '../api';
import { Product } from '../types';
import { useCartStore } from '../store';
import { showToast } from '../hooks/useToast';

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
    <div style={{ paddingTop: 'var(--nav-height)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!product) return (
    <div style={{ paddingTop: 'var(--nav-height)', textAlign: 'center', padding: '120px 24px' }}>
      <h2>Product not found</h2>
      <Link to="/shop" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>Back to Shop</Link>
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
    if (sizes.length > 0 && !selectedSize) { showToast('Please select a size', 'error'); return; }
    if (colors.length > 0 && !selectedColor) { showToast('Please select a color', 'error'); return; }
    const msg = `Hi COMET! I'd like to order:\n\n*${product.name}*\nSize: ${selectedSize}\nColor: ${selectedColor}\nQty: ${quantity}\nPrice: LKR ${(product.price * quantity).toLocaleString()}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/94771758395?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: 'clamp(24px, 4vw, 40px) 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'clamp(24px, 4vw, 40px)', fontSize: '13px', color: 'var(--grey-400)' }}>
          <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={14} /> Shop
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--black)' }}>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Images */}
          <div>
            <div style={{
              position: 'relative',
              background: 'var(--grey-100)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '3/4',
              marginBottom: 12,
            }}>
              {images.length > 0 ? (
                <img src={images[imgIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f5f5, #e5e5e5)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 8vw, 72px)', color: 'var(--grey-300)' }}>COMET</span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setImgIndex(i => (i + 1) % images.length)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setImgIndex(i)}
                    style={{
                      width: 72, height: 90, borderRadius: 'var(--radius)', overflow: 'hidden',
                      border: i === imgIndex ? '2px solid var(--black)' : '2px solid transparent',
                      cursor: 'pointer', background: 'none', padding: 0, flexShrink: 0,
                    }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
              {product.is_new && <span className="badge badge-new">New</span>}
              {discount > 0 && <span className="badge badge-sale">-{discount}% OFF</span>}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              {product.category?.name}
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '0.04em', marginBottom: 20, lineHeight: 1 }}>
              {product.name.toUpperCase()}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700 }}>LKR {product.price.toLocaleString()}</span>
              {product.original_price && (
                <span style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--grey-400)', textDecoration: 'line-through' }}>
                  LKR {product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ color: 'var(--grey-600)', lineHeight: 1.8, marginBottom: 32, fontSize: '15px' }}>
                {product.description}
              </p>
            )}

            {/* Color */}
            {colors.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Color: <span style={{ fontWeight: 400 }}>{selectedColor}</span>
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 'var(--radius)',
                        border: selectedColor === c ? '2px solid var(--black)' : '2px solid var(--grey-200)',
                        background: selectedColor === c ? 'var(--black)' : 'var(--white)',
                        color: selectedColor === c ? 'var(--white)' : 'var(--black)',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Size: <span style={{ fontWeight: 400 }}>{selectedSize}</span>
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        width: 48, height: 48,
                        borderRadius: 'var(--radius)',
                        border: selectedSize === s ? '2px solid var(--black)' : '2px solid var(--grey-200)',
                        background: selectedSize === s ? 'var(--black)' : 'var(--white)',
                        color: selectedSize === s ? 'var(--white)' : 'var(--black)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid var(--grey-200)', borderRadius: 'var(--radius)', width: 'fit-content' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', background: 'none', border: 'none' }}>−</button>
                <span style={{ width: 40, textAlign: 'center', fontWeight: 600, fontSize: '15px' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', background: 'none', border: 'none' }}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ width: '100%' }}>
                <ShoppingBag size={18} />
                Add to Cart — LKR {(product.price * quantity).toLocaleString()}
              </button>
              <button
                onClick={handleWhatsAppOrder}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#25D366',
                  color: 'var(--white)',
                  borderRadius: 'var(--radius)',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
