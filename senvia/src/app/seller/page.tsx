export default function SellerPage() {
  return (
    <div className="min-h-screen bg-[#F6EFEA] flex">
      <aside className="w-64 bg-white border-r border-[#D9B8AE] p-6">
        <h1 className="font-serif text-2xl text-[#3A2A2E] mb-8">Seller Center</h1>
        <ul className="space-y-4 text-sm">
          <li className="text-[#AC3B61] font-medium">Dashboard</li>
          <li>Sản phẩm</li>
          <li>Đơn hàng</li>
        </ul>
      </aside>
      <main className="flex-1 p-10">
        <div className="bg-white p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Tổng quan</h2>
        </div>
      </main>
    </div>
  );
}