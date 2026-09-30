const fs = require('fs');
const path = require('path');

const files = {
  'src/app/products/page.tsx': `import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="w-full max-w-[1480px] mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <div className="text-xs text-[#8E7F7B] uppercase tracking-wider mb-4">Trang chủ / Sản phẩm</div>
          <h1 className="font-serif text-5xl text-[#3A2A2E]">Tất cả sản phẩm</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="flex flex-col gap-8">
              <div className="border-b border-[#F6EFEA] pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Danh mục</h3>
                <ul className="space-y-3 text-sm text-[#3A2A2E]/80">
                  <li className="text-[#AC3B61] font-medium">Tất cả</li>
                  <li>Thời trang</li>
                  <li>Làm đẹp</li>
                  <li>Nhà cửa</li>
                  <li>Công nghệ</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {[1,2,3,4,5,6,7,8].map((item) => (
                  <ProductCard key={item} product={{
                    id: item,
                    name: "Sample Product " + item,
                    brand: "SENVIA",
                    price: 1000000 + (item * 10000)
                  }} />
               ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}`,
  'src/app/products/[id]/page.tsx': `import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductDetail({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <main className="w-full max-w-[1480px] mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Gallery - 60% */}
          <div className="lg:col-span-3">
             <div className="w-full bg-[#F6EFEA] aspect-[4/5] flex items-center justify-center">
                <span className="text-xl font-serif text-[#8E7F7B]">Product Image {params.id}</span>
             </div>
          </div>

          {/* Info - 40% */}
          <div className="lg:col-span-2 flex flex-col pt-4">
             <span className="text-xs uppercase tracking-widest text-[#8E7F7B] mb-2">MAISON 28</span>
             <h1 className="text-3xl font-serif text-[#3A2A2E] mb-4">Signature Product Name</h1>
             
             <div className="text-2xl font-medium text-[#3A2A2E] mb-8">1.290.000₫</div>
             
             <p className="text-sm text-[#3A2A2E]/80 leading-relaxed mb-8">
               Mô tả ngắn gọn về sản phẩm. Thiết kế tinh tế, tối giản phù hợp cho không gian hiện đại.
             </p>

             <button className="w-full bg-[#AC3B61] text-white py-4 font-medium uppercase tracking-widest hover:bg-[#8A2F4D] transition-colors mb-4">
               Thêm vào giỏ
             </button>
             <button className="w-full border border-[#3A2A2E] text-[#3A2A2E] py-4 font-medium uppercase tracking-widest hover:bg-[#F6EFEA] transition-colors">
               Mua ngay
             </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}`,
  'src/app/cart/page.tsx': `import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="w-full max-w-[1480px] mx-auto px-4 md:px-8 py-10">
        <h1 className="font-serif text-4xl text-[#3A2A2E] mb-10">Giỏ hàng</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Cart Items */}
            <div className="border-b border-[#F6EFEA] pb-6 mb-6 flex gap-6">
               <div className="w-24 h-32 bg-[#F6EFEA] shrink-0" />
               <div className="flex-1">
                 <div className="text-xs text-[#8E7F7B] uppercase mb-1">NOLA</div>
                 <div className="font-medium text-[#3A2A2E] mb-2">Structured Shoulder Bag</div>
                 <div className="text-[#3A2A2E]">1.190.000₫</div>
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-[#F6EFEA] p-8 sticky top-10">
               <h3 className="font-serif text-2xl mb-6">Tóm tắt</h3>
               <div className="flex justify-between mb-4 text-sm">
                 <span className="text-[#8E7F7B]">Tạm tính</span>
                 <span className="font-medium">1.190.000₫</span>
               </div>
               <div className="flex justify-between mb-6 text-sm">
                 <span className="text-[#8E7F7B]">Vận chuyển</span>
                 <span className="font-medium">Miễn phí</span>
               </div>
               <div className="flex justify-between mb-8 border-t border-[#D9B8AE] pt-6">
                 <span className="font-medium uppercase tracking-widest">Tổng cộng</span>
                 <span className="font-bold text-xl text-[#AC3B61]">1.190.000₫</span>
               </div>
               <button className="w-full bg-[#AC3B61] text-white py-4 font-medium uppercase tracking-widest hover:bg-[#8A2F4D] transition-colors">
                 Thanh toán
               </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}`,
  'src/app/checkout/page.tsx': `export default function CheckoutPage() {
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
}`,
  'src/app/login/page.tsx': `import Link from "next/link";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 hidden md:block bg-[#E8CFC4] bg-cover bg-center"></div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="font-serif text-4xl text-[#3A2A2E] mb-2">Đăng nhập</h1>
          <p className="text-[#8E7F7B] mb-8">Chào mừng trở lại Senvia.</p>
          <div className="space-y-4">
            <input className="w-full border border-[#D9B8AE] p-4 outline-none focus:border-[#AC3B61]" placeholder="Email" />
            <input className="w-full border border-[#D9B8AE] p-4 outline-none focus:border-[#AC3B61]" type="password" placeholder="Mật khẩu" />
            <button className="w-full bg-[#AC3B61] text-white py-4 tracking-widest font-medium uppercase mt-4">Đăng nhập</button>
          </div>
          <p className="mt-6 text-sm text-[#8E7F7B]">
            Chưa có tài khoản? <Link href="/register" className="text-[#3A2A2E] border-b border-[#3A2A2E]">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
}`,
  'src/app/register/page.tsx': `import Link from "next/link";
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
}`,
  'src/app/account/page.tsx': `import Header from "@/components/Header";
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
}`,
  'src/app/seller/page.tsx': `export default function SellerPage() {
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
}`,
  'src/app/admin/page.tsx': `export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#3A2A2E] text-white p-6">
        <h1 className="font-serif text-2xl mb-8">Admin</h1>
        <ul className="space-y-4 text-sm text-white/70">
          <li className="text-white font-medium">Dashboard</li>
          <li>Users</li>
          <li>Shops</li>
        </ul>
      </aside>
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-serif text-[#3A2A2E]">Quản trị hệ thống</h2>
      </main>
    </div>
  );
}`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}
