'use client';

import { useState } from 'react';
import {
  Apple, Smartphone, ShieldCheck, Zap, BarChart3,
  Headset, Lock, Globe, ChevronRight, X,
  CheckCircle2, TrendingUp, Users, Award,
  FileCheck, Eye, Fingerprint, AlertTriangle,
  Share, Plus, Home, MoreHorizontal
} from 'lucide-react';

// ─── iOS Add-to-Homescreen Modal ──────────────────────────────────────────────
interface IOSModalProps {
  onClose: () => void;
}
function IOSModal({ onClose }: IOSModalProps) { 
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Globe size={32} className="text-blue-400" />,
      title: "Open Safari",
      desc: "Launch Apple Safari on your iPhone or iPad. Make sure you're using Safari — this feature doesn't work on Chrome or other browsers.",
      visual: (
        <div className="relative w-full h-40 bg-[#0d0d1a] rounded-2xl border border-gray-800 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent" />
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Globe size={30} className="text-white" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Safari</span>
          </div>
        </div>
      ),
    },
    {
      icon: <Globe size={32} className="text-cyan-400" />,
      title: "Visit the App",
      desc: "In the Safari address bar, type or paste the URL below and tap Go.",
      visual: (
        <div className="w-full bg-[#0d0d1a] rounded-2xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 bg-gray-900 rounded-xl px-4 py-3 border border-gray-700">
            <Lock size={14} className="text-green-400 flex-shrink-0" />
            <span className="text-sm font-mono text-blue-400 truncate">app.dunexmarkets.com</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Tap and hold to copy ↑</p>
        </div>
      ),
    },
    {
      icon: <Share size={32} className="text-blue-400" />,
      title: 'Tap the Share Icon',
      desc: 'At the bottom of Safari, tap the Share button — it looks like a box with an arrow pointing upward.',
      visual: (
        <div className="w-full bg-[#0d0d1a] rounded-2xl border border-gray-800 p-4 relative">
          <div className="h-8 bg-gray-900 rounded-lg mb-3 flex items-center px-4">
            <div className="w-24 h-2 bg-gray-700 rounded-full" />
          </div>
          <div className="h-24 bg-gray-900 rounded-lg mb-3" />
          <div className="h-12 bg-[#111] rounded-xl flex items-center justify-around border-t border-gray-800">
            <div className="text-gray-700"><MoreHorizontal size={20} /></div>
            <div className="text-gray-700"><Home size={20} /></div>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse">
              <Share size={18} className="text-white" />
            </div>
            <div className="text-gray-700"><Plus size={20} /></div>
            <div className="text-gray-700"><MoreHorizontal size={20} /></div>
          </div>
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-0 h-0" style={{borderLeft:'8px solid transparent',borderRight:'8px solid transparent',borderTop:'10px solid #3b82f6'}} />
        </div>
      ),
    },
    {
      icon: <Plus size={32} className="text-cyan-400" />,
      title: '"Add to Home Screen"',
      desc: 'Scroll down in the Share menu until you see "Add to Home Screen". Tap it, then tap "Add" in the top-right corner.',
      visual: (
        <div className="w-full bg-[#0d0d1a] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <span className="text-sm font-semibold text-white">Share</span>
            <X size={14} className="text-gray-500" />
          </div>
          {['Copy Link', 'Message', 'Mail'].map(item => (
            <div key={item} className="px-4 py-3 flex items-center gap-3 border-b border-gray-800/50">
              <div className="w-8 h-8 rounded-lg bg-gray-800" />
              <span className="text-sm text-gray-400">{item}</span>
            </div>
          ))}
          <div className="px-4 py-3 flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 mx-2 my-1 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Plus size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-blue-300">Add to Home Screen</span>
          </div>
        </div>
      ),
    },
    {
      icon: <CheckCircle2 size={32} className="text-green-400" />,
      title: "You're All Set!",
      desc: "Dunex Markets is now installed on your home screen. Tap the icon anytime to launch the full app experience.",
      visual: (
        <div className="w-full bg-[#0d0d1a] rounded-2xl border border-gray-800 p-6 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
            <BarChart3 size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <p className="font-bold text-white text-lg">Dunex Markets</p>
            <p className="text-xs text-gray-500">app.dunexmarkets.com</p>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 size={18} />
            <span className="text-sm font-semibold">Added to Home Screen</span>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative bg-[#0a0a0f] border border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">iOS Installation Guide</p>
            <h3 className="text-lg font-black text-white">Add to Home Screen</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="flex gap-1.5 mb-6 relative z-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-blue-500' : 'bg-gray-800'}`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <span className="text-sm font-black text-blue-400">{step + 1}</span>
            </div>
            <h4 className="text-xl font-bold text-white">{current.title}</h4>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-5">{current.desc}</p>

          {current.visual}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6 relative z-10">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold text-sm hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
            >
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <a
              href="https://app.dunexmarkets.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Open App <ChevronRight size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ─────────────────────────────────────────────────────────
export default function DunexLandingPage() {
  const [iosModalOpen, setIosModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05050a] text-white selection:bg-blue-500/30 overflow-hidden font-sans">

      {iosModalOpen && <IOSModal onClose={() => setIosModalOpen(false)} />}

      {/* AMBIENT GLOWS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/15 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* NAVBAR */}
      <nav className="fixed w-full top-0 z-50 border-b border-white/5 bg-[#05050a]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <BarChart3 size={18} className="text-white" strokeWidth={3} />
            </div>
            <span className="text-xl font-black tracking-tight">DUNEX <span className="text-gray-500 font-medium">MARKETS</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#kyc" className="hover:text-white transition-colors">Compliance</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
          </div>

          <a
            href="https://app.dunexmarkets.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            Launch App
          </a>
        </div>
      </nav>

      {/* HERO */}
      <main className="pt-40 pb-24 px-6 max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Regulated · Verified · Trusted
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Institutional Trading.<br />
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                In Your Pocket.
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Dunex Markets delivers bank-grade infrastructure, real-time execution, and multi-asset trading across Forex, Crypto, Indices, and Commodities — all from one powerful mobile platform.
            </p>

            {/* DOWNLOAD BUTTONS */}
            <div id="download" className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">

              {/* iOS */}
              <button
                onClick={() => setIosModalOpen(true)}
                className="group relative flex items-center gap-4 bg-[#0e0e1a] border border-gray-800 p-4 rounded-2xl hover:border-blue-500/60 hover:bg-[#131323] transition-all w-full sm:w-auto shadow-lg"
              >
                <div className="bg-white text-black p-3 rounded-xl group-hover:scale-110 transition-transform shadow">
                  <Apple size={24} fill="currentColor" />
                </div>
                <div className="text-left pr-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Install on</p>
                  <p className="text-lg font-black text-white">iOS — Web App</p>
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Guide</div>
              </button>

              {/* Android */}
              <a
                href="/dunex-markets.apk"
                download
                className="group relative flex items-center gap-4 bg-[#0e0e1a] border border-gray-800 p-4 rounded-2xl hover:border-cyan-500/60 hover:bg-[#131323] transition-all w-full sm:w-auto shadow-lg"
              >
                <div className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Smartphone size={24} />
                </div>
                <div className="text-left pr-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Download for</p>
                  <p className="text-lg font-black text-white">Android — APK</p>
                </div>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-5 justify-center lg:justify-start text-xs text-gray-600">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" /> Verified secure installations</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-blue-500" /> No app store required</span>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex-1 relative hidden md:flex justify-center z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 blur-3xl rounded-full" />
            <div className="relative w-[290px] h-[590px] bg-[#0a0a0f] border-[7px] border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden transform rotate-[-4deg] hover:rotate-0 transition-all duration-700 hover:shadow-[0_0_60px_rgba(59,130,246,0.25)]">
              <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
                <div className="w-28 h-7 bg-gray-900 rounded-b-3xl" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#11111a] to-[#05050a] p-5 pt-12 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500 font-medium">Good morning</p>
                    <p className="text-sm font-bold text-white">Trader</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-xs font-black text-white">DM</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-4 mb-4">
                  <p className="text-gray-400 text-xs mb-1">Portfolio Value</p>
                  <p className="text-3xl font-black text-white">$124,590</p>
                  <p className="text-green-400 text-xs font-bold mt-1">▲ +3.24% today</p>
                </div>
                <div className="h-32 w-full mb-4 relative">
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                      <linearGradient id="fill2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,50 Q10,40 20,45 T40,20 T60,35 T80,10 T100,5 L100,50 Z" fill="url(#fill2)" />
                    <path d="M0,50 Q10,40 20,45 T40,20 T60,35 T80,10 T100,5" fill="none" stroke="url(#grad2)" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['BTC/USD','EUR/USD','XAU/USD','S&P 500'].map((pair, i) => (
                    <div key={pair} className="bg-gray-900/60 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-500 font-bold">{pair}</p>
                      <p className={`text-xs font-black mt-0.5 ${i % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {i % 2 === 0 ? '▲' : '▼'} {(Math.random()*3+0.5).toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STATS */}
      <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '$2B+', label: 'Quarterly Volume' },
            { val: '100k+', label: 'Active Traders' },
            { val: '99.99%', label: 'Platform Uptime' },
            { val: '<10ms', label: 'Order Execution' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-black text-white">{s.val}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Why Dunex Markets</p>
          <h2 className="text-3xl md:text-5xl font-black mb-5">The Competitive Edge<br />You've Been Missing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Dunex Markets was built from the ground up for serious traders who demand precision, speed, and transparency. We're not another clone — we're infrastructure-first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: <TrendingUp size={24} className="text-blue-400" />,
              color: 'blue',
              title: 'Institutional Liquidity',
              desc: 'We connect directly to Tier-1 liquidity providers — the same networks used by hedge funds and prime brokerages. No B-book manipulation, no conflict of interest. Your trades are executed in the real market.',
            },
            {
              icon: <Zap size={24} className="text-cyan-400" />,
              color: 'cyan',
              title: 'Zero Hidden Fees',
              desc: 'Our pricing model is fully transparent. What you see in the app is what you pay — no undisclosed markups, no withdrawal taxes. Your profits remain yours.',
            },
            {
              icon: <Users size={24} className="text-purple-400" />,
              color: 'purple',
              title: 'Built for Every Level',
              desc: 'Whether you\'re placing your first trade or managing a seven-figure portfolio, Dunex scales with you. Powerful tools, intuitive design, and dedicated support at every tier.',
            },
          ].map(card => (
            <div key={card.title} className="bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-blue-500/40 transition-colors group relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-40 h-40 bg-${card.color}-500/10 blur-[60px] rounded-full group-hover:opacity-150 transition-opacity`} />
              <div className={`w-12 h-12 rounded-2xl bg-${card.color}-500/10 border border-${card.color}-500/20 flex items-center justify-center mb-5`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
            <Award size={28} className="text-white" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-white mb-2">Our Commitment to You</h3>
            <p className="text-gray-400 leading-relaxed max-w-3xl">
              Dunex Markets operates with a fiduciary mindset. Client capital is segregated from company funds, all trading activity is audited, and our infrastructure is monitored 24/7. We hold ourselves to the highest standards so you can trade without second-guessing your platform.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Platform Features</p>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Built for the Elite.</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">Analyze, execute, and scale your portfolio from the palm of your hand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
            <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Lightning Execution Engine</h3>
            <p className="text-gray-400 leading-relaxed max-w-md">Our matching engine routes your orders directly to top-tier liquidity providers, ensuring near-zero slippage and near-instant fills across all asset classes.</p>
          </div>

          <div className="bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-green-500/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full group-hover:bg-green-500/20 transition-colors" />
            <div className="bg-green-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
              <Lock className="text-green-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Bank-Grade Vault</h3>
            <p className="text-gray-400 leading-relaxed">Military-grade encryption, biometric 2FA, and robust identity verification to safeguard every account.</p>
          </div>

          <div className="bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-colors group relative overflow-hidden">
            <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
              <Globe className="text-purple-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Global Markets</h3>
            <p className="text-gray-400 leading-relaxed">Trade Forex, Crypto, Indices, and Commodities all from a single unified wallet. One account, every market.</p>
          </div>

          <div className="md:col-span-2 bg-[#0a0a0f] border border-gray-800 rounded-3xl p-8 hover:border-cyan-500/50 transition-colors group relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
                <Headset className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">24/7 Priority Support</h3>
              <p className="text-gray-400 leading-relaxed max-w-sm">Skip the bots. Our in-app live chat connects you directly to a dedicated account manager in seconds — any time, any day.</p>
            </div>
            <div className="bg-[#11111a] border border-gray-800 p-4 rounded-2xl w-full md:w-64 shadow-xl">
              <div className="flex gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">D</div>
                <div className="bg-gray-800 rounded-xl rounded-tl-none p-3 text-sm text-gray-300">How can I help you scale today?</div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-blue-600/30 rounded-xl rounded-tr-none p-3 text-sm text-blue-300">I need help with a withdrawal.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Security Infrastructure</p>
          <h2 className="text-3xl md:text-5xl font-black mb-5">Your Capital.<br />Fortress-Level Protected.</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            At Dunex Markets, security isn't a feature — it's the foundation. We've architected every layer of our platform with one goal: keeping your funds and data untouchable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <Lock size={22} className="text-green-400" />,
              color: 'green',
              title: 'AES-256 Encryption',
              desc: 'All data transmitted between you and Dunex Markets is encrypted using AES-256 — the same standard trusted by global financial institutions and defence agencies. Your credentials and financial data are never exposed in transit or at rest.',
            },
            {
              icon: <Fingerprint size={22} className="text-blue-400" />,
              color: 'blue',
              title: 'Multi-Factor Authentication',
              desc: 'Every account is protected by mandatory two-factor authentication (2FA). Biometric login, OTP codes, and device-level trust management ensure that only you can access your account — even if your password is compromised.',
            },
            {
              icon: <Eye size={22} className="text-cyan-400" />,
              color: 'cyan',
              title: 'Real-Time Fraud Monitoring',
              desc: 'Our AI-powered surveillance engine monitors all account activity around the clock. Suspicious logins, unusual withdrawal patterns, and anomalous trading behavior trigger instant alerts and automatic account locks to protect you before damage occurs.',
            },
            {
              icon: <ShieldCheck size={22} className="text-purple-400" />,
              color: 'purple',
              title: 'Segregated Client Funds',
              desc: 'All client funds are held in fully segregated accounts with top-tier banking partners. Dunex Markets company funds are never commingled with client capital. In the unlikely event of insolvency, your funds remain protected and accessible.',
            },
            {
              icon: <AlertTriangle size={22} className="text-yellow-400" />,
              color: 'yellow',
              title: 'DDoS & Intrusion Protection',
              desc: 'Our cloud infrastructure is hardened against distributed denial-of-service attacks and unauthorized intrusions. Redundant data centres, edge firewalls, and automated threat response ensure our platform stays online during any attack.',
            },
            {
              icon: <Globe size={22} className="text-indigo-400" />,
              color: 'indigo',
              title: 'Secure API Access',
              desc: 'For advanced traders using our API, all endpoints are secured with signed request authentication, IP whitelisting, and rate-limiting. You stay in full control of your automated strategies without exposing your account.',
            },
          ].map(item => (
            <div key={item.title} className="bg-[#0a0a0f] border border-gray-800 rounded-2xl p-7 hover:border-gray-600 transition-colors flex gap-5">
              <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KYC / COMPLIANCE */}
      <section id="kyc" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Compliance & Regulation</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6">KYC & AML:<br />Compliance You<br />Can Trust</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Dunex Markets operates within a comprehensive regulatory framework. Our Know Your Customer (KYC) and Anti-Money Laundering (AML) programs meet international standards set by FATF, ensuring that our platform is safe for every legitimate trader.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Verification is fast, secure, and fully digital. We use industry-leading identity verification technology to confirm your identity in minutes — protecting both you and the integrity of the platform.
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Government-issued ID verification (passport, national ID, driver\'s licence)',
                'Proof of address confirmation',
                'Biometric liveness check to prevent identity fraud',
                'Enhanced Due Diligence (EDD) for high-value accounts',
                'Continuous transaction monitoring for AML compliance',
                'All data handled under strict privacy regulations',
              ].map(point => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-400 text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <FileCheck size={28} className="text-blue-400" />, title: 'Identity Verification', sub: 'Powered by AI-based document scanning' },
              { icon: <ShieldCheck size={28} className="text-green-400" />, title: 'AML Screening', sub: 'Global watchlist & PEP checks' },
              { icon: <Eye size={28} className="text-cyan-400" />, title: 'Transaction Monitoring', sub: 'Real-time risk scoring engine' },
              { icon: <Lock size={28} className="text-purple-400" />, title: 'Data Protection', sub: 'GDPR-aligned data handling' },
            ].map(card => (
              <div key={card.title} className="bg-[#0a0a0f] border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
                  {card.icon}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{card.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{card.sub}</p>
              </div>
            ))}
            <div className="col-span-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border border-blue-500/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Fast-Track Verification</p>
                <p className="text-xs text-gray-400 mt-0.5">Most accounts are verified within 10 minutes. Upload your documents once — trade for life.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-b from-[#0d0d20] to-[#07071a] border border-blue-500/20 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 relative z-10">Get Started Today</p>
            <h2 className="text-3xl md:text-5xl font-black mb-5 relative z-10">Ready to Trade<br />Like a Professional?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto relative z-10">Download the Dunex Markets app directly to your device. Full installation takes under 60 seconds — and your first trade is minutes away.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <button
                onClick={() => setIosModalOpen(true)}
                className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Apple size={20} fill="currentColor" /> iOS Web App
              </button>
              <a
                href="/dunex-markets.apk"
                download
                className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-500 transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                <Smartphone size={20} /> Android APK <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-900 bg-[#020205] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                <BarChart3 size={16} className="text-white" strokeWidth={3} />
              </div>
              <span className="font-black tracking-tight">DUNEX <span className="text-gray-500 font-medium">MARKETS</span></span>
            </div>
            <p className="text-xs text-gray-600 max-w-xs leading-relaxed">Institutional-grade trading infrastructure for the modern trader. Regulated, verified, and built for performance.</p>
          </div>
          <div className="flex flex-wrap gap-10 text-sm text-gray-500">
            <div>
              <p className="text-white font-bold mb-3">Platform</p>
              <div className="flex flex-col gap-2">
                <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
                <a href="#security" className="hover:text-gray-300 transition-colors">Security</a>
                <a href="#download" className="hover:text-gray-300 transition-colors">Download</a>
              </div>
            </div>
            <div>
              <p className="text-white font-bold mb-3">Legal</p>
              <div className="flex flex-col gap-2">
                <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-300 transition-colors">AML/KYC Policy</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-5 border-t border-gray-900">
          <p className="text-xs text-gray-700 text-center">© 2026 Dunex Markets. All rights reserved. Trading involves risk. Past performance is not indicative of future results.</p>
        </div>
      </footer>
    </div>
  );
}
