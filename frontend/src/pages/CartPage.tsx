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
      <div className="flex flex-col items-center justify-center min-h-[80vh] container animate-soft-fade">
        <div className="w-40 h-40 bg-surface-container rounded-full flex items-center justify-center mb-10">
          <span className="material-symbols-outlined text-[64px] opacity-20">shopping_bag</span>
        </div>
        <h2 className="text-headline-lg mb-4">YOUR CART IS EMPTY</h2>
        <p className="text-on-surface-variant opacity-60 mb-12">Looking for something to move in?</p>
        <Link to="/shop" className="btn-pill btn-pill-primary px-16">START EXPLORING</Link>
      </div>
    );
  }

  return (
    <main className="container py-24 animate-soft-fade">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20">
        <div>
          <p className="text-label-caps text-primary tracking-[0.3em] mb-4">Selection</p>
          <h1 className="text-headline-lg">YOUR CART</h1>
        </div>
        <button onClick={clearCart} className="text-label-caps text-[10px] opacity-40 hover:opacity-100 hover:text-primary transition-all border-b border-outline/20 pb-1">Clear Selection</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-8">
          {items.map(item => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="group flex flex-col sm:flex-row gap-10 items-center animate-soft-fade"
            >
              {/* Image */}
              <div className="w-32 aspect-[3/4] flex-shrink-0 bg-surface-container rounded-[24px] overflow-hidden">
                {(() => {
                  const imgs = (() => { try { return JSON.parse(item.product.images || '[]'); } catch { return []; } })();
                  return imgs[0] ? (
                    <img src={getImageUrl(imgs[0])} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-xl text-outline/20 opacity-20">COMET</span>
                    </div>
                  );
                })()}
              </div>

              {/* Info */}
              <div className="flex-grow text-center sm:text-left">
                <p className="text-label-caps text-[10px] opacity-40 mb-2">{item.product.category?.name || 'CORE'}</p>
                <h3 className="text-headline-md text-2xl mb-1 group-hover:text-primary transition-colors">{item.product.name}</h3>
                <p className="text-body text-[12px] opacity-60 font-medium tracking-wider">
                  SIZE: {item.size} / COLOR: {item.color}
                </p>
                <p className="text-body font-semibold mt-6">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center bg-surface-container rounded-full p-1">
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-background transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="w-10 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-background transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>

              {/* Subtotal */}
              <div className="sm:min-w-[120px] text-right">
                <p className="text-2xl font-semibold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.product.id, item.size, item.color)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">delete_outline</span>
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <div className="bg-surface p-10 rounded-[40px] border border-outline/10 shadow-sm">
            <h2 className="text-label-caps text-lg mb-10 border-b border-outline/10 pb-6 opacity-80">
              Order Summary
            </h2>

            <div className="space-y-6 mb-10">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between text-[13px] opacity-60">
                  <span className="font-light">{item.product.name} ×{item.quantity}</span>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-outline/10 pt-8 flex justify-between items-end">
                <span className="text-label-caps font-semibold">EST. TOTAL</span>
                <span className="text-3xl font-semibold text-on-background">${totalPrice().toFixed(2)}</span>
              </div>
            </div>

            {!checkoutMode ? (
              <button className="btn-pill btn-pill-primary w-full h-16 text-[13px] tracking-widest font-bold" onClick={() => setCheckoutMode(true)}>
                PROCEED TO CHECKOUT
              </button>
            ) : (
              <div className="space-y-8 animate-soft-fade">
                <h3 className="text-label-caps text-[11px] opacity-40">Shipping Information</h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-6 py-4 text-[14px] focus:outline-none focus:border-primary transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-6 py-4 text-[14px] focus:outline-none focus:border-primary transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-6 py-4 text-[14px] focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <textarea
                    placeholder="Shipping Address"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-6 py-4 text-[14px] focus:outline-none focus:border-primary transition-all"
                    rows={3}
                  />
                  <textarea
                    placeholder="Notes (Optional)"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-surface-container-low border border-outline/10 rounded-2xl px-6 py-4 text-[14px] focus:outline-none focus:border-primary transition-all"
                    rows={2}
                  />
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  disabled={loading}
                  className="btn-pill btn-pill-primary w-full h-16 bg-secondary text-white hover:bg-on-background flex items-center justify-center gap-4 text-[13px] tracking-widest font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>

                <button className="text-label-caps text-[10px] opacity-40 hover:opacity-100 w-full text-center tracking-widest" onClick={() => setCheckoutMode(false)}>
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
