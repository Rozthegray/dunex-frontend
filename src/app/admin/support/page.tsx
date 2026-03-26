"use client";

import { useState, useEffect } from "react";
import { LifeBuoy, Send, Mail, AlertTriangle, MessageSquare, Reply } from "lucide-react";

// Using standard fetch since we need custom endpoints not in apiClient yet
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ADMIN_TOKEN = () => typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [targetUser, setTargetUser] = useState("all");
  const [customEmail, setCustomEmail] = useState("");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const fetchTickets = async () => {
    const res = await fetch(`${API_BASE}/chat/admin/support/tickets`, { headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` } });
    if (res.ok) setTickets(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/chat/admin/support/users`, { headers: { Authorization: `Bearer ${ADMIN_TOKEN()}` } });
    if (res.ok) setUsers(await res.json());
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUser === "all" && !confirm("Are you sure you want to email EVERY user on the platform?")) return;
    if (targetUser === "custom" && !customEmail.trim()) {
      alert("Please enter a custom email address.");
      return;
    }
    
    setIsBroadcasting(true);
    try {
      const res = await fetch(`${API_BASE}/chat/admin/support/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN()}` },
        body: JSON.stringify({ 
          target_user_id: targetUser, 
          custom_email: customEmail,
          subject: broadcastSubject, 
          message: broadcastMessage 
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(`Success! Email queued for ${data.recipients} user(s).`);
        setBroadcastSubject("");
        setBroadcastMessage("");
        setCustomEmail("");
      } else {
        alert(data.detail || "Failed to send email.");
      }
    } catch (error) {
      alert("Error sending email to server.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="relative min-h-full pb-10">
      {/* AMBIENT GLOWS */}
      <div className="hidden dark:block absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Support & Broadcast Desk</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Review formal client tickets and execute mass email communications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Tickets */}
        <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 flex flex-col h-[750px]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center">
              <LifeBuoy size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            Formal Support Tickets
          </h2>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-600">
                <MessageSquare size={32} className="mb-3 opacity-50" />
                <p className="text-sm font-medium italic">No formal tickets found in the queue.</p>
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="p-5 border border-gray-100 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-[#05050a] hover:border-blue-200 dark:hover:border-white/10 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">{t.name}</span>
                      <span className="text-gray-500 text-xs font-mono mt-0.5">{t.user_email}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{t.subject}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{t.message}</p>
                  
                  {t.attachment && (
                    <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                      📎 Attached: {t.attachment}
                    </div>
                  )}
                  
                  {/* QUICK REPLY BUTTON */}
                  <div className="mt-5 flex justify-end">
                    <button 
                      onClick={() => {
                        setTargetUser("custom");
                        setCustomEmail(t.user_email);
                        setBroadcastSubject(`RE: ${t.subject}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs bg-blue-100 dark:bg-blue-600 hover:bg-blue-200 dark:hover:bg-blue-500 text-blue-700 dark:text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    >
                      <Reply size={14} /> Quick Reply
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Broadcast / Direct Email */}
        <div className="bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-white/5 p-6 md:p-8 h-fit relative overflow-hidden">
          {/* Red glow for alert mode when broadcasting to all */}
          {targetUser === 'all' && (
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
          )}
          
          <h2 className={`text-xl font-bold mb-8 flex items-center gap-3 ${targetUser === 'all' ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              targetUser === 'all' ? 'bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' : 'bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20'
            }`}>
              <Send size={16} className={targetUser === 'all' ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'} />
            </div>
            Communications Relay
          </h2>

          <form onSubmit={handleBroadcast} className="space-y-5">
            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Target Recipient</label>
              <select 
                value={targetUser} 
                onChange={(e) => setTargetUser(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl py-3.5 px-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all cursor-pointer font-medium"
              >
                <option value="all" className="font-bold text-red-600">🚨 MASS BROADCAST (All Users)</option>
                <option value="custom" className="font-bold text-blue-600">✏️ Custom External Email</option>
                <optgroup label="Registered Clients" className="font-medium text-gray-500">
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* DYNAMIC CUSTOM EMAIL INPUT */}
            {targetUser === "custom" && (
              <div>
                <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">External Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="email" 
                    required 
                    value={customEmail} 
                    onChange={(e) => setCustomEmail(e.target.value)} 
                    className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/30 text-gray-900 dark:text-white rounded-xl py-3.5 pl-11 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700" 
                    placeholder="Enter external recipient..." 
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Transmission Subject</label>
              <input 
                type="text" 
                required 
                value={broadcastSubject} 
                onChange={(e) => setBroadcastSubject(e.target.value)} 
                className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl p-3.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700"
                placeholder="e.g. Account Maintenance Notice"
              />
            </div>
            
            <div>
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Payload / Message</label>
              <textarea 
                required 
                rows={7} 
                value={broadcastMessage} 
                onChange={(e) => setBroadcastMessage(e.target.value)} 
                className="w-full bg-gray-50 dark:bg-[#05050a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700 resize-none leading-relaxed"
                placeholder="Type your communication here..."
              />
            </div>

            <button 
              type="submit" 
              disabled={isBroadcasting} 
              className={`w-full font-bold py-4 rounded-xl text-white transition-all flex items-center justify-center gap-2 ${
                targetUser === 'all' 
                ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              } disabled:opacity-50 disabled:hover:shadow-none`}
            >
              {isBroadcasting ? (
                <span className="animate-pulse uppercase tracking-widest text-sm">Transmitting...</span>
              ) : (
                <>
                  {targetUser === 'all' && <AlertTriangle size={18} />}
                  {targetUser === "all" ? "EXECUTE MASS BROADCAST" : "TRANSMIT EMAIL"}
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}