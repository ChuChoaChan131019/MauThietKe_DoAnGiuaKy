const fs = require('fs');
const path = require('path');

const files = {
  'src/components/Header.tsx': `import Link from "next/link";
import { Search, Heart, User, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full flex flex-col">
      {/* LEVEL 1 — UTILITY BAR */}
      <div className="w-full bg-[#3A2A2E] text-white text-xs py-1.5 px-4 md:px-8 flex justify-between items-center tracking-wide font-sans">
        <div className="flex-1 hidden md:block">Miễn phí vận chuyển cho đơn từ 499.000đ</div>
        <div className="flex-1 text-center font-medium">Senvia Edit — Tuyển chọn mới mỗi tuần</div>
        <div className="flex-1 hidden md:flex justify-end gap-4 text-white/80">
          <Link href="#" className="hover:text-white transition-colors">Theo dõi đơn hàng</Link>
          <Link href="#" className="hover:text-white transition-colors">Trợ giúp</Link>
          <Link href="#" className="hover:text-white transition-colors">Kênh người bán</Link>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="w-full bg-white px-4 md:px-8 py-5 md:py-6 flex items-center justify-between border-b border-[#F6EFEA]">
        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-1 group">
          <span className="font-serif text-3xl md:text-4xl tracking-widest text-[#3A2A2E]">SEN</span>
          <span className="font-serif text-3xl md:text-4xl tracking-widest text-[#AC3B61]">VIA</span>
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-12">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Tìm sản phẩm, thương hiệu hoặc phong cách..." 
              className="w-full bg-[#F6EFEA] text-[#3A2A2E] placeholder-[#8E7F7B] px-5 py-3 rounded-none border border-transparent focus:border-[#D9B8AE] focus:outline-none focus:ring-1 focus:ring-[#D9B8AE] transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A2A2E]">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-5 md:gap-7 text-[#3A2A2E]">
          <button className="md:hidden"><Search className="w-5 h-5" /></button>
          <Link href="/account/wishlist" className="hover:text-[#AC3B61] transition-colors"><Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /></Link>
          <Link href="/login" className="hover:text-[#AC3B61] transition-colors"><User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /></Link>
          <Link href="/cart" className="hover:text-[#AC3B61] transition-colors relative">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-2 bg-[#AC3B61] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </Link>
        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <nav className="w-full bg-white px-4 md:px-8 border-b border-[#F6EFEA] overflow-x-auto no-scrollbar">
        <ul className="flex items-center gap-8 min-w-max py-4 text-sm font-medium text-[#3A2A2E] uppercase tracking-wider">
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Mới về</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Bán chạy</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Thời trang</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Làm đẹp</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Nhà cửa</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Công nghệ</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Lifestyle</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Phụ kiện</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Quà tặng</Link></li>
          <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Thương hiệu</Link></li>
          <li><Link href="/products" className="text-[#AC3B61] font-bold">Sale</Link></li>
        </ul>
      </nav>
    </header>
  );
}`,
  'src/components/Footer.tsx': `import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#3A2A2E] text-white pt-16 pb-8 px-4 md:px-8 lg:px-12 font-sans mt-24">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
        
        {/* Col 1 */}
        <div className="lg:col-span-1">
          <div className="font-serif text-3xl tracking-widest mb-6">
            <span className="text-white">SEN</span><span className="text-[#AC3B61]">VIA</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-6 pr-4">
            Khám phá những món đồ được tuyển chọn cho phong cách, không gian và nhịp sống của bạn.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-serif text-lg mb-5 text-[#E8CFC4]">Mua sắm</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Mới về</Link></li>
            <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Bán chạy</Link></li>
            <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Thương hiệu</Link></li>
            <li><Link href="/products" className="hover:text-[#AC3B61] transition-colors">Sale</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-serif text-lg mb-5 text-[#E8CFC4]">Hỗ trợ</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li><Link href="#" className="hover:text-[#AC3B61] transition-colors">Trung tâm trợ giúp</Link></li>
            <li><Link href="#" className="hover:text-[#AC3B61] transition-colors">Theo dõi đơn hàng</Link></li>
            <li><Link href="#" className="hover:text-[#AC3B61] transition-colors">Vận chuyển</Link></li>
            <li><Link href="#" className="hover:text-[#AC3B61] transition-colors">Đổi trả</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="font-serif text-lg mb-5 text-[#E8CFC4]">Về Senvia</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li><Link href="#" className="hover:text-[#AC3B61] transition-colors">Giới thiệu</Link></li>
            <li><Link href="#" className="hover:text-[#AC3B61] transition-colors">Tuyển dụng</Link></li>
            <li><Link href="#" className="hover:text-[#AC3B61] transition-colors">Điều khoản</Link></li>
            <li><Link href="#" className="hover:text-[#AC3B61] transition-colors">Quyền riêng tư</Link></li>
          </ul>
        </div>

        {/* Col 5 */}
        <div>
          <h4 className="font-serif text-lg mb-5 text-[#E8CFC4]">Theo dõi chúng tôi</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-[#AC3B61] hover:border-[#AC3B61] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-[#AC3B61] hover:border-[#AC3B61] transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            {/* TikTok Icon placeholder using text since lucide doesn't have it standard without third party */}
            <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-[#AC3B61] hover:border-[#AC3B61] transition-colors text-xs font-bold">
              TK
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-[1480px] mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
        <p>© 2026 Senvia. All rights reserved.</p>
        <div className="flex gap-3">
          <span className="px-2 py-1 border border-white/20">VISA</span>
          <span className="px-2 py-1 border border-white/20">MASTER</span>
          <span className="px-2 py-1 border border-white/20">COD</span>
        </div>
      </div>
    </footer>
  );
}`,
  'src/components/ProductCard.tsx': `import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="group flex flex-col gap-3 font-sans">
      <Link href={\`/products/\${product.id}\`} className="relative aspect-[4/5] bg-[#F6EFEA] overflow-hidden">
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-[#F6EFEA] flex items-center justify-center text-[#8E7F7B] text-xs">
           Img: {product.name}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <span className="bg-white text-[#3A2A2E] text-[10px] uppercase px-2 py-1 tracking-wider">Mới</span>}
          {product.discount > 0 && <span className="bg-[#AC3B61] text-white text-[10px] uppercase px-2 py-1 tracking-wider">-{product.discount}%</span>}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button className="w-full bg-white text-[#3A2A2E] py-3 text-sm font-medium hover:bg-[#AC3B61] hover:text-white transition-colors">
            Thêm nhanh
          </button>
        </div>

        <button className="absolute top-3 right-3 text-[#3A2A2E] hover:text-[#AC3B61] transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </Link>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-widest text-[#8E7F7B]">{product.brand}</span>
        <Link href={\`/products/\${product.id}\`} className="text-[#3A2A2E] text-sm md:text-base font-medium truncate hover:text-[#AC3B61] transition-colors">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-[#3A2A2E]">{product.price.toLocaleString('vi-VN')}₫</span>
          {product.oldPrice && (
            <span className="text-xs text-[#8E7F7B] line-through">{product.oldPrice.toLocaleString('vi-VN')}₫</span>
          )}
        </div>
      </div>
    </div>
  );
}`,
  'src/app/page.tsx': `import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, RefreshCcw, CreditCard, HeadphonesIcon } from "lucide-react";

const mockProducts = [
  { id: 1, name: "Structured Shoulder Bag", brand: "NOLA", price: 1190000, isNew: true },
  { id: 2, name: "Oversized Cotton Shirt", brand: "MORI", price: 890000, discount: 15, oldPrice: 1050000 },
  { id: 3, name: "Minimal Desk Lamp", brand: "KANSO", price: 1290000 },
  { id: 4, name: "Signature Eau de Parfum", brand: "MAISON 28", price: 2490000, isNew: true },
];

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="w-full flex flex-col items-center">
        
        {/* HOMEPAGE HERO */}
        <section className="w-full max-w-[1480px] px-4 md:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch min-h-[650px]">
            {/* Main Image */}
            <div className="lg:col-span-7 bg-[#E8CFC4] relative h-[400px] lg:h-auto flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center text-[#3A2A2E]/50 text-xl font-serif">Editorial Hero Image</div>
            </div>
            
            {/* Typography Column */}
            <div className="lg:col-span-3 flex flex-col justify-center px-4 lg:px-8 py-10 lg:py-0 bg-[#F6EFEA] lg:bg-transparent">
              <div className="mb-6">
                <span className="text-xs font-bold tracking-[0.2em] text-[#AC3B61] uppercase">Senvia / New Edit</span>
              </div>
              <h1 className="font-serif text-5xl lg:text-7xl leading-[1.1] text-[#3A2A2E] mb-6">
                Không cần<br />nhiều.<br />Chỉ cần<br />đúng.
              </h1>
              <p className="text-[#8E7F7B] mb-10 text-base leading-relaxed max-w-sm">
                Khám phá những món đồ được tuyển chọn cho phong cách, không gian và nhịp sống của bạn.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link href="/products" className="bg-[#AC3B61] text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#8A2F4D] transition-colors">
                  Khám phá ngay
                </Link>
                <Link href="/products" className="text-[#3A2A2E] text-sm font-medium hover:text-[#AC3B61] transition-colors flex items-center gap-2 group">
                  Xem hàng mới <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Secondary Image & Meta */}
            <div className="lg:col-span-2 hidden lg:flex flex-col justify-between h-full">
              <div className="bg-[#D9B8AE] h-[45%] w-full relative flex items-center justify-center text-sm text-[#3A2A2E]/60 font-serif">Secondary Img</div>
              <div className="bg-[#F6EFEA] h-[50%] w-full p-6 flex flex-col justify-end">
                <span className="text-xs tracking-widest text-[#8E7F7B] uppercase mb-2">New Arrivals</span>
                <span className="text-2xl font-serif text-[#3A2A2E]">128</span>
                <span className="text-sm text-[#3A2A2E]">Sản phẩm mới</span>
              </div>
            </div>
          </div>
        </section>

        {/* SHOP BY CATEGORY MOSAIC */}
        <section className="w-full max-w-[1480px] px-4 md:px-8 py-16 md:py-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-4xl text-[#3A2A2E]">Mua theo danh mục</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 h-[800px]">
            {/* LARGE LEFT */}
            <Link href="/products" className="col-span-2 row-span-2 bg-[#F6EFEA] relative group overflow-hidden">
               <div className="absolute inset-0 bg-neutral-200" />
               <div className="absolute bottom-0 left-0 p-8">
                 <h3 className="font-serif text-3xl text-white drop-shadow-md">Thời trang</h3>
               </div>
            </Link>
            {/* CENTER TOP */}
            <Link href="/products" className="col-span-2 md:col-span-1 lg:col-span-2 row-span-1 bg-[#E8CFC4] relative group overflow-hidden">
               <div className="absolute inset-0 bg-neutral-300" />
               <div className="absolute bottom-0 left-0 p-6">
                 <h3 className="font-serif text-2xl text-[#3A2A2E]">Làm đẹp</h3>
               </div>
            </Link>
            {/* RIGHT TALL */}
            <Link href="/products" className="col-span-2 md:col-span-1 lg:col-span-1 row-span-2 bg-[#D9B8AE] relative group overflow-hidden">
               <div className="absolute inset-0 bg-neutral-400" />
               <div className="absolute bottom-0 left-0 p-6">
                 <h3 className="font-serif text-2xl text-white drop-shadow-md">Nhà cửa</h3>
               </div>
            </Link>
            {/* CENTER BOTTOM */}
            <Link href="/products" className="col-span-2 lg:col-span-2 row-span-1 bg-[#F6EFEA] relative group overflow-hidden">
               <div className="absolute inset-0 bg-neutral-300" />
               <div className="absolute bottom-0 left-0 p-6">
                 <h3 className="font-serif text-2xl text-[#3A2A2E]">Công nghệ</h3>
               </div>
            </Link>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="w-full max-w-[1480px] px-4 md:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="font-serif text-4xl text-[#3A2A2E] mb-3">Mới trên Senvia</h2>
              <p className="text-[#8E7F7B] text-lg">Những lựa chọn vừa cập nhật.</p>
            </div>
            <Link href="/products" className="text-[#3A2A2E] hover:text-[#AC3B61] text-sm font-medium tracking-wide uppercase transition-colors">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {mockProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* THE SENVIA EDIT */}
        <section className="w-full bg-[#E8CFC4] py-24 my-16">
          <div className="max-w-[1480px] mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
            <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-square bg-[#F6EFEA] relative">
              <div className="absolute inset-0 flex items-center justify-center text-[#AC3B61]/40 text-xl font-serif">Editorial Layout Block</div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-start">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#AC3B61] mb-6">The Senvia Edit</span>
              <h2 className="font-serif text-5xl md:text-6xl text-[#3A2A2E] leading-tight mb-8">
                Những món đồ khiến mỗi ngày trở nên thú vị hơn.
              </h2>
              <p className="text-[#3A2A2E]/80 text-lg max-w-md mb-10 leading-relaxed">
                Tuyển tập những thiết kế tinh tế, kết hợp hài hòa giữa công năng và thẩm mỹ, dành riêng cho không gian sống hiện đại.
              </p>
              <Link href="/products" className="border-b border-[#3A2A2E] pb-1 text-[#3A2A2E] font-medium hover:text-[#AC3B61] hover:border-[#AC3B61] transition-all flex items-center gap-2 group">
                Xem tuyển chọn <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* QUICK BENEFITS */}
        <section className="w-full max-w-[1480px] mx-auto px-4 md:px-8 py-16 border-y border-[#F6EFEA]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#AC3B61]" strokeWidth={1} />
              <span className="text-sm font-medium text-[#3A2A2E]">Thanh toán bảo mật</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <RefreshCcw className="w-6 h-6 text-[#AC3B61]" strokeWidth={1} />
              <span className="text-sm font-medium text-[#3A2A2E]">Đổi trả trong 14 ngày</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <CreditCard className="w-6 h-6 text-[#AC3B61]" strokeWidth={1} />
              <span className="text-sm font-medium text-[#3A2A2E]">Giao hàng toàn quốc</span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <HeadphonesIcon className="w-6 h-6 text-[#AC3B61]" strokeWidth={1} />
              <span className="text-sm font-medium text-[#3A2A2E]">Hỗ trợ khách hàng</span>
            </div>
          </div>
        </section>

        {/* FLASH OFFER / SENVIA HOURS */}
        <section className="w-full bg-[#3A2A2E] text-white py-24 my-16">
          <div className="max-w-[1480px] mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
              <div>
                <h2 className="font-serif text-5xl text-[#E8CFC4] mb-4">Senvia Hours</h2>
                <p className="text-white/70 text-lg">Ưu đãi chọn lọc trong thời gian giới hạn.</p>
              </div>
              <div className="flex items-center gap-4 text-3xl font-serif">
                <div className="w-16 h-16 bg-white/10 flex items-center justify-center">02</div>
                <span className="text-[#AC3B61]">:</span>
                <div className="w-16 h-16 bg-white/10 flex items-center justify-center">18</div>
                <span className="text-[#AC3B61]">:</span>
                <div className="w-16 h-16 bg-white/10 flex items-center justify-center">45</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map((item) => (
                <div key={item} className="bg-white text-[#3A2A2E] flex gap-4 p-4 items-center">
                  <div className="w-24 h-32 bg-[#F6EFEA] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#8E7F7B] block mb-1">MAISON 28</span>
                    <h4 className="font-medium mb-2">Signature Ceramic Mug</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[#AC3B61] font-bold">290.000₫</span>
                      <span className="text-xs text-[#8E7F7B] line-through">450.000₫</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND DISCOVERY */}
        <section className="w-full max-w-[1480px] mx-auto px-4 md:px-8 py-20">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#AC3B61] mb-4 block">Tuyển chọn</span>
            <h2 className="font-serif text-4xl text-[#3A2A2E]">Khám phá thương hiệu</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 lg:gap-24 items-center opacity-70">
            {["NOLA", "MORI", "ASTER", "LINEA", "KANSO", "MAISON 28"].map((brand) => (
              <span key={brand} className="font-serif text-2xl md:text-3xl text-[#3A2A2E] uppercase tracking-widest hover:text-[#AC3B61] transition-colors cursor-pointer">{brand}</span>
            ))}
          </div>
        </section>

        {/* FEATURED CAMPAIGN */}
        <section className="w-full mt-10">
          <div className="w-full h-[600px] bg-[#D9B8AE] relative flex items-center justify-center text-center px-4">
             <div className="absolute inset-0 bg-[#3A2A2E]/20" />
             <div className="relative z-10 flex flex-col items-center">
               <span className="text-xs font-bold tracking-[0.2em] text-white mb-6 uppercase">HOME / 26</span>
               <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 max-w-2xl leading-tight">
                 "Không gian cũng là một phần phong cách."
               </h2>
               <Link href="/products" className="bg-white text-[#3A2A2E] px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#F6EFEA] transition-colors">
                 Khám phá Home Edit
               </Link>
             </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="w-full bg-[#E8CFC4] py-24">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="font-serif text-5xl md:text-6xl text-[#3A2A2E] mb-6 leading-tight">
              Đừng bỏ lỡ<br />Senvia Edit.
            </h2>
            <p className="text-[#3A2A2E]/80 text-lg mb-10">
              Hàng mới, xu hướng và những tuyển chọn đáng chú ý.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 w-full max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Địa chỉ email của bạn" 
                className="flex-1 bg-white px-6 py-4 rounded-none border-none focus:ring-2 focus:ring-[#AC3B61] outline-none font-sans text-sm"
              />
              <button className="bg-[#AC3B61] text-white px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-[#8A2F4D] transition-colors">
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
