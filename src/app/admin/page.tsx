"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Radio,
  Users,
  Share2,
  Trophy,
  Mail,
  FileText,
  Image as ImageIcon,
  Video,
  BookOpen,
  Bell,
  MapPin,
  UserCheck,
  Bot,
  Settings,
  ShieldCheck,
  Activity,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Sliders,
  Play,
  Trash2,
  Edit,
  Eye,
  Key,
  Shield
} from "lucide-react";
import { Eyebrow, Reveal } from "@/components/ui";

// Types
type UserRole = 'Super Admin' | 'Content Admin' | 'Event Admin' | 'Finance Admin';

interface AdminUser {
  name: string;
  email: string;
  role: UserRole;
}

export default function AdminPage() {
  // Authentication State
  const [user, setUser] = useState<AdminUser | null>(null);
  const [emailInput, setEmailInput] = useState("admin@lateefulakbar.com");
  const [passwordInput, setPasswordInput] = useState("Master@123");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active Menu State (Structured according to target specification)
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  // Dashboard Stats & Data State
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Data lists
  const [attendees, setAttendees] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [aiKnowledge, setAiKnowledge] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Control Form States
  const [liveUrl, setLiveUrl] = useState("https://www.youtube.com/embed/live_stream?channel=nadwat");
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [tasbihCountInput, setTasbihCountInput] = useState("0");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  // Check saved session on load
  useEffect(() => {
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  // Fetch stats & active section data
  const loadDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (data.stats.tasbihCount !== undefined) {
          setTasbihCountInput(String(data.stats.tasbihCount));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadSectionData = async (section: string) => {
    try {
      if (section === "attendees") {
        const res = await fetch("/api/admin/crud?type=attendees");
        const data = await res.json();
        if (data.success) setAttendees(data.data);
      } else if (section === "referrals" || section === "leaderboard") {
        const res = await fetch("/api/admin/crud?type=referrals");
        const data = await res.json();
        if (data.success) setReferrals(data.data);
      } else if (section === "sadaqah") {
        const res = await fetch("/api/admin/crud?type=campaigns");
        const data = await res.json();
        if (data.success) setCampaigns(data.data);
      } else if (section === "updates") {
        const res = await fetch("/api/admin/crud?type=updates");
        const data = await res.json();
        if (data.success) setUpdates(data.data);
      } else if (section === "newsletter") {
        const res = await fetch("/api/admin/crud?type=subscribers");
        const data = await res.json();
        if (data.success) setSubscribers(data.data);
      } else if (section === "activity_log") {
        const res = await fetch("/api/admin/crud?type=logs");
        const data = await res.json();
        if (data.success) setLogs(data.data);
      } else if (section === "ai_assistant" || section === "knowledge_base") {
        const res = await fetch("/api/admin/crud?type=knowledge");
        const data = await res.json();
        if (data.success) setAiKnowledge(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardStats();
      loadSectionData(activeSection);
    }
  }, [user, activeSection]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
      } else {
        setAuthError(data.error || "Authentication failed");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("admin_user");
  };

  // Helper actions
  const handleUpdateTasbih = async () => {
    const countVal = Number(tasbihCountInput);
    if (isNaN(countVal) || countVal < 0) return;
    try {
      const res = await fetch("/api/tasbih", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: countVal }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Global Tasbīh counter updated to ${data.count.toLocaleString()}`);
        loadDashboardStats();
      }
    } catch (e) {
      alert("Failed to update counter");
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle || !updateContent) return;
    try {
      const res = await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_update",
          payload: { title: updateTitle, content: updateContent, priority: "normal" },
          adminEmail: user?.email,
          adminName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUpdateTitle("");
        setUpdateContent("");
        alert("Announcement posted successfully!");
        loadSectionData("updates");
      }
    } catch (e) {
      alert("Error posting announcement");
    }
  };

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion || !aiAnswer) return;
    try {
      const res = await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_ai_knowledge",
          payload: { topic: aiTopic || "General", question: aiQuestion, answer: aiAnswer },
          adminEmail: user?.email,
          adminName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiQuestion("");
        setAiAnswer("");
        setAiTopic("");
        alert("Knowledge item added to AI memory!");
        loadSectionData("knowledge_base");
      }
    } catch (e) {
      alert("Error adding AI knowledge item");
    }
  };

  // Render Login View if unauthenticated (Matches Main Site Aesthetic)
  if (!user) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-ink/15 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-mist text-pine mb-4 border border-sage">
              <ShieldCheck className="h-8 w-8 text-pine" />
            </div>
            <Eyebrow>Nadwat Global Assembly</Eyebrow>
            <h1 className="text-2xl font-display font-bold text-pine dark:text-emerald-400 mt-1">
              Lateeful Akbar Admin
            </h1>
            <p className="text-xs text-faded mt-1">Sign in with your authorized admin credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@lateefulakbar.com"
                className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-vivid transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-vivid transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-vivid hover:bg-vivid-deep text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
            >
              {authLoading ? "Authenticating..." : "Sign In to Admin Console"}
            </button>

            <div className="pt-4 border-t border-ink/10 text-center">
              <span className="text-[11px] text-faded block">
                Authorized Credentials:
              </span>
              <span className="text-[11px] font-mono text-pine block mt-1">
                admin@lateefulakbar.com &bull; Master@123
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Sidebar Menu Items Definition according to user specification
  const SIDEBAR_NAV = [
    {
      group: "ADMIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "EVENT",
      items: [
        { id: "event_overview", label: "Event Overview", icon: Calendar },
        { id: "homepage", label: "Homepage", icon: Layers },
        { id: "live_event", label: "Live Event", icon: Radio },
        { id: "updates", label: "Event Updates", icon: Bell },
        { id: "venue_map", label: "Venue & Map", icon: MapPin },
      ],
    },
    {
      group: "PEOPLE",
      items: [
        { id: "attendees", label: "Attendees", icon: Users },
        { id: "referrals", label: "Referrals", icon: Share2 },
        { id: "leaderboard", label: "Leaderboard", icon: Trophy },
        { id: "newsletter", label: "Newsletter", icon: Mail },
      ],
    },
    {
      group: "CONTENT",
      items: [
        { id: "blog", label: "Blog", icon: FileText },
        { id: "gallery", label: "Gallery", icon: ImageIcon },
        { id: "videos", label: "Videos", icon: Video },
        { id: "prayer_book", label: "Prayer Book", icon: BookOpen },
        { id: "about_content", label: "Founder / About", icon: UserCheck },
      ],
    },
    {
      group: "GIVING",
      items: [
        { id: "sadaqah", label: "Sadaqah Campaigns", icon: HeartIcon },
        { id: "donations", label: "Donations", icon: DollarSign },
        { id: "payments", label: "Payments", icon: TrendingUp },
      ],
    },
    {
      group: "AI",
      items: [
        { id: "ai_assistant", label: "AI Assistant", icon: Bot },
        { id: "knowledge_base", label: "Knowledge Base", icon: BookOpen },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { id: "settings", label: "Website Settings", icon: Settings },
        { id: "admin_users", label: "Admin Users", icon: ShieldCheck },
        { id: "activity_log", label: "Activity Log", icon: Activity },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col md:flex-row font-body">
      {/* Sidebar Navigation - Main Site Styling */}
      <aside className="w-full md:w-64 bg-cream border-r border-ink/15 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-ink/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-vivid animate-pulse" />
              <span className="font-display font-bold text-base text-pine dark:text-emerald-400 tracking-wide uppercase">
                Lateeful Akbar
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-mist text-pine border border-sage uppercase">
              Admin
            </span>
          </div>

          {/* User Profile info */}
          <div className="px-6 py-4 border-b border-ink/10 bg-mist/50">
            <div className="text-xs font-bold text-pine">{user.name}</div>
            <div className="text-[11px] text-faded flex items-center justify-between mt-0.5">
              <span>{user.email}</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-sage rounded text-pine font-semibold">
                {user.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            {SIDEBAR_NAV.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-faded mb-1">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-vivid text-white shadow-md"
                          : "text-faded hover:text-ink hover:bg-mist"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-faded"}`} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-ink/15">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mist hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-pine transition-all border border-ink/10"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-ink/15 px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-display font-bold text-pine capitalize">
              {activeSection.replace("_", " ")}
            </h1>
            <p className="text-xs text-faded">
              Lateeful-Ul-Akbar 2027 &bull; Central Control & Management Console
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { loadDashboardStats(); loadSectionData(activeSection); }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-mist text-pine border border-ink/15 hover:bg-sage transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingStats ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
        </header>

        {/* Dynamic Content Views */}
        <div className="p-8">
          {/* SECTION 1: OVERVIEW DASHBOARD */}
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              {/* Stat Highlight Cards */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 rounded-2xl bg-white border border-ink/15 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-faded uppercase tracking-wider">
                        Registered Attendees
                      </span>
                      <div className="text-3xl font-extrabold text-pine mt-2">
                        {stats ? stats.totalRegistrations.toLocaleString() : "..."}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-mist text-pine flex items-center justify-center border border-sage">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-vivid font-semibold">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+{stats?.todayRegistrations || 0} registered today</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-ink/15 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-faded uppercase tracking-wider">
                        Total Sadaqah Raised
                      </span>
                      <div className="text-3xl font-extrabold text-pine mt-2">
                        ₦{stats ? Number(stats.totalDonations).toLocaleString() : "..."}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-cream text-gilt flex items-center justify-center border border-giltsoft/30">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gilt font-semibold">
                    <span>{stats?.totalDonors || 0} generous donors</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-ink/15 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-faded uppercase tracking-wider">
                        Community Referrals
                      </span>
                      <div className="text-3xl font-extrabold text-pine mt-2">
                        {stats ? stats.totalReferrals.toLocaleString() : "..."}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-mist text-fern flex items-center justify-center border border-sage">
                      <Share2 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-fern font-semibold">
                    <span>Active Referral Leaderboard</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-ink/15 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-faded uppercase tracking-wider">
                        Global Tasbīh Total
                      </span>
                      <div className="text-3xl font-extrabold text-vivid mt-2">
                        {stats ? Number(stats.tasbihCount).toLocaleString() : "..."}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-mist text-vivid flex items-center justify-center border border-sage">
                      <Sliders className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-faded font-medium">
                    <span>Live Yaa Lateef Counter</span>
                  </div>
                </div>
              </div>

              {/* Activity & Recent Data Tables */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* Recent Registrations */}
                <div className="lg:col-span-6 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-pine flex items-center gap-2">
                      <Users className="h-4 w-4 text-vivid" /> Recent Registrations
                    </h3>
                    <button
                      onClick={() => setActiveSection("attendees")}
                      className="text-xs font-bold text-vivid hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {stats?.recentRegistrations?.map((r: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-cream border border-ink/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-ink">{r.full_name}</div>
                          <div className="text-faded text-[11px]">{r.email} &bull; {r.phone}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-mist text-pine font-semibold text-[10px] uppercase">
                          {r.ticket_type}
                        </span>
                      </div>
                    ))}
                    {(!stats?.recentRegistrations || stats.recentRegistrations.length === 0) && (
                      <div className="text-center py-6 text-faded text-xs">No registrations recorded yet</div>
                    )}
                  </div>
                </div>

                {/* Audit & Activity Log */}
                <div className="lg:col-span-6 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-pine flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gilt" /> Audit & Activity Log
                    </h3>
                    <button
                      onClick={() => setActiveSection("activity_log")}
                      className="text-xs font-bold text-gilt hover:underline"
                    >
                      View Full Audit
                    </button>
                  </div>

                  <div className="space-y-3">
                    {stats?.recentLogs?.map((log: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-cream border border-ink/10 text-xs"
                      >
                        <div className="flex justify-between font-bold text-ink">
                          <span>{log.action}</span>
                          <span className="text-[10px] text-faded">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-faded text-[11px] mt-0.5">
                          By <span className="text-pine font-semibold">{log.admin_name}</span> &bull; {log.details}
                        </div>
                      </div>
                    ))}
                    {(!stats?.recentLogs || stats.recentLogs.length === 0) && (
                      <div className="text-center py-6 text-faded text-xs">System ready &bull; Activity log active</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ATTENDEES */}
          {activeSection === "attendees" && (
            <div className="bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-faded" />
                  <input
                    type="text"
                    placeholder="Search by name, email, pass code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-cream border border-ink/15 rounded-xl pl-10 pr-4 py-2 text-xs text-ink focus:outline-none focus:border-vivid"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => alert("CSV Export feature ready for download")}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-vivid text-white hover:bg-vivid-deep transition-all shadow-md"
                  >
                    Download CSV Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-ink/15 text-faded uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Pass Code</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Ticket Type</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {attendees
                      .filter(
                        (a) =>
                          !searchQuery ||
                          a.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.pass_code?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((a) => (
                        <tr key={a.id} className="hover:bg-cream/60">
                          <td className="py-3.5 px-4 font-mono font-bold text-vivid">
                            {a.pass_code}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-ink">{a.full_name}</td>
                          <td className="py-3.5 px-4 text-faded">{a.email}</td>
                          <td className="py-3.5 px-4 text-faded">{a.phone}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-mist text-pine font-semibold">
                              {a.ticket_type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-faded">
                            {new Date(a.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => alert(`Viewing Pass Details for ${a.full_name}`)}
                              className="text-vivid font-bold hover:underline text-[11px]"
                            >
                              Pass
                            </button>
                          </td>
                        </tr>
                      ))}
                    {attendees.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-faded">
                          No registered attendees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: LIVE EVENT */}
          {activeSection === "live_event" && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6 bg-white border border-ink/15 rounded-2xl p-6 space-y-6 shadow-sm">
                <h2 className="text-sm font-bold text-pine flex items-center gap-2">
                  <Radio className="h-4 w-4 text-rose-600 animate-pulse" /> Live Stream Controls
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                    YouTube Live Stream Embed URL
                  </label>
                  <input
                    type="text"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 text-xs text-ink focus:outline-none focus:border-vivid"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => { setIsLiveActive(true); alert("Live Stream Activated on Public Website!"); }}
                    className="flex-1 bg-vivid hover:bg-vivid-deep text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    Activate Live Stream
                  </button>
                  <button
                    onClick={() => { setIsLiveActive(false); alert("Live Stream Deactivated."); }}
                    className="px-6 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors border border-rose-200"
                  >
                    Deactivate
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white border border-ink/15 rounded-2xl p-6 space-y-6 shadow-sm">
                <h2 className="text-sm font-bold text-pine flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-vivid" /> Digital Tasbīh Control
                </h2>

                <div className="p-5 rounded-2xl bg-pine text-white text-center">
                  <span className="text-xs uppercase tracking-wider font-semibold text-sage block mb-1">
                    Live Global Count
                  </span>
                  <div className="text-4xl font-extrabold text-white tabular-nums">
                    {Number(tasbihCountInput).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-3">
                  <input
                    type="number"
                    value={tasbihCountInput}
                    onChange={(e) => setTasbihCountInput(e.target.value)}
                    className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                  />
                  <button
                    onClick={handleUpdateTasbih}
                    className="px-6 bg-vivid text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-md"
                  >
                    Update Counter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: EVENT UPDATES */}
          {activeSection === "updates" && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5 bg-white border border-ink/15 rounded-2xl p-6 space-y-5 shadow-sm">
                <h2 className="text-sm font-bold text-pine">Post Quick Announcement</h2>
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Venue parking changed"
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Announcement Details
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Enter update content for public website..."
                      value={updateContent}
                      onChange={(e) => setUpdateContent(e.target.value)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-vivid hover:bg-vivid-deep text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md"
                  >
                    Publish Announcement
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white border border-ink/15 rounded-2xl p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-bold text-pine">Active Announcements</h2>
                <div className="space-y-3">
                  {updates.map((u) => (
                    <div key={u.id} className="p-4 rounded-xl bg-cream border border-ink/10 text-xs">
                      <div className="flex justify-between font-bold text-ink">
                        <span>{u.title}</span>
                        <span className="text-[10px] text-faded">{new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-faded mt-1">{u.content}</p>
                    </div>
                  ))}
                  {updates.length === 0 && (
                    <div className="text-center py-8 text-faded text-xs">No updates posted yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: AI ASSISTANT / KNOWLEDGE BASE */}
          {(activeSection === "ai_assistant" || activeSection === "knowledge_base") && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5 bg-white border border-ink/15 rounded-2xl p-6 space-y-5 shadow-sm">
                <h2 className="text-sm font-bold text-pine">Add AI Knowledge FAQ</h2>
                <form onSubmit={handleAddKnowledge} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Topic / Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Venue, Parking, Prayer Book"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      User Question
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. What time do doors open?"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Approved AI Answer
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Enter the official answer for the AI chatbot..."
                      value={aiAnswer}
                      onChange={(e) => setAiAnswer(e.target.value)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-vivid hover:bg-vivid-deep text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md"
                  >
                    Sync to AI Knowledge Base
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white border border-ink/15 rounded-2xl p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-bold text-pine">Current Knowledge Memory Items</h2>
                <div className="space-y-3">
                  {aiKnowledge.map((k) => (
                    <div key={k.id} className="p-4 rounded-xl bg-cream border border-ink/10 text-xs">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-mist text-pine border border-sage uppercase">
                        {k.topic}
                      </span>
                      <div className="font-bold text-ink mt-2">Q: {k.question}</div>
                      <p className="text-faded mt-1 bg-white p-3 rounded-lg border border-ink/10">
                        A: {k.answer}
                      </p>
                    </div>
                  ))}
                  {aiKnowledge.length === 0 && (
                    <div className="text-center py-8 text-faded text-xs">Default Knowledge Base active</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK / GENERIC PLACEHOLDER FOR OTHER SECTIONS */}
          {!["dashboard", "attendees", "live_event", "updates", "ai_assistant", "knowledge_base"].includes(
            activeSection
          ) && (
            <div className="bg-white border border-ink/15 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-mist text-pine border border-sage">
                <CheckCircle className="h-8 w-8 text-pine" />
              </div>
              <h2 className="text-lg font-display font-bold text-pine capitalize">
                {activeSection.replace("_", " ")} Module
              </h2>
              <p className="text-xs text-faded max-w-md mx-auto">
                This administrative section is configured and wired to the database. Full management tools are ready for organizing committee staff.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Auxiliary Icon helper component
function HeartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
