const fs = require('fs');
const path = require('path');

const files = {
  'src/app/products/page.tsx': `"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const mockProducts = [
  { id: 1, name: "Structured Mini Shoulder Bag", brand: "NOLA", price: 1190000, isNew: true, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80" },
  { id: 2, name: "Oversized Linen Shirt", brand: "MORI", price: 890000, discount: 15, oldPrice: 1050000, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80" },
  { id: 3, name: "Minimal Desk Lamp", brand: "KANSO", price: 1290000, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80" },
  { id: 4, name: "Signature Eau de Parfum", brand: "MAISON 28", price: 2490000, isNew: true, image: "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=800&q=80" },
  { id: 5, name: "Ceramic Minimalist Vase", brand: "KANSO", price: 690000, image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80" },
  { id: 6, name: "Leather Tote Bag", brand: "NOLA", price: 2190000, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80" },
  { id: 7, name: "Luxury Hand Cream", brand: "MAISON 28", price: 450000, image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&q=80" },
  { id: 8, name: "Wood Desk Organizer", brand: "KANSO", price: 890000, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80" },
];

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="w-full max-w-[1536px] mx-auto px-4 md:px-8 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-[#F7F1EC] pb-10"
        >
          <div className="text-[10px] text-[#8D7C77] uppercase tracking-[0.2em] mb-4">Trang chủ / Cửa hàng / Tất cả sản phẩm</div>
          <h1 className="font-serif text-5xl md:text-6xl text-[#2F2328]">Tất cả sản phẩm</h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="flex flex-col gap-10 sticky top-32">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F2328] mb-6">Danh mục</h3>
                <ul className="space-y-4 text-sm text-[#8D7C77]">
                  <li className="text-[#A63D63] font-medium cursor-pointer">Tất cả sản phẩm</li>
                  <li className="hover:text-[#2F2328] transition-colors cursor-pointer">Thời trang</li>
                  <li className="hover:text-[#2F2328] transition-colors cursor-pointer">Làm đẹp</li>
                  <li className="hover:text-[#2F2328] transition-colors cursor-pointer">Nhà cửa</li>
                  <li className="hover:text-[#2F2328] transition-colors cursor-pointer">Công nghệ</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F2328] mb-6">Thương hiệu</h3>
                <ul className="space-y-4 text-sm text-[#8D7C77]">
                  <li className="hover:text-[#2F2328] transition-colors cursor-pointer flex justify-between">NOLA <span>(12)</span></li>
                  <li className="hover:text-[#2F2328] transition-colors cursor-pointer flex justify-between">MORI <span>(8)</span></li>
                  <li className="hover:text-[#2F2328] transition-colors cursor-pointer flex justify-between">MAISON 28 <span>(15)</span></li>
                  <li className="hover:text-[#2F2328] transition-colors cursor-pointer flex justify-between">KANSO <span>(6)</span></li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 text-sm text-[#8D7C77]">
               <span>Hiển thị 8 trên 240 sản phẩm</span>
               <select className="bg-transparent outline-none border-none cursor-pointer focus:ring-0">
                  <option>Mới nhất</option>
                  <option>Giá: Thấp đến cao</option>
                  <option>Giá: Cao xuống thấp</option>
               </select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
               {mockProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
  'src/app/products/[id]/page.tsx': `"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Heart, Plus, Minus, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [qty, setQty] = useState(1);
  
  return (
    <>
      <Header />
      <main className="w-full max-w-[1536px] mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Gallery - 65% */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
             {/* Thumbnails */}
             <div className="flex md:flex-col gap-4 md:w-24 overflow-x-auto md:overflow-visible">
                {[1,2,3,4].map((i) => (
                   <div key={i} className={\`relative aspect-[4/5] md:w-24 bg-[#F7F1EC] cursor-pointer \${i === 1 ? 'border border-[#A63D63]' : 'opacity-60 hover:opacity-100'}\`}>
                      <Image src="https://images.unsplash.com/photo-1594035910387-fea47714263f?w=400&q=80" alt="Thumbnail" fill className="object-cover" />
                   </div>
                ))}
             </div>
             {/* Main Image */}
             <div className="relative flex-1 aspect-[4/5] bg-[#F7F1EC] overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1594035910387-fea47714263f?w=1200&q=80" alt="Main product" fill className="object-cover hover:scale-105 transition-transform duration-1000" priority />
             </div>
          </div>

          {/* Info - 35% */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 flex flex-col pt-4 sticky top-32 h-fit"
          >
             <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8D7C77]">MAISON 28</span>
                <button className="text-[#8D7C77] hover:text-[#2F2328]"><Share2 className="w-4 h-4" /></button>
             </div>
             
             <h1 className="text-4xl lg:text-5xl font-serif text-[#2F2328] mb-6 leading-tight">Signature Eau de Parfum</h1>
             
             <div className="text-2xl font-medium text-[#A63D63] mb-8">2.490.000₫</div>
             
             <p className="text-[#8D7C77] leading-relaxed mb-10 font-light">
               Sự pha trộn tinh tế giữa nốt hương hoa nhài thanh khiết và xạ hương ấm áp. Một lựa chọn hoàn hảo để bắt đầu ngày mới với phong thái tự tin và hiện đại.
             </p>

             <div className="mb-10">
                <h4 className="text-[11px] uppercase tracking-widest text-[#2F2328] mb-4">Dung tích</h4>
                <div className="flex gap-4">
                   <button className="border border-[#2F2328] text-[#2F2328] px-6 py-3 text-sm font-medium">50ml</button>
                   <button className="border border-[#E9D6CC] text-[#8D7C77] px-6 py-3 text-sm font-medium hover:border-[#2F2328] transition-colors">100ml</button>
                </div>
             </div>

             <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center border border-[#E9D6CC] h-14">
                   <button onClick={() => setQty(Math.max(1, qty-1))} className="w-12 h-full flex items-center justify-center text-[#8D7C77] hover:bg-[#F7F1EC]"><Minus className="w-4 h-4" /></button>
                   <span className="w-12 text-center text-[#2F2328] font-medium">{qty}</span>
                   <button onClick={() => setQty(qty+1)} className="w-12 h-full flex items-center justify-center text-[#8D7C77] hover:bg-[#F7F1EC]"><Plus className="w-4 h-4" /></button>
                </div>
                <button className="flex-1 bg-[#2F2328] text-white h-14 font-medium uppercase tracking-[0.1em] text-sm hover:bg-[#A63D63] transition-colors shadow-lg shadow-[#2F2328]/10">
                  Thêm vào giỏ
                </button>
                <button className="w-14 h-14 border border-[#E9D6CC] flex items-center justify-center text-[#2F2328] hover:text-[#A63D63] hover:border-[#A63D63] transition-colors">
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                </button>
             </div>

             <div className="mt-10 border-t border-[#F7F1EC] pt-8 space-y-6">
                <div className="flex justify-between items-center cursor-pointer group">
                   <span className="text-sm font-medium uppercase tracking-widest text-[#2F2328]">Chi tiết sản phẩm</span>
                   <Plus className="w-4 h-4 text-[#8D7C77] group-hover:text-[#2F2328]" />
                </div>
                <div className="flex justify-between items-center cursor-pointer group border-t border-[#F7F1EC] pt-6">
                   <span className="text-sm font-medium uppercase tracking-widest text-[#2F2328]">Vận chuyển & Đổi trả</span>
                   <Plus className="w-4 h-4 text-[#8D7C77] group-hover:text-[#2F2328]" />
                </div>
             </div>
          </motion.div>
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
      <main className="w-full max-w-[1536px] mx-auto px-4 md:px-8 py-16">
        <h1 className="font-serif text-5xl text-[#2F2328] mb-12">Giỏ hàng</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="border-t border-[#F7F1EC] pt-8 flex gap-8 mb-8 relative group">
               <button className="absolute top-8 right-0 text-[#8D7C77] hover:text-[#A63D63] transition-colors"><X className="w-5 h-5" /></button>
               <div className="relative w-32 aspect-[4/5] bg-[#F7F1EC] shrink-0 overflow-hidden">
                 <Image src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80" alt="Bag" fill className="object-cover" />
               </div>
               <div className="flex flex-col justify-between py-2">
                 <div>
                   <div className="text-[10px] text-[#8D7C77] uppercase tracking-[0.2em] mb-2">NOLA</div>
                   <div className="font-medium text-[#2F2328] text-lg mb-4">Structured Mini Shoulder Bag</div>
                   <div className="text-[#A63D63] font-medium">1.190.000₫</div>
                 </div>
                 <div className="flex items-center border border-[#E9D6CC] h-10 w-fit">
                    <button className="w-10 h-full flex items-center justify-center text-[#8D7C77] hover:bg-[#F7F1EC]"><Minus className="w-3 h-3" /></button>
                    <span className="w-10 text-center text-[#2F2328] font-medium text-sm">1</span>
                    <button className="w-10 h-full flex items-center justify-center text-[#8D7C77] hover:bg-[#F7F1EC]"><Plus className="w-3 h-3" /></button>
                 </div>
               </div>
            </div>
            
            <div className="border-t border-[#F7F1EC] pt-8 flex gap-8 mb-8 relative group">
               <button className="absolute top-8 right-0 text-[#8D7C77] hover:text-[#A63D63] transition-colors"><X className="w-5 h-5" /></button>
               <div className="relative w-32 aspect-[4/5] bg-[#F7F1EC] shrink-0 overflow-hidden">
                 <Image src="https://images.unsplash.com/photo-1594035910387-fea47714263f?w=400&q=80" alt="Perfume" fill className="object-cover" />
               </div>
               <div className="flex flex-col justify-between py-2">
                 <div>
                   <div className="text-[10px] text-[#8D7C77] uppercase tracking-[0.2em] mb-2">MAISON 28</div>
                   <div className="font-medium text-[#2F2328] text-lg mb-4">Signature Eau de Parfum</div>
                   <div className="text-[#A63D63] font-medium">2.490.000₫</div>
                 </div>
                 <div className="flex items-center border border-[#E9D6CC] h-10 w-fit">
                    <button className="w-10 h-full flex items-center justify-center text-[#8D7C77] hover:bg-[#F7F1EC]"><Minus className="w-3 h-3" /></button>
                    <span className="w-10 text-center text-[#2F2328] font-medium text-sm">1</span>
                    <button className="w-10 h-full flex items-center justify-center text-[#8D7C77] hover:bg-[#F7F1EC]"><Plus className="w-3 h-3" /></button>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="bg-[#F7F1EC] p-8 lg:p-10 sticky top-32">
               <h3 className="font-serif text-3xl mb-8 text-[#2F2328]">Tóm tắt</h3>
               <div className="flex justify-between mb-4 text-[#8D7C77]">
                 <span>Tạm tính</span>
                 <span className="text-[#2F2328] font-medium">3.680.000₫</span>
               </div>
               <div className="flex justify-between mb-8 text-[#8D7C77]">
                 <span>Vận chuyển</span>
                 <span className="text-[#2F2328] font-medium">Miễn phí</span>
               </div>
               <div className="flex justify-between mb-8 border-t border-[#D8BBB0] pt-8">
                 <span className="font-medium uppercase tracking-[0.1em] text-[#2F2328]">Tổng cộng</span>
                 <span className="font-bold text-2xl text-[#A63D63]">3.680.000₫</span>
               </div>
               <Link href="/checkout" className="block text-center w-full bg-[#2F2328] text-white py-5 text-sm font-medium uppercase tracking-[0.1em] hover:bg-[#A63D63] transition-colors shadow-xl">
                 Thanh toán
               </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
`,
  'src/app/login/page.tsx': `"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 hidden lg:block relative">
        <Image src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80" alt="Login Lifestyle" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#2F2328]/20"></div>
        <Link href="/" className="absolute top-10 left-12 flex-shrink-0 flex items-center gap-1">
          <span className="font-serif text-3xl tracking-widest text-white drop-shadow-md">SEN</span>
          <span className="font-serif text-3xl tracking-widest text-[#D8BBB0] drop-shadow-md">VIA</span>
        </Link>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <Link href="/" className="lg:hidden mb-12 block">
             <span className="font-serif text-3xl tracking-widest text-[#2F2328]">SEN</span>
             <span className="font-serif text-3xl tracking-widest text-[#A63D63]">VIA</span>
          </Link>

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A63D63] mb-4 block font-bold">Welcome Back</span>
          <h1 className="font-serif text-5xl text-[#2F2328] mb-4">Đăng nhập</h1>
          <p className="text-[#8D7C77] mb-12 font-light">Truy cập vào tài khoản Senvia để quản lý đơn hàng và lưu lại những sản phẩm yêu thích.</p>
          
          <div className="space-y-6">
            <div className="relative">
              <label className="text-[11px] uppercase tracking-widest text-[#8D7C77] mb-2 block">Email</label>
              <input className="w-full border-b border-[#E9D6CC] pb-3 pt-2 outline-none focus:border-[#A63D63] text-[#2F2328] transition-colors bg-transparent placeholder-transparent" placeholder="Email" />
            </div>
            <div className="relative">
              <label className="text-[11px] uppercase tracking-widest text-[#8D7C77] mb-2 block flex justify-between">
                Mật khẩu
                <Link href="#" className="text-[#A63D63] hover:underline">Quên mật khẩu?</Link>
              </label>
              <input className="w-full border-b border-[#E9D6CC] pb-3 pt-2 outline-none focus:border-[#A63D63] text-[#2F2328] transition-colors bg-transparent" type="password" />
            </div>
            
            <button className="w-full bg-[#2F2328] text-white py-5 text-sm tracking-[0.1em] font-medium uppercase mt-8 hover:bg-[#A63D63] transition-colors shadow-lg">
              Đăng nhập
            </button>
          </div>
          
          <p className="mt-12 text-sm text-[#8D7C77] text-center">
            Chưa có tài khoản? <Link href="/register" className="text-[#2F2328] font-medium border-b border-[#2F2328] pb-1 hover:text-[#A63D63] hover:border-[#A63D63] transition-colors">Đăng ký ngay</Link>
          </p>
        </motion.div>
      </div>
    </div>
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
