'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Shield, ShieldAlert, CheckCircle2, XCircle, ArrowUpRight, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ADMIN_TOKEN = () => typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  kyc_status: string;
  is_active: boolean;
  created_at: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sidebarFilter = searchParams.get('filter'); // Captures ?filter=banned from sidebar
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Map Sidebar Filters to actual Database Filters
  const [kycFilter, setKycFilter] = useState(sidebarFilter === 'kyc-pending' ? 'pending' : 'all');
  const [statusFilter, setStatusFilter] = useState(
    sidebarFilter === 'active' ? 'true' : sidebarFilter === 'banned' ? 'false' : 'all'
  );

  const limit = 15;
  const totalPages = Math.ceil(total / limit);

  // Sync state if sidebar link is clicked
  useEffect(() => {
    if (sidebarFilter === 'kyc-pending') setKycFilter('pending');
    if (sidebarFilter === 'active') setStatusFilter('true');
    if (sidebarFilter === 'banned') setStatusFilter('false');
  }, [sidebarFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let endpoint = `/admin/users?page=${page}&limit=${limit}`;
        if (debouncedSearch) endpoint += `&search=${encodeURIComponent(debouncedSearch)}`;
        if (kycFilter !== 'all') endpoint += `&kyc_status=${kycFilter}`;
        if (statusFilter !== 'all') endpoint += `&is_active=${statusFilter}`; // New Active/Banned filter

        const response = await fetch(`${API_BASE}${endpoint}`, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ADMIN_TOKEN()}` 
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Network error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [page, debouncedSearch, kycFilter, statusFilter]);


  return (
    <div className="relative min-h-full pb-10">
      {/* AMBIENT GLOW */}
      <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">User Directory</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage {total} registered clients, security clearances, and account statuses.</p>
      </div>

      {/* CONTROLS (Search & Filters) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl py-3 pl-12 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all shadow-sm dark:shadow-none"
          />
        </div>

        {/* KYC Filters */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-1.5 rounded-xl shadow-sm dark:shadow-none overflow-x-auto w-full md:w-auto">
          <Filter size={16} className="text-gray-500 mx-2 hidden sm:block" />
          <FilterButton label="All Clients" active={kycFilter === 'all'} onClick={() => { setKycFilter('all'); setPage(1); }} />
          <FilterButton label="Verified" active={kycFilter === 'verified'} onClick={() => { setKycFilter('verified'); setPage(1); }} />
          <FilterButton label="Pending Review" active={kycFilter === 'pending'} onClick={() => { setKycFilter('pending'); setPage(1); }} />
          <FilterButton label="Unverified" active={kycFilter === 'unverified'} onClick={() => { setKycFilter('unverified'); setPage(1); }} />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl transition-colors relative min-h-[400px]">
        
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/50 dark:bg-[#05050a]/50 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-white/[0.02] text-[11px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-200 dark:border-transparent">
              <tr>
                <th className="p-5 pl-6">Client Identity</th>
                <th className="p-5">Security Clearance</th>
                <th className="p-5">Account Status</th>
                <th className="p-5">Joined Date</th>
                <th className="p-5 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 italic">No clients found matching your criteria.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    {/* Identity */}
                    <td className="p-5 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-400 shadow-sm">
                          {(user.full_name || user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-bold text-sm tracking-tight">{user.full_name || 'Anonymous'}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* KYC Clearance */}
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        {user.kyc_status === 'verified' && <Shield className="text-emerald-500" size={16} />}
                        {user.kyc_status === 'pending' && <ShieldAlert className="text-amber-500" size={16} />}
                        {user.kyc_status === 'unverified' && <XCircle className="text-gray-500" size={16} />}
                        {user.kyc_status === 'rejected' && <XCircle className="text-rose-500" size={16} />}
                        
                        <span className={`text-[10px] uppercase tracking-wider font-bold ${
                          user.kyc_status === 'verified' ? 'text-emerald-600 dark:text-emerald-400' : 
                          user.kyc_status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 
                          user.kyc_status === 'rejected' ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500'
                        }`}>
                          {user.kyc_status}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                        user.is_active 
                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                        : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                      }`}>
                        {user.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {user.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="p-5 text-gray-600 dark:text-gray-400 text-sm font-mono">
                      {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    {/* Action */}
                    <td className="p-5 text-right pr-6">
                      <button className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.01] flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} clients
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-gray-400 min-w-[60px] text-center">
              PAGE {page} / {totalPages || 1}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper Component for Tabs
function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
        active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}