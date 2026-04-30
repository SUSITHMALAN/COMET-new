import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import { Product, Category } from '../types';
import ProductCard from '../components/ui/ProductCard';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

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

  return (
    <main className="container py-24 animate-soft-fade">
      {/* Hero Header */}
      <header className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-2xl">
          <p className="text-label-caps text-primary tracking-[0.3em] mb-4">Discovery</p>
          <h1 className="text-headline-lg">CORE CATALOG</h1>
          <p className="text-body text-[16px] opacity-60 mt-6 leading-relaxed">
            A curated selection of high-performance gear engineered for contemporary movement. Each piece is defined by technical precision and timeless aesthetics.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <button 
            className="text-label-caps tracking-widest border-b border-on-background pb-1 hover:text-primary transition-all"
            onClick={() => clearFilters()}
          >
            Clear Filters / {products.length.toString().padStart(2, '0')}
          </button>
          <div className="bg-surface-container rounded-full p-1 flex items-center">
            <button className="px-6 py-2 bg-on-background text-white text-[11px] font-bold tracking-widest rounded-full uppercase">Grid</button>
            <button className="px-6 py-2 text-on-surface-variant text-[11px] font-bold tracking-widest uppercase hover:text-on-background">List</button>
          </div>
        </div>
      </header>

      {/* Product Viewport */}
      <div className="flex flex-col lg:flex-row gap-20">
        {/* Side Filters (Desktop) */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-32 space-y-20">
            <div>
              <h3 className="text-label-caps text-[11px] mb-8 opacity-40">Categories</h3>
              <ul className="space-y-6">
                <li>
                  <button 
                    onClick={() => clearFilters()}
                    className={`text-body text-[14px] text-left w-full transition-all flex justify-between items-center ${!categorySlug && !filter ? 'text-on-background font-semibold' : 'text-on-surface-variant hover:text-on-background'}`}
                  >
                    <span>All Products</span>
                    {!categorySlug && !filter && <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>}
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setCategory(cat.slug)}
                      className={`text-body text-[14px] text-left w-full transition-all flex justify-between items-center ${categorySlug === cat.slug ? 'text-on-background font-semibold' : 'text-on-surface-variant hover:text-on-background'}`}
                    >
                      <span>{cat.name}</span>
                      {categorySlug === cat.slug && <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-label-caps text-[11px] mb-8 opacity-40">Drop Status</h3>
              <div className="space-y-6">
                <button 
                  onClick={() => setFilter('new')}
                  className={`text-body text-[14px] text-left w-full transition-all flex justify-between items-center ${filter === 'new' ? 'text-on-background font-semibold' : 'text-on-surface-variant hover:text-on-background'}`}
                >
                  <span>New Arrivals</span>
                  {filter === 'new' && <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>}
                </button>
                <button 
                  onClick={() => setFilter('featured')}
                  className={`text-body text-[14px] text-left w-full transition-all flex justify-between items-center ${filter === 'featured' ? 'text-on-background font-semibold' : 'text-on-surface-variant hover:text-on-background'}`}
                >
                  <span>Featured Drops</span>
                  {filter === 'featured' && <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>}
                </button>
              </div>
            </div>

            <div className="p-10 rounded-[32px] bg-primary/10 border border-primary/10 relative overflow-hidden group">
              <p className="text-label-caps text-[10px] text-primary mb-4">Membership</p>
              <h4 className="text-headline-md text-xl mb-6">COMET PRO++</h4>
              <p className="text-body text-[12px] opacity-60 mb-8 leading-relaxed">Priority access to archival drops and engineering advice.</p>
              <button className="text-label-caps text-[10px] font-bold border-b border-primary pb-1 hover:text-primary transition-all">Join Fleet</button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-surface-container rounded-[40px]">
              <h3 className="text-headline-md mb-6">No matches found</h3>
              <button className="btn-pill btn-pill-outline" onClick={clearFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-40 flex justify-center items-center gap-4">
            <button className="w-14 h-14 rounded-full border border-outline/10 flex items-center justify-center text-on-background hover:bg-on-background hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full bg-on-background text-white font-medium text-[14px]">01</button>
              <button className="w-14 h-14 rounded-full border border-outline/10 text-on-background font-medium text-[14px] hover:bg-surface">02</button>
              <button className="w-14 h-14 rounded-full border border-outline/10 text-on-background font-medium text-[14px] hover:bg-surface">03</button>
            </div>
            <button className="w-14 h-14 rounded-full border border-outline/10 flex items-center justify-center text-on-background hover:bg-on-background hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
