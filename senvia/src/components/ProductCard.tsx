"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="group flex flex-col w-full h-full relative">
      <Link href={`/products/${product.id}`} className="relative block aspect-[4/5] bg-[#F7F1EC] overflow-hidden mb-3">
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
        <Link href={`/products/${product.id}`} className="text-[14px] text-[#2F2328] font-medium truncate w-full hover:text-[#A63D63] transition-colors mb-1">
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
