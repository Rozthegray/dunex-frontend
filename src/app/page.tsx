'use client';

import Link from 'next/link';
import { 
  Apple, Smartphone, ShieldCheck, Zap, BarChart3, 
  Headset, ArrowRight, Lock, Globe, ChevronRight 
} from 'lucide-react';

export default function DunexLandingPage() {
  return (
    <div className="min-h-screen bg-[#05050a] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* --- AMBIENT BACKGROUND GLOWS --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full top-0 z-50 border-b border-white/5 bg-[#05050a]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <BarChart3 size={18} className="text-white" strokeWidth={3} />
            </div>
            <span className="text-2xl font-black tracking-tight">DUNEX</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#compliance" className="hover:text-white transition-colors">Compliance</a>
          </div>

          <div className="flex items-center gap-4">
            {/* Stealthy Admin Link for you */}
            <Link href="/admin" className="text-xs font-bold text-gray-600 hover:text-gray-300 transition-colors uppercase tracking-wider">
              Admin Portal
            </Link>
            <a href="#download" className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Get the App
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mt-16">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              100% Regulated & Secure
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Trade Like a Pro.<br />
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Without the Limits.
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Institutional-grade liquidity, zero hidden fees, and lightning-fast execution. Download the Dunex mobile engine and take control of your financial future.
            </p>

            {/* Download Buttons */}
            <div id="download" className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {/* iOS Button */}
              <button className="group relative flex items-center gap-4 bg-[#11111a] border border-gray-800 p-4 rounded-2xl hover:border-blue-500/50 hover:bg-[#151522] transition-all w-full sm:w-auto">
                <div className="bg-white text-black p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Apple size={24} fill="currentColor" />
                </div>
                <div className="text-left pr-4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Download for</p>
                  <p className="text-lg font-bold text-white">iOS (Profile)</p>
                </div>
              </button>

              {/* Android Button */}
              <button className="group relative flex items-center gap-4 bg-[#11111a] border border-gray-800 p-4 rounded-2xl hover:border-cyan-500/50 hover:bg-[#151522] transition-all w-full sm:w-auto">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Smartphone size={24} />
                </div>
                <div className="text-left pr-4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Download for</p>
                  <p className="text-lg font-bold text-white">Android APK</p>
                </div>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mt-6 flex items-center justify-center lg:justify-start gap-2">
              <ShieldCheck size={16} className="text-green-500" />
              Verified secure installations. No app store limits.
            </p>
          </div>

          {/* Right Floating Phone Mockup (CSS Only) */}
          <div className="flex-1 relative hidden md:flex justify-center z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 blur-3xl rounded-full" />
            <div className="relative w-[300px] h-[600px] bg-[#0a0a0f] border-[8px] border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-all duration-700 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-32 h-6 bg-gray-800 rounded-b-3xl" />
              </div>
              {/* Mockup UI Inside */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#11111a] to-[#05050a] p-6 pt-12 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30" />
                  <div className="w-8 h-8 rounded-full bg-gray-800" />
                </div>
                <div className="text-gray-400 text-sm font-medium mb-1">Total Balance</div>
                <div className="text-4xl font-black text-white tracking-tight mb-8">$124,590.00</div>
                
                {/* Fake Chart */}
                <div className="h-40 w-full mb-8 relative">
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <path d="M0,50 Q10,40 20,45 T40,20 T60,35 T80,10 T100,5" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" className="animate-[dash_3s_ease-in-out]" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] to-transparent opacity-80" />
                </div>

                <div className="flex gap-4">
                  <div className="h-12 flex-1 bg-blue-600 rounded-xl" />
                  <div className="h-12 flex-1 bg-gray-800 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- STATS BANNER --- */}
      <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap justify-around gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-black text-white">$2B+</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Quarterly Volume</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-white">100k+</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Active Traders</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-white">99.99%</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Engine Uptime</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-white">0ms</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Order Delay</p>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Built for the Elite.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything you need to analyze, execute, and scale your portfolio from your pocket.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Execution */}
          <div className="md:col-span-2 bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
            <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Lightning Execution Engine</h3>
            <p className="text-gray-400 leading-relaxed max-w-md">Our matching engine routes your orders directly to top-tier liquidity providers, ensuring zero slippage and instant fills.</p>
          </div>

          {/* Card 2: Security */}
          <div className="bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-green-500/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full group-hover:bg-green-500/20 transition-colors" />
            <div className="bg-green-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
              <Lock className="text-green-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Bank-Grade Vault</h3>
            <p className="text-gray-400 leading-relaxed">Military-grade encryption, enforced 2FA, and robust KYC protocols to protect your capital.</p>
          </div>

          {/* Card 3: Global */}
          <div className="bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-colors group relative overflow-hidden">
            <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
              <Globe className="text-purple-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Global Markets</h3>
            <p className="text-gray-400 leading-relaxed">Trade Forex, Crypto, Indices, and Commodities all from a single unified wallet.</p>
          </div>

          {/* Card 4: Support */}
          <div className="md:col-span-2 bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-cyan-500/50 transition-colors group relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
                <Headset className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">24/7 Priority Support</h3>
              <p className="text-gray-400 leading-relaxed max-w-sm">Skip the bots. Our in-app live chat connects you directly to a dedicated account manager in seconds.</p>
            </div>
            <div className="bg-[#11111a] border border-gray-800 p-4 rounded-2xl w-full md:w-64 shadow-xl">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white">D</div>
                <div className="bg-gray-800 rounded-xl rounded-tl-none p-3 text-sm text-gray-300">How can I help you scale today?</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <footer className="border-t border-gray-900 bg-[#020205] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to dominate the markets?</h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto">Download the app directly to your device. Full installation takes less than 60 seconds.</p>
          
          <div className="flex justify-center gap-6">
            <a href="#download" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
              Download App <ChevronRight size={18} />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-medium">
          <p>© 2026 Dunex Markets. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">AML/KYC Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}