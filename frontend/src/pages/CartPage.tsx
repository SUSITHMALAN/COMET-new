import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store';
import { ordersApi } from '../api';
import { showToast } from '../hooks/useToast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', notes: '' });
  const navigate = useNavigate();

  const handleWhatsAppOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      showToast('Please fill in name, phone and address', 'error');
      return;
    }

    const itemLines = items.map(i =>
      `• ${i.product.name} (${i.size}, ${i.color}) x${i.quantity} — LKR ${(i.product.price * i.quantity).toLocaleString()}`
    ).join('\n');

    const msg = `*New COMET Order* 🚀\n\n*Customer:* ${form.name}\n*Phone:* ${form.phone}\n*Email:* ${form.email || 'N/A'}\n*Address:* ${form.address}\n\n*Items:*\n${itemLines}\n\n*Total: LKR ${totalPrice().toLocaleString()}*\n\n${form.notes ? `*Notes:* ${form.notes}` : ''}`;

    // Save order to backend
    setLoading(true);
    ordersApi.create({
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || undefined,
      shipping_address: form.address,
      notes: form.notes || undefined,
      items: items.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
        price: i.product.price,
      }))
    }).then(() => {
      clearCart();
      window.open(`https://wa.me/94771758395?text=${encodeURIComponent(msg)}`, '_blank');
      showToast('Order placed! Redirecting to WhatsApp...', 'success');
      setTimeout(() => navigate('/'), 1500);
    }).catch(() => {
      // Even if backend fails, open WhatsApp
      window.open(`https://wa.me/94771758395?text=${encodeURIComponent(msg)}`, '_blank');
      clearCart();
      navigate('/');
    }).finally(() => setLoading(false));
  };

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state">
          <ShoppingBag size={64} strokeWidth={1} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '0.06em', color: 'var(--grey-700)' }}>
            YOUR CART IS EMPTY
          </h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', background: 'var(--grey-100)' }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.06em', marginBottom: 40 }}>
          YOUR CART
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map(item => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  gap: 20,
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Image */}
                <div style={{ width: 88, height: 110, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--grey-100)', flexShrink: 0 }}>
                  {(() => {
                    const imgs = JSON.parse(item.product.images || '[]');
                    return imgs[0] ? (
                      <img src={imgs[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--grey-300)' }}>C</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, fontSize: '15px', marginBottom: 4 }}>{item.product.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--grey-500)' }}>
                    {item.size} · {item.color}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginTop: 8 }}>
                    LKR {item.product.price.toLocaleString()}
                  </p>
                </div>

                {/* Qty controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid var(--grey-200)', borderRadius: 'var(--radius)' }}>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ width: 32, textAlign: 'center', fontWeight: 600, fontSize: '14px' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ minWidth: 100, textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '16px' }}>
                    LKR {(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product.id, item.size, item.color)}
                  style={{ color: 'var(--grey-400)', cursor: 'pointer', background: 'none', border: 'none', padding: 8, borderRadius: 'var(--radius)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--grey-400)')}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 28, boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 'calc(var(--nav-height) + 24px)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '0.06em', marginBottom: 24 }}>
              ORDER SUMMARY
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--grey-600)' }}>
                  <span>{item.product.name} ×{item.quantity}</span>
                  <span>LKR {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--grey-200)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
                <span>Total</span>
                <span>LKR {totalPrice().toLocaleString()}</span>
              </div>
            </div>

            {!checkoutMode ? (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setCheckoutMode(true)}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your Details</h3>
                
                {[
                  { key: 'name', label: 'Full Name *', placeholder: 'John Silva', type: 'text' },
                  { key: 'phone', label: 'Phone Number *', placeholder: '07X XXX XXXX', type: 'tel' },
                  { key: 'email', label: 'Email (Optional)', placeholder: 'john@example.com', type: 'email' },
                  { key: 'address', label: 'Delivery Address *', placeholder: '123 Galle Road, Colombo 3', type: 'text' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                ))}

                <div className="form-group">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    placeholder="Special instructions..."
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="form-input"
                    rows={2}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#25D366',
                    color: 'var(--white)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    border: 'none',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {loading ? 'Placing Order...' : 'Confirm via WhatsApp'}
                </button>

                <button className="btn btn-ghost btn-sm" onClick={() => setCheckoutMode(false)}>
                  ← Back to cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
