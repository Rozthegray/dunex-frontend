'use client';

import { useEffect, useState } from 'react';
import { 
  Users, AlertCircle, Activity, LifeBuoy, DollarSign, 
  UserPlus, ArrowDownToLine, ArrowUpFromLine, CheckCircle2 
} from 'lucide-react';
import { RecentActivityFeed, ActivityItem } from '@/src/components/ui/dashboard-activities';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ADMIN_TOKEN = () => typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

interface OverviewStats {
  total_users: number;
  active_users: number;
  pending_kyc: number;
  open_tickets: number;
  unread_chats: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${ADMIN_TOKEN()}` };

        // Fetch ALL real data using native fetch to bypass apiClient intercepts
        const [statsRes, usersRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE}/admin/stats`, { headers }),
          fetch(`${API_BASE}/admin/users?limit=50`, { headers }),
          fetch(`${API_BASE}/admin/orders?status=pending`, { headers })
        ]);

        const fetchedStats = statsRes.ok ? await statsRes.json() : null;
        
        // Extract the .users array from the paginated response
        const usersPayload = usersRes.ok ? await usersRes.json() : { users: [] };
        const fetchedUsers = usersPayload.users || [];
        
        // Safe fallback in case the orders endpoint isn't built yet
        const fetchedOrders = ordersRes.ok ? await ordersRes.json() : [];

        setStats(fetchedStats);
        setUsers(fetchedUsers);
        setRecentOrders(fetchedOrders.slice(0, 5)); // Grab top 5 for the mini-widget

        // --- DYNAMIC ACTIVITY FEED GENERATION ---
        const realActivities: ActivityItem[] = [];

        // 1. Add Recent Users to Feed
        fetchedUsers.slice(0, 5).forEach((u: any) => {
          realActivities.push({
            id: `user-${u.id}`,
            icon: UserPlus,
            message: `New user joined: ${u.email}`,
            timestamp: new Date(u.created_at || Date.now()).toLocaleDateString(),
            iconColorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20"
          });
        });

        // 2. Add Recent Orders to Feed
        fetchedOrders.slice(0, 5).forEach((o: any) => {
          const isDeposit = o.transaction_type === 'deposit';
          realActivities.push({
            id: `order-${o.id}`,
            icon: isDeposit ? ArrowDownToLine : ArrowUpFromLine,
            message: `${isDeposit ? 'Deposit' : 'Withdrawal'} request: $${o.amount?.toLocaleString()}`,
            timestamp: new Date(o.created_at || Date.now()).toLocaleDateString(),
            iconColorClass: isDeposit 
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-amber-400 bg-amber-500/10 border-amber-500/20"
          });
        });

        setActivities(realActivities.slice(0, 8));

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-blue-600 dark:text-blue-400 font-mono text-sm uppercase tracking-widest animate-pulse">Syncing Live Telemetry...</p>
        </div>
      </div>
    );
  }

  // --- REAL SYSTEM HEALTH CALCULATIONS ---
  const total = stats?.total_users || 1; // Prevent division by zero
  const activeAccountsPercent = Math.round(((stats?.active_users || 0) / total) * 100);
  
  const verifiedUsersCount = users.filter(u => u.kyc_status === 'verified').length;
  const kycClearancePercent = Math.round((verifiedUsersCount / total) * 100);
  
  const fundedWalletsCount = users.filter(u => (u.cached_balance || 0) > 0).length;
  const fundedWalletsPercent = Math.round((fundedWalletsCount / total) * 100);

  return (
    <div className="relative min-h-full pb-10">
      {/* AMBIENT GLOWS (Dark Mode Only) */}
      <div className="hidden dark:block absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Command Center</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Live platform telemetry based on actual database metrics.</p>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats?.total_users.toString() || '0'} 
          icon={<Users className="text-blue-600 dark:text-blue-400" />} 
        />
        <StatCard 
          title="Active Accounts" 
          value={stats?.active_users.toString() || '0'} 
          icon={<Activity className="text-emerald-600 dark:text-emerald-400" />} 
        />
        <StatCard 
          title="Pending KYC" 
          value={stats?.pending_kyc.toString() || '0'} 
          icon={<AlertCircle className="text-amber-600 dark:text-amber-400" />} 
          alert={(stats?.pending_kyc ?? 0) > 0} 
        />
        <StatCard 
          title="Support Queue" 
          value={stats?.open_tickets.toString() || '0'} 
          icon={<LifeBuoy className="text-purple-600 dark:text-purple-400" />} 
          trend={`${stats?.unread_chats || '0'} unread chats`} 
          trendColor="text-rose-500"
        />
      </div>

      {/* SPLIT CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT COLUMN: Real Activity Feed */}
        <div className="lg:col-span-2">
          <RecentActivityFeed activities={activities} cardTitle="Live Platform Events" />
        </div>

        {/* RIGHT COLUMN: Real System Health & Recent Transactions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-colors">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity size={16} /> Platform Analytics
            </h3>
            <div className="space-y-6">
              <ProgressBar label="Active Accounts" value={`${activeAccountsPercent}%`} percent={activeAccountsPercent} color="bg-blue-500" />
              <ProgressBar label="KYC Clearance Rate" value={`${kycClearancePercent}%`} percent={kycClearancePercent} color="bg-emerald-500" />
              <ProgressBar label="Funded Wallets" value={`${fundedWalletsPercent}%`} percent={fundedWalletsPercent} color="bg-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-colors">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign size={16} /> Recent Orders
            </h3>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No recent transactions.</p>
              ) : (
                recentOrders.map(order => (
                  <TransactionRow 
                    key={order.id} 
                    type={order.transaction_type} 
                    amount={`$${order.amount.toLocaleString()}`} 
                    status={order.status} 
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* USER LEDGER ROW */}
      <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl transition-colors">
        <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-transparent">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client Ledger</h2>
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold uppercase tracking-wider">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-white/[0.02] text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-200 dark:border-transparent">
              <tr>
                <th className="p-4 pl-6">Client</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Clearance</th>
                <th className="p-4 text-right pr-6">AUM (Balance)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {users.slice(0, 10).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-400">
                        {(user.full_name || user.email)[0].toUpperCase()}
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold text-sm">{user.full_name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">{user.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                      user.kyc_status === 'verified' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                      user.kyc_status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}>
                      {user.kyc_status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right text-gray-700 dark:text-gray-300 font-mono text-sm">
                    ${user.cached_balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- HELPER UI COMPONENTS ---

function StatCard({ title, value, icon, trend, trendColor, alert }: any) {
  return (
    <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-200 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {alert && (
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
          {trend && (
            <span className={`text-xs font-bold ${trendColor || 'text-gray-500'}`}>{trend}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, percent, color }: { label: string, value: string, percent: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
        <span className="text-xs font-bold text-gray-900 dark:text-white">{value}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-full h-1.5 overflow-hidden">
        <div className={`${color} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function TransactionRow({ type, amount, status }: { type: string, amount: string, status: string }) {
  const isDeposit = type.toLowerCase() === 'deposit';
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDeposit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
          {isDeposit ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">{type}</span>
      </div>
      <div className="text-right">
        <span className="block text-sm font-mono text-gray-900 dark:text-white">{amount}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${
          status === 'completed' ? 'text-emerald-500' : 
          status === 'pending' ? 'text-amber-500' : 'text-red-500'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}