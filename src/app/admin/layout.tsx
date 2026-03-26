'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AuthGuard from '@/src/components/AuthGuard';
import { 
  LayoutDashboard, Users, CreditCard, Settings, LogOut, 
  FileText, ChevronDown, ChevronRight, ArrowDownToLine, 
  ArrowUpFromLine, MessageSquare, LifeBuoy, Sun, Moon, Bell, User 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Dark/Light Mode State
  const [isDark, setIsDark] = useState(true); // Defaulting to our premium dark mode

  // Dropdown states
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isDepositsOpen, setIsDepositsOpen] = useState(false);
  const [isWithdrawalsOpen, setIsWithdrawalsOpen] = useState(false);

  // Apply Dark Mode Class to HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (pathname.includes('/admin/users')) setIsUsersOpen(true);
    if (pathname.includes('/admin/deposits')) setIsDepositsOpen(true);
    if (pathname.includes('/admin/withdrawals')) setIsWithdrawalsOpen(true);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin-login');
  };

  return (
    <AuthGuard>
      <div className={`flex h-screen w-full ${isDark ? 'dark' : ''} bg-gray-50 dark:bg-[#05050a] transition-colors duration-300`}>
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-white dark:bg-[#11111a] text-gray-700 dark:text-[#9899ac] flex flex-col shadow-xl z-20 border-r border-gray-200 dark:border-white/5 transition-colors duration-300">
          <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
            <h1 className="text-gray-900 dark:text-white text-2xl font-black tracking-wider text-center">
              DUNEX<span className="text-blue-600 dark:text-blue-500">OPS</span>
            </h1>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto space-y-1">
            {/* DASHBOARD */}
            <Link href="/admin" className={`flex items-center px-6 py-3 transition-colors ${isActive('/admin') ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
              <LayoutDashboard size={20} className="mr-3" />
              <span className="font-semibold">Dashboard</span>
            </Link>

            {/* LIVE SUPPORT CHAT */}
            <Link href="/admin/chat" className={`flex items-center px-6 py-3 transition-colors ${isActive('/admin/chat') ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
              <MessageSquare size={20} className="mr-3" />
              <span className="font-semibold">Live Support</span>
            </Link>

            {/* SUPPORT TICKETS & BROADCAST */}
            <Link href="/admin/support" className={`flex items-center px-6 py-3 transition-colors ${isActive('/admin/support') ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
              <LifeBuoy size={20} className="mr-3" />
              <span className="font-semibold">Support Tickets</span>
            </Link>

            {/* ORDERS */}
            <Link href="/admin/orders" className={`flex items-center px-6 py-3 transition-colors ${isActive('/admin/orders') ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
              <FileText size={20} className="mr-3" />
              <span className="font-semibold">Manage Orders</span>
            </Link>

            {/* MANAGE USERS COLLAPSIBLE */}
            <div>
              <button 
                onClick={() => setIsUsersOpen(!isUsersOpen)} 
                className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${pathname.includes('/admin/users') ? 'text-gray-900 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <div className="flex items-center">
                  <Users size={20} className="mr-3" />
                  <span className="font-semibold">Manage Users</span>
                </div>
                {isUsersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {isUsersOpen && (
                <div className="bg-gray-50 dark:bg-black/20 py-2">
                  <Link href="/admin/users?filter=active" className="block px-12 py-2 text-sm hover:text-gray-900 dark:hover:text-white transition-colors">Active Users</Link>
                  <Link href="/admin/users?filter=banned" className="block px-12 py-2 text-sm hover:text-gray-900 dark:hover:text-white transition-colors">Banned Users</Link>
                  <Link href="/admin/users?filter=kyc-pending" className="block px-12 py-2 text-sm hover:text-gray-900 dark:hover:text-white transition-colors">KYC Pending</Link>
                  <Link href="/admin/users" className="block px-12 py-2 text-sm text-blue-600 dark:text-blue-500 font-medium transition-colors">All Users</Link>
                </div>
              )}
            </div>

            {/* PAYMENT METHODS */}
            <Link href="/admin/payment-methods" className={`flex items-center px-6 py-3 transition-colors ${isActive('/admin/payment-methods') ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
              <CreditCard size={20} className="mr-3" />
              <span className="font-semibold">Payment Methods</span>
            </Link>
            
            {/* SITE SETTINGS */}
            <Link href="/admin/settings" className={`flex items-center px-6 py-3 transition-colors ${isActive('/admin/settings') ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
              <Settings size={20} className="mr-3" />
              <span className="font-semibold">Site Settings</span>
            </Link>
          </nav>

          {/* LOGOUT BUTTON */}
          <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center space-x-3 p-3 w-full rounded-xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition-all duration-200 font-bold"
            >
              <LogOut size={20} />
              <span>Terminate Session</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* THE NEW TOP BAR */}
          <header className="h-20 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-8 z-10 transition-colors duration-300">
            {/* Left side: Search */}
            <div className="flex items-center bg-gray-100 dark:bg-[#05050a] rounded-xl px-4 py-2.5 w-96 border border-gray-200 dark:border-white/5 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-all">
              <span className="text-gray-400 mr-2">🔍</span>
              <input type="text" placeholder="Search users, orders, or deposits..." className="bg-transparent outline-none w-full text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-600" />
            </div>

            {/* Right side: Tools & Profile */}
            <div className="flex items-center gap-4">
              
              {/* Notification Bell */}
              <button className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0f]"></span>
              </button>

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 ml-2">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">Admin System</p>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Superuser</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto p-8 relative text-gray-900 dark:text-white">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}