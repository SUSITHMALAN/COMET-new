import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store';
import { ordersApi, getImageUrl } from '../api';
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
      `• ${i.product.name} (${i.size}, ${i.color}) x${i.quantity} — $${(i.product.price * i.quantity).toFixed(2)}`
    ).join('\n');

    const msg = `*New COMET Order* 🚀\n\n*Customer:* ${form.name}\n*Phone:* ${form.phone}\n*Address:* ${form.address}\n\n*Items:*\n${itemLines}\n\n*Total: $${totalPrice().toFixed(2)}*\n\n${form.notes ? `*Notes:* ${form.notes}` : ''}`;

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
      window.open(`https://wa.me/94771758395?text=${encodeURIComponent(msg)}`, '_blank');
      clearCart();
      navigate('/');
    }).finally(() => setLoading(false));
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] container fade-in">
        <span className="material-symbols-outlined text-[120px] text-white/5 mb-8">shopping_bag</span>
        <h2 className="text-headline-lg text-white mb-4">YOUR CART IS EMPTY</h2>
        <p className="text-on-surface-variant mb-12">LOOKS LIKE YOU HAVEN'T ADDED ANY GEAR YET.</p>
        <Link to="/shop" className="btn-brutalist px-12 py-4">START SHOPPING</Link>
      </div>
    );
  }

  return (
    <main className="container py-12 fade-in">
      <h1 className="text-headline-xl text-white mb-12">YOUR CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(item => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="bg-surface-container-low border-2 border-white/10 p-6 flex flex-col sm:flex-row gap-6 items-center"
            >
              {/* Image */}
              <div className="w-24 aspect-[3/4] flex-shrink-0 bg-surface-container">
                {(() => {
                  const imgs = (() => { try { return JSON.parse(item.product.images || '[]'); } catch { return []; } })();
                  return imgs[0] ? (
                    <img src={getImageUrl(imgs[0])} alt={item.product.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-xl text-white/10">COMET</span>
                    </div>
                  );
                })()}
              </div>

              {/* Info */}
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-label-caps text-white text-lg mb-1">{item.product.name.toUpperCase()}</h3>
                <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
                  {item.size} / {item.color}
                </p>
                <p className="text-white font-bold mt-4">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center border-2 border-white/10">
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>

              {/* Subtotal */}
              <div className="sm:min-w-[120px] text-right">
                <p className="text-xl font-bold text-white">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.product.id, item.size, item.color)}
                className="text-on-surface-variant hover:text-primary transition-colors p-2"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-surface-container border-2 border-white/10 p-8">
            <h2 className="text-label-caps text-xl text-white mb-8 border-b-2 border-white/10 pb-4">
              ORDER SUMMARY
            </h2>

            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between text-xs text-on-surface-variant">
                  <span>{item.product.name.toUpperCase()} ×{item.quantity}</span>
                  <span className="text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t-2 border-white/10 pt-4 flex justify-between items-end">
                <span className="text-label-caps text-white">TOTAL</span>
                <span className="text-3xl font-bold text-primary">${totalPrice().toFixed(2)}</span>
              </div>
            </div>

            {!checkoutMode ? (
              <button className="btn-brutalist w-full py-4" onClick={() => setCheckoutMode(true)}>
                PROCEED TO CHECKOUT
              </button>
            ) : (
              <div className="space-y-6 fade-in">
                <h3 className="text-label-caps text-xs text-white">SHIPPING INFORMATION</h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value.toUpperCase() }))}
                    className="input-minimal w-full"
                  />
                  <input
                    type="tel"
                    placeholder="PHONE NUMBER"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="input-minimal w-full"
                  />
                  <input
                    type="email"
                    placeholder="EMAIL (OPTIONAL)"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-minimal w-full"
                  />
                  <textarea
                    placeholder="SHIPPING ADDRESS"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value.toUpperCase() }))}
                    className="input-minimal w-full"
                    rows={3}
                  />
                  <textarea
                    placeholder="NOTES (OPTIONAL)"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value.toUpperCase() }))}
                    className="input-minimal w-full"
                    rows={2}
                  />
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  disabled={loading}
                  className="btn-brutalist w-full py-4 bg-secondary text-black hover:bg-white flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">send</span>
                  {loading ? 'PROCESSING...' : 'CONFIRM ORDER'}
                </button>

                <button className="text-label-caps text-[10px] text-on-surface-variant hover:text-white w-full text-center" onClick={() => setCheckoutMode(false)}>
                  ← BACK TO CART
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
