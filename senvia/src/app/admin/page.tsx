export default function AdminPage() {
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
}