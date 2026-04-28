import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Star, Sparkles } from 'lucide-react';
import { productsApi, categoriesApi } from '../api';
import { Product, Category } from '../types';
import { showToast } from '../hooks/useToast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const defaultForm = {
    name: '', description: '', price: '', original_price: '',
    category_id: '', sizes: 'XS,S,M,L,XL,XXL', colors: 'Black,White',
    is_featured: false, is_new: false, is_active: true,
  };
  const [form, setForm] = useState(defaultForm);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([productsApi.getAllAdmin(), categoriesApi.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data);
        setCategories(cRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setImageFiles([]);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const sizes = (() => { try { return JSON.parse(p.sizes).join(','); } catch { return ''; } })();
    const colors = (() => { try { return JSON.parse(p.colors).join(','); } catch { return ''; } })();
    setForm({
      name: p.name, description: p.description || '',
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : '',
      category_id: p.category_id ? String(p.category_id) : '',
      sizes, colors,
      is_featured: p.is_featured, is_new: p.is_new, is_active: p.is_active,
    });
    setImageFiles([]);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { showToast('Name and price are required', 'error'); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    if (form.original_price) fd.append('original_price', form.original_price);
    if (form.category_id) fd.append('category_id', form.category_id);
    fd.append('sizes', JSON.stringify(form.sizes.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('colors', JSON.stringify(form.colors.split(',').map(c => c.trim()).filter(Boolean)));
    fd.append('is_featured', String(form.is_featured));
    fd.append('is_new', String(form.is_new));
    if (editing) fd.append('is_active', String(form.is_active));
    imageFiles.forEach(f => fd.append('images', f));

    try {
      if (editing) {
        await productsApi.update(editing.id, fd);
        showToast('Product updated!', 'success');
      } else {
        await productsApi.create(fd);
        showToast('Product created!', 'success');
      }
      setShowModal(false);
      fetchAll();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await productsApi.delete(id);
    showToast('Product deleted', 'success');
    fetchAll();
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '0.06em' }}>PRODUCTS</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--grey-100)' }}>
                {['Product', 'Category', 'Price', 'Status', 'Flags', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--grey-500)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const imgs = (() => { try { return JSON.parse(p.images); } catch { return []; } })();
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 60, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--grey-100)', flexShrink: 0 }}>
                          {imgs[0] ? <img src={imgs[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--grey-400)' }}>#{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--grey-500)' }}>{p.category?.name || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontWeight: 700, fontSize: '14px' }}>LKR {p.price.toLocaleString()}</p>
                      {p.original_price && <p style={{ fontSize: '11px', color: 'var(--grey-400)', textDecoration: 'line-through' }}>LKR {p.original_price.toLocaleString()}</p>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 2, fontSize: '11px', fontWeight: 700,
                        background: p.is_active ? '#dcfce7' : '#fee2e2',
                        color: p.is_active ? '#15803d' : '#991b1b',
                      }}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {p.is_featured && <span title="Featured"><Star size={14} color="#f59e0b" fill="#f59e0b" /></span>}
                        {p.is_new && <span title="New"><Sparkles size={14} color="#3b82f6" fill="#3b82f6" /></span>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} style={{ padding: '6px 10px' }}>
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p.id)} style={{ padding: '6px 10px', color: 'var(--error)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center', color: 'var(--grey-400)' }}>No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="COMET Classic Tee" />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Product description..." />
              </div>
              <div className="form-group">
                <label className="form-label">Price (LKR) *</label>
                <input className="form-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2990" />
              </div>
              <div className="form-group">
                <label className="form-label">Original Price (LKR)</label>
                <input className="form-input" type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} placeholder="3990" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                  <option value="">None</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sizes (comma separated)</label>
                <input className="form-input" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} placeholder="XS,S,M,L,XL" />
              </div>
              <div className="form-group">
                <label className="form-label">Colors (comma separated)</label>
                <input className="form-input" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} placeholder="Black,White,Grey" />
              </div>
              <div className="form-group">
                <label className="form-label">Images</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: '1.5px dashed var(--grey-300)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '13px', color: 'var(--grey-500)' }}>
                  <Upload size={16} />
                  {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Upload images'}
                  <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => setImageFiles(Array.from(e.target.files || []))} />
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { key: 'is_featured', label: 'Featured Product' },
                  { key: 'is_new', label: 'New Arrival' },
                  ...(editing ? [{ key: 'is_active', label: 'Active (visible)' }] : []),
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
