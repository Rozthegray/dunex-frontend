'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Apple, Smartphone, ShieldCheck, Zap, BarChart3, 
  Headset, ArrowRight, Lock, Globe, ChevronRight, X, FileText, CheckCircle2, Coins
} from 'lucide-react';

export default function DunexLandingPage() {
  // State for handling the legal/policy modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-amber-500/30 overflow-hidden font-sans">
      
      {/* --- AMBIENT BACKGROUND GLOWS (Gold & Blue) --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* --- NAVBAR --- */}
      <nav className="fixed w-full top-0 z-50 border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <BarChart3 size={22} className="text-black" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight tracking-widest uppercase">Dunex</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-amber-400 transition-colors">Why Us</a>
            <a href="#security" className="hover:text-amber-400 transition-colors">Security</a>
            <button onClick={() => setActiveModal('kyc')} className="hover:text-amber-400 transition-colors">KYC / AML</button>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs font-bold text-gray-600 hover:text-gray-300 transition-colors uppercase tracking-wider">
              Admin
            </Link>
            <a href="#download" className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Start Trading
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mt-16">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} />
              The Gold Standard in Trading
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Trade the Markets. <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Keep Your Profits.
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              No hidden fees. No lies. Just lightning-fast execution and guaranteed payouts. Download the Dunex platform and trade with absolute confidence.
            </p>

            {/* Download Buttons - UPDATED WITH YOUR LINKS */}
            <div id="download" className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              
              {/* iOS Web App Button */}
              <a href="https://app.dunexmarkets.com/" target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-4 bg-[#0a0a0f] border border-gray-800 p-4 rounded-2xl hover:border-amber-500/50 hover:bg-[#111116] transition-all w-full sm:w-auto">
                <div className="bg-white text-black p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Apple size={24} fill="currentColor" />
                </div>
                <div className="text-left pr-4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Access on</p>
                  <p className="text-lg font-bold text-white">iOS Web App</p>
                </div>
              </a>

              {/* Android APK Button */}
              <a href="https://expo.dev/artifacts/eas/8ymCj66h6VDxUfM9odYPhi.apk" download className="group relative flex items-center gap-4 bg-[#0a0a0f] border border-gray-800 p-4 rounded-2xl hover:border-amber-500/50 hover:bg-[#111116] transition-all w-full sm:w-auto">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Smartphone size={24} />
                </div>
                <div className="text-left pr-4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Download for</p>
                  <p className="text-lg font-bold text-white">Android APK</p>
                </div>
              </a>

            </div>
            
            <p className="text-sm text-gray-500 mt-6 flex items-center justify-center lg:justify-start gap-2 font-medium">
              <CheckCircle2 size={16} className="text-amber-500" />
              Direct, secure download. No app store restrictions.
            </p>
          </div>

          {/* Right Floating Phone Mockup */}
          <div className="flex-1 relative hidden md:flex justify-center z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-blue-500/10 blur-3xl rounded-full" />
            <div className="relative w-[300px] h-[600px] bg-[#050508] border-[4px] border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-all duration-700 hover:shadow-[0_0_50px_rgba(245,158,11,0.15)]">
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-32 h-6 bg-gray-800 rounded-b-3xl" />
              </div>
              {/* Mockup UI Inside */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] to-[#050508] p-6 pt-12 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <div className="w-4 h-4 bg-amber-400 rounded-full" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-800" />
                </div>
                <div className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Available Balance</div>
                <div className="text-4xl font-black text-white tracking-tight mb-8">$12,450.00</div>
                
                {/* Fake Chart */}
                <div className="h-40 w-full mb-8 relative">
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <path d="M0,50 Q10,40 20,45 T40,20 T60,35 T80,10 T100,5" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" className="animate-[dash_3s_ease-in-out]" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fcd34d" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent opacity-90" />
                </div>

                <div className="flex gap-4">
                  <div className="h-12 flex-1 bg-amber-500 rounded-xl flex items-center justify-center text-black font-bold text-sm">Buy</div>
                  <div className="h-12 flex-1 bg-gray-800 rounded-xl flex items-center justify-center font-bold text-sm">Sell</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- STATS BANNER --- */}
      <section className="border-y border-white/5 bg-white/[0.01] backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-around gap-8 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-black text-white">Same Day</p>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mt-1">Withdrawals</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-black text-white">Zero</p>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mt-1">Hidden Fees</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-black text-white">99.9%</p>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mt-1">Server Uptime</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-black text-white">24/7</p>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mt-1">Human Support</p>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Straightforward Trading.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">We built this platform on trust. What you see is exactly what you get.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Fast Payouts */}
          <div className="md:col-span-2 bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-amber-500/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
            <div className="bg-amber-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
              <Coins className="text-amber-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Guaranteed Fast Payouts</h3>
            <p className="text-gray-400 leading-relaxed max-w-md">Your money is your money. When you request a withdrawal, our system processes it instantly. No hold-ups, no excuses, just fast transfers directly to your account.</p>
          </div>

          {/* Card 2: Security */}
          <div className="bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-blue-500/30 transition-colors group relative overflow-hidden">
            <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
              <Lock className="text-blue-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Ironclad Security</h3>
            <p className="text-gray-400 leading-relaxed">Top-tier encryption keeps your data safe. We enforce strict compliance rules so you can trade with total peace of mind.</p>
          </div>

          {/* Card 3: Execution */}
          <div className="bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors group relative overflow-hidden">
            <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Zap className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Zero Delay</h3>
            <p className="text-gray-400 leading-relaxed">Market prices change in milliseconds. Our optimized servers ensure your trades execute exactly when you click.</p>
          </div>

          {/* Card 4: Support */}
          <div className="md:col-span-2 bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-amber-500/30 transition-colors group relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="bg-amber-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <Headset className="text-amber-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Real Human Support</h3>
              <p className="text-gray-400 leading-relaxed max-w-sm">No endless automated menus. If you have a problem, you speak to our support team directly. We are here to keep you trading smoothly.</p>
            </div>
            <div className="bg-[#111116] border border-gray-800 p-4 rounded-2xl w-full md:w-64 shadow-xl">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-black">D</div>
                <div className="bg-gray-800 rounded-xl rounded-tl-none p-3 text-sm text-gray-200">Hello, how can we assist your trading today?</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <footer className="border-t border-gray-900 bg-[#020203] relative z-10 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black mb-2 text-white">Join Dunex Markets Today.</h2>
            <p className="text-gray-500 text-sm">Download the app directly and start trading in minutes.</p>
          </div>
          
          <div className="flex gap-4">
            <a href="https://expo.dev/artifacts/eas/8ymCj66h6VDxUfM9odYPhi.apk" download className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
              <Smartphone size={16}/> Android
            </a>
            <a href="https://app.dunexmarkets.com/" target="_blank" rel="noopener noreferrer" className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
              <Apple size={16}/> iOS Web App
            </a>
          </div>
        </div>

        {/* Legal Links */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-medium">
          <p>© {new Date().getFullYear()} Dunex Markets. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-amber-400 transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-amber-400 transition-colors">Terms of Service</button>
            <button onClick={() => setActiveModal('kyc')} className="hover:text-amber-400 transition-colors">AML/KYC Policy</button>
          </div>
        </div>
      </footer>

      {/* --- MODAL SYSTEM --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          
          {/* Modal Content */}
          <div className="relative bg-[#0a0a0f] border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#0a0a0f] z-10">
              <div className="flex items-center gap-3">
                <FileText className="text-amber-500" size={20} />
                <h3 className="text-xl font-bold text-white">
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'terms' && 'Terms of Service'}
                  {activeModal === 'kyc' && 'AML / KYC Policy'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors bg-gray-900 p-2 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto text-gray-300 text-sm leading-relaxed space-y-6">
              
              {activeModal === 'kyc' && (
                <>
                  <p>At Dunex Markets, we prioritize the safety of our traders and the integrity of the financial system. Our Anti-Money Laundering (AML) and Know Your Customer (KYC) policies are strictly enforced.</p>
                  <h4 className="text-white font-bold text-base">1. Identity Verification</h4>
                  <p>To ensure a secure trading environment, all users must complete identity verification before processing withdrawals. This includes providing a valid government-issued ID and proof of address.</p>
                  <h4 className="text-white font-bold text-base">2. Anti-Money Laundering</h4>
                  <p>We actively monitor transactions to prevent illicit activities. Any suspicious behavior will be immediately flagged, and accounts may be temporarily frozen pending investigation to protect the platform's community.</p>
                  <h4 className="text-white font-bold text-base">3. Honest Trading</h4>
                  <p>We promise transparency. In return, we require users to operate honest accounts. Use of stolen funds, synthetic identities, or malicious software will result in permanent bans.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>Welcome to Dunex Markets. By accessing our platform, you agree to abide by these straightforward terms.</p>
                  <h4 className="text-white font-bold text-base">1. Account Responsibilities</h4>
                  <p>You are solely responsible for maintaining the confidentiality of your login credentials. Dunex Markets will never ask for your password. Any trades executed from your account are considered final.</p>
                  <h4 className="text-white font-bold text-base">2. Market Risks</h4>
                  <p>Trading carries inherent risks. While we guarantee fast execution and system uptime, we are not liable for market volatility or losses incurred from your trading decisions.</p>
                  <h4 className="text-white font-bold text-base">3. Withdrawals & Deposits</h4>
                  <p>We pride ourselves on fast payouts. However, you must ensure that the withdrawal accounts match the name on your verified Dunex profile. Third-party deposits and withdrawals are strictly prohibited to comply with global standards.</p>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>Your data is yours. We believe in strict data protection and transparency regarding how your information is handled.</p>
                  <h4 className="text-white font-bold text-base">1. Data Collection</h4>
                  <p>We collect only what is necessary to run your account securely: contact details, financial transaction history, and KYC verification documents. We do not sell your personal data to advertisers.</p>
                  <h4 className="text-white font-bold text-base">2. Data Protection</h4>
                  <p>Your sensitive information is secured using bank-grade encryption algorithms. Our databases are isolated and protected against unauthorized external access.</p>
                  <h4 className="text-white font-bold text-base">3. Communication</h4>
                  <p>We will only contact you regarding important account updates, security alerts, or direct support inquiries. You will not receive spam from us.</p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 bg-[#050508] flex justify-end">
              <button onClick={closeModal} className="bg-amber-500 text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors">
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
