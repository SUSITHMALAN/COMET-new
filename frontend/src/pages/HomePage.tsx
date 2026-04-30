import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsApi, getImageUrl } from '../api';
import { Product } from '../types';
import ProductCard from '../components/ui/ProductCard';

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
    productsApi.getAll({ is_new: true, limit: 8 })
      .then(res => {
        if (res.data.length < 4) {
          // If too few new items, just get all products
          return productsApi.getAll({ limit: 8 });
        }
        return res;
      })
      .then(res => {
        setNewArrivals(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      {/* Hero Section */}
      <header className="relative h-[921px] flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Hero" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZjtlcZIn742dqDm7v4QJ2EJ9bwgGdGIQAHHRXKk-kXJMgZX4VgByNF0ZSwGmwFrcc4mYp14Ng3z6nFxwRGbyZrExm3wO0jPOFZIZjN8jYDwJ3FBrW8xUn9iEGRZjeqqMJKmm7pSCJV0vbzMv8WeMS-NT3Y6E8ELtHiNB_alYF9JeNgrgYqDKGewMa57L6WHdwNMvF_Wdpa97BMoWQvtwoPTiwUjBTgxeh1GYd0GwWaIyMZWEOVC7lzhfK4vadidwo2Wi1Q32Crp7D"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent"></div>
        </div>
        <div className="relative z-10 px-16 max-w-3xl animate-fade-in-slide">
          <span className="text-label-sm text-primary uppercase tracking-[0.2em] mb-4 block">Spring Collection 2024</span>
          <h1 className="text-headline-xl mb-6 leading-tight">Woven with <br/><span className="italic font-light text-rose-400">Pure Imagination</span></h1>
          <p className="text-body-lg text-secondary mb-10 max-w-lg">Discover curated garments designed to celebrate the magic of childhood. Each piece is crafted with the finest natural fabrics and a touch of vintage charm.</p>
          <div className="flex gap-4">
            <Link to="/shop" className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full text-label-sm hover:opacity-90 transition-opacity shadow-soft flex items-center justify-center">
              Shop the Look
            </Link>
            <Link to="/lookbook" className="glass border border-white/40 px-10 py-4 rounded-full text-label-sm text-primary hover:bg-white/60 transition-all flex items-center justify-center">
              View Lookbook
            </Link>
          </div>
        </div>
      </header>

      {/* Categories Bento Grid */}
      <section className="px-16 py-24 bg-surface">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-headline-lg text-on-background mb-2">Curated Collections</h2>
            <p className="text-secondary">Explore our most loved styles for every stage.</p>
          </div>
          <Link to="/shop" className="text-rose-400 text-label-sm border-b border-rose-200 hover:text-rose-600 transition-colors">
            Browse All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter h-[600px]">
          <div className="md:col-span-2 relative group overflow-hidden rounded-xl">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="Newborn" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpbMZSj_ipyIH9zqeISCNOIjycEyPWP4l6Y_AnQyv8uMPopw-UkUdwIwipITQxtbVRgC-pgV4xo4irVetJoVedMDEMq-w9q0P2dW2k_y5JRjChzuc5M312WH77Yb3ukIfcHLUN1NO9ioBqsCFMoH-xxRNrjCa9_mcxWk4DXEaPjuyLKe_5J0qr60WYcMW_wdgvfECX0secM4gWQ_7TlpBCzN--tdnc2qU39wuNzifcKzIr-_S2DGT5ZeLI2yYKft8UzuvZdY8XA7iO"
            />
            <div className="absolute bottom-6 left-6 right-6 glass-card p-6 rounded-lg transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="text-headline-md text-on-background">Newborn Essentials</h3>
              <p className="text-sm text-secondary">Organic cotton and softest knits.</p>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-xl">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="Details" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqixIosGHL67pgppqmj6yWGDADIiJ3hW8IS9jw6JXyy9OV5OMqaT_PMYZ9XhHAuCyJ4Y8e1_1wqF8MHsrgR4oA33MQzV_cW1OU9E4T2zyuAMOIfKDUoXH4CpUXX4zZpwgYMBVQ7rBz-P8JLNAg_VGe9SKlvQTkoxAvu3Q92sM6NMc0r_1N0PWMyAOhBbnKiSWxArHNwx7V5PS_uFk_Tn-NMHIzWL27iEvDB812lOSyMR0-Wh2KVE-eRG_BlA-I_6q4KKsLRVC-Tt0X"
            />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="glass px-6 py-2 rounded-full text-white text-label-sm">Explore Occasion</span>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-xl bg-rose-50 flex flex-col items-center justify-center p-8 text-center border border-rose-100">
            <span className="material-symbols-outlined text-4xl text-rose-300 mb-4">stars</span>
            <h3 className="text-headline-md text-on-background mb-2">Gift Sets</h3>
            <p className="text-secondary text-sm mb-6">Perfectly packaged surprises for the little ones in your life.</p>
            <button className="bg-white px-6 py-2 rounded-full text-label-sm text-primary shadow-sm hover:shadow-md transition-shadow">Create a Box</button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-16 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-headline-lg text-on-background">New Arrivals</h2>
          <div className="w-12 h-0.5 bg-rose-200 mx-auto mt-4"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Seasonal Favorites / Promo */}
      <section className="mx-16 my-24 rounded-[40px] overflow-hidden relative min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            alt="Summer" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQy1Q6UIobff2Jr-EOEnv4kMMXu2aTl-XxqrIcllUClV4f6-bhPtT2fADc6J18hgfie1zj0HSPKLcC7FUhtOmtE040LwcP6OU_4l_6_GdwNVedYMg3iPIFpbH0l3DvzK1pbMRnmM02npRxGQBQ5AXAEUQHsnT3Bj_guSwJfCSmqKUjgrvqhDWkMxvs-oS7kQxM1DHeVy-YTxjjADVJOYDDwbroahjNG3LZlJ--X21PPsHfizAirrdS6zUxn-qgX0csa86F-Qkr4drW"
          />
          <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 px-16 text-white max-w-2xl">
          <h2 className="text-headline-xl mb-6">Seasonal Favorites</h2>
          <p className="text-body-lg mb-8 text-white/90">Our Summer Garden collection has arrived. Lightweight linens and sun-ready silhouettes designed for adventures in the tall grass.</p>
          <button className="glass px-12 py-4 rounded-full text-label-sm text-white border border-white/30 hover:bg-white/20 transition-all uppercase tracking-widest">Explore Summer</button>
        </div>
      </section>
    </div>
  );
}
