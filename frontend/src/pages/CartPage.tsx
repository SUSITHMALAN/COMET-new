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
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-16 animate-fade-in-slide">
        <div className="w-48 h-48 bg-rose-50 rounded-full flex items-center justify-center mb-10 border border-rose-100 shadow-soft">
          <span className="material-symbols-outlined text-[64px] text-rose-200">shopping_bag</span>
        </div>
        <h2 className="text-headline-lg text-primary mb-4">Your bag is empty</h2>
        <p className="text-secondary opacity-70 mb-12 max-w-sm text-center italic font-light">It seems your collection is awaiting its first beautiful piece.</p>
        <Link to="/shop" className="bg-primary text-white px-12 py-4 rounded-full text-label-sm uppercase tracking-widest shadow-soft hover:opacity-90 transition-opacity">
          Begin Exploring
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 px-16 max-w-[1440px] mx-auto animate-fade-in-slide">
      <header className="mb-16">
        <h1 className="text-headline-xl text-primary mb-2">Your Bag</h1>
        <div className="flex items-center gap-4 text-label-sm text-secondary">
          <span>{items.length} {items.length === 1 ? 'Piece' : 'Pieces'} Selected</span>
          <div className="w-1.5 h-1.5 bg-rose-200 rounded-full"></div>
          <button onClick={clearCart} className="text-rose-400 hover:text-rose-600 transition-colors">Clear All</button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items */}
        <div className="flex-1 space-y-10">
          {items.map(item => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="group flex gap-10 items-center pb-10 border-b border-rose-50"
            >
              <div className="w-40 aspect-[4/5] rounded-2xl overflow-hidden bg-rose-50/30 border border-rose-100 shadow-sm relative">
                {(() => {
                  const imgs = (() => { try { return JSON.parse(item.product.images || '[]'); } catch { return []; } })();
                  return imgs[0] ? (
                    <img src={getImageUrl(imgs[0])} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <span className="font-display text-4xl">EG</span>
                    </div>
                  );
                })()}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-headline-md text-2xl text-primary group-hover:text-rose-600 transition-colors">{item.product.name}</h3>
                    <p className="text-label-sm text-secondary uppercase tracking-widest mt-1 opacity-60">{item.product.category?.name || 'Collection'}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="text-rose-300 hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>

                <div className="flex gap-6 mt-6 items-center">
                  <div className="px-4 py-2 bg-rose-50/50 border border-rose-100 rounded-full text-[10px] font-bold text-primary uppercase tracking-tighter">
                    {item.size} / {item.color}
                  </div>
                  <div className="flex items-center gap-4 glass-card px-2 py-1 rounded-full border border-rose-100">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-6 text-center font-medium text-primary text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-end">
                  <span className="text-body-md text-secondary italic">Per piece: ${item.product.price}</span>
                  <span className="text-2xl font-light text-rose-400">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="w-full lg:w-[450px]">
          <div className="glass-card p-10 rounded-3xl border border-rose-100 shadow-soft sticky top-32">
            <h2 className="text-headline-md text-primary mb-10 text-center">Summary</h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-body-md text-secondary">
                <span>Subtotal</span>
                <span className="font-medium">${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-body-md text-secondary">
                <span>Shipping</span>
                <span className="font-medium text-rose-400 italic">Complimentary</span>
              </div>
              <div className="pt-6 border-t border-rose-100 flex justify-between items-end">
                <span className="text-label-sm text-primary uppercase tracking-widest font-bold">Total</span>
                <span className="text-4xl font-light text-rose-400">${totalPrice().toFixed(2)}</span>
              </div>
            </div>

            {!checkoutMode ? (
              <button 
                onClick={() => setCheckoutMode(true)}
                className="w-full bg-primary text-white py-5 rounded-full text-label-sm uppercase tracking-widest shadow-soft hover:opacity-90 transition-all active:scale-95"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="space-y-6 animate-fade-in-slide">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/50 border border-rose-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-white/50 border border-rose-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white/50 border border-rose-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200"
                    />
                  </div>
                  <textarea
                    placeholder="Shipping Address"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full bg-white/50 border border-rose-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  disabled={loading}
                  className="w-full bg-rose-400 text-white py-5 rounded-full text-label-sm uppercase tracking-widest shadow-soft hover:bg-rose-500 transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  {loading ? 'Processing...' : 'Reserve via WhatsApp'}
                </button>

                <button 
                  onClick={() => setCheckoutMode(false)}
                  className="w-full text-center text-[10px] text-secondary hover:text-primary uppercase tracking-[0.2em] transition-colors"
                >
                  ← Back to Bag
                </button>
              </div>
            )}
            
            <p className="mt-10 text-[10px] text-secondary text-center italic opacity-60">
              Each order is personally curated and shipped with care from our boutique.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
