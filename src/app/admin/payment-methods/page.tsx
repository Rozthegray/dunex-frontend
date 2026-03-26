'use client';

import { useEffect, useState } from 'react';
import { 
  Wallet, Landmark, Smartphone, PlusCircle, Trash2, Edit3, 
  Power, PowerOff, X, CreditCard, Activity, Copy, CheckCircle2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ADMIN_TOKEN = () => typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

interface PaymentMethod {
  id: string;
  name: string;
  method_type: string;
  account_details: string;
  instructions: string;
  is_active: boolean;
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    method_type: 'crypto',
    account_details: '',
    instructions: ''
  });

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/payment-methods`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      if (response.ok) {
        setMethods(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch methods", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // --- ACTIONS ---

  const openModal = (mode: 'add' | 'edit', method: PaymentMethod | null = null) => {
    setModalMode(mode);
    if (mode === 'edit' && method) {
      setEditingId(method.id);
      setFormData({
        name: method.name,
        method_type: method.method_type,
        account_details: method.account_details,
        instructions: method.instructions || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', method_type: 'crypto', account_details: '', instructions: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const url = modalMode === 'add' 
        ? `${API_BASE}/admin/payment-methods` 
        : `${API_BASE}/admin/payment-methods/${editingId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN()}` },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to save gateway");
      
      setIsModalOpen(false);
      fetchMethods(); 
    } catch (error) {
      alert("Failed to save payment method.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMethod = async (id: string, currentState: boolean) => {
    try {
      // Optimistic UI update
      setMethods(methods.map(m => m.id === id ? { ...m, is_active: !currentState } : m));
      const response = await fetch(`${API_BASE}/admin/payment-methods/${id}?is_active=${!currentState}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      if (!response.ok) throw new Error("Toggle failed");
    } catch (error) {
      // Revert on failure
      setMethods(methods.map(m => m.id === id ? { ...m, is_active: currentState } : m));
      alert("Failed to toggle method state.");
    }
  };

  const deleteMethod = async (id: string, name: string) => {
    if (!confirm(`🚨 WARNING: Are you sure you want to delete "${name}"? Users will no longer see this option.`)) return;
    try {
      const response = await fetch(`${API_BASE}/admin/payment-methods/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      if (!response.ok) throw new Error("Failed to delete");
      setMethods(methods.filter(m => m.id !== id));
    } catch (error) {
      alert("Failed to delete payment method.");
    }
  };

  // --- HELPERS ---
  const getIcon = (type: string) => {
    if (type === 'crypto') return <Wallet size={24} className="text-blue-400" />;
    if (type === 'bank_transfer') return <Landmark size={24} className="text-emerald-400" />;
    return <Smartphone size={24} className="text-purple-400" />;
  };

  return (
    <div className="relative min-h-full pb-20">
      {/* AMBIENT GLOW */}
      <div className="hidden dark:block absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 flex items-center gap-3">
            <CreditCard size={28} className="text-purple-500" />
            Payment Gateways
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Configure routing details for global client deposits.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-full transition-all flex items-center gap-2 text-sm font-bold shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:scale-105"
        >
          <PlusCircle size={18} /> Integrate Gateway
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-purple-600 dark:text-purple-400 font-mono text-sm uppercase tracking-widest animate-pulse">Syncing Gateways...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {methods.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-gray-300 dark:border-white/10 rounded-3xl bg-gray-50 dark:bg-[#0a0a0f]/50">
              <Activity size={48} className="text-gray-400 dark:text-gray-600 mb-4 opacity-50" />
              <p className="text-gray-600 dark:text-gray-400 font-bold text-lg">No Gateways Active</p>
              <p className="text-gray-500 text-sm mt-1">Clients currently cannot make deposits. Add a gateway above.</p>
            </div>
          ) : (
            methods.map((method) => {
              const isActive = method.is_active;
              return (
                <div key={method.id} className={`bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex flex-col transition-all group ${!isActive ? 'opacity-75 grayscale-[0.5]' : 'hover:border-purple-200 dark:hover:border-white/10'}`}>
                  
                  {/* TOP: Identity */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center shadow-inner">
                        {getIcon(method.method_type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{method.name}</h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{method.method_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                               : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
                    }`}>
                      {isActive ? <CheckCircle2 size={12} /> : <X size={12} />}
                      {isActive ? 'Live' : 'Offline'}
                    </div>
                  </div>

                  {/* MIDDLE: Destination Details */}
                  <div className="mb-6 flex-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Routing Destination</p>
                    <div className="bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 p-3.5 rounded-xl group/copy relative cursor-pointer hover:border-purple-500/50 transition-colors">
                      <p className="text-sm font-mono text-gray-800 dark:text-gray-300 break-all leading-relaxed">
                        {method.account_details}
                      </p>
                      <div className="absolute top-2 right-2 opacity-0 group-hover/copy:opacity-100 transition-opacity p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                        <Copy size={12} className="text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    {method.instructions && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 italic mt-3 line-clamp-2">
                        "{method.instructions}"
                      </p>
                    )}
                  </div>

                  {/* BOTTOM: Action Controls */}
                  <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openModal('edit', method)}
                        className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors border border-transparent dark:border-white/5"
                        title="Edit Gateway"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteMethod(method.id, method.name)}
                        className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-transparent dark:border-white/5"
                        title="Delete Gateway"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <button 
                      onClick={() => toggleMethod(method.id, method.is_active)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all border ${
                        isActive 
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20' 
                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                      }`}
                    >
                      {isActive ? <PowerOff size={14} /> : <Power size={14} />}
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* GLASSMORPHISM MODAL - ADD/EDIT GATEWAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-white/10 p-8 rounded-3xl w-full max-w-2xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] relative transition-colors max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors bg-gray-100 dark:bg-white/5 p-2 rounded-full">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              {modalMode === 'add' ? 'Integrate New Gateway' : 'Edit Gateway Settings'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              {modalMode === 'add' ? 'Establish a new routing destination for user deposits.' : 'Modify the routing details. Changes take effect immediately.'}
            </p>
            
            <form onSubmit={handleSaveMethod} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Gateway Name</label>
                  <input 
                    type="text" required placeholder="e.g. Binance Pay or Chase Bank" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-xl p-3.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700" 
                  />
                </div>
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Gateway Type</label>
                  <select 
                    value={formData.method_type} onChange={e => setFormData({...formData, method_type: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-xl py-3.5 px-4 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all cursor-pointer"
                  >
                    <option value="crypto">Crypto Wallet</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="p2p_app">P2P App (CashApp/Venmo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Destination Address / Details</label>
                <input 
                  type="text" required placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" 
                  value={formData.account_details} onChange={e => setFormData({...formData, account_details: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-xl p-3.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all font-mono placeholder:text-gray-400 dark:placeholder:text-gray-700" 
                />
              </div>

              <div>
                <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">User Instructions (Optional)</label>
                <textarea 
                  placeholder="e.g. Please ensure you send on the ERC-20 network only." 
                  value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-xl p-4 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all min-h-[100px] resize-y placeholder:text-gray-400 dark:placeholder:text-gray-700"
                />
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-4 mt-4 rounded-xl font-bold text-white transition-all shadow-lg bg-purple-600 hover:bg-purple-500 shadow-purple-600/20 disabled:opacity-50"
              >
                {isProcessing ? 'Encrypting Configuration...' : (modalMode === 'add' ? 'Deploy Gateway' : 'Save Modifications')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}