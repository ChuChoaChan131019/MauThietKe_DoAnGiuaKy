const fs = require('fs');
const path = require('path');

const files = {
  'src/app/globals.css': `@import "tailwindcss";

@theme {
  --color-senvia-ivory: #F7F1EC;
  --color-senvia-white: #FFFFFF;
  --color-senvia-plum: #2F2328;
  --color-senvia-burgundy: #A63D63;
  --color-senvia-clay: #D8BBB0;
  --color-senvia-muted: #8D7C77;
  --color-senvia-champagne: #B9936B;
  
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

.senvia-rule {
  border-color: rgba(47,35,40,0.18);
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

h1, h2, h3, h4, h5, h6 {
  color: var(--color-senvia-plum);
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
      <div className="w-full bg-[#2F2328] text-[#F7F1EC] text-[9px] py-1 px-4 md:px-8 flex justify-between items-center tracking-[0.25em] font-sans uppercase">
        <div className="flex-1 hidden md:block opacity-70">SENVIA / CURATED LIFESTYLE</div>
        <div className="flex-1 text-center font-medium opacity-80">MIỄN PHÍ VẬN CHUYỂN TỪ 499.000Đ</div>
        <div className="flex-1 hidden md:flex justify-end gap-6 opacity-70">
          <Link href="#" className="hover:text-white transition-colors duration-300">Theo dõi đơn hàng</Link>
        </div>
      </div>

      {/* MAIN HEADER - STICKY */}
      <div className={\`w-full bg-white/95 backdrop-blur-md px-4 md:px-8 lg:px-12 transition-all duration-500 sticky top-0 z-50 flex items-center justify-between border-b senvia-rule \${isScrolled ? 'py-4' : 'py-6'}\`}>
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-1 group w-1/4">
          <span className="font-serif text-xl tracking-[0.2em] text-[#2F2328]">SENVIA</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex justify-center flex-1">
          <ul className="flex items-center gap-8 text-[10px] font-medium text-[#2F2328] uppercase tracking-[0.25em]">
            {['Mới về', 'Thời trang', 'Làm đẹp', 'Nhà cửa', 'Công nghệ', 'Lifestyle'].map((item) => (
               <li key={item} className="group relative overflow-hidden">
                 <Link href="/products" className="hover:text-[#A63D63] transition-colors duration-300 py-1 inline-block opacity-80 hover:opacity-100">
                   {item}
                 </Link>
               </li>
            ))}
            <li className="group relative">
              <Link href="/products" className="text-[#A63D63] py-1 inline-block opacity-90 hover:opacity-100">SALE</Link>
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
                  className="bg-transparent border-b border-[#2F2328] outline-none text-[10px] uppercase tracking-widest px-2 pb-1 mr-2 placeholder-[#8D7C77]"
                  autoFocus
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="text-[10px] uppercase tracking-[0.2em] hover:text-[#A63D63] transition-colors flex items-center gap-2"
            >
              {searchOpen ? 'ĐÓNG' : 'TÌM KIẾM ⌕'}
            </button>
          </div>
          
          <Link href="/account/wishlist" className="hover:text-[#A63D63] transition-colors duration-300">
            <Heart className="w-[16px] h-[16px]" strokeWidth={1} />
          </Link>
          <Link href="/login" className="hover:text-[#A63D63] transition-colors duration-300">
            <User className="w-[16px] h-[16px]" strokeWidth={1} />
          </Link>
          <Link href="/cart" className="hover:text-[#A63D63] transition-colors duration-300 relative group flex items-center gap-1.5">
            <ShoppingCart className="w-[16px] h-[16px]" strokeWidth={1} />
            <span className="text-[10px]">0</span>
          </Link>
        </div>
      </div>
    </header>
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

const directoryItems = [
  { id: '01', name: 'Thời trang', count: 124, img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80' },
  { id: '02', name: 'Làm đẹp', count: 86, img: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80' },
  { id: '03', name: 'Nhà cửa', count: 104, img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80' },
  { id: '04', name: 'Công nghệ', count: 72, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { id: '05', name: 'Lifestyle', count: 95, img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
  { id: '06', name: 'Phụ kiện', count: 68, img: 'https://images.unsplash.com/photo-1599643478524-fb66f7aa26d5?w=600&q=80' },
];

export default function Home() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <>
      <Header />
      
      <main className="w-full bg-white flex flex-col items-center overflow-hidden">
        
        {/* HERO - ASYMMETRICAL & EDITORIAL */}
        <section className="w-full max-w-[1440px] px-4 md:px-8 lg:px-12 pt-16 pb-24 border-b senvia-rule">
          <div className="grid grid-cols-12 gap-6 relative">
            
            {/* Left Vertical Label */}
            <div className="hidden lg:flex col-span-1 items-start justify-center h-full pt-10">
              <span className="vertical-text text-[9px] uppercase tracking-[0.3em] text-[#8D7C77]">
                SENVIA / CURATED 09.26
              </span>
            </div>

            {/* Main Editorial Image */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="col-span-12 lg:col-span-5 aspect-[3/4] relative"
            >
              <Image 
                 src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=80" 
                 alt="Senvia Curated" 
                 fill 
                 className="object-cover"
                 priority
              />
              <span className="absolute -right-16 top-1/2 -translate-y-1/2 vertical-text text-[8px] uppercase tracking-[0.4em] text-[#8D7C77] hidden xl:block">
                PHOTOGRAPHED FOR SENVIA
              </span>
            </motion.div>

            {/* Typography & Secondary Composition */}
            <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex flex-col justify-center pt-10 lg:pt-0">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="font-serif text-5xl md:text-6xl text-[#2F2328] leading-[1.1] mb-8">
                  Chọn kỹ.<br /><span className="italic font-light">Sống đẹp.</span>
                </h1>
                
                <p className="text-[#8D7C77] text-[13px] font-light leading-relaxed max-w-sm mb-12">
                  Một tuyển chọn dành cho những món đồ đáng để giữ lại lâu hơn.
                </p>

                <Link href="/products" className="group inline-flex items-center gap-4 text-[#2F2328] text-[10px] font-medium tracking-[0.25em] uppercase hover:text-[#A63D63] transition-colors">
                  <span className="border-b border-[#2F2328] group-hover:border-[#A63D63] pb-1">Khám phá Edit 09</span>
                  <span className="font-serif text-lg leading-none">→</span>
                </Link>
              </motion.div>

              {/* Offset Secondary Image */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-20 ml-auto w-[65%] aspect-[4/5] relative"
              >
                 <Image src="https://images.unsplash.com/photo-1599643478524-fb66f7aa26d5?w=600&q=80" alt="Detail" fill className="object-cover" />
                 <div className="absolute -bottom-8 right-0 text-right">
                   <span className="text-[10px] uppercase tracking-[0.2em] text-[#2F2328] block mb-1">128 Sản phẩm mới</span>
                   <span className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77]">09.2026</span>
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* THE DIRECTORY */}
        <section className="w-full max-w-[1200px] px-4 md:px-8 py-32 border-b senvia-rule relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
             <div className="md:col-span-4">
               <span className="text-[10px] uppercase tracking-[0.2em] text-[#8D7C77]">01 / THE DIRECTORY</span>
             </div>
             
             <div className="md:col-span-8 relative">
               <div className="flex flex-col">
                 {directoryItems.map((item, idx) => (
                    <Link 
                      href="/products" 
                      key={item.id}
                      onMouseEnter={() => setHoveredCategory(item.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className="group flex items-center justify-between py-6 border-b senvia-rule first:border-t hover:pl-6 transition-all duration-500 relative z-10"
                    >
                       <div className="flex items-center gap-8">
                         <span className="text-[10px] text-[#8D7C77]">{item.id}</span>
                         <span className="font-serif text-3xl text-[#2F2328] group-hover:text-[#A63D63] transition-colors">{item.name}</span>
                       </div>
                       <span className="text-[11px] text-[#8D7C77]">{item.count}</span>
                    </Link>
                 ))}
               </div>

               {/* Hover Image Preview */}
               <div className="absolute top-1/2 -translate-y-1/2 right-12 w-64 aspect-[3/4] pointer-events-none opacity-0 lg:group-hover:opacity-100 hidden lg:block overflow-hidden transition-opacity duration-300 z-0">
                 {directoryItems.map((item) => (
                   <Image 
                     key={item.id}
                     src={item.img} 
                     alt={item.name}
                     fill
                     className={\`object-cover transition-opacity duration-500 \${hoveredCategory === item.id ? 'opacity-100' : 'opacity-0'}\`}
                   />
                 ))}
               </div>
             </div>
          </div>
        </section>

        {/* NEW OBJECTS - STAGGERED LAYOUT */}
        <section className="w-full max-w-[1440px] px-4 md:px-8 py-32 border-b senvia-rule">
           <div className="flex justify-between items-end mb-24">
             <span className="text-[10px] uppercase tracking-[0.2em] text-[#8D7C77]">02 / NEW OBJECTS</span>
             <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-[#2F2328] hover:text-[#A63D63] transition-colors flex items-center gap-2">
               Xem tất cả <span className="font-serif text-lg leading-none">→</span>
             </Link>
           </div>

           <div className="grid grid-cols-12 gap-8 relative pb-20">
              
              {/* Product 1: Normal */}
              <div className="col-span-6 md:col-span-3">
                 <div className="relative aspect-[4/5] bg-[#F7F1EC] mb-4 w-full max-w-[280px]">
                   <Image src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80" alt="Bag" fill className="object-cover p-4" />
                 </div>
                 <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">NOLA</div>
                 <div className="text-[13px] font-light text-[#2F2328] mb-1">Canvas Tote Bag</div>
                 <div className="text-[11px] text-[#2F2328]">1.190.000đ</div>
              </div>

              {/* Product 2: Lower */}
              <div className="col-span-6 md:col-span-3 mt-24">
                 <div className="relative aspect-[4/5] bg-transparent mb-4 w-full max-w-[240px]">
                   <Image src="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80" alt="Shirt" fill className="object-cover" />
                 </div>
                 <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">MORI</div>
                 <div className="text-[13px] font-light text-[#2F2328] mb-1">Linen Shirt</div>
                 <div className="text-[11px] text-[#2F2328]">890.000đ</div>
              </div>

              {/* Product 3: Narrow center */}
              <div className="col-span-12 md:col-span-2 flex flex-col items-center">
                 <div className="relative aspect-[1/2] w-full max-w-[160px] bg-[#F7F1EC] mb-4">
                   <Image src="https://images.unsplash.com/photo-1594035910387-fea47714263f?w=600&q=80" alt="Perfume" fill className="object-cover p-2" />
                 </div>
                 <div className="text-center">
                   <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">MAISON 28</div>
                   <div className="text-[13px] font-light text-[#2F2328] mb-1">Signature Iris</div>
                   <div className="text-[11px] text-[#2F2328]">2.490.000đ</div>
                 </div>
              </div>

              {/* Product 4: Featured large */}
              <div className="col-span-12 md:col-span-4 flex flex-col items-end md:-mt-10">
                 <div className="relative aspect-square w-full max-w-[400px] mb-4">
                   <Image src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80" alt="Lamp" fill className="object-cover" />
                   <span className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.2em] bg-white px-3 py-1">Featured</span>
                 </div>
                 <div className="w-full max-w-[400px]">
                   <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">KANSO</div>
                   <div className="text-[13px] font-light text-[#2F2328] mb-1">Brass Table Lamp</div>
                   <div className="text-[11px] text-[#2F2328]">1.290.000đ</div>
                 </div>
              </div>

           </div>
        </section>

        {/* SIGNATURE SECTION: OBJECTS / 01 */}
        <section className="w-full max-w-[1440px] px-4 md:px-8 py-32 border-b senvia-rule">
           <div className="flex justify-center mb-16">
             <span className="text-[10px] uppercase tracking-[0.2em] text-[#8D7C77]">03 / OBJECTS / 01</span>
           </div>
           
           <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 max-w-5xl mx-auto">
              <div className="w-full max-w-[320px] aspect-[3/4] relative">
                 <Image src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" alt="Object 01" fill className="object-cover p-6 bg-[#F7F1EC]" />
              </div>
              
              <div className="max-w-xs flex flex-col items-start">
                 <span className="text-[9px] uppercase tracking-[0.2em] text-[#A63D63] mb-4">Object 01</span>
                 <h2 className="font-serif text-3xl text-[#2F2328] mb-6">Mori Ceramic Vase</h2>
                 <p className="text-[#8D7C77] font-light text-[13px] leading-relaxed mb-8 italic">
                   "Vẻ đẹp của sự thô mộc. Một tác phẩm tôn vinh khoảng không tĩnh lặng."
                 </p>
                 
                 <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-10 w-full border-t border-b senvia-rule py-6">
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">Chất liệu</div>
                      <div className="text-[12px] text-[#2F2328]">Gốm nhám</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-[#8D7C77] mb-1">Mức giá</div>
                      <div className="text-[12px] text-[#2F2328]">1.490.000đ</div>
                    </div>
                 </div>

                 <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-[#2F2328] flex items-center gap-2 hover:text-[#A63D63] transition-colors">
                   Khám phá <span className="font-serif text-lg leading-none">→</span>
                 </Link>
              </div>
           </div>
        </section>

        {/* CURATED PATHS */}
        <section className="w-full max-w-[1200px] px-4 md:px-8 py-32 border-b senvia-rule">
           <div className="mb-20">
             <span className="text-[10px] uppercase tracking-[0.2em] text-[#8D7C77]">04 / CURATED PATHS</span>
           </div>

           <div className="flex flex-col space-y-16">
              {[
                { num: '01', title: 'Soft Geometry', desc: 'Không gian sống tinh giản với những đường nét mềm mại.', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
                { num: '02', title: 'After Hours', desc: 'Sự tĩnh lặng sau một ngày dài. Phụ kiện và ánh sáng.', img: 'https://images.unsplash.com/photo-1475179532958-3602fc5ce64a?w=800&q=80', reverse: true },
                { num: '03', title: 'Objects for Work', desc: 'Những vật dụng khơi nguồn cảm hứng nơi góc làm việc.', img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80' },
              ].map((path, idx) => (
                 <div key={idx} className={\`flex flex-col \${path.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24 group\`}>
                    <div className="w-full md:w-1/2 flex flex-col max-w-sm">
                       <span className="font-serif text-xl text-[#A63D63] mb-4">{path.num}</span>
                       <h3 className="font-serif text-4xl text-[#2F2328] mb-4 group-hover:text-[#A63D63] transition-colors">{path.title}</h3>
                       <p className="text-[13px] font-light text-[#8D7C77] mb-8">{path.desc}</p>
                       <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-[#2F2328] hover:text-[#A63D63] transition-colors border-b senvia-rule pb-1 w-fit">
                         Xem tuyển chọn
                       </Link>
                    </div>
                    <div className="w-full md:w-1/2 aspect-[16/9] relative overflow-hidden">
                       <Image src={path.img} alt={path.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-1000" />
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* PRIVATE EDIT (REFINED DARK SECTION) */}
        <section className="w-full bg-[#2F2328] py-32 mt-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
             <div className="flex justify-between items-end mb-24 border-b border-white/10 pb-8">
               <div>
                 <h2 className="font-serif text-3xl text-[#F7F1EC] mb-2">PRIVATE EDIT</h2>
                 <p className="text-[11px] uppercase tracking-[0.2em] text-[#8D7C77]">Ưu đãi tuyển chọn đến 30%</p>
               </div>
               <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] text-[#D8BBB0] hover:text-white transition-colors">
                 Tất cả Private Edit →
               </Link>
             </div>

             <div className="flex flex-col">
                {[
                  { num: '01', name: "Kanso Brass Lamp", price: "1.090.000", old: "1.290.000", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" },
                  { num: '02', name: "Nola Carry Tote", price: "1.490.000", old: "1.890.000", img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80" },
                  { num: '03', name: "Mori Ceramic Vase", price: "590.000", old: "750.000", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80" },
                  { num: '04', name: "Aster Wall Frame", price: "790.000", old: "990.000", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&q=80" },
                ].map((item, idx) => (
                   <Link href="/products" key={idx} className="group flex items-center justify-between py-6 border-b border-white/10 hover:border-[#D8BBB0] transition-colors relative z-10">
                      <div className="flex items-center gap-8 md:gap-16">
                        <span className="text-[10px] font-sans text-[#8D7C77]">{item.num}</span>
                        <div className="w-16 h-16 relative bg-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                           <Image src={item.img} alt={item.name} fill className="object-cover p-1" />
                        </div>
                        <span className="font-serif text-xl md:text-2xl text-[#F7F1EC] group-hover:text-[#D8BBB0] transition-colors">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-[#8D7C77] line-through hidden md:inline-block">{item.old}đ</span>
                        <span className="text-[13px] font-light text-[#F7F1EC]">{item.price}đ</span>
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
