const fs = require('fs');
const path = require('path');

const files = {
  'src/components/Header.tsx': `"use client";
import Link from "next/link";
import { Heart, User, ShoppingCart, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full flex flex-col z-50">
      {/* TOP BAR - Espresso */}
      <div className="w-full bg-[#2F2328] text-white text-[11px] py-2 px-4 md:px-8 flex justify-between items-center tracking-wide font-sans">
        <div className="flex-1 hidden md:block opacity-90">Miễn phí vận chuyển từ 499.000đ</div>
        <div className="flex-1 text-center font-medium text-[#E8CFC4]">Senvia Edit — Lựa chọn mới mỗi tuần</div>
        <div className="flex-1 hidden md:flex justify-end gap-6 opacity-90">
          <Link href="#" className="hover:text-[#A63D63] transition-colors duration-300">Theo dõi đơn hàng</Link>
          <Link href="#" className="hover:text-[#A63D63] transition-colors duration-300">Trợ giúp</Link>
        </div>
      </div>

      {/* MAIN HEADER - White/Ivory */}
      <div className={\`w-full bg-white transition-all duration-300 sticky top-0 z-50 border-b border-[#E8CFC4]/50 \${isScrolled ? 'shadow-sm py-3' : 'py-5'}\`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <span className="font-serif text-3xl font-bold tracking-[0.15em] text-[#2F2328]">SEN</span>
            <span className="font-serif text-3xl font-bold tracking-[0.15em] text-[#A63D63]">VIA</span>
          </Link>

          {/* SEARCH */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Tìm sản phẩm, thương hiệu..." 
              className="w-full bg-[#F7F1EC] text-[#2F2328] placeholder-[#8D7C77] px-5 py-2.5 outline-none text-[13px] rounded-none focus:ring-1 focus:ring-[#A63D63] transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F2328] hover:text-[#A63D63]">
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          {/* ICONS */}
          <div className="flex items-center gap-6 text-[#2F2328]">
            <button className="md:hidden text-[#2F2328]"><Search className="w-[20px] h-[20px]" /></button>
            <Link href="/account/wishlist" className="hover:text-[#A63D63] transition-colors duration-300 relative">
              <Heart className="w-[20px] h-[20px]" strokeWidth={1.5} />
            </Link>
            <Link href="/login" className="hover:text-[#A63D63] transition-colors duration-300">
              <User className="w-[20px] h-[20px]" strokeWidth={1.5} />
            </Link>
            <Link href="/cart" className="hover:text-[#A63D63] transition-colors duration-300 relative flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCart className="w-[20px] h-[20px]" strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-1.5 bg-[#A63D63] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">3</span>
              </div>
            </Link>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <nav className="max-w-[1440px] mx-auto px-4 md:px-8 mt-4 hidden md:block">
          <ul className="flex items-center gap-8 text-[12px] font-medium text-[#2F2328] uppercase tracking-wide">
            {['Mới về', 'Bán chạy', 'Thời trang', 'Làm đẹp', 'Nhà cửa', 'Công nghệ', 'Lifestyle', 'Phụ kiện', 'Thương hiệu'].map((item) => (
               <li key={item} className="group relative overflow-hidden">
                 <Link href="/products" className="hover:text-[#A63D63] transition-colors duration-300 py-1 inline-block">
                   {item}
                 </Link>
                 <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#A63D63] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
               </li>
            ))}
            <li className="group relative">
              <Link href="/products" className="text-[#A63D63] py-1 inline-block font-bold hover:opacity-80 transition-opacity">SALE</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
`,
  'src/components/ProductCard.tsx': `"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="group flex flex-col w-full h-full relative">
      <Link href={\`/products/\${product.id}\`} className="relative block aspect-[4/5] bg-[#F7F1EC] overflow-hidden mb-3">
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          className="object-cover p-3 group-hover:scale-[1.025] transition-transform duration-500 ease-out"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.isNew && <span className="bg-white text-[#2F2328] text-[10px] font-bold uppercase px-2 py-1 shadow-sm">Mới</span>}
          {product.discount > 0 && <span className="bg-[#A63D63] text-white text-[10px] font-bold uppercase px-2 py-1 shadow-sm">-{product.discount}%</span>}
        </div>

        {/* Hover Action */}
        <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-sm py-2.5 text-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10 shadow-sm border border-[#E8CFC4]/50">
          <button className="w-full text-[#A63D63] text-[11px] font-bold uppercase tracking-widest hover:text-[#2F2328] transition-colors">
            Thêm nhanh
          </button>
        </div>

        <button className="absolute top-2 right-2 text-[#8D7C77] hover:text-[#A63D63] opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-white/80 p-1.5 rounded-full">
          <Heart className="w-[16px] h-[16px]" strokeWidth={2} />
        </button>
      </Link>

      <div className="flex flex-col text-left">
        <span className="text-[11px] font-medium uppercase text-[#8D7C77] mb-1">{product.brand}</span>
        <Link href={\`/products/\${product.id}\`} className="text-[14px] text-[#2F2328] font-medium truncate w-full hover:text-[#A63D63] transition-colors mb-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-[#A63D63]">{product.price.toLocaleString('vi-VN')}₫</span>
          {product.oldPrice && (
            <span className="text-[12px] text-[#8D7C77] line-through">{product.oldPrice.toLocaleString('vi-VN')}₫</span>
          )}
        </div>
      </div>
    </div>
  );
}
`,
  'src/app/page.tsx': `"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

// Reliable Image Data
const MOCK_PRODUCTS = [
  { id: 1, name: "Canvas Tote Bag", brand: "NOLA", price: 1190000, isNew: true, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80" },
  { id: 2, name: "Linen Shirt", brand: "MORI", price: 890000, discount: 15, oldPrice: 1050000, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80" },
  { id: 3, name: "Brass Table Lamp", brand: "KANSO", price: 1290000, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
  { id: 4, name: "Signature Parfum", brand: "MAISON 28", price: 2490000, isNew: true, image: "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=600&q=80" },
  { id: 5, name: "Ceramic Vase", brand: "FORM", price: 690000, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80" },
  { id: 6, name: "Wall Frame", brand: "ASTER", price: 790000, image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80" },
  { id: 7, name: "Leather Wallet", brand: "NOLA", price: 950000, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80" },
  { id: 8, name: "Desk Organizer", brand: "MORI", price: 550000, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80" }
];

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="w-full bg-white flex flex-col items-center">
        
        {/* 02 HERO - 60/40 COMPOSITION */}
        <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 h-auto md:h-[660px]">
          <div className="flex flex-col md:flex-row w-full h-full">
            
            {/* Left 60%: Large Lifestyle Image */}
            <div className="w-full md:w-[60%] relative h-[400px] md:h-full">
              <Image 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80" 
                alt="Senvia Luxury Lifestyle" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            
            {/* Right 40%: Soft Blush Box with Text */}
            <div className="w-full md:w-[40%] bg-[#E8CFC4] h-full flex flex-col justify-center px-8 lg:px-16 py-12 relative">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#A63D63] mb-6">NEW SEASON / SENVIA</span>
              <h1 className="font-serif text-[50px] lg:text-[64px] leading-[1.1] text-[#2F2328] mb-6">
                Chọn điều<br />hợp với bạn.
              </h1>
              <p className="text-[#2F2328] text-[15px] leading-relaxed mb-10 opacity-80 max-w-sm">
                Thời trang, làm đẹp, không gian sống và những lựa chọn mới được tuyển chọn mỗi ngày.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/products" className="bg-[#A63D63] text-white px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-[#2F2328] transition-colors w-full sm:w-auto text-center">
                  Mua sắm ngay
                </Link>
                <Link href="/products" className="text-[#2F2328] text-[12px] font-bold uppercase tracking-widest hover:text-[#A63D63] transition-colors border-b border-[#2F2328] hover:border-[#A63D63] pb-0.5">
                  Khám phá hàng mới →
                </Link>
              </div>

              {/* Overlapping Product Thumbnail */}
              <div className="hidden xl:block absolute -left-16 bottom-16 w-32 aspect-[3/4] bg-white border-4 border-white shadow-lg">
                <Image src="https://images.unsplash.com/photo-1594035910387-fea47714263f?w=400&q=80" alt="Featured Item" fill className="object-cover p-2 bg-[#F7F1EC]" />
              </div>
            </div>
          </div>
        </section>

        {/* 03 POPULAR CATEGORIES */}
        <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-20">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-[24px] font-bold text-[#2F2328]">Mua theo danh mục</h2>
            <Link href="/products" className="text-[12px] font-bold uppercase text-[#A63D63] hover:text-[#2F2328] transition-colors">Xem tất cả →</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Thời trang', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80' },
              { name: 'Làm đẹp', img: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=400&q=80' },
              { name: 'Nhà cửa', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80' },
              { name: 'Công nghệ', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
              { name: 'Phụ kiện', img: 'https://images.unsplash.com/photo-1599643478524-fb66f7aa26d5?w=400&q=80' },
              { name: 'Lifestyle', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80' },
            ].map((cat, i) => (
              <Link href="/products" key={i} className="group flex flex-col items-center cursor-pointer">
                <div className="w-full aspect-[4/5] relative bg-[#F7F1EC] mb-4 overflow-hidden">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <span className="text-[14px] font-medium text-[#2F2328] group-hover:text-[#A63D63] transition-colors">{cat.name} <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        {/* 04 NEW ARRIVALS */}
        <section className="w-full bg-[#F7F1EC] py-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-[24px] font-bold text-[#2F2328]">Mới trên Senvia</h2>
              <Link href="/products" className="text-[12px] font-bold uppercase text-[#A63D63] hover:text-[#2F2328] transition-colors">Tất cả hàng mới →</Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_PRODUCTS.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* 05 LARGE EDITORIAL CAMPAIGN */}
        <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-20">
          <div className="flex flex-col md:flex-row bg-[#E8CFC4] w-full min-h-[500px]">
             <div className="w-full md:w-1/2 relative min-h-[300px]">
               <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&q=80" alt="Editorial" fill className="object-cover" />
             </div>
             <div className="w-full md:w-1/2 flex flex-col justify-center px-8 lg:px-20 py-12">
               <span className="text-[11px] font-bold uppercase tracking-widest text-[#A63D63] mb-6">THE SENVIA EDIT</span>
               <h2 className="font-serif text-[40px] md:text-[48px] leading-[1.1] text-[#2F2328] mb-6">
                 Những lựa chọn<br />đáng để giữ lâu hơn.
               </h2>
               <div className="w-12 h-1 bg-[#A63D63] mb-6"></div>
               <p className="text-[#2F2328] opacity-80 text-[15px] leading-relaxed mb-10">
                 Bộ sưu tập tôn vinh chất liệu và phom dáng. Đầu tư vào những thiết kế không bị lỗi thời theo năm tháng.
               </p>
               <Link href="/products" className="text-[#A63D63] text-[12px] font-bold uppercase tracking-widest hover:text-[#2F2328] transition-colors">
                 Xem tuyển chọn →
               </Link>
             </div>
          </div>
        </section>

        {/* 06 BEST SELLERS */}
        <section className="w-full bg-white py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-[24px] font-bold text-[#2F2328]">Được yêu thích</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 border border-[#D8BBB0] flex items-center justify-center text-[#2F2328] hover:border-[#A63D63] hover:text-[#A63D63] transition-colors">←</button>
                <button className="w-8 h-8 border border-[#D8BBB0] flex items-center justify-center text-[#2F2328] hover:border-[#A63D63] hover:text-[#A63D63] transition-colors">→</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_PRODUCTS.slice(4, 8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* 07 PROMOTIONAL STRIP */}
        <section className="w-full bg-[#2F2328] py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
            
            <div className="md:w-1/2 flex flex-col items-start">
              <h2 className="text-[28px] font-bold text-white mb-2">SENVIA PRIVATE SALE</h2>
              <p className="text-[#E8CFC4] text-[16px] mb-8">Ưu đãi đến 30% cho tuyển chọn tuần này.</p>
              <Link href="/products" className="bg-[#A63D63] text-white px-8 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-[#E8CFC4] hover:text-[#2F2328] transition-colors">
                KHÁM PHÁ →
              </Link>
            </div>
            
            <div className="md:w-1/2 flex gap-4 w-full overflow-x-auto no-scrollbar">
              <div className="w-1/3 min-w-[140px] aspect-[4/5] relative bg-white border-2 border-[#A63D63]">
                 <Image src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80" alt="Promo 1" fill className="object-cover p-2" />
              </div>
              <div className="w-1/3 min-w-[140px] aspect-[4/5] relative bg-white">
                 <Image src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" alt="Promo 2" fill className="object-cover p-2" />
              </div>
              <div className="w-1/3 min-w-[140px] aspect-[4/5] relative bg-white">
                 <Image src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80" alt="Promo 3" fill className="object-cover p-2" />
              </div>
            </div>
            
          </div>
        </section>

        {/* 08 SHOP BY LIFESTYLE */}
        <section className="w-full bg-[#F7F1EC] py-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <h2 className="text-[24px] font-bold text-[#2F2328] mb-10">Chọn theo phong cách</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
              {/* Large Panel */}
              <Link href="/products" className="relative group overflow-hidden bg-black h-[300px] md:h-full">
                <Image src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&q=80" alt="Everyday Minimal" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="font-bold text-[24px] mb-2">Everyday Minimal</h3>
                  <span className="text-[12px] uppercase tracking-widest border-b border-white pb-1 hover:text-[#E8CFC4] hover:border-[#E8CFC4] transition-colors font-medium">Khám phá</span>
                </div>
              </Link>
              
              {/* Two smaller panels */}
              <div className="flex flex-col gap-6 h-[500px] md:h-full">
                <Link href="/products" className="relative group overflow-hidden bg-black h-1/2">
                  <Image src="https://images.unsplash.com/photo-1475179532958-3602fc5ce64a?w=800&q=80" alt="City Essentials" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="font-bold text-[20px] mb-2">City Essentials</h3>
                    <span className="text-[11px] uppercase tracking-widest border-b border-white pb-1 font-medium hover:text-[#E8CFC4] transition-colors">Mua ngay</span>
                  </div>
                </Link>
                <Link href="/products" className="relative group overflow-hidden bg-black h-1/2">
                  <Image src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80" alt="Soft Living" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="font-bold text-[20px] mb-2">Soft Living</h3>
                    <span className="text-[11px] uppercase tracking-widest border-b border-white pb-1 font-medium hover:text-[#E8CFC4] transition-colors">Mua ngay</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 09 BRAND SELECTION */}
        <section className="w-full bg-[#E8CFC4]/30 py-16 border-y border-[#D8BBB0]/30">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col items-center">
            <h2 className="text-[14px] uppercase tracking-widest text-[#8D7C77] font-bold mb-10">Thương hiệu nổi bật</h2>
            <div className="flex flex-wrap justify-center gap-10 md:gap-16 opacity-60">
              {['NOLA', 'MORI', 'ASTER', 'KANSO', 'LINEA', 'MAISON 28'].map(brand => (
                <span key={brand} className="font-serif text-[24px] md:text-[28px] text-[#2F2328] font-bold tracking-widest cursor-pointer hover:text-[#A63D63] transition-colors">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 10 FOR YOU */}
        <section className="w-full bg-white py-20">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <h2 className="text-[24px] font-bold text-[#2F2328] mb-10 text-center">Dành cho bạn</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
               {MOCK_PRODUCTS.slice(0, 5).map(p => (
                 <ProductCard key={p.id} product={p} />
               ))}
            </div>
          </div>
        </section>

        {/* 11 NEWSLETTER */}
        <section className="w-full bg-[#E8CFC4] py-20">
          <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
            <h2 className="font-serif text-[36px] text-[#2F2328] mb-4">Senvia, trong hộp thư của bạn.</h2>
            <p className="text-[#2F2328] text-[15px] mb-8 opacity-80">Hàng mới, ưu đãi và những lựa chọn đáng chú ý.</p>
            
            <form className="w-full max-w-md flex bg-white p-1">
              <input 
                type="email" 
                placeholder="Địa chỉ email" 
                className="flex-1 px-4 py-3 bg-transparent text-[#2F2328] placeholder-[#8D7C77] outline-none text-[14px]"
              />
              <button className="bg-[#A63D63] text-white px-6 py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-[#2F2328] transition-colors">
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
`,
  'src/app/products/page.tsx': `"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

const MOCK_PRODUCTS = [
  { id: 1, name: "Canvas Tote Bag", brand: "NOLA", price: 1190000, isNew: true, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80" },
  { id: 2, name: "Linen Shirt", brand: "MORI", price: 890000, discount: 15, oldPrice: 1050000, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80" },
  { id: 3, name: "Brass Table Lamp", brand: "KANSO", price: 1290000, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
  { id: 4, name: "Signature Parfum", brand: "MAISON 28", price: 2490000, isNew: true, image: "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=600&q=80" },
  { id: 5, name: "Ceramic Vase", brand: "FORM", price: 690000, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80" },
  { id: 6, name: "Wall Frame", brand: "ASTER", price: 790000, image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80" },
  { id: 7, name: "Leather Wallet", brand: "NOLA", price: 950000, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80" },
  { id: 8, name: "Desk Organizer", brand: "MORI", price: 550000, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80" }
];

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="w-full bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-[#E8CFC4] pb-6">
             <div>
               <div className="text-[11px] text-[#8D7C77] uppercase tracking-widest mb-4">Trang chủ / Sản phẩm</div>
               <h1 className="text-[32px] font-bold text-[#2F2328]">Tất cả sản phẩm <span className="text-[16px] text-[#8D7C77] font-normal ml-2">(128)</span></h1>
             </div>
             
             <div className="mt-4 md:mt-0">
               <select className="border border-[#D8BBB0] bg-white text-[#2F2328] text-[13px] font-bold px-4 py-2 outline-none focus:border-[#A63D63]">
                 <option>Sắp xếp: Mới nhất</option>
                 <option>Giá: Thấp đến cao</option>
                 <option>Giá: Cao xuống thấp</option>
               </select>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
             
             {/* LEFT FILTER - 240px */}
             <aside className="w-full lg:w-[240px] flex-shrink-0">
                <div className="flex flex-col gap-8 sticky top-24">
                   
                   <div>
                     <h3 className="text-[14px] font-bold text-[#2F2328] mb-4">Danh mục</h3>
                     <ul className="space-y-3 text-[14px] text-[#2F2328]">
                       <li className="font-bold text-[#A63D63] cursor-pointer">Tất cả sản phẩm</li>
                       <li className="hover:text-[#A63D63] hover:bg-[#E8CFC4]/30 px-2 -mx-2 py-1 rounded transition-colors cursor-pointer">Thời trang</li>
                       <li className="hover:text-[#A63D63] hover:bg-[#E8CFC4]/30 px-2 -mx-2 py-1 rounded transition-colors cursor-pointer">Làm đẹp</li>
                       <li className="hover:text-[#A63D63] hover:bg-[#E8CFC4]/30 px-2 -mx-2 py-1 rounded transition-colors cursor-pointer">Nhà cửa</li>
                       <li className="hover:text-[#A63D63] hover:bg-[#E8CFC4]/30 px-2 -mx-2 py-1 rounded transition-colors cursor-pointer">Công nghệ</li>
                     </ul>
                   </div>

                   <div className="border-t border-[#E8CFC4] pt-8">
                     <h3 className="text-[14px] font-bold text-[#2F2328] mb-4">Thương hiệu</h3>
                     <ul className="space-y-3 text-[14px] text-[#2F2328]">
                       <li className="hover:text-[#A63D63] cursor-pointer flex justify-between items-center"><span className="flex items-center gap-2"><input type="checkbox" className="accent-[#A63D63]" /> NOLA</span> <span className="text-[12px] text-[#8D7C77]">(12)</span></li>
                       <li className="hover:text-[#A63D63] cursor-pointer flex justify-between items-center"><span className="flex items-center gap-2"><input type="checkbox" className="accent-[#A63D63]" /> MORI</span> <span className="text-[12px] text-[#8D7C77]">(8)</span></li>
                       <li className="hover:text-[#A63D63] cursor-pointer flex justify-between items-center"><span className="flex items-center gap-2"><input type="checkbox" className="accent-[#A63D63]" /> MAISON 28</span> <span className="text-[12px] text-[#8D7C77]">(15)</span></li>
                     </ul>
                   </div>

                </div>
             </aside>

             {/* RIGHT GRID - 4 Cols */}
             <div className="flex-1">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {MOCK_PRODUCTS.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                  {MOCK_PRODUCTS.map((p) => (
                    <ProductCard key={p.id + 10} product={p} />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center mt-16 border-t border-[#E8CFC4] pt-8">
                   <div className="flex gap-2">
                     <button className="w-10 h-10 border border-[#D8BBB0] flex items-center justify-center text-[#2F2328] hover:border-[#A63D63] hover:text-[#A63D63] transition-colors">1</button>
                     <button className="w-10 h-10 border border-[#A63D63] bg-[#A63D63] text-white flex items-center justify-center font-bold">2</button>
                     <button className="w-10 h-10 border border-[#D8BBB0] flex items-center justify-center text-[#2F2328] hover:border-[#A63D63] hover:text-[#A63D63] transition-colors">3</button>
                     <button className="w-10 h-10 border border-[#D8BBB0] flex items-center justify-center text-[#2F2328] hover:border-[#A63D63] hover:text-[#A63D63] transition-colors">→</button>
                   </div>
                </div>
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
      <main className="w-full bg-white py-12 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          
          <h1 className="text-[32px] font-bold text-[#2F2328] mb-10 border-b border-[#E8CFC4] pb-6">Giỏ hàng của bạn <span className="text-[16px] font-normal text-[#8D7C77]">(2 sản phẩm)</span></h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              
              {/* Item 1 */}
              <div className="flex gap-6 py-6 border-b border-[#E8CFC4] relative">
                 <button className="absolute top-6 right-0 text-[#8D7C77] hover:text-[#A63D63]"><X className="w-5 h-5" /></button>
                 <div className="w-24 aspect-[4/5] bg-[#F7F1EC] relative border border-[#D8BBB0]/50 shrink-0">
                   <Image src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80" alt="Bag" fill className="object-cover p-2" />
                 </div>
                 <div className="flex flex-col justify-between py-1">
                   <div>
                     <div className="text-[11px] font-bold uppercase tracking-widest text-[#8D7C77] mb-1">NOLA</div>
                     <div className="text-[16px] font-bold text-[#2F2328] mb-2">Canvas Tote Bag</div>
                     <div className="text-[15px] font-bold text-[#A63D63]">1.190.000đ</div>
                   </div>
                   <div className="flex items-center border border-[#D8BBB0] w-fit">
                     <button className="w-8 h-8 flex items-center justify-center text-[#2F2328] hover:text-[#A63D63] hover:bg-[#F7F1EC]"><Minus className="w-3 h-3" /></button>
                     <span className="w-10 text-center font-bold text-[14px] text-[#2F2328] border-l border-r border-[#D8BBB0] h-8 flex items-center justify-center">1</span>
                     <button className="w-8 h-8 flex items-center justify-center text-[#2F2328] hover:text-[#A63D63] hover:bg-[#F7F1EC]"><Plus className="w-3 h-3" /></button>
                   </div>
                 </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-6 py-6 border-b border-[#E8CFC4] relative">
                 <button className="absolute top-6 right-0 text-[#8D7C77] hover:text-[#A63D63]"><X className="w-5 h-5" /></button>
                 <div className="w-24 aspect-[4/5] bg-[#F7F1EC] relative border border-[#D8BBB0]/50 shrink-0">
                   <Image src="https://images.unsplash.com/photo-1594035910387-fea47714263f?w=400&q=80" alt="Perfume" fill className="object-cover p-2" />
                 </div>
                 <div className="flex flex-col justify-between py-1">
                   <div>
                     <div className="text-[11px] font-bold uppercase tracking-widest text-[#8D7C77] mb-1">MAISON 28</div>
                     <div className="text-[16px] font-bold text-[#2F2328] mb-2">Signature Parfum</div>
                     <div className="text-[15px] font-bold text-[#A63D63]">2.490.000đ</div>
                   </div>
                   <div className="flex items-center border border-[#D8BBB0] w-fit">
                     <button className="w-8 h-8 flex items-center justify-center text-[#2F2328] hover:text-[#A63D63] hover:bg-[#F7F1EC]"><Minus className="w-3 h-3" /></button>
                     <span className="w-10 text-center font-bold text-[14px] text-[#2F2328] border-l border-r border-[#D8BBB0] h-8 flex items-center justify-center">1</span>
                     <button className="w-8 h-8 flex items-center justify-center text-[#2F2328] hover:text-[#A63D63] hover:bg-[#F7F1EC]"><Plus className="w-3 h-3" /></button>
                   </div>
                 </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
               <div className="bg-[#E8CFC4]/30 p-8 border border-[#D8BBB0]/50">
                  <h2 className="text-[20px] font-bold text-[#2F2328] border-b border-[#D8BBB0] pb-4 mb-6">Tóm tắt đơn hàng</h2>
                  
                  <div className="flex justify-between mb-4 text-[#2F2328] text-[14px]">
                    <span>Tạm tính</span>
                    <span className="font-bold">3.680.000đ</span>
                  </div>
                  <div className="flex justify-between mb-6 text-[#2F2328] text-[14px] border-b border-[#D8BBB0] pb-6">
                    <span>Phí vận chuyển</span>
                    <span className="font-bold text-[#A63D63]">Miễn phí</span>
                  </div>
                  
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-[14px] font-bold text-[#2F2328]">Tổng cộng</span>
                    <span className="text-[24px] font-bold text-[#A63D63]">3.680.000đ</span>
                  </div>

                  <Link href="/checkout" className="block w-full bg-[#A63D63] text-white text-center py-4 font-bold uppercase tracking-widest text-[13px] hover:bg-[#2F2328] transition-colors">
                    Tiến hành thanh toán
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
