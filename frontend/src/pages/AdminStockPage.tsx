import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Package } from 'lucide-react';
import { stockApi, productsApi } from '../api';
import { Stock, Product } from '../types';
import { showToast } from '../hooks/useToast';

export default function AdminStockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [form, setForm] = useState({ product_id: '', size: '', color: '', quantity: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([stockApi.getAll(), productsApi.getAllAdmin()])
      .then(([sRes, pRes]) => {
        setStocks(sRes.data);
        setProducts(pRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const getProductName = (id: number) => products.find(p => p.id === id)?.name || `Product #${id}`;

  const openCreate = () => {
    setEditingStock(null);
    setForm({ product_id: '', size: '', color: '', quantity: '' });
    setShowModal(true);
  };

  const openEdit = (s: Stock) => {
    setEditingStock(s);
    setForm({ product_id: String(s.product_id), size: s.size, color: s.color, quantity: String(s.quantity) });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.product_id || !form.size || !form.color || form.quantity === '') {
      showToast('All fields required', 'error'); return;
    }
    setSaving(true);
    try {
      if (editingStock) {
        await stockApi.update(editingStock.id, Number(form.quantity));
        showToast('Stock updated!', 'success');
      } else {
        await stockApi.createOrUpdate({
          product_id: Number(form.product_id),
          size: form.size,
          color: form.color,
          quantity: Number(form.quantity)
        });
        showToast('Stock created!', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Error saving stock', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this stock entry?')) return;
    await stockApi.delete(id);
    showToast('Stock deleted', 'success');
    fetchData();
  };

  // Group by product
  const grouped = stocks.reduce((acc, s) => {
    if (!acc[s.product_id]) acc[s.product_id] = [];
    acc[s.product_id].push(s);
    return acc;
  }, {} as Record<number, Stock[]>);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '0.06em' }}>STOCK</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Stock
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : stocks.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>No stock entries yet. Add some!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {Object.entries(grouped).map(([productId, productStocks]) => (
            <div key={productId} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', background: 'var(--grey-900)', color: 'var(--white)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Package size={16} color="var(--grey-400)" />
                <span style={{ fontWeight: 600 }}>{getProductName(Number(productId))}</span>
                <span style={{ fontSize: '12px', color: 'var(--grey-500)', marginLeft: 'auto' }}>
                  {productStocks.length} variant{productStocks.length !== 1 ? 's' : ''}
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--grey-100)' }}>
                    {['Size', 'Color', 'Quantity', 'Status', 'Updated', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--grey-500)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productStocks.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.size}</td>
                      <td style={{ padding: '12px 16px' }}>{s.color}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontWeight: 700, fontSize: '18px', color: s.quantity === 0 ? 'var(--error)' : s.quantity < 5 ? 'var(--warning)' : 'var(--success)' }}>
                          {s.quantity}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 2, fontSize: '11px', fontWeight: 700,
                          background: s.quantity === 0 ? '#fee2e2' : s.quantity < 5 ? '#fef3c7' : '#dcfce7',
                          color: s.quantity === 0 ? '#991b1b' : s.quantity < 5 ? '#92400e' : '#15803d',
                        }}>
                          {s.quantity === 0 ? 'Out of Stock' : s.quantity < 5 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--grey-400)' }}>
                        {new Date(s.updated_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)} style={{ padding: '6px 10px' }}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(s.id)} style={{ padding: '6px 10px', color: 'var(--error)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 480, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{editingStock ? 'Update Quantity' : 'Add Stock Entry'}</h2>
              <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {!editingStock && (
                <>
                  <div className="form-group">
                    <label className="form-label">Product *</label>
                    <select className="form-input" value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}>
                      <option value="">Select a product</option>
                      {products.filter(p => p.is_active).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Size *</label>
                    <input className="form-input" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="e.g. M, L, XL" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color *</label>
                    <input className="form-input" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="e.g. Black, White" />
                  </div>
                </>
              )}
              {editingStock && (
                <div style={{ padding: '12px 16px', background: 'var(--grey-100)', borderRadius: 'var(--radius)', fontSize: '14px' }}>
                  <strong>{getProductName(editingStock.product_id)}</strong> — {editingStock.size} / {editingStock.color}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input className="form-input" type="number" min="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="0" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingStock ? 'Update' : 'Add Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
