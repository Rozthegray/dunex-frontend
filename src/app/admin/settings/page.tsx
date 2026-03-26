'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, Power, Lock, AlertTriangle, 
  Activity, DollarSign, ShieldAlert, Save, Server
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ADMIN_TOKEN = () => typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

interface SiteSettings {
  trading_enabled: boolean;
  withdrawals_enabled: boolean;
  deposits_enabled: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  kyc_required_for_withdrawal: boolean;
  min_withdrawal_usd: string;
  max_withdrawal_usd: string;
  supported_currencies: string[];
}

export default function MasterControlsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Local state for text inputs so we don't spam the backend on every keystroke
  const [localMessage, setLocalMessage] = useState('');
  const [localMin, setLocalMin] = useState('');
  const [localMax, setLocalMax] = useState('');
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/settings`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setLocalMessage(data.maintenance_message || '');
        setLocalMin(data.min_withdrawal_usd || '');
        setLocalMax(data.max_withdrawal_usd || '');
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (updates: Partial<SiteSettings>, loaderKey: string = 'toggle') => {
    if (!settings) return;
    
    // Optimistic UI update for toggles
    const previousSettings = { ...settings };
    setSettings({ ...settings, ...updates });
    setIsSaving(loaderKey);

    try {
      const response = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN()}` },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error("Failed to update");
    } catch (error) {
      alert("Failed to sync setting to the master server.");
      setSettings(previousSettings); // Revert
    } finally {
      setIsSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-blue-600 dark:text-blue-400 font-mono text-sm uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  if (!settings) return <div className="p-8 text-red-500 font-bold">Failed to load system configurations.</div>;

  const isSystemOnline = !settings.maintenance_mode && settings.trading_enabled && settings.withdrawals_enabled;

  return (
    <div className="relative min-h-full pb-20">
      {/* AMBIENT GLOWS */}
      <div className="hidden dark:block absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      {settings.maintenance_mode && (
        <div className="hidden dark:block absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 flex items-center gap-3">
            <Server size={28} className="text-blue-500" />
            System Configuration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Global parameters, liquidity limits, and defense protocols.</p>
        </div>
        
        {/* LIVE STATUS BADGE */}
        <div className={`px-4 py-2 rounded-xl flex items-center gap-3 border shadow-sm dark:shadow-none backdrop-blur-md ${
          settings.maintenance_mode 
            ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400' 
            : !isSystemOnline 
              ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400'
              : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        }`}>
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              settings.maintenance_mode ? 'bg-rose-400' : !isSystemOnline ? 'bg-amber-400' : 'bg-emerald-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              settings.maintenance_mode ? 'bg-rose-500' : !isSystemOnline ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">
            {settings.maintenance_mode ? 'DEFCON 1: Maintenance' : !isSystemOnline ? 'Degraded Performance' : 'System Optimal'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* COLUMN 1: Core Engines & Operational Limits */}
        <div className="space-y-8">
          
          {/* Core Engines */}
          <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity size={16} /> Core Engines
            </h2>
            <div className="space-y-4">
              <ToggleRow 
                icon={<Activity className="text-blue-500" />}
                title="Live Trading Engine" 
                desc="Enable or pause all buy/sell order execution across the platform."
                isActive={settings.trading_enabled}
                onToggle={() => updateSetting({ trading_enabled: !settings.trading_enabled })}
              />
              <div className="h-px w-full bg-gray-100 dark:bg-white/5" />
              <ToggleRow 
                icon={<ArrowDownToLine className="text-emerald-500" />}
                title="Deposit Gateway" 
                desc="Allow users to fund their wallets and submit payment proofs."
                isActive={settings.deposits_enabled ?? true}
                onToggle={() => updateSetting({ deposits_enabled: !settings.deposits_enabled })}
              />
              <div className="h-px w-full bg-gray-100 dark:bg-white/5" />
              <ToggleRow 
                icon={<ArrowUpFromLine className="text-amber-500" />}
                title="Withdrawal Gateway" 
                desc="Allow users to request withdrawals from their available balances."
                isActive={settings.withdrawals_enabled}
                onToggle={() => updateSetting({ withdrawals_enabled: !settings.withdrawals_enabled })}
              />
            </div>
          </div>

          {/* Operational Limits */}
          <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <DollarSign size={16} /> Liquidity Parameters
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Minimum Withdrawal (USD)</label>
                <div className="flex gap-3">
                  <input 
                    type="number" 
                    value={localMin} onChange={e => setLocalMin(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none font-mono" 
                  />
                  <button 
                    onClick={() => updateSetting({ min_withdrawal_usd: localMin }, 'min')}
                    disabled={isSaving === 'min'}
                    className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-6 rounded-xl font-bold text-xs uppercase tracking-wider border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {isSaving === 'min' ? '...' : 'Apply'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Maximum Withdrawal (USD)</label>
                <div className="flex gap-3">
                  <input 
                    type="number" 
                    value={localMax} onChange={e => setLocalMax(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none font-mono" 
                  />
                  <button 
                    onClick={() => updateSetting({ max_withdrawal_usd: localMax }, 'max')}
                    disabled={isSaving === 'max'}
                    className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-6 rounded-xl font-bold text-xs uppercase tracking-wider border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {isSaving === 'max' ? '...' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Security & Defense Protocols */}
        <div className="space-y-8">
          
          {/* Security & Compliance */}
          <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-2xl">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <ShieldAlert size={16} /> Security & Compliance
            </h2>
            <div className="space-y-4">
              <ToggleRow 
                icon={<Lock className="text-purple-500" />}
                title="Strict KYC Requirement" 
                desc="Prevent users from initiating withdrawals unless their Identity Dossier is approved."
                isActive={settings.kyc_required_for_withdrawal ?? false}
                onToggle={() => updateSetting({ kyc_required_for_withdrawal: !settings.kyc_required_for_withdrawal })}
              />
            </div>
          </div>

          {/* Defense Protocol (Maintenance) */}
          <div className={`backdrop-blur-xl border rounded-3xl p-8 shadow-xl dark:shadow-2xl transition-colors duration-500 ${
            settings.maintenance_mode 
              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30' 
              : 'bg-white dark:bg-[#0a0a0f]/80 border-gray-200 dark:border-white/5'
          }`}>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${settings.maintenance_mode ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <AlertTriangle size={16} /> Defense Protocol
            </h2>
            
            <div className="space-y-6">
              <ToggleRow 
                icon={<Power className={settings.maintenance_mode ? "text-rose-500" : "text-gray-400"} />}
                title="Maintenance Mode" 
                desc="Takes the entire platform offline for end-users immediately."
                isActive={settings.maintenance_mode}
                onToggle={() => updateSetting({ maintenance_mode: !settings.maintenance_mode })}
                danger
              />
              
              <div className={`p-4 rounded-2xl border transition-colors ${
                settings.maintenance_mode ? 'bg-rose-100/50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-500/20' : 'bg-gray-50 dark:bg-[#05050a] border-gray-200 dark:border-white/5'
              }`}>
                <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Offline Broadcast Message</label>
                <textarea 
                  value={localMessage} onChange={e => setLocalMessage(e.target.value)}
                  placeholder="System is currently undergoing scheduled maintenance..."
                  className="w-full bg-transparent text-gray-900 dark:text-white p-2 focus:outline-none resize-y min-h-[80px]" 
                />
                <div className="flex justify-end mt-2 pt-2 border-t border-gray-200 dark:border-white/5">
                  <button 
                    onClick={() => updateSetting({ maintenance_message: localMessage }, 'msg')}
                    disabled={isSaving === 'msg'}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50"
                  >
                    <Save size={14} /> {isSaving === 'msg' ? 'Syncing...' : 'Save Broadcast'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENT ---

function ToggleRow({ icon, title, desc, isActive, onToggle, danger }: any) {
  return (
    <div className="flex justify-between items-center py-2 group">
      <div className="flex gap-4 items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm dark:shadow-none ${
          isActive && danger ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' : 
          isActive ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' : 
          'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-sm font-bold tracking-tight mb-0.5 ${
            isActive && danger ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'
          }`}>{title}</h3>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">{desc}</p>
        </div>
      </div>
      
      <button 
        onClick={onToggle}
        className={`w-14 h-8 rounded-full transition-all relative shrink-0 border ${
          isActive && danger ? 'bg-rose-500 border-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]' :
          isActive ? 'bg-blue-500 border-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 
          'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
        }`}
      >
        <div className={`w-6 h-6 bg-white rounded-full absolute top-[3px] transition-transform shadow-md ${
          isActive ? 'translate-x-[26px]' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
}

function ArrowDownToLine(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg>;
}
function ArrowUpFromLine(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg>;
}