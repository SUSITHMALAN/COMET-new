import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsApi, categoriesApi, getImageUrl } from '../api';
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
    <main className="pt-32 pb-20 px-16 max-w-[1440px] mx-auto animate-fade-in-slide">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-headline-xl text-primary mb-2">Girls' Collection</h1>
        <p className="text-body-lg text-secondary font-light">Timeless pieces designed for moments of wonder.</p>
      </header>

      {/* Catalog Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Side Panel (Glassmorphic) */}
        <aside className="w-full lg:w-64 space-y-10">
          <section>
            <h3 className="text-label-sm text-primary mb-4 uppercase tracking-widest">Categories</h3>
            <div className="flex flex-wrap lg:flex-col gap-3">
              <button 
                onClick={() => clearFilters()}
                className={`glass-card px-4 py-2 rounded-full border border-rose-100 text-sm text-primary transition-all duration-300 text-left ${!categorySlug && !filter ? 'bg-rose-100/30 font-semibold' : 'hover:bg-rose-50/50'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setCategory(cat.slug)}
                  className={`glass-card px-4 py-2 rounded-full border border-rose-100 text-sm text-primary transition-all duration-300 text-left ${categorySlug === cat.slug ? 'bg-rose-100/30 font-semibold' : 'hover:bg-rose-50/50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-label-sm text-primary mb-4 uppercase tracking-widest">Status</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('new')}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${filter === 'new' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-rose-100/50'}`}
              >
                New Arrivals
              </button>
              <button 
                onClick={() => setFilter('featured')}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${filter === 'featured' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-rose-100/50'}`}
              >
                Featured Drops
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-label-sm text-primary mb-4 uppercase tracking-widest">Color Palette</h3>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#fadadd] border border-rose-200 cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-[#fff8f7] border border-rose-200 cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-[#e4e3db] border border-rose-200 cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-[#e1e1f5] border border-rose-200 cursor-pointer hover:scale-110 transition-transform"></div>
            </div>
          </section>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-surface-container rounded-[40px]">
              <h3 className="text-headline-md mb-6 text-primary">No pieces found</h3>
              <button className="text-label-sm text-rose-400 border-b border-rose-200" onClick={clearFilters}>Reset Collection</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
              {products.map(p => (
                <div key={p.id} className="group relative bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500">
                  <Link to={`/product/${p.id}`} className="block aspect-[4/5] w-full overflow-hidden">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt={p.name}
                      src={(() => { try { return getImageUrl(JSON.parse(p.images)[0]); } catch { return ''; } })() || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"}
                    />
                  </Link>
                  <div className="glass-card absolute bottom-0 left-0 right-0 p-6 m-4 rounded-xl border border-white/40 shadow-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-start mb-1">
                      <Link to={`/product/${p.id}`} className="text-headline-md text-lg text-primary hover:text-rose-600 transition-colors">{p.name}</Link>
                      <span className="text-body-md text-primary font-semibold">${p.price}</span>
                    </div>
                    <p className="text-[10px] text-secondary tracking-widest uppercase mb-4">{p.category?.name || 'Collection'}</p>
                    <button className="w-full py-3 rounded-full bg-primary-container text-on-primary-container text-label-sm uppercase tracking-widest hover:bg-rose-200 transition-colors duration-300">
                      Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-20 flex justify-center items-center gap-4">
            <button className="w-12 h-12 rounded-full border border-rose-100 flex items-center justify-center text-rose-300 hover:bg-rose-50 transition-colors duration-300">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-label-sm text-primary">1 / 5</span>
            <button className="w-12 h-12 rounded-full border border-rose-100 flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-colors duration-300">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
