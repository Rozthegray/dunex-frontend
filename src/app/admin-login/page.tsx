'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, Activity } from 'lucide-react';
import { apiClient } from '@/src/lib/apiClient';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // FastAPI OAuth2 expects form data
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Verify the user is actually an admin (Optional but recommended)
      if (response.data.role !== 'admin' && response.data.role !== 'superadmin') {
        setError('Unauthorized. Clearance level too low.');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', response.data.access_token);
      router.push('/admin'); // Boot them into the command center
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Matrix rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* LOGIN TERMINAL */}
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-6">
            <Shield size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Dunex<span className="text-blue-500">Ops</span></h1>
          <p className="text-gray-500 text-sm font-mono mt-2 uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-blue-500 animate-pulse" />
            Restricted Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#05050a] border border-white/5 text-white rounded-xl py-3.5 pl-12 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700" 
                  placeholder="admin@dunex.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Passphrase</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#05050a] border border-white/5 text-white rounded-xl py-3.5 pl-12 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700" 
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:hover:shadow-none group"
          >
            {loading ? (
              <span className="animate-pulse tracking-widest uppercase text-sm">Authenticating...</span>
            ) : (
              <>
                Initiate Override <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}