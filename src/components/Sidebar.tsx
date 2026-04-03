'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, FileText } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar on the login page
  if (pathname === '/') return null;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Users', href: '/admin/users', icon: <Users size={20} /> }, // <-- NEW: Added Users route
    { name: 'Financial Orders', href: '/admin/orders', icon: <FileText size={20} /> },
    { name: 'Payment Methods', href: '/admin/payment-methods', icon: <CreditCard size={20} /> },
    { name: 'Site Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen flex flex-col text-gray-300">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white tracking-wider">DUNEX<span className="text-blue-500">ADMIN</span></h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          // Highlight if the current path starts with the href (e.g., /users and /users/123)
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors mb-1 ${isActive ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-gray-800 hover:text-white'}`}>
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Terminate Session</span>
        </button>
      </div>
    </div>
  );
}