'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/apiClient';
import { Users, AlertCircle, Activity, Clock, RefreshCw } from 'lucide-react';

interface OverviewStats {
  total_users: number;
  pending_kyc: number;
  total_platform_volume: number;
  active_orders: number;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  kyc_status: string;
  // 🚨 Updated to support the new 4-balance system we built earlier
  main_balance?: number; 
  cached_balance?: number; 
  joined_at: string;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (isBackgroundPoll = false) => {
    if (!isBackgroundPoll) setIsRefreshing(true);
    
    try {
      const [statsRes, usersRes] = await Promise.all([
        apiClient.get('/admin/overview'), 
        apiClient.get('/admin/users')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // 1. Initial Load
    fetchDashboardData();

    // 2. Background Polling (Silently updates every 30 seconds)
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <RefreshCw className="animate-spin mb-4 text-blue-500" size={32} />
        <p className="animate-pulse font-medium tracking-widest uppercase text-sm">Synchronizing with core engine...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
        
        {/* 🚨 Manual Refresh Button */}
        <button 
          onClick={() => fetchDashboardData(false)}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors border border-gray-700 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin text-blue-400" : "text-gray-400"} />
          <span className="text-sm font-bold">{isRefreshing ? "SYNCING..." : "LIVE SYNC"}</span>
        </button>
      </div>

      {/* Top-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Users" 
          value={stats?.total_users.toString() || '0'} 
          icon={<Users className="text-blue-500" size={24} />} 
        />
        <StatCard 
          title="Pending KYC" 
          value={stats?.pending_kyc.toString() || '0'} 
          icon={<AlertCircle className="text-yellow-500" size={24} />} 
        />
        <StatCard 
          title="Platform Volume" 
          value={`$${stats?.total_platform_volume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`} 
          icon={<Activity className="text-green-500" size={24} />} 
        />
        <StatCard 
          title="Active Orders" 
          value={stats?.active_orders.toString() || '0'} 
          icon={<Clock className="text-purple-500" size={24} />} 
        />
      </div>

      {/* User Ledger */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Registrations</h2>
          <button className="text-sm bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition font-bold shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium uppercase tracking-wider text-xs">User</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs">Email</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs">KYC Status</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs">Wallet Balance</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                    No active users found in the database.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  // Catch both the new main_balance and the old cached_balance just in case
                  const balance = user.main_balance ?? user.cached_balance ?? 0;
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="p-4 text-white font-bold">{user.full_name || 'Anonymous'}</td>
                      <td className="p-4 text-gray-400 font-mono text-sm">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                          user.kyc_status === 'verified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                          user.kyc_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                          'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {user.kyc_status}
                        </span>
                      </td>
                      <td className="p-4 text-green-400 font-mono font-bold">
                        ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
                        {new Date(user.joined_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Metrics
function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:border-gray-700 transition-colors">
      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700/50 shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-black text-white font-mono tracking-tight">{value}</p>
      </div>
    </div>
  );
}