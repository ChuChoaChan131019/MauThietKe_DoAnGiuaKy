export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#F6EFEA] py-6 px-8 flex justify-center">
        <span className="font-serif text-3xl tracking-widest"><span className="text-[#3A2A2E]">SEN</span><span className="text-[#AC3B61]">VIA</span></span>
      </header>
      
      <main className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-4 md:px-8 py-10">
        <div>
          <h2 className="font-serif text-2xl mb-6 text-[#3A2A2E]">Thông tin liên hệ</h2>
          <input className="w-full border border-[#D9B8AE] p-4 focus:ring-1 focus:ring-[#AC3B61] outline-none mb-6" placeholder="Email" />
          
          <h2 className="font-serif text-2xl mb-6 mt-10 text-[#3A2A2E]">Địa chỉ giao hàng</h2>
          <div className="grid grid-cols-2 gap-4">
            <input className="col-span-1 border border-[#D9B8AE] p-4 focus:ring-1 focus:ring-[#AC3B61] outline-none" placeholder="Họ" />
            <input className="col-span-1 border border-[#D9B8AE] p-4 focus:ring-1 focus:ring-[#AC3B61] outline-none" placeholder="Tên" />
            <input className="col-span-2 border border-[#D9B8AE] p-4 focus:ring-1 focus:ring-[#AC3B61] outline-none" placeholder="Địa chỉ" />
          </div>
        </div>
        
        <div className="bg-[#F6EFEA] p-8 h-fit">
          <h3 className="font-serif text-xl mb-6">Đơn hàng của bạn</h3>
          <div className="border-t border-[#D9B8AE] pt-6 flex justify-between">
            <span className="font-bold">Tổng cộng</span>
            <span className="font-bold text-[#AC3B61]">1.190.000₫</span>
          </div>
        </div>
      </main>
    </div>
  );
}