import Link from "next/link";
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 hidden md:block bg-[#F6EFEA] bg-cover bg-center"></div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="font-serif text-4xl text-[#3A2A2E] mb-2">Đăng ký</h1>
          <p className="text-[#8E7F7B] mb-8">Tạo tài khoản Senvia.</p>
          <div className="space-y-4">
            <input className="w-full border border-[#D9B8AE] p-4 outline-none focus:border-[#AC3B61]" placeholder="Họ và tên" />
            <input className="w-full border border-[#D9B8AE] p-4 outline-none focus:border-[#AC3B61]" placeholder="Email" />
            <input className="w-full border border-[#D9B8AE] p-4 outline-none focus:border-[#AC3B61]" type="password" placeholder="Mật khẩu" />
            <button className="w-full bg-[#AC3B61] text-white py-4 tracking-widest font-medium uppercase mt-4">Tạo tài khoản</button>
          </div>
          <p className="mt-6 text-sm text-[#8E7F7B]">
            Đã có tài khoản? <Link href="/login" className="text-[#3A2A2E] border-b border-[#3A2A2E]">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}