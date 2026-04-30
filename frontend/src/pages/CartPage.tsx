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
        <h2 className="text-headline-lg text-primary mb-4 font-serif">Your bag is empty</h2>
        <p className="text-secondary opacity-70 mb-12 max-w-sm text-center italic font-light">It seems your collection is awaiting its first beautiful piece.</p>
        <Link to="/shop" className="bg-primary text-white px-12 py-4 rounded-full text-label-sm uppercase tracking-widest shadow-soft hover:opacity-90 transition-opacity">
          Begin Exploring
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 px-16 max-w-[1440px] mx-auto animate-fade-in-slide selection:bg-rose-100">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <span className="text-[10px] text-rose-400 uppercase tracking-[0.3em] font-bold mb-4 block">Selection</span>
          <h1 className="text-headline-xl text-primary font-serif">Your Cart</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button onClick={clearCart} className="text-[10px] text-rose-300 hover:text-rose-500 uppercase tracking-widest border-b border-rose-100 pb-1 transition-colors">
            Clear Selection
          </button>
          <p className="text-label-sm text-secondary italic opacity-60">
            {items.length} {items.length === 1 ? 'Piece' : 'Pieces'} Selected
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-10">
          {items.map(item => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="group flex flex-col sm:flex-row gap-10 items-center pb-10 border-b border-rose-50/50"
            >
              <div className="w-48 aspect-[4/5] rounded-3xl overflow-hidden bg-rose-50/30 border border-rose-100 shadow-sm relative group-hover:shadow-soft transition-all">
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

              <div className="flex-1 text-center sm:text-left">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[9px] text-rose-400 uppercase tracking-widest mb-1 font-bold">{item.product.category?.name || 'Collection'}</p>
                    <h3 className="text-headline-md text-3xl text-primary font-serif mb-1">{item.product.name}</h3>
                    <p className="text-label-sm text-secondary/60 uppercase tracking-tighter">
                      Size: <span className="text-primary font-bold">{item.size}</span> / Color: <span className="text-primary font-bold">{item.color}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-rose-200 hover:bg-rose-50 hover:text-error transition-all"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-10 pt-6 border-t border-rose-50/30 gap-6">
                  <div className="flex items-center gap-6 glass-card px-3 py-1.5 rounded-full border border-rose-100">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-8 text-center font-bold text-primary">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-body-md text-secondary italic block mb-1">Subtotal</span>
                    <span className="text-3xl font-light text-rose-400">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-12 rounded-[40px] border border-rose-100 shadow-soft sticky top-32">
            <h2 className="text-headline-md text-primary font-serif mb-12 text-center border-b border-rose-50 pb-6">Order Summary</h2>
            
            <div className="space-y-8 mb-12">
              <div className="space-y-4">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between text-label-sm text-secondary items-baseline">
                    <span className="font-light italic line-clamp-1 flex-1 pr-4">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-8 border-t border-rose-50">
                <div className="flex justify-between text-body-md text-secondary">
                  <span>Shipping</span>
                  <span className="font-medium text-rose-400 italic">Complimentary</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-label-sm text-primary uppercase tracking-[0.2em] font-bold">Estimated Total</span>
                  <span className="text-4xl font-light text-rose-400">${totalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!checkoutMode ? (
              <button 
                onClick={() => setCheckoutMode(true)}
                className="w-full bg-primary text-white py-6 rounded-full text-label-sm uppercase tracking-[0.2em] font-bold shadow-soft hover:opacity-90 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="space-y-8 animate-fade-in-slide">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/50 border border-rose-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-white/50 border border-rose-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white/50 border border-rose-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 transition-all"
                    />
                  </div>
                  <textarea
                    placeholder="Shipping Address"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full bg-white/50 border border-rose-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 transition-all"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  disabled={loading}
                  className="w-full bg-rose-400 text-white py-6 rounded-full text-label-sm uppercase tracking-[0.2em] font-bold shadow-soft hover:bg-rose-500 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  {loading ? 'Processing...' : 'Reserve via WhatsApp'}
                </button>

                <button 
                  onClick={() => setCheckoutMode(false)}
                  className="w-full text-center text-[10px] text-secondary hover:text-primary uppercase tracking-[0.3em] font-bold transition-colors"
                >
                  ← Back to Selection
                </button>
              </div>
            )}
            
            <p className="mt-12 text-[10px] text-secondary text-center italic opacity-40 leading-relaxed px-6">
              Each order is personally curated and shipped with care from our boutique to your doorstep.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
