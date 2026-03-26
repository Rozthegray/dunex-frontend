'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/apiClient';
import { Users, AlertCircle, Activity, Clock } from 'lucide-react';

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
  cached_balance: number;
  joined_at: string;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // We only need /admin/... because apiClient already handles the base URL
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
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-400 animate-pulse">Synchronizing with core engine...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Platform Overview</h1>

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
          value={`$${stats?.total_platform_volume.toLocaleString() || '0.00'}`} 
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
          <button className="text-sm bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">KYC Status</th>
                <th className="p-4 font-medium">Wallet Balance</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No active users found in the database.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 text-white font-medium">{user.full_name || 'Anonymous'}</td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${
                        user.kyc_status === 'verified' ? 'bg-green-500/10 text-green-500' : 
                        user.kyc_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {user.kyc_status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300 font-mono">
                      ${user.cached_balance.toFixed(2)}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(user.joined_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
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
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
      <div className="p-3 bg-gray-800 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}