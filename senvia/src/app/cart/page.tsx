"use client";
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
