import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store';
import { showToast } from '../../hooks/useToast';

interface Props {
  product: Product;
}

function getImages(images: string): string[] {
  try { return JSON.parse(images) || []; } catch { return []; }
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem);
  const images = getImages(product.images);
  const sizes = (() => { try { return JSON.parse(product.sizes) || []; } catch { return []; } })();
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const size = sizes[0] || 'One Size';
    const colors = (() => { try { return JSON.parse(product.colors) || []; } catch { return []; } })();
    const color = colors[0] || 'Default';
    addItem(product, size, color);
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        {/* Image */}
        <div style={{
          position: 'relative',
          background: 'var(--grey-100)',
          aspectRatio: '3/4',
          overflow: 'hidden',
        }}>
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--grey-300)', letterSpacing: '0.1em' }}>COMET</span>
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.is_new && <span className="badge badge-new">New</span>}
            {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
          </div>

          {/* Quick add */}
          <button
            onClick={handleQuickAdd}
            style={{
              position: 'absolute',
              bottom: 12, left: 12, right: 12,
              padding: '10px',
              background: 'var(--black)',
              color: 'var(--white)',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: 0,
              transform: 'translateY(8px)',
              transition: 'all 0.2s ease',
            }}
            className="quick-add-btn"
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 4px 4px' }}>
          <p style={{ fontSize: '11px', color: 'var(--grey-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            {product.category?.name || 'Clothing'}
          </p>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--black)', marginBottom: 8, lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--black)' }}>
              LKR {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span style={{ fontSize: '13px', color: 'var(--grey-400)', textDecoration: 'line-through' }}>
                LKR {product.original_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        div:hover .quick-add-btn {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </Link>
  );
}
