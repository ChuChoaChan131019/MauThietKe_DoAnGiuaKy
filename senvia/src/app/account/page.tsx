import Header from "@/components/Header";
export default function AccountPage() {
  return (
    <>
      <Header />
      <div className="max-w-[1480px] mx-auto px-4 md:px-8 py-10 flex gap-12">
        <aside className="w-64 border-r border-[#F6EFEA] pr-6 h-[50vh]">
          <h2 className="font-serif text-2xl mb-6">Tài khoản</h2>
          <ul className="space-y-4 text-sm text-[#8E7F7B]">
            <li className="text-[#AC3B61] font-medium">Tổng quan</li>
            <li>Đơn hàng</li>
            <li>Wishlist</li>
            <li>Địa chỉ</li>
          </ul>
        </aside>
        <div className="flex-1">
          <h3 className="text-xl mb-4 text-[#3A2A2E]">Xin chào, User</h3>
          <p className="text-[#8E7F7B]">Quản lý thông tin tài khoản của bạn tại đây.</p>
        </div>
      </div>
    </>
  );
}