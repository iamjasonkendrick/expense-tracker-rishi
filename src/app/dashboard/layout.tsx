import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col hidden md:flex fixed h-full">
        
        {/* Brand */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold tracking-tight cursor-pointer">
              Rupa<span className="text-emerald-400">lytic</span>
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <span className="text-lg">📊</span> Dashboard
          </Link>
          
          <Link href="/dashboard/calendar" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <span className="text-lg">📅</span> Calendar
          </Link>
          
          <Link href="/dashboard/incomes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <span className="text-lg">💰</span> Incomes
          </Link>
          
          <Link href="/dashboard/shared" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <span className="text-lg">🤝</span> Shared Expenses
          </Link>

          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-3">
            Account
          </p>
          
          <Link href="/dashboard/notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <span className="text-lg">🔔</span> Notifications
          </Link>
          
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <span className="text-lg">⚙️</span> Settings
          </Link>
        </nav>

        {/* Bottom User Section */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white">
              R
            </div>
            <div>
              <p className="text-sm font-medium text-white">Rupalytic User</p>
              <p className="text-xs text-slate-400">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Rupalytic Dashboard</h2>
            <p className="text-sm text-slate-500">Track your financial journey</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}