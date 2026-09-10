"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  MessageSquare, 
  Headphones, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Sliders,
  Send
} from "lucide-react";

type SupportTicket = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  query: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
};

type Registration = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  ticket_type: string;
  pass_code: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'tasbih' | 'tickets' | 'registrations' | 'donations'>('tasbih');
  const [tasbihCount, setTasbihCount] = useState<number>(0);
  const [newTasbihInput, setNewTasbihInput] = useState<string>('');
  const [updatingTasbih, setUpdatingTasbih] = useState<boolean>(false);
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [donationStats, setDonationStats] = useState<{ grandTotal: number; totalDonors: number; categoryTotals: Record<string, number> }>({
    grandTotal: 0,
    totalDonors: 0,
    categoryTotals: {},
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Tasbih count
      const tasbihRes = await fetch('/api/tasbih');
      const tasbihData = await tasbihRes.json();
      if (tasbihData.success) {
        setTasbihCount(tasbihData.count);
        setNewTasbihInput(String(tasbihData.count));
      }

      // 2. Support tickets
      const ticketsRes = await fetch('/api/admin/tickets');
      const ticketsData = await ticketsRes.json();
      if (ticketsData.success) {
        setTickets(ticketsData.tickets || []);
      }

      // 3. Donations
      const donationsRes = await fetch('/api/donate');
      const donationsData = await donationsRes.json();
      if (donationsData.success) {
        setDonationStats({
          grandTotal: donationsData.grandTotal || 0,
          totalDonors: donationsData.totalDonors || 0,
          categoryTotals: donationsData.categoryTotals || {},
        });
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateTasbih = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newTasbihInput);
    if (isNaN(val) || val < 0) return;

    setUpdatingTasbih(true);
    try {
      const res = await fetch('/api/tasbih', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: val }),
      });
      const data = await res.json();
      if (data.success) {
        setTasbihCount(data.count);
        alert(`Global Tasbīh count updated successfully to ${data.count.toLocaleString()}`);
      }
    } catch (err) {
      console.error('Failed to update tasbih count:', err);
    } finally {
      setUpdatingTasbih(false);
    }
  };

  const handleUpdateTicketStatus = async (id: number, status: 'pending' | 'in_progress' | 'resolved') => {
    try {
      await fetch('/api/admin/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-slate-950 text-ink dark:text-slate-100">
      {/* Admin Top Header */}
      <header className="border-b border-ink/10 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-vivid animate-pulse" />
              <h1 className="text-xl font-bold tracking-tight text-pine dark:text-emerald-400">
                Lateeful Akbar 2027 Admin Console
              </h1>
            </div>
            <p className="text-xs text-faded dark:text-slate-400 mt-1">
              Event Control Center &bull; Tasbīh Manager &bull; Customer Support Handoff
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-mist dark:bg-slate-800 text-pine dark:text-emerald-300 border border-ink/15 dark:border-slate-700 hover:bg-sage transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Dashboard
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-ink/10 dark:border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('tasbih')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'tasbih'
                ? 'bg-vivid text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-ink dark:text-slate-400 border border-ink/15 dark:border-slate-800 hover:bg-cream'
            }`}
          >
            <Sliders className="h-4 w-4" /> Live Tasbīh Control
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'tickets'
                ? 'bg-vivid text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-ink dark:text-slate-400 border border-ink/15 dark:border-slate-800 hover:bg-cream'
            }`}
          >
            <Headphones className="h-4 w-4" /> Support Tickets ({tickets.filter(t => t.status === 'pending').length})
          </button>

          <button
            onClick={() => setActiveTab('donations')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'donations'
                ? 'bg-vivid text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-ink dark:text-slate-400 border border-ink/15 dark:border-slate-800 hover:bg-cream'
            }`}
          >
            <DollarSign className="h-4 w-4" /> Donation Overview
          </button>
        </div>

        {/* Tab 1: Tasbīh Control */}
        {activeTab === 'tasbih' && (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-ink/15 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink dark:text-white mb-2">
                Live Global Tasbīh Counter
              </h2>
              <p className="text-xs text-faded dark:text-slate-400 mb-6">
                Directly adjust or seed the global Yaa Lateef count for the event.
              </p>

              <div className="bg-pine text-white p-6 rounded-2xl text-center mb-6 border border-emerald-800">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                  Current Global Recitation Total
                </span>
                <div className="text-5xl font-extrabold text-white my-2 tabular-nums">
                  {tasbihCount.toLocaleString()}
                </div>
                <span className="text-[11px] text-sage">
                  Updated in real-time across all public site visitors
                </span>
              </div>

              <form onSubmit={handleUpdateTasbih} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-faded dark:text-slate-400 mb-2">
                    Set New Count Value
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newTasbihInput}
                    onChange={(e) => setNewTasbihInput(e.target.value)}
                    placeholder="Enter starting count (e.g. 0 or 100000)"
                    className="w-full border border-ink/20 dark:border-slate-700 bg-paper dark:bg-slate-800 px-4 py-3 text-sm text-ink dark:text-white rounded-xl focus:border-vivid focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingTasbih}
                  className="w-full bg-vivid hover:bg-vivid-deep text-white font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {updatingTasbih ? "Updating..." : "Set Tasbīh Count Now"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-ink/15 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink dark:text-white mb-2">
                Quick Action Admin Controls
              </h2>
              <p className="text-xs text-faded dark:text-slate-400 mb-6">
                Pre-event fast settings for the organizing committee.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { setNewTasbihInput("0"); handleUpdateTasbih({ preventDefault: () => {} } as any); }}
                  className="w-full text-left p-4 rounded-xl border border-ink/15 dark:border-slate-800 hover:border-vivid transition-all flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-bold text-ink dark:text-white">Reset Counter to 0</h3>
                    <p className="text-[11px] text-faded">Clears current recitations to zero for clean start</p>
                  </div>
                  <span className="text-xs font-bold text-vivid">Apply</span>
                </button>

                <button
                  onClick={() => { setNewTasbihInput("100000"); handleUpdateTasbih({ preventDefault: () => {} } as any); }}
                  className="w-full text-left p-4 rounded-xl border border-ink/15 dark:border-slate-800 hover:border-vivid transition-all flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-bold text-ink dark:text-white">Seed with 100,000 baseline</h3>
                    <p className="text-[11px] text-faded">Includes pre-event opening sitting recitations</p>
                  </div>
                  <span className="text-xs font-bold text-vivid">Apply</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customer Support Tickets */}
        {activeTab === 'tickets' && (
          <div className="bg-white dark:bg-slate-900 border border-ink/15 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink dark:text-white mb-2">
              Customer Support Handoff Requests
            </h2>
            <p className="text-xs text-faded dark:text-slate-400 mb-6">
              Messages escalated from the AI Chatbot by visitors asking for human customer support.
            </p>

            {tickets.length === 0 ? (
              <div className="text-center py-12 text-faded text-xs">
                No customer support tickets received yet.
              </div>
            ) : (
              <div className="divide-y divide-ink/10 dark:divide-slate-800">
                {tickets.map((t) => (
                  <div key={t.id} className="py-4 flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-ink dark:text-white">{t.name}</span>
                        <span className="text-xs text-faded">({t.email})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          t.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-ink dark:text-slate-300 bg-cream dark:bg-slate-800/60 p-3 rounded-lg border border-ink/10 dark:border-slate-700">
                        "{t.query}"
                      </p>
                      <span className="text-[10px] text-faded block">
                        Received: {new Date(t.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateTicketStatus(t.id, 'in_progress')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleUpdateTicketStatus(t.id, 'resolved')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Donations Overview */}
        {activeTab === 'donations' && (
          <div className="bg-white dark:bg-slate-900 border border-ink/15 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink dark:text-white mb-2">
              Donations & Sadaqah Tally
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 my-6">
              <div className="p-5 rounded-2xl bg-pine text-white">
                <span className="text-xs uppercase tracking-wider text-sage font-semibold">Total Raised</span>
                <div className="text-3xl font-bold text-white mt-1">
                  ₦{donationStats.grandTotal.toLocaleString()}
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-cream dark:bg-slate-800 border border-ink/15 dark:border-slate-700">
                <span className="text-xs uppercase tracking-wider text-faded font-semibold">Total Donors</span>
                <div className="text-3xl font-bold text-ink dark:text-white mt-1">
                  {donationStats.totalDonors}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
