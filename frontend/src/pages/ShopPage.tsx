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
    <main className="container py-12 fade-in">
      {/* Hero Header */}
      <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-headline-xl text-white uppercase">CORE CATALOG</h1>
          <p className="text-body text-lg text-on-surface-variant max-w-lg mt-4 leading-relaxed">
            HIGH-VELOCITY PERFORMANCE GEAR ENGINEERED FOR THE URBAN FRONTIER. BRUTALIST AESTHETICS MET WITH TECHNICAL PRECISION.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            className="btn-brutalist"
            onClick={() => clearFilters()}
          >
            FILTER / {products.length.toString().padStart(2, '0')}
          </button>
          <div className="bg-surface-container border-2 border-white/10 flex items-center p-1">
            <button className="px-4 py-2 bg-primary text-white text-label-caps">GRID</button>
            <button className="px-4 py-2 text-white text-label-caps hover:bg-white/5 opacity-50">LIST</button>
          </div>
        </div>
      </header>

      {/* Product Viewport */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Side Filters (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-12">
            <div>
              <h3 className="text-label-caps text-white mb-6 border-b border-white/20 pb-2">CATEGORIES</h3>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => clearFilters()}
                    className={`text-label-caps text-left w-full transition-colors ${!categorySlug && !filter ? 'text-primary' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    ALL PRODUCTS
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setCategory(cat.slug)}
                      className={`text-label-caps text-left w-full transition-colors ${categorySlug === cat.slug ? 'text-primary' : 'text-on-surface-variant hover:text-white'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-label-caps text-white mb-6 border-b border-white/20 pb-2">DROP STATUS</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setFilter('new')}
                  className={`flex items-center gap-3 group w-full ${filter === 'new' ? 'text-white' : 'text-on-surface-variant'}`}
                >
                  <div className={`w-4 h-4 border ${filter === 'new' ? 'bg-primary border-primary' : 'border-white group-hover:border-primary'}`}></div>
                  <span className="text-label-caps text-[10px]">New Arrivals</span>
                </button>
                <button 
                  onClick={() => setFilter('featured')}
                  className={`flex items-center gap-3 group w-full ${filter === 'featured' ? 'text-white' : 'text-on-surface-variant'}`}
                >
                  <div className={`w-4 h-4 border ${filter === 'featured' ? 'bg-primary border-primary' : 'border-white group-hover:border-primary'}`}></div>
                  <span className="text-label-caps text-[10px]">Featured</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-primary text-white">
              <p className="text-headline-lg text-3xl leading-none mb-4 italic">COMET PRO++</p>
              <p className="text-body text-[12px] leading-tight mb-6">EARLY ACCESS TO ALL LIMITED DROPS AND EXCLUSIVE PERFORMANCE GEAR.</p>
              <button className="w-full border-2 border-white py-3 text-label-caps hover:bg-white hover:text-primary transition-all">JOIN THE FLEET</button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="text-headline-lg text-4xl mb-4">NO PRODUCTS FOUND</h3>
              <button className="btn-brutalist" onClick={clearFilters}>CLEAR ALL FILTERS</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-16">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination (Static for now) */}
          <div className="mt-24 flex justify-center items-center gap-4">
            <button className="w-12 h-12 border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex gap-2">
              <button className="w-12 h-12 bg-white text-black font-label-caps">01</button>
              <button className="w-12 h-12 border-2 border-white text-white font-label-caps hover:bg-white/5">02</button>
              <button className="w-12 h-12 border-2 border-white text-white font-label-caps hover:bg-white/5">03</button>
            </div>
            <button className="w-12 h-12 border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
