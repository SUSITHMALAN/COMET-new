import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Package, RefreshCw } from 'lucide-react';
import { productsApi, categoriesApi } from '../api';
import { Product, Category } from '../types';
import ProductCard from '../components/ui/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.getAll({ featured: true, limit: 4 }),
      productsApi.getAll({ is_new: true, limit: 4 }),
      categoriesApi.getAll(),
    ]).then(([featRes, newRes, catRes]) => {
      setFeatured(featRes.data);
      setNewArrivals(newRes.data);
      setCategories(catRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      {/* Hero */}
      <section style={{
        minHeight: 'calc(100vh - var(--nav-height))',
        background: 'var(--black)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(255,60,0,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%)`,
        }} />
        
        {/* Big background text */}
        <div style={{
          position: 'absolute',
          right: -20, top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(120px, 22vw, 320px)',
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 1,
          userSelect: 'none',
        }}>COMET</div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,60,0,0.15)',
              border: '1px solid rgba(255,60,0,0.3)',
              borderRadius: 2, padding: '6px 14px',
              marginBottom: 32,
            }}>
              <Zap size={12} color="var(--accent)" fill="var(--accent)" />
              <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                New Collection 2025
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 12vw, 160px)',
              letterSpacing: '0.04em',
              color: 'var(--white)',
              lineHeight: 0.9,
              marginBottom: 32,
            }}>
              MOVE<br />
              <span style={{ color: 'var(--accent)' }}>FAST.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--grey-400)',
              maxWidth: 480,
              lineHeight: 1.7,
              marginBottom: 48,
            }}>
              Clothing built for those who refuse to slow down. Premium streetwear that hits different.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-accent btn-lg">
                Shop Collection
                <ArrowRight size={18} />
              </Link>
              <Link to="/shop?filter=new" className="btn btn-outline btn-lg" style={{ color: 'var(--white)', borderColor: 'var(--grey-700)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--white)'; (e.currentTarget as HTMLElement).style.color = 'var(--black)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--white)'; }}>
                New Arrivals
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: 'var(--grey-600)',
        }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{
            width: 1, height: 48,
            background: 'linear-gradient(to bottom, var(--grey-600), transparent)',
          }} />
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ padding: '80px 0', background: 'var(--grey-100)' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', letterSpacing: '0.06em', marginBottom: 40, color: 'var(--black)' }}>
              SHOP BY CATEGORY
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="btn btn-outline"
                  style={{ fontSize: '13px' }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Hand Picked
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '0.06em' }}>
                  FEATURED DROPS
                </h2>
              </div>
              <Link to="/shop?filter=featured" className="btn btn-ghost" style={{ gap: 8 }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner - WhatsApp Order */}
      <section style={{
        background: 'var(--black)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 72px)',
            letterSpacing: '0.06em',
            color: 'var(--white)',
            marginBottom: 20,
          }}>
            ORDER VIA<br /><span style={{ color: '#25D366' }}>WHATSAPP</span>
          </h2>
          <p style={{ color: 'var(--grey-400)', fontSize: '16px', lineHeight: 1.7, marginBottom: 36 }}>
            Add items to your cart and place your order directly through WhatsApp for a personal shopping experience.
          </p>
          <Link to="/shop" className="btn btn-accent btn-lg">
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Just Landed
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '0.06em' }}>
                  NEW ARRIVALS
                </h2>
              </div>
              <Link to="/shop?filter=new" className="btn btn-ghost" style={{ gap: 8 }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--grey-100)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
            {[
              { icon: Package, title: 'Island-Wide Delivery', desc: 'We deliver all across Sri Lanka' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
              { icon: Zap, title: 'Premium Quality', desc: '100% authentic, long-lasting materials' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--black)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Icon size={22} color="var(--white)" />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--grey-500)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
