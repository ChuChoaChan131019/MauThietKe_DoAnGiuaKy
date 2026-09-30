"use client";
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
                   <div key={i} className={`relative aspect-[4/5] md:w-24 bg-[#F7F1EC] cursor-pointer ${i === 1 ? 'border border-[#A63D63]' : 'opacity-60 hover:opacity-100'}`}>
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
