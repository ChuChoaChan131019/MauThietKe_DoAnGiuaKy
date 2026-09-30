const fs = require('fs');
const path = require('path');

const files = {
  'src/components/Header.tsx': `"use client";
import Link from "next/link";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className="w-full bg-[#2F2328] text-[#F7F1EC] text-[10px] py-1.5 px-4 md:px-8 flex justify-between items-center tracking-[0.2em] font-sans uppercase">
        <div className="flex-1 hidden md:block opacity-70">Miễn phí vận chuyển từ 499.000đ</div>
        <div className="flex-1 text-center font-medium opacity-80">Senvia Edit — Tuyển chọn tuần này</div>
        <div className="flex-1 hidden md:flex justify-end gap-6 opacity-70">
          <Link href="#" className="hover:text-white transition-colors duration-300">Theo dõi đơn hàng</Link>
          <Link href="#" className="hover:text-white transition-colors duration-300">Trợ giúp</Link>
        </div>
      </div>

      {/* MAIN HEADER - STICKY */}
      <div className={\`w-full bg-white/98 backdrop-blur-md px-4 md:px-8 lg:px-12 transition-all duration-500 sticky top-0 z-50 flex items-center justify-between border-b \${isScrolled ? 'py-3 border-[#F7F1EC] shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'py-5 border-transparent'}\`}>
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-1 group">
          <span className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-[#2F2328]">SEN</span>
          <span className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-[#A63D63]">VIA</span>
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 max-w-md mx-12">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="w-full bg-transparent text-[#2F2328] placeholder-[#8D7C77] px-4 py-2 rounded-none border-b border-[#E9D6CC] focus:border-[#A63D63] focus:outline-none transition-all duration-300 text-[13px] font-light"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8D7C77] group-hover:text-[#2F2328] transition-colors">
              <Search className="w-4 h-4" strokeWidth={1.2} />
            </button>
          </div>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-6 md:gap-7 text-[#2F2328]">
          <button className="md:hidden"><Search className="w-4 h-4" strokeWidth={1.2} /></button>
          <Link href="/account/wishlist" className="hover:text-[#A63D63] transition-colors duration-300"><Heart className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.2} /></Link>
          <Link href="/login" className="hover:text-[#A63D63] transition-colors duration-300"><User className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.2} /></Link>
          <Link href="/cart" className="hover:text-[#A63D63] transition-colors duration-300 relative group">
            <ShoppingCart className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.2} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#A63D63] text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full">3</span>
          </Link>
        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <nav className="w-full bg-white px-4 md:px-8 lg:px-12 border-b border-[#F7F1EC] overflow-x-auto no-scrollbar relative z-40">
        <ul className="flex items-center justify-center gap-8 md:gap-10 min-w-max py-3 text-[11px] font-medium text-[#2F2328] uppercase tracking-[0.2em]">
          {['Mới về', 'Bán chạy', 'Thời trang', 'Làm đẹp', 'Nhà cửa', 'Công nghệ', 'Lifestyle'].map((item) => (
             <li key={item} className="group relative">
               <Link href="/products" className="hover:text-[#A63D63] transition-colors duration-300 py-1.5 inline-block opacity-80 hover:opacity-100">
                 {item}
               </Link>
             </li>
          ))}
          <li className="group relative">
            <Link href="/products" className="text-[#A63D63] font-bold py-1.5 inline-block opacity-90 hover:opacity-100">SALE</Link>
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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group flex flex-col gap-3 font-sans w-full max-w-[280px] mx-auto"
    >
      <Link href={\`/products/\${product.id}\`} className="relative aspect-[4/5] bg-[#F7F1EC] overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
        />
        
        {/* Badges - minimal */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.isNew && <span className="bg-white/95 text-[#2F2328] text-[9px] uppercase px-2 py-1 tracking-widest shadow-sm">Mới</span>}
          {product.discount > 0 && <span className="bg-[#A63D63] text-white text-[9px] uppercase px-2 py-1 tracking-widest shadow-sm">-{product.discount}%</span>}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 ease-out z-10">
          <button className="w-full bg-white/95 backdrop-blur-sm text-[#2F2328] py-2.5 text-[11px] uppercase tracking-widest font-medium hover:bg-[#A63D63] hover:text-white transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-[#E9D6CC]/30">
            Thêm nhanh
          </button>
        </div>

        <button className="absolute top-2 right-2 text-[#8D7C77] hover:text-[#A63D63] transition-colors opacity-0 group-hover:opacity-100 z-10">
          <Heart className="w-[18px] h-[18px]" strokeWidth={1.2} />
        </button>
      </Link>

      <div className="flex flex-col gap-1 items-center text-center mt-2">
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#8D7C77] mb-1">{product.brand}</span>
        <Link href={\`/products/\${product.id}\`} className="text-[#2F2328] text-[13px] font-light truncate w-full hover:text-[#A63D63] transition-colors">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[13px] text-[#2F2328]">{product.price.toLocaleString('vi-VN')}₫</span>
          {product.oldPrice && (
            <span className="text-[11px] text-[#8D7C77] line-through">{product.oldPrice.toLocaleString('vi-VN')}₫</span>
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
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const mockProducts = [
  { id: 1, name: "NOLA Canvas Tote", brand: "NOLA", price: 1190000, isNew: true, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80" },
  { id: 2, name: "MORI Linen Shirt", brand: "MORI", price: 890000, discount: 15, oldPrice: 1050000, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80" },
  { id: 3, name: "KANSO Brass Lamp", brand: "KANSO", price: 1290000, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
  { id: 4, name: "MAISON 28 Iris Eau de Parfum", brand: "MAISON 28", price: 2490000, isNew: true, image: "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=600&q=80" },
];

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="w-full flex flex-col items-center bg-white overflow-hidden">
        
        {/* HERO - REFINED AND DELICATE */}
        <section className="w-full max-w-[1440px] px-4 md:px-8 lg:px-12 py-10 md:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-5/12 flex flex-col items-start pt-10"
            >
              <span className="text-[9px] font-bold tracking-[0.3em] text-[#8D7C77] uppercase mb-8 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#E9D6CC]"></span>
                Senvia Edit
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[4rem] leading-[1.15] text-[#2F2328] mb-8">
                Sự tinh tế<br />không cần<br /><span className="italic font-light">lên tiếng.</span>
              </h1>
              <p className="text-[#8D7C77] mb-12 text-[15px] leading-relaxed max-w-sm font-light">
                Một bộ sưu tập những thiết kế được tuyển chọn cẩn trọng, mang lại giá trị bền vững và vẻ đẹp tĩnh lặng cho nhịp sống hiện đại.
              </p>
              
              <Link href="/products" className="group flex items-center gap-4 border-b border-[#2F2328] pb-2">
                <span className="text-[#2F2328] text-[11px] font-medium tracking-[0.2em] uppercase group-hover:text-[#A63D63] transition-colors">Khám phá</span>
                <ArrowRight className="w-3 h-3 text-[#2F2328] group-hover:text-[#A63D63] group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full lg:w-7/12 relative aspect-[4/3] lg:aspect-[16/11]"
            >
               <Image 
                 src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80" 
                 alt="Luxury Fashion Edit" 
                 fill 
                 className="object-cover"
                 priority
               />
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.4 }}
                 className="absolute -bottom-8 -left-8 w-48 aspect-[3/4] bg-white p-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hidden lg:block"
               >
                 <div className="relative w-full h-full">
                   <Image src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400&q=80" alt="Detail" fill className="object-cover" />
                 </div>
               </motion.div>
            </motion.div>

          </div>
        </section>

        {/* CATEGORY MOSAIC - RESTRAINED */}
        <section className="w-full max-w-[1440px] px-4 md:px-8 lg:px-12 py-20 mt-10">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] tracking-[0.2em] text-[#8D7C77] uppercase mb-4 block">Danh mục</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2F2328]">Tuyển chọn</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Lớn bên trái */}
            <Link href="/products" className="md:col-span-7 aspect-[4/3] relative group overflow-hidden bg-[#F7F1EC]">
               <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="Fashion" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-1000" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <h3 className="font-serif text-3xl text-white drop-shadow-sm mb-2">Thời trang</h3>
                 <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 inline-block">Xem thêm</span>
               </div>
            </Link>
            {/* Nhỏ bên phải */}
            <div className="md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
              <Link href="/products" className="row-span-1 relative group overflow-hidden bg-[#E9D6CC]">
                 <Image src="https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80" alt="Beauty" fill className="object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-1000" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <h3 className="font-serif text-2xl text-[#2F2328] bg-white/70 backdrop-blur-md px-6 py-2 rounded-sm group-hover:bg-white/90 transition-colors">Làm đẹp</h3>
                 </div>
              </Link>
              <Link href="/products" className="row-span-1 relative group overflow-hidden bg-[#F7F1EC]">
                 <Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80" alt="Home" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-1000" />
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <h3 className="font-serif text-2xl text-white bg-[#2F2328]/50 backdrop-blur-sm px-6 py-2 rounded-sm group-hover:bg-[#2F2328]/70 transition-colors">Nhà cửa</h3>
                 </div>
              </Link>
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS - REFINED GRID */}
        <section className="w-full max-w-[1440px] px-4 md:px-8 lg:px-12 py-16 md:py-24 border-t border-[#F7F1EC]">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-[#2F2328] mb-4">Sản phẩm mới</h2>
            <Link href="/products" className="text-[#8D7C77] hover:text-[#A63D63] text-[10px] font-medium tracking-[0.2em] uppercase transition-colors">
              Khám phá toàn bộ
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 max-w-6xl mx-auto">
            {mockProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* THE EDIT - QUIET LUXURY */}
        <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-24">
          <div className="bg-[#F7F1EC] px-6 py-16 md:p-24 flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative overflow-hidden">
             
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="w-full md:w-1/2 relative aspect-square md:aspect-[4/5] max-w-md mx-auto"
             >
                <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&q=80" alt="Editorial" fill className="object-cover" />
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="w-full md:w-1/2 max-w-sm"
             >
               <span className="text-[10px] tracking-[0.3em] uppercase text-[#8D7C77] mb-6 block font-medium">Tiêu điểm</span>
               <h2 className="font-serif text-4xl text-[#2F2328] leading-[1.2] mb-8">
                 Sự hoàn mỹ trong từng chi tiết nhỏ.
               </h2>
               <p className="text-[#8D7C77] text-[14px] mb-10 leading-relaxed font-light">
                 Mỗi sản phẩm đều được chọn lọc kỹ lưỡng, không chỉ vì vẻ đẹp bên ngoài mà còn vì chất lượng bền bỉ và sự tinh tế trong thiết kế.
               </p>
               <Link href="/products" className="inline-flex items-center gap-3 border-b border-[#E9D6CC] pb-2 text-[#2F2328] font-medium tracking-[0.15em] uppercase text-[11px] hover:border-[#2F2328] transition-all group">
                 Đọc thêm <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
               </Link>
             </motion.div>
          </div>
        </section>

        {/* SHOP BY MOOD - LIGHTER & FINER */}
        <section className="w-full max-w-[1440px] px-4 md:px-8 lg:px-12 py-20">
           <div className="flex flex-col lg:flex-row gap-6 h-[400px]">
              {[
                { name: "Minimalist", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" },
                { name: "City Living", img: "https://images.unsplash.com/photo-1475179532958-3602fc5ce64a?w=600&q=80" },
                { name: "Soft Neutrals", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80" },
              ].map((mood, idx) => (
                 <Link href="/products" key={idx} className="flex-1 relative group overflow-hidden bg-[#F7F1EC]">
                    <Image src={mood.img} alt={mood.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
                       <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#2F2328] bg-white/90 backdrop-blur-md px-6 py-2 shadow-sm">{mood.name}</span>
                    </div>
                 </Link>
              ))}
           </div>
        </section>

        {/* LIMITED OFFER - CONTROLLED DARK SECTION */}
        <section className="w-full bg-[#2F2328] text-white py-24 my-10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-[#D8BBB0] text-[10px] uppercase tracking-[0.3em] mb-4 block">Bộ sưu tập giới hạn</span>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Midnight Edit</h2>
              <p className="text-white/60 text-[14px] font-light max-w-md">Những thiết kế mang tông màu trầm ấm, tôn lên vẻ sang trọng và bí ẩn.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80", name: "Oud & Wood", brand: "MAISON 28", price: "1.450.000₫" },
                { img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80", name: "Matte Black Vase", brand: "KANSO", price: "590.000₫" },
                { img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80", name: "Leather Tote", brand: "NOLA", price: "2.290.000₫" },
                { img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80", name: "Desk Organizer", brand: "MORI", price: "890.000₫" },
              ].map((item, idx) => (
                <div key={idx} className="group cursor-pointer text-center">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5 mb-4">
                     <Image src={item.img} alt={item.name} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700" />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#D8BBB0] block mb-1">{item.brand}</span>
                  <h4 className="font-light text-white text-[13px] mb-1">{item.name}</h4>
                  <span className="text-white/70 text-[12px]">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND DISCOVERY - QUIET */}
        <section className="w-full max-w-[1000px] mx-auto px-4 md:px-8 py-20 border-b border-[#F7F1EC]">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-40 hover:opacity-100 transition-opacity duration-700">
            {["NOLA", "MORI", "ASTER", "LINEA", "KANSO", "MAVE", "MAISON 28"].map((brand) => (
              <span key={brand} className="font-serif text-xl md:text-2xl text-[#2F2328] uppercase tracking-[0.2em] hover:text-[#A63D63] transition-colors cursor-pointer">
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* NEWSLETTER - ELEGANT */}
        <section className="w-full py-24 md:py-32 relative">
          <div className="max-w-xl mx-auto text-center px-4 relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl text-[#2F2328] mb-4">
              Nhận thông tin từ Senvia
            </h2>
            <p className="text-[#8D7C77] text-[14px] mb-10 font-light">
              Đăng ký để cập nhật những bộ sưu tập mới nhất và ưu đãi đặc quyền.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 w-full max-w-md mx-auto border-b border-[#2F2328]">
              <input 
                type="email" 
                placeholder="Địa chỉ email" 
                className="flex-1 bg-transparent px-4 py-3 border-none outline-none font-sans text-[13px] text-[#2F2328] placeholder-[#8D7C77]"
              />
              <button className="text-[#2F2328] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.15em] hover:text-[#A63D63] transition-colors">
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
