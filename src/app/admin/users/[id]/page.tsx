'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  PlusCircle, MinusCircle, UserX, Bell, LogIn, X, 
  Wallet, Activity, Box, ArrowLeftRight, ShieldCheck, 
  FileImage, ShieldAlert, Trash2, ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ADMIN_TOKEN = () => typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '', email: '', dob: '', ssn: '', role: ''
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'subtract'>('add');
  const [amountInput, setAmountInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    fetchUserTransactions();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      
      if (!response.ok) throw new Error("Failed to fetch");
      const u = await response.json();
      setUser(u);
      
      setFormData({
        full_name: u.full_name || '', 
        email: u.email || '',
        dob: u.dob || '',
        ssn: u.ssn || '',
        role: u.role || 'user'
      });
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTransactions = async () => {
    try {
      // Assuming you have an endpoint that fetches txs for a specific user
      const response = await fetch(`${API_BASE}/admin/users/${userId}/transactions`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      if (response.ok) {
        setTransactions(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  // --- ACTION: BALANCE ADJUSTMENT ---
  const openModal = (action: 'add' | 'subtract') => {
    setModalAction(action); 
    setAmountInput(''); 
    setIsModalOpen(true);
  };

  const handleBalanceAdjust = async () => {
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) return alert("Enter a valid amount");
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN()}` },
        body: JSON.stringify({ amount: val, action: modalAction })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to adjust balance");

      setIsModalOpen(false);
      // Immediately update UI balance
      const newBalance = data.new_balance !== undefined ? data.new_balance : (user.cached_balance + (modalAction === 'add' ? val : -val));
      setUser({ ...user, cached_balance: newBalance });
      
      // Refresh transaction history to show the new ledger entry
      fetchUserTransactions();
      
      alert(`Successfully ${modalAction === 'add' ? 'added' : 'subtracted'} $${val.toLocaleString()}.`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- ACTION: KYC REVIEW ---
  const handleKycReview = async (status: 'verified' | 'rejected') => {
    if (!confirm(`Are you sure you want to mark this KYC as ${status.toUpperCase()}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/kyc-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN()}` },
        body: JSON.stringify({ status, reason: "Admin review" })
      });

      if (!res.ok) throw new Error("Failed to update KYC");
      setUser({ ...user, kyc_status: status });
      alert(`KYC status updated to ${status}.`);
    } catch (error) {
      alert("Failed to update KYC status.");
    }
  };

  // --- ACTION: SUSPEND / REACTIVATE ---
  const handleToggleSuspend = async () => {
    const action = user.is_active ? 'suspend' : 'reactivate';
    if (!confirm(`Are you sure you want to ${action.toUpperCase()} this user?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      setUser({ ...user, is_active: !user.is_active });
    } catch (error) {
      alert(`Failed to ${action} user.`);
    }
  };

  // --- ACTION: DELETE USER ---
  const handleDeleteUser = async () => {
    if (!confirm("🚨 WARNING: Are you sure you want to PERMANENTLY DELETE this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      alert("User deleted successfully.");
      router.push('/admin/users'); // Kick back to user directory
    } catch (error) {
      alert("Failed to delete user. Check server logs.");
    }
  };

  // --- ACTION: IMPERSONATE ---
  const handleImpersonate = async () => {
    if (!confirm(`Generate a temporary session token for ${formData.email}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/impersonate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Impersonation failed");
      
      localStorage.setItem('temp_impersonation_token', data.access_token);
      window.open('/dashboard', '_blank');
    } catch (error: any) {
      alert(error.message);
    }
  };

  // --- ACTION: UPDATE IDENTITY PROFILE ---
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN()}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Identity Matrix Updated Successfully.");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-blue-400 font-mono text-sm uppercase tracking-widest animate-pulse">Decrypting User Matrix...</p>
      </div>
    </div>
  );

  if (!user) return <div className="p-8 text-red-500 font-bold">User Matrix Not Found.</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto relative pb-20">
      {/* AMBIENT GLOW */}
      <div className="hidden dark:block absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm dark:shadow-none">
            User ID: {user.id}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{formData.full_name || 'Anonymous Client'}</h1>
          <div className="flex items-center gap-4 mt-3">
            <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
              user.is_active ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
            }`}>
              {user.is_active ? 'Account Active' : 'Account Suspended'}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
              user.kyc_status === 'verified' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 
              user.kyc_status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'
            }`}>
              KYC: {user.kyc_status}
            </span>
            <span className="text-xl font-mono font-bold text-gray-900 dark:text-white">
              AUM: <span className="text-blue-600 dark:text-blue-400">${user.cached_balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</span>
            </span>
          </div>
        </div>
        <button 
          onClick={handleImpersonate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all flex items-center gap-2 text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105"
        >
          <LogIn size={18} /> Impersonate View
        </button>
      </div>

      {/* ADMIN ACTIONS BENTO GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <ActionButton icon={<PlusCircle size={18} />} label="Add Funds" color="emerald" onClick={() => openModal('add')} />
        <ActionButton icon={<MinusCircle size={18} />} label="Sub Funds" color="rose" onClick={() => openModal('subtract')} />
        {/* Route to Support / Mail tab */}
        <ActionButton icon={<Bell size={18} />} label="Notify User" color="blue" onClick={() => router.push('/admin/support')} />
        <ActionButton 
          icon={<UserX size={18} />} 
          label={user.is_active ? "Suspend User" : "Reactivate"} 
          color={user.is_active ? "amber" : "emerald"} 
          onClick={handleToggleSuspend} 
        />
        <ActionButton icon={<Trash2 size={18} />} label="Delete User" color="rose" onClick={handleDeleteUser} />
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT COL: IDENTITY MATRIX (FORM) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
              <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            Identity Matrix
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputField label="Full Legal Name" name="full_name" value={formData.full_name} onChange={handleInputChange} />
            <InputField label="Email Address" name="email" value={formData.email} onChange={handleInputChange} type="email" />
            <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} placeholder="YYYY-MM-DD" />
            <InputField label="SSN / Tax ID" name="ssn" value={formData.ssn} onChange={handleInputChange} type="password" />
          </div>

          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Platform Clearances</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 flex justify-between items-center transition-colors">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">2FA Engine</span>
              <span className={`text-xs font-black ${user.two_fa_enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'}`}>{user.two_fa_enabled ? 'ENABLED' : 'DISABLED'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 flex justify-between items-center transition-colors">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Currency</span>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">{user.base_currency || 'USD'}</span>
            </div>
          </div>

          <button 
            onClick={handleUpdateProfile}
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
          >
            {isSaving ? 'Encrypting Changes...' : 'Update Identity Profile'}
          </button>
        </div>

        {/* RIGHT COL: KYC DOCUMENT REVIEW */}
        <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden h-fit transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center">
              <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400" />
            </div>
            KYC Document Vault
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Government ID</p>
              {user.govt_id_url ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#05050a] aspect-video flex items-center justify-center transition-colors">
                  <FileImage className="text-gray-400 dark:text-gray-600 absolute" size={32} />
                  <img src={user.govt_id_url} alt="Govt ID" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity relative z-10" />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#05050a] p-6 text-center text-sm text-gray-500 dark:text-gray-600 italic transition-colors">No document uploaded</div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard ID Card (Front)</p>
              {user.id_card_url ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#05050a] aspect-video flex items-center justify-center transition-colors">
                  <FileImage className="text-gray-400 dark:text-gray-600 absolute" size={32} />
                  <img src={user.id_card_url} alt="ID Card" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity relative z-10" />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#05050a] p-6 text-center text-sm text-gray-500 dark:text-gray-600 italic transition-colors">No document uploaded</div>
              )}
            </div>

            {/* KYC Actions */}
            {user.kyc_status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/5 mt-6">
                <button onClick={() => handleKycReview('verified')} className="flex-1 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 py-3 rounded-xl font-bold text-sm transition-all shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  Approve
                </button>
                <button onClick={() => handleKycReview('rejected')} className="flex-1 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 py-3 rounded-xl font-bold text-sm transition-all shadow-sm dark:shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULL WIDTH: TRANSACTION & LEDGER HISTORY */}
      <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
            <Activity size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          Ledger & Transaction History
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-white/[0.02] text-[11px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-200 dark:border-transparent">
              <tr>
                <th className="p-4 pl-6">Type</th>
                <th className="p-4">Reference</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 italic">No ledger activity found for this client.</td>
                </tr>
              ) : (
                transactions.map((tx: any) => {
                  const isDeposit = tx.transaction_type?.toLowerCase() === 'deposit';
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDeposit ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                            {isDeposit ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
                          </div>
                          <span className="text-gray-900 dark:text-white font-bold text-sm capitalize">{tx.transaction_type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 text-xs font-mono">{tx.reference}</td>
                      <td className="p-4 text-gray-900 dark:text-white font-mono text-sm">
                        {isDeposit ? '+' : '-'}${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                          tx.status === 'completed' || tx.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                          tx.status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-gray-500 text-xs font-mono">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GLASSMORPHISM MODAL - FUNDS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] relative transition-colors">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/5 p-2 rounded-full">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 capitalize tracking-tight">{modalAction} Liquidity</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Target: <span className="text-gray-900 dark:text-white font-medium">{formData.full_name}'s Vault</span></p>
            
            <div className="mb-8 relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-mono">$</span>
              <input 
                type="number" 
                className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-2xl rounded-2xl py-5 pl-12 pr-5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                placeholder="0.00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                autoFocus
              />
            </div>

            <button 
              onClick={handleBalanceAdjust}
              disabled={isProcessing || !amountInput}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                modalAction === 'add' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
              } disabled:opacity-50`}
            >
              {isProcessing ? 'Executing...' : `Execute ${modalAction === 'add' ? 'Deposit' : 'Withdrawal'}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// UI COMPONENTS
function ActionButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: 'emerald' | 'rose' | 'blue' | 'gray' | 'amber', onClick: () => void }) {
  const colorMap = {
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20',
    rose: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20',
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20',
    gray: 'bg-gray-50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/20 hover:bg-gray-100 dark:hover:bg-gray-500/20',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20',
  };
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${colorMap[color]}`}>
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wide text-center">{label}</span>
    </button>
  );
}

function InputField({ label, name, value, onChange, type = "text", placeholder }: any) {
  return (
    <div>
      <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">{label}</label>
      <input 
        type={type} name={name} value={value} onChange={onChange} 
        className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700" 
        placeholder={placeholder}
      />
    </div>
  );
}