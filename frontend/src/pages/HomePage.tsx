import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsApi, getImageUrl } from '../api';
import { Product } from '../types';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.2 }
};

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.getAll({ is_new: true, limit: 4 }),
    ]).then(([newRes]) => {
      setNewArrivals(newRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background text-on-background">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-surface-container-low pt-20">
        <motion.div 
          initial={{ scale: 1.02, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          {/* Subtle elegant image or light gradient */}
          <img 
            className="w-full h-full object-cover opacity-20 grayscale-0" 
            alt="Hero background"
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-[1000px]">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-label-caps tracking-[0.3em] mb-6 opacity-60"
          >
            Spring / Summer 2026 Collection
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-headline-xl mb-10"
          >
            Refined Motion.<br />
            <span className="italic font-light">Defined Style.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/shop?filter=new" className="btn-pill btn-pill-primary">
              EXPLORE NEW DROPS
            </Link>
            <Link to="/shop" className="btn-pill btn-pill-outline">
              VIEW LOOKBOOK
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Ticker / Marquee - Refined for light mode */}
      <div className="bg-surface-container py-8 border-y border-outline/10 overflow-hidden whitespace-nowrap relative z-20">
        <div className="inline-block animate-[marquee_30s_linear_infinite]">
          <span className="text-label-caps text-[14px] opacity-40 mx-12 uppercase">
            Curated Performance — Conscious Craftsmanship — Timeless Kinetics — Global Delivery — Curated Performance — Conscious Craftsmanship — Timeless Kinetics — Global Delivery
          </span>
        </div>
      </div>

      {/* New Arrivals Bento Grid */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 py-40">
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <p className="text-label-caps text-primary tracking-[0.2em] mb-4">Latest Additions</p>
            <h2 className="text-headline-lg">NEW ARRIVALS</h2>
          </div>
          <Link to="/shop?filter=new" className="text-label-caps tracking-[0.1em] border-b border-on-background/20 pb-1 hover:border-primary transition-all">
            Browse All Collection
          </Link>
        </motion.div>
        
        {loading ? (
           <div className="flex justify-center items-center py-24">
             <div className="spinner"></div>
           </div>
        ) : (
          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Large Hero Card */}
            {newArrivals.length > 0 && (
              <motion.div variants={fadeInUp} className="md:col-span-2 md:row-span-2">
                <Link to={`/product/${newArrivals[0].id}`} className="group block relative overflow-hidden rounded-[32px] bg-surface-container-high h-full min-h-[600px]">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    src={(() => { try { return getImageUrl(JSON.parse(newArrivals[0].images)[0]); } catch { return ''; } })() || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"}
                    alt={newArrivals[0].name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent p-12 flex flex-col justify-end">
                    <p className="text-label-caps text-primary mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">Featured Drop</p>
                    <h3 className="text-headline-md mb-2">{newArrivals[0].name}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-body font-medium opacity-60">${newArrivals[0].price.toFixed(2)}</p>
                      <div className="flex gap-2">
                        {['S', 'M', 'L'].map(size => (
                          <span key={size} className="w-8 h-8 rounded-full border border-outline/20 flex items-center justify-center text-[10px] opacity-40">{size}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Small Refined Cards */}
            {newArrivals.slice(1, 4).map((product) => (
              <motion.div variants={fadeInUp} key={product.id}>
                <Link to={`/product/${product.id}`} className="group block h-full">
                  <div className="aspect-[4/5] overflow-hidden rounded-[32px] bg-surface-container mb-6 relative">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      src={(() => { try { return getImageUrl(JSON.parse(product.images)[0]); } catch { return ''; } })() || "https://images.unsplash.com/photo-1539109132314-3477524c8945?q=80&w=1920&auto=format&fit=crop"}
                      alt={product.name}
                    />
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-10 h-10 rounded-full glass flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-label-caps text-[10px] opacity-40 mb-2">{product.category?.name || 'CORE'}</p>
                    <h4 className="text-body font-medium mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                    <p className="text-body text-[14px] opacity-60">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Empty space fallback or promotional card */}
            {newArrivals.length < 4 && (
              <motion.div variants={fadeInUp} className="bg-surface-container rounded-[32px] p-10 flex flex-col justify-between border border-outline/5">
                <h4 className="text-headline-md opacity-20">COMING<br/>SOON</h4>
                <p className="text-label-caps text-[10px] opacity-40">Drop 02.26</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>

      {/* Refined WhatsApp Section */}
      <section className="bg-surface py-40 border-y border-outline/5">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
          <motion.div {...fadeInUp}>
            <p className="text-label-caps text-primary tracking-[0.2em] mb-6">Concierge Service</p>
            <h2 className="text-headline-lg mb-8">
              Personalized<br/>
              <span className="italic font-light">Direct Access.</span>
            </h2>
            <p className="text-body text-[18px] opacity-60 mb-12 max-w-lg leading-relaxed">
              Experience fashion as a conversation. Our dedicated stylists are available via WhatsApp for real-time sizing advice and priority access to limited drops.
            </p>
            <a className="btn-pill btn-pill-primary px-16" href="https://wa.me/94771758395" target="_blank" rel="noreferrer">
              START CONVERSATION
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl relative z-10">
              <img className="w-full h-full object-cover" alt="Concierge" src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2040&auto=format&fit=crop"/>
            </div>
            {/* Soft decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full z-0"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-outline/10 blur-[80px] rounded-full z-0"></div>
          </motion.div>
        </div>
      </section>

      {/* Community / Lifestyle Grid */}
      <section className="max-w-[1440px] mx-auto px-6 py-40">
        <div className="text-center mb-24">
          <p className="text-label-caps tracking-[0.3em] mb-4 opacity-40">The Lifestyle</p>
          <h2 className="text-headline-lg italic font-light">Community Kinetics</h2>
        </div>
        <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { tag: "Editorial", title: "Urban Softness", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" },
            { tag: "Makers", title: "Mindful Design", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2048&auto=format&fit=crop" },
            { tag: "People", title: "Global Movement", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" }
          ].map((item, idx) => (
            <motion.div variants={fadeInUp} key={idx} className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden rounded-[32px] mb-8">
                <img className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.title} src={item.img}/>
              </div>
              <p className="text-label-caps text-[10px] opacity-40 mb-3">{item.tag}</p>
              <h4 className="text-headline-md text-2xl">{item.title}</h4>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Floating Modern Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-12 right-12 z-40"
      >
        <Link to="/shop?filter=new" className="glass p-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-4 group">
          <span className="material-symbols-outlined text-on-background">auto_awesome</span>
          <span className="text-label-caps text-[10px] pr-4 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">Explore New Season</span>
        </Link>
      </motion.div>
    </div>
  );
}
