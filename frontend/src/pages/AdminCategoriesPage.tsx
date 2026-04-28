import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Tags } from 'lucide-react';
import { categoriesApi } from '../api';
import { Category } from '../types';
import { showToast } from '../hooks/useToast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const defaultForm = { name: '', slug: '', description: '' };
  const [form, setForm] = useState(defaultForm);

  const fetchCategories = () => {
    setLoading(true);
    categoriesApi.getAll()
      .then(res => setCategories(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      showToast('Name and slug are required', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await categoriesApi.update(editing.id, form);
        showToast('Category updated!', 'success');
      } else {
        await categoriesApi.create(form);
        showToast('Category created!', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category? Ensure no products are linked to it.')) return;
    try {
      await categoriesApi.delete(id);
      showToast('Category deleted', 'success');
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Delete failed', 'error');
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', letterSpacing: '0.06em' }}>CATEGORIES</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
      ) : (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--grey-100)' }}>
                {['ID', 'Name', 'Slug', 'Description', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--grey-500)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--grey-400)' }}>#{c.id}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--grey-500)' }}>{c.slug}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--grey-500)' }}>{c.description || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)} style={{ padding: '6px 10px' }}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(c.id)} style={{ padding: '6px 10px', color: 'var(--error)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 60, textAlign: 'center', color: 'var(--grey-400)' }}>No categories yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 450, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input 
                  className="form-input" 
                  value={form.name} 
                  onChange={e => {
                    const val = e.target.value;
                    setForm(f => ({ 
                      ...f, 
                      name: val,
                      slug: editing ? f.slug : val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    }));
                  }} 
                  placeholder="e.g. Graphic Tees" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slug *</label>
                <input 
                  className="form-input" 
                  value={form.slug} 
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} 
                  placeholder="graphic-tees" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  value={form.description} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                  rows={3} 
                  placeholder="Optional category description..." 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
