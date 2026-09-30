"use client";
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
