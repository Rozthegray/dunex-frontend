'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  PlusCircle, MinusCircle, UserX, Bell, LogIn, X, 
  Wallet, Activity, ShieldCheck, FileImage, ShieldAlert, 
  Trash2, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Gift, Users, MapPin, Phone, Hash
} from 'lucide-react';
import { apiClient, API_URL } from '../../../../lib/apiClient';

const HOST_URL = API_URL.replace('/api/v1', '');

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '', email: '', dob: '', ssn: '', role: '',
    gender: '', phone: '', address: '', country: '', idNumber: '',
    referred_by_code: '', referred_by_email: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'subtract'>('add');
  const [targetWallet, setTargetWallet] = useState<'main' | 'profit' | 'bonus' | 'referral'>('main');
  const [amountInput, setAmountInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    fetchUserTransactions();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const res = await apiClient.get(`/admin/users/${userId}`);
      const u = res.data;
      
      if (!u.balances) u.balances = { main: 0, profit: 0, bonus: 0, referral: 0 };
      
      setUser(u);
      setFormData({
        full_name: u.full_name || '', 
        email: u.email || '',
        dob: u.dob || '',
        ssn: u.ssn || '', 
        gender: u.gender || '',
        phone: u.phone || '',
        address: u.address || '',
        country: u.country || '',
        idNumber: u.id_number || u.ssn || '', 
        role: u.role || 'user',
        referred_by_code: u.referred_by_code || '',
        referred_by_email: u.referred_by_email || 'No Referrer'
      });
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTransactions = async () => {
    try {
      const res = await apiClient.get(`/admin/users/${userId}/transactions`);
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const openModal = (action: 'add' | 'subtract') => {
    setModalAction(action); setAmountInput(''); setTargetWallet('main'); setIsModalOpen(true);
  };

  const handleBalanceAdjust = async () => {
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) return alert("Enter a valid amount");
    setIsProcessing(true);
    
    try {
      await apiClient.post(`/admin/users/${userId}/balance`, { 
        amount: val, 
        action: modalAction, 
        wallet_type: targetWallet 
      });

      setIsModalOpen(false);
      const updatedBalances = { ...user.balances };
      const change = modalAction === 'add' ? val : -val;
      updatedBalances[targetWallet] = Math.max(0, updatedBalances[targetWallet] + change);
      
      setUser({ ...user, balances: updatedBalances });
      fetchUserTransactions();
      
      alert(`Successfully ${modalAction === 'add' ? 'added' : 'subtracted'} $${val.toLocaleString()} to ${targetWallet} wallet.`);
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to adjust balance");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKycReview = async (status: 'verified' | 'rejected') => {
    if (!confirm(`Are you sure you want to mark this KYC as ${status.toUpperCase()}?`)) return;
    try {
      await apiClient.post(`/admin/users/${userId}/kyc-review`, { 
        status, 
        reason: "Admin review" 
      });
      setUser({ ...user, kyc_status: status });
    } catch (error) {
      alert("Failed to update KYC status.");
    }
  };

  const handleToggleSuspend = async () => {
    const action = user.is_active ? 'suspend' : 'reactivate';
    if (!confirm(`Are you sure you want to ${action.toUpperCase()} this user?`)) return;
    try {
      await apiClient.post(`/admin/users/${userId}/${action}`);
      setUser({ ...user, is_active: !user.is_active });
    } catch (error) {
      alert(`Failed to ${action} user.`);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm("🚨 WARNING: Are you sure you want to PERMANENTLY DELETE this user?")) return;
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      router.push('/admin/users'); 
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  // 🚨 CRITICAL FIX: Direct Cross-Domain Impersonation Routing
  const handleImpersonate = async () => {
    if (!confirm(`Generate a temporary session token for ${formData.email}?`)) return;
    try {
      const res = await apiClient.post(`/admin/users/${userId}/impersonate`);
      const token = res.data.access_token;
      
      // Fires the generated JWT directly into the main app via URL parameter
      window.open(`https://app.dunexmarkets.com/?impersonate_token=${token}`, '_blank');
    } catch (error: any) {
      alert(error.response?.data?.detail || "Impersonation failed");
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      await apiClient.patch(`/admin/users/${userId}`, formData);
      alert("Identity Matrix Updated Successfully.");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getImageUrl = (url: string) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${HOST_URL}${url}`;
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-blue-400 font-mono text-sm uppercase tracking-widest animate-pulse">Decrypting User Matrix...</p>
      </div>
    </div>
  );

  if (!user) return <div className="p-8 text-red-500 font-bold">User Matrix Not Found.</div>;

  const totalEquity = (user.balances?.main || 0) + (user.balances?.profit || 0) + (user.balances?.bonus || 0) + (user.balances?.referral || 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto relative pb-20">
      <div className="hidden dark:block absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
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
          </div>
        </div>
        <button 
          onClick={handleImpersonate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all flex items-center gap-2 text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105"
        >
          <LogIn size={18} /> Impersonate View
        </button>
      </div>

      {/* 4-BALANCE VAULT GRID */}
      <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-xl dark:shadow-2xl mb-10 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Equity (AUM)</h2>
          <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400"><Wallet size={16} /><span className="text-xs font-bold uppercase tracking-wider">Main</span></div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">${(user.balances?.main || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400"><TrendingUp size={16} /><span className="text-xs font-bold uppercase tracking-wider">Profit</span></div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">${(user.balances?.profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400"><Gift size={16} /><span className="text-xs font-bold uppercase tracking-wider">Bonus</span></div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">${(user.balances?.bonus || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400"><Users size={16} /><span className="text-xs font-bold uppercase tracking-wider">Referral</span></div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">${(user.balances?.referral || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <ActionButton icon={<PlusCircle size={18} />} label="Add Funds" color="emerald" onClick={() => openModal('add')} />
        <ActionButton icon={<MinusCircle size={18} />} label="Sub Funds" color="rose" onClick={() => openModal('subtract')} />
        <ActionButton icon={<Bell size={18} />} label="Notify User" color="blue" onClick={() => router.push('/admin/support')} />
        <ActionButton icon={<UserX size={18} />} label={user.is_active ? "Suspend User" : "Reactivate"} color={user.is_active ? "amber" : "emerald"} onClick={handleToggleSuspend} />
        <ActionButton icon={<Trash2 size={18} />} label="Delete User" color="rose" onClick={handleDeleteUser} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* LEFT COL: EXPANDED IDENTITY MATRIX */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
              <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            Comprehensive Identity Matrix
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputField label="Full Legal Name" name="full_name" value={formData.full_name} onChange={handleInputChange} />
            <InputField label="Email Address" name="email" value={formData.email} onChange={handleInputChange} type="email" />
            <InputField label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} placeholder="YYYY-MM-DD" />
            <InputField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} />
            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} icon={<Phone size={14}/>} />
            <InputField label="Country of Residence" name="country" value={formData.country} onChange={handleInputChange} icon={<MapPin size={14}/>} />
            <div className="md:col-span-2">
              <InputField label="Residential Address" name="address" value={formData.address} onChange={handleInputChange} />
            </div>
            
            <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
              <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Regulatory ID Number (SSN, BVN, NIN, etc.)</label>
              <div className="flex items-center gap-3">
                <Hash size={18} className="text-gray-400" />
                <input 
                  type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} 
                  className="w-full bg-transparent text-gray-900 dark:text-white font-mono font-bold text-lg outline-none" 
                  placeholder="Not provided"
                />
              </div>
            </div>

            <div className="md:col-span-2 p-4 bg-purple-50 dark:bg-purple-500/5 rounded-xl border border-purple-200 dark:border-purple-500/10 mt-2">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Client's Personal Referral Code</label>
                  <div className="text-gray-900 dark:text-white font-mono font-bold text-lg ml-1">
                    {user.referral_code || 'N/A'}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Referred By (Code Override)</label>
                  <input 
                    type="text" name="referred_by_code" value={formData.referred_by_code} onChange={handleInputChange} 
                    className="w-full bg-white dark:bg-[#05050a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-purple-500 font-mono text-sm" 
                    placeholder="Enter Referrer Code"
                  />
                  <p className="text-xs text-gray-500 mt-2 ml-1">Current Referrer: <span className="font-bold">{formData.referred_by_email}</span></p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleUpdateProfile} disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
          >
            {isSaving ? 'Encrypting Changes...' : 'Update Identity Profile'}
          </button>
        </div>

        {/* RIGHT COL: KYC DOCUMENT REVIEW */}
        <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl h-fit">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center">
              <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400" />
            </div>
            KYC Vault
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Government ID (Passport/License)</p>
              {user.govt_id_url ? (
                <a href={getImageUrl(user.govt_id_url) || '#'} target="_blank" rel="noopener noreferrer" className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#05050a] aspect-video flex items-center justify-center block">
                  <FileImage className="text-gray-400 dark:text-gray-600 absolute" size={32} />
                  <img src={getImageUrl(user.govt_id_url) || ''} alt="Govt ID" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity relative z-10" />
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#05050a] p-6 text-center text-sm text-gray-500 dark:text-gray-600 italic">No document uploaded</div>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard ID Card (Front)</p>
              {user.id_card_url ? (
                <a href={getImageUrl(user.id_card_url) || '#'} target="_blank" rel="noopener noreferrer" className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#05050a] aspect-video flex items-center justify-center block">
                  <FileImage className="text-gray-400 dark:text-gray-600 absolute" size={32} />
                  <img src={getImageUrl(user.id_card_url) || ''} alt="ID Card" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity relative z-10" />
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#05050a] p-6 text-center text-sm text-gray-500 dark:text-gray-600 italic">No document uploaded</div>
              )}
            </div>

            {user.kyc_status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/5 mt-6">
                <button onClick={() => handleKycReview('verified')} className="flex-1 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 py-3 rounded-xl font-bold text-sm transition-all shadow-sm">
                  Approve
                </button>
                <button onClick={() => handleKycReview('rejected')} className="flex-1 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 py-3 rounded-xl font-bold text-sm transition-all shadow-sm">
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULL WIDTH: TRANSACTION & LEDGER HISTORY */}
      <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl overflow-hidden">
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
                <tr><td colSpan={5} className="p-10 text-center text-gray-500 italic">No ledger activity found.</td></tr>
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
          <div className="bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative transition-colors">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/5 p-2 rounded-full">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 capitalize tracking-tight">{modalAction} Liquidity</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Target: <span className="text-gray-900 dark:text-white font-medium">{formData.full_name}'s Vault</span></p>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Target Wallet</label>
              <select value={targetWallet} onChange={(e) => setTargetWallet(e.target.value as any)} className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold appearance-none">
                <option value="main">Main Balance</option>
                <option value="profit">Total Profit</option>
                <option value="bonus">Bonus Wallet</option>
                <option value="referral">Referral Wallet</option>
              </select>
            </div>

            <div className="mb-8 relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-mono">$</span>
                <input 
                  type="number" 
                  className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-2xl rounded-2xl py-4 pl-10 pr-5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                  placeholder="0.00" value={amountInput} onChange={(e) => setAmountInput(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleBalanceAdjust} disabled={isProcessing || !amountInput}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${modalAction === 'add' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'} disabled:opacity-50`}
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
function ActionButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: 'emerald' | 'rose' | 'blue' | 'amber', onClick: () => void }) {
  const colorMap = {
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20',
    rose: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20',
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20',
  };
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${colorMap[color]}`}>
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wide text-center">{label}</span>
    </button>
  );
}

function InputField({ label, name, value, onChange, type = "text", placeholder, icon }: any) {
  return (
    <div>
      <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input 
          type={type} name={name} value={value} onChange={onChange} 
          className={`w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700 ${icon ? 'pl-9' : ''}`} 
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}