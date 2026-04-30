import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api';
import { Product } from '../types';
import ProductCard from '../components/ui/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.getAll({ featured: true, limit: 4 }),
      productsApi.getAll({ is_new: true, limit: 4 }),
    ]).then(([featRes, newRes]) => {
      setFeatured(featRes.data);
      setNewArrivals(newRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-black flex items-center overflow-hidden border-b-2 border-white">
        {/* Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[25vw] text-white/[0.03] leading-none select-none pointer-events-none">
          COMET
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-headline-xl text-white uppercase leading-[0.85] mb-8">
              ENGINEERED<br />
              FOR <span className="text-primary italic">SPEED.</span>
            </h1>
            <p className="text-body text-xl text-on-surface-variant max-w-xl mb-12">
              HIGH-VELOCITY PERFORMANCE GEAR FOR THE URBAN FRONTIER. BRUTALIST AESTHETICS MET WITH TECHNICAL PRECISION.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/shop" className="btn-brutalist px-12 py-4 text-lg">
                ENTER CATALOG
              </Link>
              <Link to="/drops" className="btn-brutalist-outline px-12 py-4 text-lg">
                VIEW DROPS
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="text-label-caps text-[10px] text-on-surface-variant tracking-[0.3em]">SCROLL</span>
          <div className="w-[2px] h-16 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>
      </section>

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="py-24 border-b-2 border-white/10">
          <div className="container">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-label-caps text-primary mb-2 block">SELECTED GEAR</span>
                <h2 className="text-headline-lg text-white">FEATURED DROPS</h2>
              </div>
              <Link to="/shop?filter=featured" className="text-label-caps hover:text-primary transition-colors border-b border-primary pb-1">
                SEE ALL
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-24">
          <div className="container">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-label-caps text-primary mb-2 block">JUST LANDED</span>
                <h2 className="text-headline-lg text-white">NEW ARRIVALS</h2>
              </div>
              <Link to="/shop?filter=new" className="text-label-caps hover:text-primary transition-colors border-b border-primary pb-1">
                SEE ALL
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Brand Banner */}
      <section className="py-32 bg-primary text-white text-center overflow-hidden relative">
        <div className="container relative z-10">
          <h2 className="text-headline-xl italic mb-8">BRUTALIST PRECISION</h2>
          <p className="text-body text-2xl max-w-2xl mx-auto mb-12 opacity-90">
            UNCOMPROMISING QUALITY, ENGINEERED FOR THE FUTURE OF STREETWEAR.
          </p>
          <button className="btn-brutalist-outline border-white hover:bg-white hover:text-primary px-16 py-4">
            JOIN THE FLEET
          </button>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl translate-y-1/2 -translate-x-1/2 rounded-full"></div>
      </section>
    </div>
  );
}
