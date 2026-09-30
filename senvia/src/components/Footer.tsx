"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#2F2328] text-white py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-1 mb-6">
            <span className="font-serif text-3xl tracking-[0.2em] text-white">SEN</span>
            <span className="font-serif text-3xl tracking-[0.2em] text-[#A63D63]">VIA</span>
          </Link>
          <p className="text-[#E8CFC4] text-[13px] font-light max-w-xs leading-relaxed">
            Tuyển chọn những thiết kế đáng để giữ lại lâu hơn.
          </p>
        </div>
        
        <div className="md:col-span-1">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#D8BBB0] mb-6">Về chúng tôi</h4>
          <ul className="space-y-4 text-[13px] text-[#E8CFC4] font-light">
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Câu chuyện</Link></li>
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Tuyển dụng</Link></li>
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Liên hệ</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-1">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#D8BBB0] mb-6">Hỗ trợ</h4>
          <ul className="space-y-4 text-[13px] text-[#E8CFC4] font-light">
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Vận chuyển</Link></li>
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Đổi trả</Link></li>
            <li><Link href="#" className="hover:text-[#A63D63] transition-colors">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        <div className="md:col-span-1">
           <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#D8BBB0] mb-6">Theo dõi</h4>
           <div className="flex gap-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#E8CFC4]">
             <Link href="#" className="hover:text-[#A63D63] transition-colors">IG</Link>
             <Link href="#" className="hover:text-[#A63D63] transition-colors">FB</Link>
             <Link href="#" className="hover:text-[#A63D63] transition-colors">TK</Link>
           </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-[#D8BBB0]/20 text-[10px] text-[#E8CFC4] font-light uppercase tracking-[0.2em] flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© 2026 SENVIA</span>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-[#A63D63]">Điều khoản</Link>
          <Link href="#" className="hover:text-[#A63D63]">Bảo mật</Link>
        </div>
      </div>
    </footer>
  );
}
