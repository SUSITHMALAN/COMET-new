import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Package, RefreshCw } from "lucide-react";
import { productsApi, categoriesApi } from "../api";
import { Product, Category } from "../types";
import ProductCard from "../components/ui/ProductCard";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsApi.getAll({ featured: true, limit: 4 }), productsApi.getAll({ is_new: true, limit: 4 }), categoriesApi.getAll()])
      .then(([featRes, newRes, catRes]) => {
        setFeatured(featRes.data);
        setNewArrivals(newRes.data);
        setCategories(catRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      {/* =================== HERO =================== */}
      <section className="hero">
        {/* Subtle radial light behind model */}
        <div className="hero-radial-glow" />

        {/* Giant COMET text — behind the model */}
        <h1 className="hero-brand-text" aria-hidden="true">
          COMET
        </h1>

        {/* Model image — centered, overlaps the text */}
        <div className="hero-model">
          <img src="/hero-image-2.png" alt="COMET streetwear model wearing premium orange hoodie" loading="eager" draggable={false} />
        </div>

        {/* Description — positioned right side */}
        <div className="hero-description">
          <p>Discover the hottest hoodies & accessories, designed for effortless style and all-day comfort. Stay ahead of the trend.</p>
        </div>

        {/* Bottom action bar */}
        <div className="hero-bottom-bar">
          <Link to="/shop" className="hero-bottom-bar-inner">
            <span className="hero-shop-label">Shop Now</span>
            <span className="hero-shop-arrow">
              <ArrowRight size={22} />
            </span>
          </Link>
        </div>
      </section>

      {/* =================== CATEGORIES =================== */}
      {categories.length > 0 && (
        <section style={{ padding: "clamp(48px, 8vw, 80px) 0", background: "var(--grey-100)" }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "clamp(24px, 4vw, 40px)", color: "var(--black)" }}>
              SHOP BY CATEGORY
            </h2>
            <div className="category-pills">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="btn btn-outline" style={{ fontSize: "13px" }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================== FEATURED PRODUCTS =================== */}
      {featured.length > 0 && (
        <section style={{ padding: "clamp(48px, 8vw, 80px) 0" }}>
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-label">Hand Picked</p>
                <h2 className="section-title">FEATURED DROPS</h2>
              </div>
              <Link to="/shop?filter=featured" className="btn btn-ghost" style={{ gap: 8 }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="products-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================== CTA BANNER - WHATSAPP =================== */}
      <section
        style={{
          background: "var(--black)",
          padding: "clamp(48px, 8vw, 80px) 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 6vw, 72px)",
              letterSpacing: "0.06em",
              color: "var(--white)",
              marginBottom: 20,
            }}
          >
            ORDER VIA
            <br />
            <span style={{ color: "#25D366" }}>WHATSAPP</span>
          </h2>
          <p style={{ color: "var(--grey-400)", fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.7, marginBottom: 36 }}>
            Add items to your cart and place your order directly through WhatsApp for a personal shopping experience.
          </p>
          <Link to="/shop" className="btn btn-accent btn-lg">
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* =================== NEW ARRIVALS =================== */}
      {newArrivals.length > 0 && (
        <section style={{ padding: "clamp(48px, 8vw, 80px) 0" }}>
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-label">Just Landed</p>
                <h2 className="section-title">NEW ARRIVALS</h2>
              </div>
              <Link to="/shop?filter=new" className="btn btn-ghost" style={{ gap: 8 }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="products-grid">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================== FEATURES =================== */}
      <section style={{ padding: "clamp(48px, 8vw, 80px) 0", background: "var(--grey-100)" }}>
        <div className="container">
          <div className="features-grid">
            {[
              { icon: Package, title: "Island-Wide Delivery", desc: "We deliver all across Sri Lanka" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free return policy" },
              { icon: Zap, title: "Premium Quality", desc: "100% authentic, long-lasting materials" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--black)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Icon size={22} color="var(--white)" />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: "13px", color: "var(--grey-500)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
