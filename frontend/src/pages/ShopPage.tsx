import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productsApi, categoriesApi } from '../api';
import { Product, Category } from '../types';
import ProductCard from '../components/ui/ProductCard';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categorySlug = searchParams.get('category') || '';
  const filter = searchParams.get('filter') || '';

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params: Record<string, any> = {};
    if (categorySlug) params.category = categorySlug;
    if (filter === 'new') params.is_new = true;
    if (filter === 'featured') params.featured = true;
    if (search) params.search = search;

    productsApi.getAll(params)
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [categorySlug, filter, search]);

  useEffect(() => {
    categoriesApi.getAll().then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.delete('filter');
    setSearchParams(params);
  };

  const setFilter = (f: string) => {
    const params = new URLSearchParams(searchParams);
    if (f) params.set('filter', f);
    else params.delete('filter');
    params.delete('category');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchParams({});
  };

  const hasFilters = categorySlug || filter || search;

  const filterLabel = filter === 'new' ? 'New Arrivals'
    : filter === 'featured' ? 'Featured'
    : filter === 'sale' ? 'Sale'
    : categorySlug ? categories.find(c => c.slug === categorySlug)?.name || 'Collection'
    : search ? `"${search}"`
    : 'All Products';

  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--black)',
        padding: 'clamp(40px, 6vw, 60px) 0 clamp(28px, 4vw, 40px)',
        borderBottom: '1px solid var(--grey-800)',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 8vw, 96px)',
            letterSpacing: '0.06em',
            color: 'var(--white)',
            marginBottom: 'clamp(16px, 3vw, 24px)',
          }}>
            {filterLabel.toUpperCase()}
          </h1>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480, width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--grey-500)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: 44,
                background: 'var(--grey-900)',
                border: '1.5px solid var(--grey-800)',
                color: 'var(--white)',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: 'clamp(24px, 4vw, 32px) 24px' }}>
        {/* Filter bar */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 'clamp(20px, 3vw, 32px)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <button
            className={`btn btn-sm ${!categorySlug && !filter ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => clearFilters()}
          >
            All
          </button>
          <button
            className={`btn btn-sm ${filter === 'new' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('new')}
          >
            New In
          </button>
          <button
            className={`btn btn-sm ${filter === 'featured' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter('featured')}
          >
            Featured
          </button>
          <div style={{ width: 1, height: 24, background: 'var(--grey-200)', margin: '0 4px' }} />
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`btn btn-sm ${categorySlug === cat.slug ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
          {hasFilters && (
            <button className="btn btn-sm btn-ghost" onClick={clearFilters} style={{ marginLeft: 'auto', color: 'var(--accent)' }}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 'clamp(16px, 2vw, 24px)', color: 'var(--grey-500)', fontSize: '13px' }}>
          {loading ? 'Loading...' : `${products.length} products`}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(48px, 8vw, 80px) 0' }}>
            <div className="spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--grey-600)' }}>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
