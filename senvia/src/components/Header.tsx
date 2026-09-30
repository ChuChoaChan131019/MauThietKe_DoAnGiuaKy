"use client";
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
      <div className={`w-full bg-white transition-all duration-300 sticky top-0 z-50 border-b border-[#E8CFC4]/50 ${isScrolled ? 'shadow-sm py-3' : 'py-5'}`}>
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
