import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api';
import { Product } from '../types';
import { getImageUrl } from '../api';

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
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative h-[921px] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-60" 
            alt="Hero background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsBq-U9wJ5C_ZNMuBNLczUfi0h7oZ01NiRFCKd2lXy3QYh6YC_mMY-6DkvtNuziw2rqT_P--5J9Lcucs3jSWIHTbn2H7BJvqfc88OnfVr0zjeRfM6v9xkf2vqeDLmhtCnZNnOW1gMvr38afeBX5y3iyXgeGRoOyJVPC-hwwaa4ibC6_JS-s7_Y6IDGww3HsAkRMQIMDd8Ed3P2f1cbJeohDYvXrQhAN83qDMvFgqXOxa5xe93n6xfuhTPpbHDb2i5ggnulYie-GYCt"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-[1200px]">
          <h1 className="font-headline-xl text-headline-xl text-white uppercase mb-8">
            MOVE FAST.<br />
            <span className="text-primary">COMET.</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/shop?filter=new" className="bg-[#FF3C00] text-white font-label-caps text-label-caps px-12 py-6 hover:bg-orange-700 transition-all active:scale-95 text-center">
              SHOP DROP 01
            </Link>
            <Link to="/shop" className="border-2 border-white text-white font-label-caps text-label-caps px-12 py-6 hover:bg-white hover:text-black transition-all active:scale-95 text-center">
              VIEW LOOKBOOK
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee / Ticker */}
      <div className="bg-primary py-4 border-y-2 border-black overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          <span className="font-headline-md text-headline-md text-black mx-8 uppercase">
            NEW SEASON ARRIVING NOW — ORDER VIA WHATSAPP — WORLDWIDE SHIPPING — NEW SEASON ARRIVING NOW — ORDER VIA WHATSAPP — WORLDWIDE SHIPPING
          </span>
        </div>
      </div>

      {/* New Arrivals Bento Grid */}
      <section className="max-w-[1440px] mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12 border-b-2 border-white pb-4">
          <h2 className="font-headline-lg text-headline-lg text-white uppercase">NEW ARRIVALS</h2>
          <Link to="/shop?filter=new" className="font-label-caps text-label-caps text-primary flex items-center gap-2 hover:underline">
            VIEW ALL <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        
        {loading ? (
           <div className="flex justify-center items-center py-24">
             <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Large Card (First Item) */}
            {newArrivals.length > 0 && (
              <Link to={`/product/${newArrivals[0].id}`} className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-surface-container block">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  src={(() => { try { return getImageUrl(JSON.parse(newArrivals[0].images)[0]); } catch { return ''; } })() || "https://lh3.googleusercontent.com/aida-public/AB6AXuC1D0r1RX6MMkIw7e0iIoRgwTONdqrszVB-CLQV-LqTyJfUAMM5X0t6hIyH2hWhLTw0_vzy911OfVsj_tcZ7pg8QDhBNo5wf5moxFx2VbS0wR5BkpY_EfxwCF5815m5BbJR_kuLZKvN3BwSJqKfGCQtBuKUgt-RTzf9fK6zqg65Diwnd3db4xPsV8950VAMPURRXMhuCHa8wO-2fprYXET4rgwcs4JWG-2rSbLvJKTcXT1peeyzGMTU5dEQlGkg_S8-x5Nn3mbebNOh"}
                  alt={newArrivals[0].name}
                />
                <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
                  <p className="font-label-caps text-label-caps text-primary mb-2 uppercase">{newArrivals[0].category?.name || 'CORE'}</p>
                  <h3 className="font-headline-md text-headline-md text-white uppercase">{newArrivals[0].name}</h3>
                  <p className="font-body-md text-body-md text-white mt-2">${newArrivals[0].price.toFixed(2)}</p>
                </div>
              </Link>
            )}

            {/* Small Cards (Next 3 Items) */}
            {newArrivals.slice(1, 4).map((product, idx) => (
              <Link key={product.id} to={`/product/${product.id}`} className="relative group overflow-hidden bg-surface-container flex flex-col p-4 block">
                <div className="overflow-hidden mb-4 bg-black aspect-[4/5]">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={(() => { try { return getImageUrl(JSON.parse(product.images)[0]); } catch { return ''; } })() || "https://lh3.googleusercontent.com/aida-public/AB6AXuAajh-pkNU1Q__SyQGRAQiNZy9dnfOCUYfkd22bW5cBCM-0G3lyDSBuZXIjsBLBqqG9PYPk6C9rAxdCzASSF1BvuzFztF5E5hYrz6Ub82Jd6rz1XrnIKmLTBj4Jypulq1RjJMxzEOBYaXGXUnK8pprpPZ2i4OY6kTom8KR97yWaxhMPLAxM8wtH2mUYqmQd41cYyUTNP5YghkUTBwre0tgUes8LH4xJ0UwlptKXVhMd_yZoonFfVSpOAQIqqFprB3BglpT6aJkyrx2b"}
                    alt={product.name}
                  />
                </div>
                <div className="mt-auto">
                  <p className="font-label-caps text-label-caps text-white uppercase truncate">{product.name}</p>
                  <p className="font-body-md text-body-md text-neutral-400">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}

            {/* Fallback Static Cards if less than 4 products */}
            {newArrivals.length < 4 && Array.from({ length: 4 - newArrivals.length }).map((_, i) => (
              <div key={`fallback-${i}`} className="relative group overflow-hidden bg-surface-container flex flex-col p-4">
                <div className="overflow-hidden mb-4 bg-black aspect-[4/5]">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR05TOhA3wjcdsiYimKp993pr9r-QM0tODUwpP91EgkOuF1MEOjZ_qnoNSItCnWC2zk_hGykN-IJV1qlt_hYe6uVfyRnJkAdfSgNy7Q1r7PVHqtFDMHqE4Vosy4dVyW9EeWnsqWGg1sJUL4dwEww9Hzn1nObz9-7F5Sc_XfIjgzVeugUCR-OYyuGfuCmxoPErtMLDCiq_oPo-ipwU9omtpF6a3jmB4B0Q2GXBBzgjap2GW7HQcyd3ythMwWDzlEmo-YEs93jzLaNc4"
                    alt="Placeholder"
                  />
                </div>
                <div className="mt-auto">
                  <p className="font-label-caps text-label-caps text-white uppercase">CORE CAP / BLK</p>
                  <p className="font-body-md text-body-md text-neutral-400">$45.00</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WhatsApp Promotion Section */}
      <section className="bg-[#171717] border-y-4 border-white py-24">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-headline-lg text-headline-lg text-white uppercase mb-6 leading-tight">
              DIRECT ACCESS.<br/>
              <span className="text-primary">ORDER VIA WHATSAPP.</span>
            </h2>
            <p className="font-body-lg text-body-lg text-neutral-300 mb-10 max-w-lg">
              Skip the queue. Get real-time stock updates, personalized sizing advice, and exclusive early access to drops via our private WhatsApp line.
            </p>
            <a className="inline-flex items-center gap-4 bg-primary text-white font-label-caps text-label-caps px-16 py-8 hover:bg-orange-700 transition-all group" href="https://wa.me/94771758395" target="_blank" rel="noreferrer">
              START CHAT <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">send</span>
            </a>
          </div>
          <div className="order-1 md:order-2 relative h-[500px]">
            <img className="w-full h-full object-cover border-2 border-white" alt="Phone" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAACI8E31pej9IYIQOPMCIfnW0GRYowz3sCuB2jp6b2t9oFN3i_PKaSmUlmxpIMxwuCQQOPXMAOooHvppi9N_Sg0k4zvOIH8ZmcAPQSPNHaXLaPsYs67BicjAuQaay1X2ncU0N-NJvuwqd5KDgf3Cp3km0L5hfEn1p-7pXHDFSEr5rOT-QTPYvlOuzMVZ-_9P5qhsQOrIV6vfthc-CLP3SRFlU-ZcuLkCizLbWUm2CGkr9PVBTREDFLTjoSKnK1lQX7Feq3wScKEbLu"/>
            <div className="absolute -bottom-6 -right-6 bg-white p-8 hidden md:block">
              <p className="font-headline-md text-headline-md text-black uppercase">+94 77 175 8395</p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial / Community */}
      <section className="max-w-[1440px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-1 bg-white">
          <div className="relative bg-black h-[600px] group overflow-hidden">
            <img className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100" alt="Editorial" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqZ85hQexVBUSHPWI73A4WlO_isuyzha_LuW8ODmJdO_j-QlQTSDNpxrj9XvDSxlEUqPUeyuDKB3pDt-JRuwKfQRt6qTbUi7T0KoTcY1Q6AKRp9v9GpEW09QAEIBLh1zTAkZnuXZDeUJ9VUx87gjLJOqnMq--tuAfBCFjs67cW8Pokasz0N0B808ocAfPE6jorr79qiShyTx4-kb1Lsk-GrtGSDR9-trI8dIM9Oeh57j2i1dUoRNa0NhbSZH6cY-L77ZcEQ79zrXDp"/>
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <p className="font-label-caps text-label-caps text-primary mb-2">EDITORIAL 001</p>
              <h4 className="font-headline-md text-headline-md text-white uppercase">URBAN KINETICS</h4>
            </div>
          </div>
          <div className="relative bg-black h-[600px] group overflow-hidden">
            <img className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100" alt="Craftsmanship" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHmohVGyzOSLWWB_Vv5HPdN6U9XtsrDiXcmahr8Ck-RwWGsIHjsTB2JyndQGR0VweqNvcBWdBDXsm03W3XoYp4fUden-IrMCAuorysk-uIas06kB8uTnr7ZOLHiKM5-iw7SatWLsoKBCvTsCMbGwrMZx0-FbQqvI_klOjOtRzTQCZlMcpzASH5uBwKZwLGkflG-r--Y9sL-6iN4RfhBb-CpTIheQ-gTCuX2qy-rMqYdvtj9eyHOuVQL7acxPYive6MsRNNaCSx0PUs"/>
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <p className="font-label-caps text-label-caps text-primary mb-2">CRAFTSMANSHIP</p>
              <h4 className="font-headline-md text-headline-md text-white uppercase">ENGINEERED SPEED</h4>
            </div>
          </div>
          <div className="relative bg-black h-[600px] group overflow-hidden">
            <img className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100" alt="Community" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfSi8jLUXDsgcBlorb90f5ZC8AH03LAMoniD4D8Vdl2siaDE13vxDUhah0dnp_W0m0EzpnOoI3u4t_wn-JHGvKlHalBCtH1r0DQHo-7W8QWKr0cqDFfnpr_ljTKECx3JXCtczmaUIfK-im0bfsdziUCHN-omqlkG7jFaQ1ejA6f2xdv7k7_KEdsMKpNFuwoLlLT5Bj-UmlhOyi8PcDRwrEgeFiQ9BHhzUa3hc0osVFuwyZTRrV6AoAJvfvlb0n54xYuj9Xze2AIMgr"/>
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <p className="font-label-caps text-label-caps text-primary mb-2">COMMUNITY</p>
              <h4 className="font-headline-md text-headline-md text-white uppercase">GLOBAL NETWORK</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button (Home Relevant Only) */}
      <Link to="/shop?filter=new" className="fixed bottom-24 right-6 md:bottom-12 md:right-12 bg-primary text-white p-4 rounded-none shadow-2xl z-40 active:scale-90 transition-transform flex items-center gap-2 group">
        <span className="material-symbols-outlined">bolt</span>
        <span className="font-label-caps text-label-caps hidden group-hover:block whitespace-nowrap">NEW DROPS LIVE</span>
      </Link>
    </div>
  );
}
