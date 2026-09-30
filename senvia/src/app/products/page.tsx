"use client";
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
