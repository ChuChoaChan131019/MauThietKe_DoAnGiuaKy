const fs = require('fs');
const path = require('path');

const files = {
  'src/app/globals.css': `@import "tailwindcss";

@theme {
  --color-senvia-ivory: #F7F1EC;
  --color-senvia-white: #FFFFFF;
  --color-senvia-plum: #2F2328;
  --color-senvia-burgundy: #A63D63;
  --color-senvia-blush: #E8CFC4;
  --color-senvia-clay: #D8BBB0;
  --color-senvia-muted: #8D7C77;
  --color-senvia-champagne: #B9936B;
  
  --font-sans: var(--font-inter);
  --font-serif: var(--font-playfair);
}

:root {
  --background: #F7F1EC;
  --foreground: #2F2328;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.text-balance { text-wrap: balance; }
.text-pretty { text-wrap: pretty; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.senvia-rule {
  border-color: rgba(47,35,40,0.18);
}
.senvia-rule-burgundy {
  border-color: #A63D63;
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
`,
  'src/components/Header.tsx': `"use client";
import Link from "next/link";
import { Heart, User, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full flex flex-col z-50">
      {/* LEVEL 1 — UTILITY BAR */}
      <div className="w-full bg-[#E8CFC4] text-[#2F2328] text-[9px] py-1.5 px-4 md:px-8 flex justify-between items-center tracking-[0.25em] font-sans uppercase">
        <div className="flex-1 hidden md:block font-medium">SENVIA / LIFESTYLE</div>
        <div className="flex-1 text-center font-bold text-[#A63D63]">MIỄN PHÍ VẬN CHUYỂN TỪ 499.000Đ</div>
        <div className="flex-1 hidden md:flex justify-end gap-6 font-medium">
          <Link href="#" className="hover:text-[#A63D63] transition-colors duration-300">Theo dõi đơn hàng</Link>
        </div>
      </div>

      {/* MAIN HEADER - STICKY */}
      <div className={\`w-full bg-[#F7F1EC]/95 backdrop-blur-md px-4 md:px-8 lg:px-12 transition-all duration-500 sticky top-0 z-50 flex items-center justify-between border-b senvia-rule \${isScrolled ? 'py-4' : 'py-6'}\`}>
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 flex items-center group w-1/4">
          <span className="font-serif text-2xl tracking-[0.2em] text-[#2F2328]">SEN</span>
          <span className="font-serif text-2xl tracking-[0.2em] text-[#A63D63]">VIA</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex justify-center flex-1">
          <ul className="flex items-center gap-8 text-[10px] font-semibold text-[#2F2328] uppercase tracking-[0.25em]">
            {['Mới về', 'Thời trang', 'Làm đẹp', 'Nhà cửa', 'Công nghệ', 'Lifestyle'].map((item) => (
               <li key={item} className="group relative overflow-hidden">
                 <Link href="/products" className="hover:text-[#A63D63] transition-colors duration-300 py-1 inline-block opacity-90 hover:opacity-100">
                   {item}
                 </Link>
                 <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#A63D63] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
               </li>
            ))}
            <li className="group relative">
              <Link href="/products" className="text-[#A63D63] py-1 inline-block hover:opacity-80 transition-opacity font-bold">SALE</Link>
            </li>
          </ul>
        </nav>

        {/* ICONS & SEARCH */}
        <div className="flex items-center justify-end gap-6 md:gap-8 text-[#2F2328] w-1/4">
          <div className="hidden md:flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 160, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-transparent border-b border-[#A63D63] outline-none text-[10px] uppercase tracking-widest px-2 pb-1 mr-2 text-[#2F2328] placeholder-[#8D7C77]"
                  autoFocus
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-[10px] uppercase tracking-[0.2em] hover:text-[#A63D63] transition-colors flex items-center gap-2 font-medium"
            >
              {searchOpen ? 'ĐÓNG' : 'TÌM KIẾM ⌕'}
            </button>
          </div>
          
          <Link href="/account/wishlist" className="hover:text-[#A63D63] text-[#A63D63] transition-colors duration-300">
            <Heart className="w-[16px] h-[16px]" strokeWidth={1.5} />
          </Link>
          <Link href="/login" className="hover:text-[#A63D63] transition-colors duration-300">
            <User className="w-[16px] h-[16px]" strokeWidth={1.5} />
          </Link>
          <Link href="/cart" className="hover:text-[#A63D63] transition-colors duration-300 relative group flex items-center gap-1.5">
            <ShoppingCart className="w-[16px] h-[16px]" strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-[#A63D63] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
`,
  'src/components/Footer.tsx': `"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#2F2328] text-white py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-1 mb-6">
            <span className="font-serif text-3xl tracking-[0.2em] text-white">SEN</span>
            <span className="font-serif text-3xl tracking-[0.2em] text-[#A63D63]">VIA</span>
          </Link>
          <p className="text-[#E8CFC4] text-[13px] font-light max-w-xs leading-relaxed">
            Tuyển chọn những thiết kế đáng để giữ lại lâu hơn.
          </p>
        </div>
        
        <div className="md:col-span-1">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#D8BBB0] mb-6">Về chúng tôi</h4>
          <ul className="space-y-4 text-[13px] text-[#E8CFC4] font-light">
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Câu chuyện</Link></li>
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Tuyển dụng</Link></li>
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Liên hệ</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-1">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#D8BBB0] mb-6">Hỗ trợ</h4>
          <ul className="space-y-4 text-[13px] text-[#E8CFC4] font-light">
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Vận chuyển</Link></li>
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Đổi trả</Link></li>
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        <div className="md:col-span-1">
           <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#D8BBB0] mb-6">Theo dõi</h4>
           <div className="flex gap-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#E8CFC4]">
             <Link href="#" className="hover:text-[#A63D63] transition-colors">IG</Link>
             <Link href="#" className="hover:text-[#A63D63] transition-colors">FB</Link>
             <Link href="#" className="hover:text-[#A63D63] transition-colors">TK</Link>
           </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-[#D8BBB0]/20 text-[10px] text-[#E8CFC4] font-light uppercase tracking-[0.2em] flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© 2026 SENVIA</span>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-[#A63D63]">Điều khoản</Link>
          <Link href="#" className="hover:text-[#A63D63]">Bảo mật</Link>
        </div>
      </div>
    </footer>
  );
}
`,
  'src/app/page.tsx': `"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

// Fixing image URLs and ensuring they match the product category
const mockDirectoryItems = [
  { id: '01', name: 'Thời trang', count: 124, img: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80' },
  { id: '02', name: 'Làm đẹp', count: 86, img: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80' },
  { id: '03', name: 'Nhà cửa', count: 104, img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80' },
  { id: '04', name: 'Công nghệ', count: 72, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { id: '05', name: 'Lifestyle', count: 95, img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
];

export default function Home() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <>
      <Header />
      
      <main className="w-full bg-[#F7F1EC] flex flex-col items-center overflow-hidden">
        
        {/* BRAND MOTIF: thin burgundy line + dot */}
        <div className="w-full h-px bg-[#A63D63]/30 relative">
          <div className="absolute left-1/2 -top-[1px] w-[3px] h-[3px] bg-[#A63D63] rounded-full"></div>
        </div>

        {/* HERO - IVORY + BLUSH + BURGUNDY */}
        <section className="w-full max-w-[1440px] px-4 md:px-8 lg:px-12 pt-16 pb-20 border-b senvia-rule relative overflow-hidden">
          {/* Subtle blush background behind text */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E8CFC4]/30 -z-10"></div>
          
          <div className="grid grid-cols-12 gap-10 relative">
            
            {/* Left Vertical Label */}
            <div className="hidden lg:flex col-span-1 items-start justify-center h-full pt-10">
              <span className="vertical-text text-[9px] uppercase tracking-[0.3em] text-[#A63D63] font-bold">
                SENVIA / 09.26
              </span>
            </div>

            {/* Main Editorial Image */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="col-span-12 lg:col-span-5 aspect-[4/5] relative bg-white shadow-sm"
            >
              <Image 
                 src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" 
                 alt="Senvia Curated" 
                 fill 
                 className="object-cover p-3"
                 priority
              />
            </motion.div>

            {/* Typography & Secondary Composition - brought closer */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center pt-8">
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10 bg-[#F7F1EC]/80 backdrop-blur-sm p-6 lg:-ml-16 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
              >
                <div className="w-10 h-px bg-[#A63D63] mb-6"></div>
                <h1 className="font-serif text-5xl md:text-6xl text-[#2F2328] leading-[1.1] mb-6">
                  Chọn kỹ.<br /><span className="italic font-light text-[#A63D63]">Sống đẹp.</span>
                </h1>
                
                <p className="text-[#8D7C77] text-[14px] font-medium leading-relaxed max-w-sm mb-10">
                  Một tuyển chọn dành cho những món đồ đáng để giữ lại lâu hơn.
                </p>

                <Link href="/products" className="group inline-flex items-center gap-3 text-[#A63D63] text-[11px] font-bold tracking-[0.2em] uppercase hover:text-[#2F2328] transition-colors">
                  Khám phá Edit 09 <span className="font-serif text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>

              {/* Offset Secondary Image */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 ml-auto w-[55%] aspect-[3/4] relative bg-white shadow-sm"
              >
                 <Image src="https://images.unsplash.com/photo-1599643478524-fb66f7aa26d5?w=600&q=80" alt="Detail" fill className="object-cover p-2" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* THE DIRECTORY - WHITE WITH BURGUNDY HOVER */}
        <section className="w-full bg-[#FFFFFF] py-20 relative">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
             
             {/* Section Header */}
             <div className="flex items-center gap-4 mb-12 border-b border-[#D8BBB0] pb-4">
               <span className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] font-bold">01</span>
               <span className="text-[11px] uppercase tracking-[0.2em] text-[#2F2328] font-bold">The Directory</span>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative">
               <div className="lg:col-span-8 flex flex-col">
                 {mockDirectoryItems.map((item) => (
                    <Link 
                      href="/products" 
                      key={item.id}
                      onMouseEnter={() => setHoveredCategory(item.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className="group flex items-center justify-between py-5 border-b senvia-rule hover:bg-[#E8CFC4]/40 hover:px-4 transition-all duration-400"
                    >
                       <div className="flex items-center gap-8">
                         <span className="text-[10px] text-[#8D7C77] group-hover:text-[#A63D63] font-medium transition-colors">{item.id}</span>
                         <span className="font-serif text-3xl text-[#2F2328] group-hover:text-[#A63D63] transition-colors">{item.name}</span>
                       </div>
                       <div className="flex items-center gap-6">
                         <span className="text-[10px] text-[#8D7C77] uppercase tracking-widest hidden md:block">Xem danh mục</span>
                         <span className="text-[11px] text-[#A63D63] font-bold">{item.count}</span>
                       </div>
                    </Link>
                 ))}
               </div>

               {/* Hover Image Preview */}
               <div className="hidden lg:block lg:col-span-4 relative h-[400px]">
                 {mockDirectoryItems.map((item) => (
                   <Image 
                     key={item.id}
                     src={item.img} 
                     alt={item.name}
                     fill
                     className={\`object-cover border border-[#E8CFC4] p-3 bg-white transition-opacity duration-400 \${hoveredCategory === item.id ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
                   />
                 ))}
               </div>
             </div>
          </div>
        </section>

        {/* NEW OBJECTS - LIGHT BLUSH BAND & STRONG GRID */}
        <section className="w-full bg-[#F7F1EC] py-20 relative border-b senvia-rule">
           {/* Blush background band */}
           <div className="absolute top-32 bottom-20 left-0 w-full bg-[#E8CFC4]/20"></div>

           <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
             
             {/* Section Header */}
             <div className="flex justify-between items-center mb-16 border-b border-[#D8BBB0] pb-4">
               <div className="flex items-center gap-4">
                 <span className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] font-bold">02</span>
                 <span className="text-[11px] uppercase tracking-[0.2em] text-[#2F2328] font-bold">New Objects</span>
               </div>
               <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] hover:text-[#2F2328] transition-colors flex items-center gap-2 font-bold">
                 Tất cả <span className="font-serif text-lg leading-none">→</span>
               </Link>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16 relative">
                
                {/* Product 1 */}
                <div className="group w-full max-w-[280px] mx-auto">
                   <Link href="/products/1" className="relative block aspect-[4/5] bg-white mb-4 border border-[#E8CFC4] p-2 hover:border-[#A63D63] transition-colors">
                     <Image src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80" alt="Bag" fill className="object-cover p-2 group-hover:scale-[1.02] transition-transform" />
                     {/* Overlay Quick Add */}
                     <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] uppercase tracking-widest text-[#A63D63] font-bold">Thêm nhanh</span>
                     </div>
                   </Link>
                   <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">NOLA</div>
                   <div className="text-[14px] font-medium text-[#2F2328] mb-1">Shoulder Bag</div>
                   <div className="text-[13px] text-[#A63D63] font-medium">1.190.000đ</div>
                </div>

                {/* Product 2 */}
                <div className="group w-full max-w-[280px] mx-auto md:mt-12">
                   <Link href="/products/2" className="relative block aspect-[4/5] bg-white mb-4 border border-[#E8CFC4] p-2 hover:border-[#A63D63] transition-colors">
                     <Image src="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80" alt="Shirt" fill className="object-cover p-2 group-hover:scale-[1.02] transition-transform" />
                     <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] uppercase tracking-widest text-[#A63D63] font-bold">Thêm nhanh</span>
                     </div>
                   </Link>
                   <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">MORI</div>
                   <div className="text-[14px] font-medium text-[#2F2328] mb-1">Linen Shirt</div>
                   <div className="text-[13px] text-[#A63D63] font-medium">890.000đ</div>
                </div>

                {/* Product 3: Featured large */}
                <div className="group col-span-2 md:col-span-2 w-full max-w-[340px] mx-auto">
                   <Link href="/products/3" className="relative block aspect-square bg-white mb-4 border border-[#D8BBB0] p-4 hover:border-[#A63D63] transition-colors shadow-sm">
                     <Image src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80" alt="Lamp" fill className="object-cover p-4 group-hover:scale-[1.02] transition-transform" />
                     <span className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.2em] bg-[#A63D63] text-white px-3 py-1 font-bold">FEATURED</span>
                     <div className="absolute inset-x-4 bottom-4 bg-white/95 backdrop-blur-md py-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[11px] uppercase tracking-widest text-[#A63D63] font-bold">Thêm vào giỏ →</span>
                     </div>
                   </Link>
                   <div className="flex justify-between items-start">
                     <div>
                       <div className="text-[10px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">KANSO</div>
                       <div className="text-[15px] font-medium text-[#2F2328] mb-1">Brass Table Lamp</div>
                     </div>
                     <div className="text-[14px] text-[#A63D63] font-bold">1.290.000đ</div>
                   </div>
                </div>

             </div>
           </div>
        </section>

        {/* SIGNATURE SECTION: OBJECTS / 01 - WHITE + DUSTY ROSE */}
        <section className="w-full bg-white py-24 border-b senvia-rule relative">
           
           <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
             
             {/* Section Header */}
             <div className="flex items-center justify-center gap-4 mb-16 border-b border-[#D8BBB0] max-w-sm mx-auto pb-4">
               <span className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] font-bold">03</span>
               <span className="text-[11px] uppercase tracking-[0.2em] text-[#2F2328] font-bold">Objects / 01</span>
             </div>
             
             <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 max-w-5xl mx-auto">
                <div className="w-full max-w-[340px] aspect-[4/5] relative bg-[#E8CFC4]/30 p-6 border border-[#D8BBB0]">
                   <Image src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" alt="Ceramic Object" fill className="object-cover p-6" />
                </div>
                
                <div className="max-w-xs flex flex-col items-start bg-[#F7F1EC] p-8 border border-[#D8BBB0]/50 shadow-sm relative">
                   <div className="absolute top-0 right-8 w-[2px] h-6 bg-[#A63D63]"></div>
                   
                   <span className="text-[11px] uppercase tracking-[0.2em] text-[#A63D63] mb-4 font-bold">Object 01</span>
                   <h2 className="font-serif text-3xl text-[#2F2328] mb-4">Gốm thô Kanso</h2>
                   <p className="text-[#8D7C77] font-medium text-[13px] leading-relaxed mb-6">
                     Vẻ đẹp của sự thô mộc. Một tác phẩm tôn vinh khoảng không tĩnh lặng.
                   </p>
                   
                   <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 w-full border-t border-b border-[#D8BBB0] py-4">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">Chất liệu</div>
                        <div className="text-[12px] font-medium text-[#2F2328]">Gốm nhám</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">Mức giá</div>
                        <div className="text-[12px] font-medium text-[#A63D63]">1.490.000đ</div>
                      </div>
                   </div>

                   <Link href="/products/4" className="text-[10px] uppercase tracking-[0.2em] text-[#FFFFFF] bg-[#A63D63] px-6 py-3 font-bold flex items-center gap-2 hover:bg-[#2F2328] transition-colors w-full justify-center">
                     KHÁM PHÁ →
                   </Link>
                </div>
             </div>
           </div>
        </section>

        {/* CURATED PATHS - ALTERNATING BACKGROUNDS */}
        <section className="w-full flex flex-col">
          {/* Section Header */}
          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mt-20 mb-8">
             <div className="flex items-center gap-4 border-b border-[#D8BBB0] pb-4">
               <span className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] font-bold">04</span>
               <span className="text-[11px] uppercase tracking-[0.2em] text-[#2F2328] font-bold">Curated Paths</span>
             </div>
          </div>

           {[
             { num: '01', title: 'Soft Geometry', bg: 'bg-[#F7F1EC]', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
             { num: '02', title: 'After Hours', bg: 'bg-[#E8CFC4]/40', img: 'https://images.unsplash.com/photo-1475179532958-3602fc5ce64a?w=800&q=80', reverse: true },
           ].map((path, idx) => (
              <div key={idx} className={\`w-full \${path.bg} py-16 border-b senvia-rule\`}>
                <div className={\`max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col \${path.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20 group\`}>
                   <div className="w-full md:w-1/2 flex flex-col max-w-sm">
                      <span className="font-serif text-xl text-[#A63D63] mb-4">{path.num}</span>
                      <h3 className="font-serif text-4xl text-[#2F2328] mb-4 group-hover:text-[#A63D63] transition-colors">{path.title}</h3>
                      <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] hover:text-[#2F2328] transition-colors border-b border-[#A63D63] pb-1 w-fit font-bold">
                        Xem tuyển chọn
                      </Link>
                   </div>
                   <div className="w-full md:w-1/2 aspect-[16/9] relative overflow-hidden border border-[#D8BBB0] bg-white p-2">
                      <Image src={path.img} alt={path.title} fill className="object-cover p-2 group-hover:scale-[1.02] transition-transform duration-1000" />
                   </div>
                </div>
              </div>
           ))}
        </section>

        {/* PRIVATE EDIT (DARK ESPRESSO) */}
        <section className="w-full bg-[#2F2328] py-24">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
             {/* Section Header */}
             <div className="flex justify-between items-center mb-16 border-b border-[#E8CFC4]/25 pb-4">
               <div className="flex items-center gap-4">
                 <span className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] font-bold">05</span>
                 <span className="text-[11px] uppercase tracking-[0.2em] text-[#E8CFC4] font-bold">Private Edit</span>
               </div>
               <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-[#E8CFC4] hover:text-[#A63D63] transition-colors font-bold">
                 Khám phá →
               </Link>
             </div>

             <div className="flex flex-col max-w-4xl mx-auto">
                {[
                  { num: '01', name: "Kanso Brass Lamp", price: "1.090.000", old: "1.290.000", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" },
                  { num: '02', name: "Nola Carry Tote", price: "1.490.000", old: "1.890.000", img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80" },
                  { num: '03', name: "Mori Ceramic Vase", price: "590.000", old: "750.000", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80" },
                ].map((item, idx) => (
                   <Link href="/products" key={idx} className="group flex items-center justify-between py-5 border-b border-[#E8CFC4]/20 hover:border-[#A63D63] transition-colors relative z-10">
                      <div className="flex items-center gap-8 md:gap-12">
                        <span className="text-[10px] font-sans text-[#E8CFC4]/60">{item.num}</span>
                        <div className="w-16 h-16 relative bg-[#E8CFC4]/10 border border-[#E8CFC4]/20 p-1 opacity-80 group-hover:opacity-100 transition-opacity">
                           <Image src={item.img} alt={item.name} fill className="object-cover p-1" />
                        </div>
                        <span className="font-serif text-xl md:text-2xl text-[#FFFFFF] group-hover:text-[#E8CFC4] transition-colors">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-[#E8CFC4]/50 line-through hidden md:inline-block">{item.old}đ</span>
                        <span className="text-[14px] font-bold text-[#A63D63]">{item.price}đ</span>
                      </div>
                   </Link>
                ))}
             </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
`,
  'src/app/products/page.tsx': `"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const mockProducts = [
  { id: 1, name: "Canvas Tote Bag", brand: "NOLA", price: 1190000, isNew: true, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80" },
  { id: 2, name: "Linen Shirt", brand: "MORI", price: 890000, discount: 15, oldPrice: 1050000, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80" },
  { id: 3, name: "Brass Table Lamp", brand: "KANSO", price: 1290000, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
  { id: 4, name: "Signature Iris Parfum", brand: "MAISON 28", price: 2490000, isNew: true, image: "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=600&q=80" },
];

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#F7F1EC] min-h-screen">
        
        {/* Intro Area */}
        <div className="w-full bg-[#E8CFC4]/30 py-12 px-4 md:px-8 lg:px-12 border-b senvia-rule-burgundy relative">
           <div className="absolute top-0 left-0 w-[4px] h-full bg-[#A63D63]"></div>
           <div className="max-w-[1440px] mx-auto">
             <span className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] font-bold mb-4 block">Products / 128</span>
             <h1 className="font-serif text-4xl md:text-5xl text-[#2F2328]">Tất cả sản phẩm</h1>
           </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-12 flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="flex flex-col gap-10 sticky top-32">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2F2328] mb-6 border-b border-[#D8BBB0] pb-2">Danh mục</h3>
                <ul className="space-y-4 text-[13px] font-medium text-[#8D7C77]">
                  <li className="text-[#A63D63] font-bold border-l-2 border-[#A63D63] pl-3 -ml-3">Tất cả sản phẩm</li>
                  <li className="hover:text-[#A63D63] transition-colors cursor-pointer pl-3">Thời trang</li>
                  <li className="hover:text-[#A63D63] transition-colors cursor-pointer pl-3">Làm đẹp</li>
                  <li className="hover:text-[#A63D63] transition-colors cursor-pointer pl-3">Nhà cửa</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 border-b border-[#D8BBB0] pb-4">
               <span className="text-[12px] font-medium text-[#8D7C77]">Hiển thị 8 trên 128 sản phẩm</span>
               <select className="bg-transparent outline-none border-none cursor-pointer focus:ring-0 text-[12px] font-bold text-[#A63D63]">
                  <option>Mới nhất</option>
                  <option>Giá: Thấp đến cao</option>
                  <option>Giá: Cao xuống thấp</option>
               </select>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
               {mockProducts.map((p) => (
                  <div key={p.id} className="group w-full max-w-[280px] mx-auto hover:bg-[#E8CFC4]/20 p-2 transition-colors rounded-sm">
                    <Link href={\`/products/\${p.id}\`} className="relative block aspect-[4/5] bg-white mb-3 border border-[#D8BBB0] p-1">
                      <Image src={p.image} alt={p.name} fill className="object-cover p-2 group-hover:scale-[1.02] transition-transform" />
                      {p.discount && <span className="absolute top-2 left-2 bg-[#A63D63] text-white text-[9px] uppercase font-bold px-2 py-1">-{p.discount}%</span>}
                      
                      <button className="absolute top-2 right-2 text-[#D8BBB0] group-hover:text-[#A63D63] opacity-0 group-hover:opacity-100 transition-all z-10">
                        <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                      </button>

                      <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md py-2.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] uppercase tracking-widest text-[#A63D63] font-bold">Thêm nhanh →</span>
                      </div>
                    </Link>
                    <div className="text-center">
                      <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">{p.brand}</div>
                      <div className="text-[14px] font-medium text-[#2F2328] mb-1">{p.name}</div>
                      <div className="flex items-center justify-center gap-2">
                        {p.oldPrice && <span className="text-[11px] text-[#8D7C77] line-through">{p.oldPrice.toLocaleString('vi-VN')}đ</span>}
                        <span className="text-[13px] text-[#A63D63] font-bold">{p.price.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
`,
  'src/app/cart/page.tsx': `"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-[#F7F1EC] min-h-screen pt-12 pb-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          
          <div className="flex items-center gap-4 mb-10 border-b border-[#A63D63] pb-4">
             <span className="text-[10px] uppercase tracking-[0.2em] text-[#A63D63] font-bold">Shopping</span>
             <h1 className="font-serif text-4xl text-[#2F2328]">Giỏ hàng (2)</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 bg-white p-6 md:p-8 border border-[#D8BBB0] shadow-sm">
              <div className="border-b border-[#E8CFC4] pb-8 mb-8 flex gap-6 relative group">
                 <button className="absolute top-0 right-0 text-[#8D7C77] hover:text-[#A63D63] transition-colors"><X className="w-4 h-4" /></button>
                 <div className="relative w-28 aspect-[4/5] bg-[#F7F1EC] shrink-0 border border-[#D8BBB0] p-1">
                   <Image src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80" alt="Bag" fill className="object-cover p-2" />
                 </div>
                 <div className="flex flex-col justify-between">
                   <div>
                     <div className="text-[9px] text-[#8D7C77] uppercase tracking-[0.2em] mb-1 font-bold">NOLA</div>
                     <div className="font-medium text-[#2F2328] text-lg mb-2">Canvas Tote Bag</div>
                     <div className="text-[#A63D63] font-bold">1.190.000đ</div>
                   </div>
                   <div className="flex items-center border border-[#D8BBB0] h-9 w-fit bg-[#F7F1EC]">
                      <button className="w-9 h-full flex items-center justify-center text-[#8D7C77] hover:text-[#A63D63]"><Minus className="w-3 h-3" /></button>
                      <span className="w-10 text-center text-[#2F2328] font-bold text-sm bg-white h-full flex items-center justify-center border-l border-r border-[#D8BBB0]">1</span>
                      <button className="w-9 h-full flex items-center justify-center text-[#8D7C77] hover:text-[#A63D63]"><Plus className="w-3 h-3" /></button>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <div className="bg-[#E8CFC4]/20 p-8 border border-[#D8BBB0] sticky top-32">
                 <h3 className="font-serif text-2xl mb-6 text-[#2F2328] border-b border-[#D8BBB0] pb-4">Tóm tắt</h3>
                 <div className="flex justify-between mb-4 text-[#8D7C77] text-[13px] font-medium">
                   <span>Tạm tính</span>
                   <span className="text-[#2F2328]">1.190.000đ</span>
                 </div>
                 <div className="flex justify-between mb-6 text-[#8D7C77] text-[13px] font-medium border-b border-[#D8BBB0] pb-6">
                   <span>Vận chuyển</span>
                   <span className="text-[#A63D63] font-bold">Miễn phí</span>
                 </div>
                 <div className="flex justify-between mb-8 items-end">
                   <span className="font-bold uppercase tracking-[0.1em] text-[#2F2328] text-[11px]">Tổng cộng</span>
                   <span className="font-bold text-2xl text-[#A63D63]">1.190.000đ</span>
                 </div>
                 <Link href="/checkout" className="block text-center w-full bg-[#A63D63] text-white py-4 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#8D3050] transition-colors shadow-md">
                   Thanh toán →
                 </Link>
              </div>
            </div>
          </div>
        </div>
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
