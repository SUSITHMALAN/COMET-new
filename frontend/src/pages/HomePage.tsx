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
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[921px] w-full flex items-center justify-center overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img 
            className="w-full h-full object-cover opacity-60" 
            alt="Hero background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsBq-U9wJ5C_ZNMuBNLczUfi0h7oZ01NiRFCKd2lXy3QYh6YC_mMY-6DkvtNuziw2rqT_P--5J9Lcucs3jSWIHTbn2H7BJvqfc88OnfVr0zjeRfM6v9xkf2vqeDLmhtCnZNnOW1gMvr38afeBX5y3iyXgeGRoOyJVPC-hwwaa4ibC6_JS-s7_Y6IDGww3HsAkRMQIMDd8Ed3P2f1cbJeohDYvXrQhAN83qDMvFgqXOxa5xe93n6xfuhTPpbHDb2i5ggnulYie-GYCt"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-[1200px]">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-headline-xl text-headline-xl text-white uppercase mb-8"
          >
            MOVE FAST.<br />
            <span className="text-primary">COMET.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 justify-center"
          >
            <Link to="/shop?filter=new" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-label-caps text-[14px] px-12 py-6 hover:bg-white/20 hover:border-primary transition-all active:scale-95 text-center tracking-widest font-bold">
              SHOP DROP 01
            </Link>
            <Link to="/shop" className="bg-white/5 backdrop-blur-md border border-white/10 text-white/80 font-label-caps text-[14px] px-12 py-6 hover:bg-white/10 hover:text-white transition-all active:scale-95 text-center tracking-widest font-bold">
              VIEW LOOKBOOK
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Marquee / Ticker */}
      <div className="bg-primary py-4 border-y-2 border-black overflow-hidden whitespace-nowrap relative z-20">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          <span className="font-headline-md text-headline-md text-black mx-8 uppercase">
            NEW SEASON ARRIVING NOW — ORDER VIA WHATSAPP — WORLDWIDE SHIPPING — NEW SEASON ARRIVING NOW — ORDER VIA WHATSAPP — WORLDWIDE SHIPPING
          </span>
        </div>
      </div>

      {/* New Arrivals Bento Grid */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 py-24 mt-10">
        <motion.div {...fadeInUp} className="flex justify-between items-end mb-12 border-b-2 border-white/20 pb-6">
          <h2 className="font-headline-lg text-[64px] leading-none text-white uppercase">NEW ARRIVALS</h2>
          <Link to="/shop?filter=new" className="font-label-caps text-[13px] tracking-widest font-bold text-primary flex items-center gap-2 hover:underline mb-2">
            VIEW ALL <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </motion.div>
        
        {loading ? (
           <div className="flex justify-center items-center py-24">
             <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
           </div>
        ) : (
          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Large Card */}
            {newArrivals.length > 0 && (
              <motion.div variants={fadeInUp} className="md:col-span-2 md:row-span-2">
                <Link to={`/product/${newArrivals[0].id}`} className="relative group overflow-hidden bg-surface-container block h-full min-h-[500px]">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={(() => { try { return getImageUrl(JSON.parse(newArrivals[0].images)[0]); } catch { return ''; } })() || "https://lh3.googleusercontent.com/aida-public/AB6AXuC1D0r1RX6MMkIw7e0iIoRgwTONdqrszVB-CLQV-LqTyJfUAMM5X0t6hIyH2hWhLTw0_vzy911OfVsj_tcZ7pg8QDhBNo5wf5moxFx2VbS0wR5BkpY_EfxwCF5815m5BbJR_kuLZKvN3BwSJqKfGCQtBuKUgt-RTzf9fK6zqg65Diwnd3db4xPsV8950VAMPURRXMhuCHa8wO-2fprYXET4rgwcs4JWG-2rSbLvJKTcXT1peeyzGMTU5dEQlGkg_S8-x5Nn3mbebNOh"}
                    alt={newArrivals[0].name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-10 flex flex-col justify-end">
                    <p className="font-label-caps text-[12px] tracking-widest font-bold text-primary mb-3 uppercase">{newArrivals[0].category?.name || 'CORE COLLECTION'}</p>
                    <h3 className="font-headline-md text-[40px] leading-tight text-white uppercase mb-2">{newArrivals[0].name}</h3>
                    <div className="flex justify-between items-end">
                      <p className="font-body-md text-lg text-white font-medium">${newArrivals[0].price.toFixed(2)}</p>
                      <div className="flex gap-2">
                        {['S', 'M', 'L', 'XL'].map(size => (
                          <span key={size} className="text-[10px] font-bold border border-white/20 text-white/80 px-2 py-1 uppercase">{size}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Small Cards */}
            {newArrivals.slice(1, 4).map((product) => (
              <motion.div variants={fadeInUp} key={product.id}>
                <Link to={`/product/${product.id}`} className="relative group overflow-hidden bg-surface-container flex flex-col p-5 block h-full hover:bg-surface-container-high transition-colors">
                  <div className="overflow-hidden mb-6 bg-black aspect-[4/5] relative">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      src={(() => { try { return getImageUrl(JSON.parse(product.images)[0]); } catch { return ''; } })() || "https://lh3.googleusercontent.com/aida-public/AB6AXuAajh-pkNU1Q__SyQGRAQiNZy9dnfOCUYfkd22bW5cBCM-0G3lyDSBuZXIjsBLBqqG9PYPk6C9rAxdCzASSF1BvuzFztF5E5hYrz6Ub82Jd6rz1XrnIKmLTBj4Jypulq1RjJMxzEOBYaXGXUnK8pprpPZ2i4OY6kTom8KR97yWaxhMPLAxM8wtH2mUYqmQd41cYyUTNP5YghkUTBwre0tgUes8LH4xJ0UwlptKXVhMd_yZoonFfVSpOAQIqqFprB3BglpT6aJkyrx2b"}
                      alt={product.name}
                    />
                  </div>
                  <div className="mt-auto">
                    <p className="font-label-caps text-[13px] font-bold tracking-wider text-white uppercase truncate mb-2">{product.name}</p>
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-body-md text-[15px] text-neutral-400 font-medium">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {['S', 'M', 'L', 'XL'].map(size => (
                        <span key={size} className="text-[9px] font-bold border border-white/10 bg-white/5 text-white/60 px-1.5 py-0.5 uppercase">{size}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Fallbacks */}
            {newArrivals.length < 4 && Array.from({ length: 4 - newArrivals.length }).map((_, i) => (
              <motion.div variants={fadeInUp} key={`fallback-${i}`}>
                <div className="relative group overflow-hidden bg-surface-container flex flex-col p-5 h-full">
                  <div className="overflow-hidden mb-6 bg-black aspect-[4/5]">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR05TOhA3wjcdsiYimKp993pr9r-QM0tODUwpP91EgkOuF1MEOjZ_qnoNSItCnWC2zk_hGykN-IJV1qlt_hYe6uVfyRnJkAdfSgNy7Q1r7PVHqtFDMHqE4Vosy4dVyW9EeWnsqWGg1sJUL4dwEww9Hzn1nObz9-7F5Sc_XfIjgzVeugUCR-OYyuGfuCmxoPErtMLDCiq_oPo-ipwU9omtpF6a3jmB4B0Q2GXBBzgjap2GW7HQcyd3ythMwWDzlEmo-YEs93jzLaNc4"
                      alt="Placeholder"
                    />
                  </div>
                  <div className="mt-auto">
                    <p className="font-label-caps text-[13px] font-bold tracking-wider text-white uppercase mb-2">CORE CAP / BLK</p>
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-body-md text-[15px] text-neutral-400 font-medium">$45.00</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {['ONE SIZE'].map(size => (
                        <span key={size} className="text-[9px] font-bold border border-white/10 bg-white/5 text-white/60 px-1.5 py-0.5 uppercase">{size}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* WhatsApp Promotion Section */}
      <section className="bg-[#0a0a0a] border-y-[1px] border-white/20 py-32">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeInUp} className="order-2 md:order-1">
            <h2 className="font-headline-lg text-[72px] text-white uppercase mb-8 leading-[1.1]">
              DIRECT ACCESS.<br/>
              <span className="text-primary">ORDER VIA WHATSAPP.</span>
            </h2>
            <p className="font-body-lg text-[18px] text-neutral-400 mb-12 max-w-lg leading-relaxed">
              Skip the queue. Get real-time stock updates, personalized sizing advice, and exclusive early access to drops via our private WhatsApp line.
            </p>
            <a className="inline-flex items-center gap-4 bg-primary text-white font-label-caps text-[14px] font-bold tracking-widest px-14 py-6 hover:bg-orange-700 transition-all group" href="https://wa.me/94771758395" target="_blank" rel="noreferrer">
              START CHAT <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2 relative h-[600px]"
          >
            <img className="w-full h-full object-cover grayscale opacity-80 border-[1px] border-white/20" alt="Phone" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAACI8E31pej9IYIQOPMCIfnW0GRYowz3sCuB2jp6b2t9oFN3i_PKaSmUlmxpIMxwuCQQOPXMAOooHvppi9N_Sg0k4zvOIH8ZmcAPQSPNHaXLaPsYs67BicjAuQaay1X2ncU0N-NJvuwqd5KDgf3Cp3km0L5hfEn1p-7pXHDFSEr5rOT-QTPYvlOuzMVZ-_9P5qhsQOrIV6vfthc-CLP3SRFlU-ZcuLkCizLbWUm2CGkr9PVBTREDFLTjoSKnK1lQX7Feq3wScKEbLu"/>
            <div className="absolute bottom-4 right-4 bg-primary p-6 md:p-10 hidden md:block shadow-2xl z-20">
              <p className="font-headline-md text-[32px] md:text-[40px] text-white uppercase leading-none tracking-tight">+94 77 175 8395</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial / Community */}
      <section className="max-w-[1440px] mx-auto px-6 py-32">
        <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={fadeInUp} className="relative bg-black h-[700px] group overflow-hidden">
            <img className="w-full h-full object-cover opacity-60 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105" alt="Editorial" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqZ85hQexVBUSHPWI73A4WlO_isuyzha_LuW8ODmJdO_j-QlQTSDNpxrj9XvDSxlEUqPUeyuDKB3pDt-JRuwKfQRt6qTbUi7T0KoTcY1Q6AKRp9v9GpEW09QAEIBLh1zTAkZnuXZDeUJ9VUx87gjLJOqnMq--tuAfBCFjs67cW8Pokasz0N0B808ocAfPE6jorr79qiShyTx4-kb1Lsk-GrtGSDR9-trI8dIM9Oeh57j2i1dUoRNa0NhbSZH6cY-L77ZcEQ79zrXDp"/>
            <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-label-caps text-[13px] font-bold tracking-widest text-primary mb-3">EDITORIAL 001</p>
              <h4 className="font-headline-md text-[48px] leading-none text-white uppercase">URBAN KINETICS</h4>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="relative bg-black h-[700px] group overflow-hidden">
            <img className="w-full h-full object-cover opacity-60 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105" alt="Craftsmanship" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmohVGyzOSLWWB_Vv5HPdN6U9XtsrDiXcmahr8Ck-RwWGsIHjsTB2JyndQGR0VweqNvcBWdBDXsm03W3XoYp4fUden-IrMCAuorysk-uIas06kB8uTnr7ZOLHiKM5-iw7SatWLsoKBCvTsCMbGwrMZx0-FbQqvI_klOjOtRzTQCZlMcpzASH5uBwKZwLGkflG-r--Y9sL-6iN4RfhBb-CpTIheQ-gTCuX2qy-rMqYdvtj9eyHOuVQL7acxPYive6MsRNNaCSx0PUs"/>
            <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-label-caps text-[13px] font-bold tracking-widest text-primary mb-3">CRAFTSMANSHIP</p>
              <h4 className="font-headline-md text-[48px] leading-none text-white uppercase">ENGINEERED SPEED</h4>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="relative bg-black h-[700px] group overflow-hidden">
            <img className="w-full h-full object-cover opacity-60 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105" alt="Community" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfSi8jLUXDsgcBlorb90f5ZC8AH03LAMoniD4D8Vdl2siaDE13vxDUhah0dnp_W0m0EzpnOoI3u4t_wn-JHGvKlHalBCtH1r0DQHo-7W8QWKr0cqDFfnpr_ljTKECx3JXCtczmaUIfK-im0bfsdziUCHN-omqlkG7jFaQ1ejA6f2xdv7k7_KEdsMKpNFuwoLlLT5Bj-UmlhOyi8PcDRwrEgeFiQ9BHhzUa3hc0osVFuwyZTRrV6AoAJvfvlb0n54xYuj9Xze2AIMgr"/>
            <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-label-caps text-[13px] font-bold tracking-widest text-primary mb-3">COMMUNITY</p>
              <h4 className="font-headline-md text-[48px] leading-none text-white uppercase">GLOBAL NETWORK</h4>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Floating Action Button (Home Relevant Only) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-40"
      >
        <Link to="/shop?filter=new" className="bg-primary text-white p-5 shadow-[0_0_40px_rgba(255,86,45,0.4)] hover:bg-orange-600 active:scale-90 transition-all flex items-center justify-center group overflow-hidden">
          <span className="material-symbols-outlined text-2xl group-hover:hidden">bolt</span>
          <span className="font-label-caps text-[12px] font-bold tracking-widest hidden group-hover:block whitespace-nowrap px-4">NEW DROPS LIVE</span>
        </Link>
      </motion.div>
    </div>
  );
}
