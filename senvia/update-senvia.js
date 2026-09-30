const fs = require('fs');
const path = require('path');

const files = {
  'next.config.ts': `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
`,
  'src/app/globals.css': `@import "tailwindcss";

@theme {
  --color-senvia-cream: #F7F1EC;
  --color-senvia-peach: #E9D6CC;
  --color-senvia-burgundy: #A63D63;
  --color-senvia-espresso: #2F2328;
  --color-senvia-muted: #8D7C77;
  --color-senvia-accent: #D8BBB0;
  --color-senvia-gold: #B9936B;
  
  --font-sans: var(--font-inter);
  --font-serif: var(--font-playfair);
}

:root {
  --background: #FFFFFF;
  --foreground: #2F2328;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Custom utilities */
.text-balance { text-wrap: balance; }
.text-pretty { text-wrap: pretty; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

h1, h2, h3, h4, h5, h6 {
  color: var(--color-senvia-espresso);
}
`,
  'src/components/Header.tsx': `"use client";
import Link from "next/link";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full flex flex-col z-50">
      {/* LEVEL 1 — UTILITY BAR */}
      <div className="w-full bg-[#2F2328] text-white text-[11px] py-2 px-4 md:px-8 flex justify-between items-center tracking-[0.1em] font-sans uppercase">
        <div className="flex-1 hidden md:block opacity-80">Miễn phí vận chuyển cho đơn từ 499.000đ</div>
        <div className="flex-1 text-center font-medium opacity-90">Senvia Edit — Tuyển chọn mới mỗi tuần</div>
        <div className="flex-1 hidden md:flex justify-end gap-6 text-white/70">
          <Link href="#" className="hover:text-white transition-colors duration-300">Theo dõi đơn hàng</Link>
          <Link href="#" className="hover:text-white transition-colors duration-300">Trợ giúp</Link>
          <Link href="/seller" className="hover:text-[#D8BBB0] transition-colors duration-300">Kênh người bán</Link>
        </div>
      </div>

      {/* MAIN HEADER - STICKY */}
      <div className={\`w-full bg-white/95 backdrop-blur-md px-4 md:px-8 transition-all duration-500 sticky top-0 z-50 flex items-center justify-between border-b \${isScrolled ? 'py-4 border-[#F7F1EC] shadow-sm' : 'py-6 border-transparent'}\`}>
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-1 group">
          <span className="font-serif text-3xl md:text-4xl tracking-widest text-[#2F2328]">SEN</span>
          <span className="font-serif text-3xl md:text-4xl tracking-widest text-[#A63D63]">VIA</span>
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 max-w-xl mx-12">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Tìm sản phẩm, thương hiệu hoặc phong cách..." 
              className="w-full bg-[#F7F1EC] text-[#2F2328] placeholder-[#8D7C77] px-6 py-3.5 rounded-none border border-transparent focus:border-[#D8BBB0] focus:outline-none focus:bg-white transition-all duration-300 text-sm font-light"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D7C77] group-hover:text-[#2F2328] transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-6 md:gap-8 text-[#2F2328]">
          <button className="md:hidden"><Search className="w-5 h-5" /></button>
          <Link href="/account/wishlist" className="hover:text-[#A63D63] transition-colors duration-300"><Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /></Link>
          <Link href="/login" className="hover:text-[#A63D63] transition-colors duration-300"><User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /></Link>
          <Link href="/cart" className="hover:text-[#A63D63] transition-colors duration-300 relative group">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-105 transition-transform" strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-2 bg-[#A63D63] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm">3</span>
          </Link>
        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <nav className="w-full bg-white px-4 md:px-8 border-b border-[#F7F1EC] overflow-x-auto no-scrollbar relative z-40">
        <ul className="flex items-center justify-center gap-10 min-w-max py-4 text-[13px] font-medium text-[#2F2328] uppercase tracking-[0.15em]">
          {['Mới về', 'Bán chạy', 'Thời trang', 'Làm đẹp', 'Nhà cửa', 'Công nghệ', 'Lifestyle', 'Thương hiệu'].map((item) => (
             <li key={item} className="group relative">
               <Link href="/products" className="hover:text-[#A63D63] transition-colors duration-300 py-2 inline-block">
                 {item}
               </Link>
               <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#A63D63] transition-all duration-300 group-hover:w-full"></span>
             </li>
          ))}
          <li className="group relative">
            <Link href="/products" className="text-[#A63D63] font-bold py-2 inline-block">SALE</Link>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#A63D63]"></span>
          </li>
        </ul>
      </nav>
    </header>
  );
}
`,
  'src/components/ProductCard.tsx': `"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col gap-4 font-sans"
    >
      <Link href={\`/products/\${product.id}\`} className="relative aspect-[4/5] bg-[#F7F1EC] overflow-hidden">
        {/* Real image */}
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && <span className="bg-white/90 backdrop-blur-sm text-[#2F2328] text-[10px] uppercase px-3 py-1.5 tracking-wider shadow-sm">Mới</span>}
          {product.discount > 0 && <span className="bg-[#A63D63] text-white text-[10px] uppercase px-3 py-1.5 tracking-wider shadow-sm">-{product.discount}%</span>}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
          <button className="w-full bg-white/95 backdrop-blur-md text-[#2F2328] py-3 text-sm font-medium hover:bg-[#A63D63] hover:text-white transition-colors shadow-sm">
            Thêm nhanh
          </button>
        </div>

        <button className="absolute top-3 right-3 text-[#2F2328] hover:text-[#A63D63] transition-colors opacity-0 group-hover:opacity-100 bg-white/50 backdrop-blur-sm p-2 rounded-full z-10">
          <Heart className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </Link>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8D7C77]">{product.brand}</span>
        <Link href={\`/products/\${product.id}\`} className="text-[#2F2328] text-[15px] font-medium truncate hover:text-[#A63D63] transition-colors">
          {product.name}
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm font-medium text-[#2F2328]">{product.price.toLocaleString('vi-VN')}₫</span>
          {product.oldPrice && (
            <span className="text-xs text-[#8D7C77] line-through">{product.oldPrice.toLocaleString('vi-VN')}₫</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
`,
  'src/app/page.tsx': `"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, RefreshCcw, CreditCard, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";

const mockProducts = [
  { id: 1, name: "Structured Mini Shoulder Bag", brand: "NOLA", price: 1190000, isNew: true, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80" },
  { id: 2, name: "Oversized Linen Shirt", brand: "MORI", price: 890000, discount: 15, oldPrice: 1050000, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80" },
  { id: 3, name: "Minimal Desk Lamp", brand: "KANSO", price: 1290000, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80" },
  { id: 4, name: "Signature Eau de Parfum", brand: "MAISON 28", price: 2490000, isNew: true, image: "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=800&q=80" },
];

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="w-full flex flex-col items-center">
        
        {/* HOMEPAGE HERO - CINEMATIC EDITORIAL */}
        <section className="w-full max-w-[1536px] px-4 md:px-8 py-6 md:py-10">
          <div className="relative w-full min-h-[75vh] flex items-center bg-[#F7F1EC] overflow-hidden">
            {/* Background Layering */}
            <div className="absolute right-0 top-0 w-3/4 md:w-2/3 h-full">
               <Image 
                 src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80" 
                 alt="Luxury Fashion Edit" 
                 fill 
                 className="object-cover object-center"
                 priority
               />
               <div className="absolute inset-0 bg-gradient-to-r from-[#F7F1EC] via-[#F7F1EC]/80 to-transparent"></div>
            </div>

            {/* Content overlay */}
            <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-between">
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-xl w-full pt-10 pb-20 lg:py-0"
              >
                <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-[#A63D63] uppercase mb-8 relative after:content-[''] after:absolute after:w-12 after:h-[1px] after:bg-[#A63D63] after:left-full after:ml-4 after:top-1/2">
                  Senvia / New Edit
                </span>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.05] text-[#2F2328] mb-8">
                  Không cần<br />nhiều.<br /><span className="italic font-light">Chỉ cần đúng.</span>
                </h1>
                <p className="text-[#8D7C77] mb-10 text-lg leading-relaxed max-w-sm">
                  Khám phá những món đồ được tuyển chọn cho phong cách, không gian và nhịp sống hiện đại.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  <Link href="/products" className="bg-[#2F2328] text-white px-10 py-4 text-[13px] font-medium tracking-[0.15em] uppercase hover:bg-[#A63D63] transition-colors shadow-lg shadow-[#2F2328]/10">
                    Khám phá ngay
                  </Link>
                  <Link href="/products" className="text-[#2F2328] text-[13px] font-medium tracking-wide hover:text-[#A63D63] transition-colors flex items-center gap-2 group uppercase">
                    <span className="border-b border-[#2F2328] group-hover:border-[#A63D63] pb-0.5">Xem hàng mới</span> 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>

              {/* Overlapping small visual card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="hidden lg:block relative w-72 aspect-[3/4] bg-white p-4 shadow-2xl -mt-20 mr-12"
              >
                 <div className="relative w-full h-[85%]">
                   <Image src="https://images.unsplash.com/photo-1599643478524-fb66f7aa26d5?w=600&q=80" alt="Perfume" fill className="object-cover" />
                 </div>
                 <div className="h-[15%] flex flex-col justify-end pt-3 border-t border-[#F7F1EC] mt-3">
                   <span className="text-[10px] tracking-[0.2em] text-[#8D7C77] uppercase">Hàng Mới</span>
                   <span className="text-[#2F2328] text-sm font-medium">Hơn 300 sản phẩm trong tuần</span>
                 </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* SHOP BY CATEGORY MOSAIC */}
        <section className="w-full max-w-[1536px] px-4 md:px-8 py-20 md:py-28">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-4xl text-[#2F2328]">Mua theo danh mục</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 h-[800px]">
            {/* LARGE LEFT */}
            <Link href="/products" className="col-span-2 row-span-2 relative group overflow-hidden">
               <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="Fashion" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
               <div className="absolute bottom-0 left-0 p-8">
                 <span className="text-white/80 text-xs tracking-widest uppercase mb-2 block">Khám phá</span>
                 <h3 className="font-serif text-4xl text-white">Thời trang</h3>
               </div>
            </Link>
            {/* CENTER TOP */}
            <Link href="/products" className="col-span-2 md:col-span-1 lg:col-span-2 row-span-1 relative group overflow-hidden bg-[#E9D6CC]">
               <Image src="https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=800&q=80" alt="Beauty" fill className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
               <div className="absolute bottom-0 left-0 p-8">
                 <h3 className="font-serif text-3xl text-[#2F2328]">Làm đẹp</h3>
               </div>
            </Link>
            {/* RIGHT TALL */}
            <Link href="/products" className="col-span-2 md:col-span-1 lg:col-span-1 row-span-2 relative group overflow-hidden">
               <Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" alt="Home" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
               <div className="absolute bottom-0 left-0 p-8">
                 <h3 className="font-serif text-3xl text-white">Nhà cửa</h3>
               </div>
            </Link>
            {/* CENTER BOTTOM */}
            <Link href="/products" className="col-span-2 lg:col-span-2 row-span-1 relative group overflow-hidden bg-[#F7F1EC]">
               <Image src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" alt="Tech" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="absolute bottom-0 left-0 p-8 z-10">
                 <h3 className="font-serif text-3xl text-white md:text-[#2F2328] group-hover:text-white transition-colors">Công nghệ</h3>
               </div>
            </Link>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="w-full max-w-[1536px] px-4 md:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-[#F7F1EC] pb-6">
            <div>
              <h2 className="font-serif text-4xl text-[#2F2328] mb-3">Mới trên Senvia</h2>
              <p className="text-[#8D7C77] text-lg font-light">Những lựa chọn vừa cập nhật.</p>
            </div>
            <Link href="/products" className="text-[#2F2328] hover:text-[#A63D63] text-sm font-medium tracking-wide uppercase transition-colors flex items-center gap-2">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {mockProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* THE SENVIA EDIT - LUXURY EDITORIAL */}
        <section className="w-full bg-[#E9D6CC] py-32 my-20">
          <div className="max-w-[1536px] mx-auto px-4 md:px-8">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="lg:col-span-7 relative aspect-[4/3] w-full"
                >
                   <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80" alt="Senvia Edit" fill className="object-cover shadow-2xl" />
                   {/* Floating accent block */}
                   <div className="absolute -bottom-10 -right-10 w-48 h-64 bg-white hidden lg:block p-3 shadow-xl">
                      <Image src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600&q=80" alt="Detail" fill className="object-cover p-3" />
                   </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="lg:col-span-5 lg:pl-10"
                >
                  <span className="text-[11px] tracking-[0.3em] uppercase text-[#A63D63] mb-8 block font-bold">The Senvia Edit</span>
                  <h2 className="font-serif text-5xl md:text-6xl text-[#2F2328] leading-[1.1] mb-8">
                    Những món đồ khiến mỗi ngày trở nên tinh tế hơn.
                  </h2>
                  <p className="text-[#2F2328]/70 text-lg mb-12 leading-relaxed font-light">
                    Tuyển tập những thiết kế tinh tế, kết hợp hài hòa giữa công năng và thẩm mỹ, mang lại giá trị bền vững cho không gian sống và phong cách cá nhân của bạn.
                  </p>
                  <Link href="/products" className="inline-flex items-center gap-3 border-b-2 border-[#2F2328] pb-2 text-[#2F2328] font-medium tracking-widest uppercase text-sm hover:text-[#A63D63] hover:border-[#A63D63] transition-all group">
                    Xem tuyển chọn <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
             </div>
          </div>
        </section>

        {/* QUICK BENEFITS - REFINED */}
        <section className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-[#E9D6CC] py-12">
            {[
              { icon: ShieldCheck, text: "Thanh toán bảo mật" },
              { icon: RefreshCcw, text: "Đổi trả 14 ngày" },
              { icon: CreditCard, text: "Giao hàng toàn quốc" },
              { icon: HeadphonesIcon, text: "Hỗ trợ 24/7" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 group">
                <item.icon className="w-8 h-8 text-[#A63D63] group-hover:scale-110 transition-transform duration-300" strokeWidth={1} />
                <span className="text-[13px] uppercase tracking-widest text-[#2F2328] font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SHOP BY MOOD */}
        <section className="w-full max-w-[1536px] px-4 md:px-8 py-20">
           <div className="text-center mb-16">
             <h2 className="font-serif text-4xl text-[#2F2328]">Chọn theo Mood</h2>
             <p className="text-[#8D7C77] mt-4 font-light text-lg">Phong cách phù hợp cho mọi khoảnh khắc.</p>
           </div>
           
           <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8">
              {[
                { name: "Soft Living", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" },
                { name: "City Mode", img: "https://images.unsplash.com/photo-1475179532958-3602fc5ce64a?w=600&q=80" },
                { name: "Work Edit", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80" },
                { name: "Weekend", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" },
              ].map((mood, idx) => (
                 <Link href="/products" key={idx} className="min-w-[280px] md:min-w-[350px] aspect-[3/4] relative group snap-center overflow-hidden">
                    <Image src={mood.img} alt={mood.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <h3 className="font-serif text-3xl text-white border border-white/30 px-8 py-4 backdrop-blur-sm group-hover:bg-white/10 transition-all">{mood.name}</h3>
                    </div>
                 </Link>
              ))}
           </div>
        </section>

        {/* FLASH OFFER / SENVIA HOURS - LUXURY */}
        <section className="w-full bg-[#2F2328] text-white py-28 my-16 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
             <Image src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80" alt="Texture" fill className="object-cover" />
          </div>
          
          <div className="max-w-[1536px] mx-auto px-4 md:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-20 gap-10">
              <div className="text-center lg:text-left">
                <span className="text-[#D8BBB0] text-xs uppercase tracking-[0.3em] mb-4 block">Limited Time</span>
                <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">Senvia Hours</h2>
                <p className="text-white/60 text-lg font-light max-w-md">Ưu đãi tuyển chọn trong thời gian giới hạn. Những món đồ thiết yếu với giá tốt nhất.</p>
              </div>
              
              <div className="flex items-center gap-4 md:gap-6 text-4xl md:text-5xl font-serif">
                <div className="w-20 h-24 bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">02</div>
                <span className="text-[#B9936B]">:</span>
                <div className="w-20 h-24 bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">18</div>
                <span className="text-[#B9936B]">:</span>
                <div className="w-20 h-24 bg-white/5 border border-white/10 flex items-center justify-center shadow-inner text-[#A63D63]">45</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80", name: "Signature Perfume", brand: "MAISON 28", price: "1.450.000₫", old: "2.150.000₫" },
                { img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80", name: "Ceramic Vase", brand: "KANSO", price: "590.000₫", old: "890.000₫" },
                { img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80", name: "Leather Tote", brand: "NOLA", price: "2.290.000₫", old: "3.500.000₫" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white group cursor-pointer">
                  <div className="relative aspect-square w-full overflow-hidden bg-[#F7F1EC]">
                     <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute top-4 left-4 bg-[#A63D63] text-white text-[10px] uppercase px-3 py-1 tracking-widest">-30%</div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#8D7C77] block mb-2">{item.brand}</span>
                    <h4 className="font-medium text-[#2F2328] mb-3 text-lg">{item.name}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[#A63D63] font-semibold">{item.price}</span>
                      <span className="text-xs text-[#8D7C77] line-through">{item.old}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND DISCOVERY */}
        <section className="w-full max-w-[1536px] mx-auto px-4 md:px-8 py-24 border-b border-[#F7F1EC]">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#8D7C77] mb-4 block">Tuyển chọn từ</span>
            <h2 className="font-serif text-3xl text-[#2F2328]">Các thương hiệu nổi bật</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
            {["NOLA", "MORI", "ASTER", "LINEA", "KANSO", "MAVE", "MAISON 28"].map((brand) => (
              <span key={brand} className="font-serif text-2xl md:text-3xl text-[#2F2328] uppercase tracking-widest hover:text-[#A63D63] hover:scale-105 transition-all cursor-pointer">
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* FEATURED CAMPAIGN */}
        <section className="w-full mt-16 mb-16">
          <div className="w-full h-[75vh] relative flex items-center justify-center text-center px-4 overflow-hidden">
             <Image src="https://images.unsplash.com/photo-1507149833265-60c372daea22?w=1600&q=80" alt="Campaign" fill className="object-cover" />
             <div className="absolute inset-0 bg-[#2F2328]/30" />
             <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center max-w-3xl"
             >
               <span className="text-xs font-bold tracking-[0.3em] text-white mb-6 uppercase">Workspace Edit</span>
               <h2 className="font-serif text-5xl md:text-7xl text-white mb-10 leading-tight drop-shadow-lg">
                 Sự tập trung bắt đầu từ không gian.
               </h2>
               <Link href="/products" className="bg-white text-[#2F2328] px-10 py-4 text-sm font-medium tracking-[0.15em] uppercase hover:bg-[#F7F1EC] transition-colors shadow-2xl hover:scale-105 transition-transform">
                 Khám phá Home Edit
               </Link>
             </motion.div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="w-full bg-[#E9D6CC] py-32 mt-20 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1/4 h-full opacity-20 hidden lg:block">
            <Image src="https://images.unsplash.com/photo-1549488344-c760a95574dc?w=800&q=80" alt="Plant" fill className="object-cover object-right" />
          </div>
          
          <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
            <span className="text-[#A63D63] text-[11px] uppercase tracking-[0.3em] font-bold block mb-6">Stay Inspired</span>
            <h2 className="font-serif text-5xl md:text-6xl text-[#2F2328] mb-6 leading-tight">
              Đừng bỏ lỡ Senvia Edit.
            </h2>
            <p className="text-[#2F2328]/70 text-lg mb-12 font-light">
              Nhận thông báo về hàng mới, xu hướng thiết kế và những bộ sưu tập giới hạn trực tiếp qua email của bạn.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 w-full max-w-xl mx-auto shadow-xl">
              <input 
                type="email" 
                placeholder="Địa chỉ email của bạn" 
                className="flex-1 bg-white px-8 py-5 rounded-none border-none focus:ring-2 focus:ring-[#A63D63] outline-none font-sans text-sm text-[#2F2328]"
              />
              <button className="bg-[#2F2328] text-white px-10 py-5 text-[13px] font-medium uppercase tracking-widest hover:bg-[#A63D63] transition-colors">
                Đăng ký
              </button>
            </form>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}
