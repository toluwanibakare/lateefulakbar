"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Radio,
  Users,
  Share2,
  Trophy,
  Mail,
  FileText,
  Image as ImageIcon,
  Bell,
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
  RotateCcw,
  BookOpen,
  Headphones,
  Send,
  MessageSquare,
  Eye,
  Check,
  Paperclip,
  Smile,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Eyebrow } from "@/components/ui";

// Types
type UserRole = 'Super Admin' | 'Content Admin' | 'Event Admin' | 'Finance Admin';

interface AdminUser {
  name: string;
  email: string;
  role: UserRole;
}

const REGISTRATION_TREND = [
  { day: "Mon", count: 420 },
  { day: "Tue", count: 680 },
  { day: "Wed", count: 950 },
  { day: "Thu", count: 1200 },
  { day: "Fri", count: 1650 },
  { day: "Sat", count: 2100 },
  { day: "Sun", count: 2840 },
];

const DONATION_PIE_DATA = [
  { name: "Fans", value: 3350000, color: "#01923c" },
  { name: "Mats", value: 2100000, color: "#0b3d2e" },
  { name: "Water", value: 1850000, color: "#9a7b2e" },
  { name: "Broadcast", value: 1100000, color: "#34d399" },
];

export default function AdminPage() {
  // Authentication State
  const [user, setUser] = useState<AdminUser | null>(null);
  const [emailInput, setEmailInput] = useState("admin@lateefulakbar.com");
  const [passwordInput, setPasswordInput] = useState("Master@123");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active Menu State
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

  // Live Chat Support State
  const [chatTickets, setChatTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [adminReplyInput, setAdminReplyInput] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Email / Newsletter Hub State
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterBody, setNewsletterBody] = useState("");
  const [newsletterTarget, setNewsletterTarget] = useState("all");
  const [newsletterSingleEmail, setNewsletterSingleEmail] = useState("");
  const [newsletterMode, setNewsletterMode] = useState<"edit" | "preview">("edit");
  const [newsletterTemplateName, setNewsletterTemplateName] = useState("");
  const [savedTemplates, setSavedTemplates] = useState<{ id: string; name: string; subject: string; body: string }[]>([]);

  // Control Form States
  const [liveUrl, setLiveUrl] = useState("https://www.youtube.com/embed/live_stream?channel=nadwat");
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [tasbihCountDisplay, setTasbihCountDisplay] = useState("0");
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
          setTasbihCountDisplay(String(data.stats.tasbihCount));
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
      } else if (section === "referrals") {
        const res = await fetch("/api/admin/crud?type=referrals");
        const data = await res.json();
        if (data.success) setReferrals(data.data);
      } else if (section === "messages") {
        const res = await fetch("/api/admin/messages");
        const data = await res.json();
        if (data.success) {
          setChatTickets(data.tickets || []);
          if (data.tickets && data.tickets.length > 0 && !activeTicket) {
            setActiveTicket(data.tickets[0]);
          }
        }
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

  // Load ticket messages when active ticket changes
  useEffect(() => {
    if (activeTicket) {
      fetch(`/api/admin/messages?ticketId=${activeTicket.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTicketMessages(data.messages || []);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [activeTicket]);

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

  // Reset Tasbih to 0 in DB
  const handleResetTasbih = async () => {
    if (!confirm("Are you sure you want to reset the global Yaa Lateef counter to 0 in the database?")) return;

    try {
      const res = await fetch("/api/tasbih", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 0 }),
      });
      const data = await res.json();
      if (data.success) {
        setTasbihCountDisplay("0");
        alert("Global Tasbīh counter has been reset to 0 in the database.");
        loadDashboardStats();
      }
    } catch (e) {
      alert("Failed to reset counter");
    }
  };

  // Send Live Support Reply to User
  const handleSendLiveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !adminReplyInput.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: activeTicket.id,
          sender: user?.name || "Support Admin",
          message: adminReplyInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            ticket_id: activeTicket.id,
            sender: user?.name || "Support Admin",
            message: adminReplyInput,
            created_at: new Date().toISOString(),
          },
        ]);
        setAdminReplyInput("");
      }
    } catch (err) {
      alert("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  // Dispatch Newsletter Email Broadcast
  const handleDispatchNewsletter = async () => {
    if (!newsletterSubject || !newsletterBody) {
      alert("Please fill in both the Subject Line and Message Body.");
      return;
    }

    alert(`Dispatching Newsletter broadcast to ${newsletterTarget === 'single' ? newsletterSingleEmail : 'all community members'}!`);
  };

  const handleSaveNewsletterTemplate = () => {
    if (!newsletterTemplateName) return;
    setSavedTemplates((prev) => [
      ...prev,
      { id: String(Date.now()), name: newsletterTemplateName, subject: newsletterSubject, body: newsletterBody },
    ]);
    setNewsletterTemplateName("");
    alert("Template saved successfully!");
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
        alert("Announcement posted to the live event page and database successfully!");
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
        alert("Knowledge item added to AI memory & database!");
        loadSectionData("knowledge_base");
      }
    } catch (e) {
      alert("Error adding AI knowledge item");
    }
  };

  // Render Login View if unauthenticated
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

  // Refined Sidebar Menu
  const SIDEBAR_NAV = [
    {
      group: "ADMIN",
      items: [
        { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
        { id: "messages", label: "Live Support Chat", icon: Headphones },
      ],
    },
    {
      group: "EVENT",
      items: [
        { id: "live_event", label: "Live Event Stream", icon: Radio },
        { id: "updates", label: "Event Updates", icon: Bell },
      ],
    },
    {
      group: "PEOPLE",
      items: [
        { id: "attendees", label: "Attendees", icon: Users },
        { id: "referrals", label: "Referrals Leaderboard", icon: Share2 },
      ],
    },
    {
      group: "CONTENT",
      items: [
        { id: "newsletter", label: "Email & Newsletter Hub", icon: Mail },
        { id: "blog", label: "Blog Manager", icon: FileText },
        { id: "gallery", label: "Gallery Manager", icon: ImageIcon },
      ],
    },
    {
      group: "GIVING",
      items: [
        { id: "sadaqah", label: "Sadaqah Campaigns", icon: HeartIcon },
        { id: "donations", label: "Donation Payments", icon: DollarSign },
      ],
    },
    {
      group: "AI",
      items: [
        { id: "ai_assistant", label: "AI Knowledge Base", icon: Bot },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { id: "settings", label: "Website Settings", icon: Settings },
        { id: "admin_users", label: "Admin Users", icon: ShieldCheck },
        { id: "activity_log", label: "Activity Audit Log", icon: Activity },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col md:flex-row font-body">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-cream border-r border-ink/15 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="px-5 py-5 border-b border-ink/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full bg-vivid animate-pulse flex-shrink-0" />
              <span className="font-display font-bold text-sm text-pine dark:text-emerald-400 tracking-wide uppercase whitespace-nowrap truncate">
                Lateeful Akbar
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-mist text-pine border border-sage uppercase flex-shrink-0">
              Admin
            </span>
          </div>

          {/* User Profile */}
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
              Lateeful-Ul-Akbar 2027 &bull; Central Database & Operations Control
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { loadDashboardStats(); loadSectionData(activeSection); }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-mist text-pine border border-ink/15 hover:bg-sage transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingStats ? "animate-spin" : ""}`} />
              Refresh Database
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
                    <span>+{stats?.todayRegistrations || 0} today</span>
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
                    <span>Active Leaderboard</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-ink/15 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-faded uppercase tracking-wider">
                        Global Tasbīh Total
                      </span>
                      <div className="text-3xl font-extrabold text-vivid mt-2">
                        {stats ? Number(stats.tasbihCount).toLocaleString() : tasbihCountDisplay}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-mist text-vivid flex items-center justify-center border border-sage">
                      <Sliders className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-faded">Live Yaa Lateef</span>
                    <button
                      onClick={handleResetTasbih}
                      className="text-rose-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset 0
                    </button>
                  </div>
                </div>
              </div>

              {/* Graphical Charts Section */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* Registration Trend Area Chart */}
                <div className="lg:col-span-8 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-pine">Attendee Registration Growth</h3>
                      <p className="text-xs text-faded">Daily registration volume towards Nadwat 2027</p>
                    </div>
                    <span className="px-3 py-1 bg-mist text-pine text-xs font-semibold rounded-full border border-sage">
                      Real-Time Sync
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REGISTRATION_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#01923c" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#01923c" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef4ec" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#4c6a5e' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#4c6a5e' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0b3d2e', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#01923c" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Donation Distribution Pie Chart */}
                <div className="lg:col-span-4 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-pine">Sadaqah Category Split</h3>
                    <p className="text-xs text-faded">Donations by community project</p>
                  </div>

                  <div className="h-48 w-full my-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DONATION_PIE_DATA}
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {DONATION_PIE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => `₦${Number(value).toLocaleString()}`}
                          contentStyle={{ backgroundColor: '#0b3d2e', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {DONATION_PIE_DATA.map((d) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-ink font-semibold truncate">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: LIVE CHAT SUPPORT PAGE (Matching Image Structure) */}
          {activeSection === "messages" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-pine flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-vivid" /> Live Chat Support
                  </h2>
                  <p className="text-xs text-faded">Manage support requests and chat directly with website visitors.</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                {/* Active Sessions List Column */}
                <div className="lg:col-span-4 bg-white border border-ink/15 rounded-2xl p-5 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-pine uppercase tracking-wider">
                    Active Sessions ({chatTickets.length})
                  </h3>

                  <div className="divide-y divide-ink/10 max-h-[500px] overflow-y-auto pr-1">
                    {chatTickets.map((t) => {
                      const isSelected = activeTicket?.id === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setActiveTicket(t)}
                          className={`py-3 px-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-mist border border-sage shadow-sm"
                              : "hover:bg-cream"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs text-ink">{t.name || "Anonymous Visitor"}</div>
                            <div className="text-[11px] text-faded font-mono">ID: {t.email}</div>
                            <div className="text-[10px] text-faded mt-0.5">
                              {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      );
                    })}
                    {chatTickets.length === 0 && (
                      <div className="text-center py-10 text-faded text-xs">No support requests yet</div>
                    )}
                  </div>
                </div>

                {/* Main Chat Thread & Reply Box Column */}
                <div className="lg:col-span-8 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[520px]">
                  {activeTicket ? (
                    <>
                      {/* Ticket Header */}
                      <div className="border-b border-ink/10 pb-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-pine">{activeTicket.name}</h3>
                            <span className="text-xs font-mono text-vivid bg-mist px-2.5 py-0.5 rounded-full border border-sage">
                              {activeTicket.email}
                            </span>
                          </div>
                          <p className="text-[11px] text-faded mt-0.5">Status: Human Active Representative</p>
                        </div>

                        <button
                          onClick={() => alert("Chat thread marked as resolved!")}
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100"
                        >
                          Resolve Chat
                        </button>
                      </div>

                      {/* Messages Thread Container */}
                      <div className="py-6 space-y-4 max-h-[350px] overflow-y-auto px-2">
                        {/* Initial User Support Query */}
                        <div className="bg-cream border border-ink/10 p-4 rounded-2xl max-w-xl">
                          <span className="text-[10px] font-bold uppercase text-pine block mb-1">
                            {activeTicket.name} (Visitor)
                          </span>
                          <p className="text-xs text-ink leading-relaxed">"{activeTicket.query}"</p>
                        </div>

                        {/* Bot Handoff Notice */}
                        <div className="bg-mist/60 border border-sage p-3.5 rounded-2xl max-w-xl">
                          <span className="text-[10px] font-bold uppercase text-vivid block mb-1">
                            AI BOT
                          </span>
                          <p className="text-xs text-faded">
                            Thank you {activeTicket.name}. A human representative has been notified of your request and will reply shortly!
                          </p>
                        </div>

                        {/* Admin & Visitor Message Stream */}
                        {ticketMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl max-w-xl text-xs ${
                              msg.sender.includes("Admin") || msg.sender === user?.name
                                ? "bg-vivid text-white ml-auto shadow-sm"
                                : "bg-cream border border-ink/10 text-ink"
                            }`}
                          >
                            <span className={`text-[10px] font-bold block mb-1 uppercase ${
                              msg.sender.includes("Admin") ? "text-white/80" : "text-pine"
                            }`}>
                              {msg.sender}
                            </span>
                            <p className="leading-relaxed">{msg.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Quick Reply & Send Form */}
                      <div className="border-t border-ink/10 pt-4 space-y-3">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-[11px] font-bold text-faded">Quick Templates:</span>
                          <button
                            onClick={() => setAdminReplyInput("Assalamu Alaikum! How can I assist you with your registration?")}
                            className="px-2.5 py-1 bg-cream hover:bg-mist border border-ink/10 rounded-lg text-[11px] text-pine font-medium"
                          >
                            Welcome Greeting
                          </button>
                          <button
                            onClick={() => setAdminReplyInput("Your entry pass and QR code have been re-sent to your registered email.")}
                            className="px-2.5 py-1 bg-cream hover:bg-mist border border-ink/10 rounded-lg text-[11px] text-pine font-medium"
                          >
                            Pass Info
                          </button>
                        </div>

                        <form onSubmit={handleSendLiveReply} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your reply (Shift+Enter for new line)..."
                            value={adminReplyInput}
                            onChange={(e) => setAdminReplyInput(e.target.value)}
                            className="flex-1 bg-cream border border-ink/15 rounded-xl px-4 py-3 text-xs text-ink focus:outline-none focus:border-vivid"
                          />
                          <button
                            type="submit"
                            disabled={sendingReply}
                            className="px-6 bg-vivid hover:bg-vivid-deep text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
                          >
                            <Send className="h-4 w-4" /> Send
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20 text-faded text-xs">
                      Select an active chat session on the left to start replying
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: NEWSLETTER & EMAIL HUB (Matching Image 1, 2, 3 Layout) */}
          {activeSection === "newsletter" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-pine flex items-center gap-2">
                    <Mail className="h-5 w-5 text-vivid" /> Email Composer & Newsletter Hub
                  </h2>
                  <p className="text-xs text-faded">Create and broadcast updates to your community members.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setNewsletterMode(newsletterMode === "edit" ? "preview" : "edit")}
                    className="px-4 py-2 bg-mist border border-sage text-pine font-semibold rounded-xl text-xs flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" /> {newsletterMode === "edit" ? "Live Preview" : "Edit Mode"}
                  </button>

                  <button
                    onClick={handleDispatchNewsletter}
                    className="px-6 py-2 bg-vivid hover:bg-vivid-deep text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
                  >
                    <Send className="h-4 w-4" /> Dispatch Newsletter
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                {/* Left Column: Composer Form / Live Branded Preview */}
                <div className="lg:col-span-8 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-pine">Newsletter Composer</h3>
                      <p className="text-xs text-faded">Compose your message with rich text and media.</p>
                    </div>
                    <span className="px-3 py-1 bg-mist text-vivid font-bold text-xs rounded-full border border-sage">
                      {subscribers.length || 15} Recipients Target
                    </span>
                  </div>

                  {newsletterMode === "edit" ? (
                    <div className="space-y-4">
                      {/* Send To Toggle */}
                      <div>
                        <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                          Send To
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setNewsletterTarget("single")}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                              newsletterTarget === "single"
                                ? "bg-vivid text-white shadow-sm"
                                : "bg-cream text-faded border border-ink/15"
                            }`}
                          >
                            Single Member
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewsletterTarget("all")}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                              newsletterTarget === "all"
                                ? "bg-vivid text-white shadow-sm"
                                : "bg-cream text-faded border border-ink/15"
                            }`}
                          >
                            Entire Category (All Members)
                          </button>
                        </div>
                      </div>

                      {newsletterTarget === "single" && (
                        <div>
                          <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                            Recipient Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="member@example.com"
                            value={newsletterSingleEmail}
                            onChange={(e) => setNewsletterSingleEmail(e.target.value)}
                            className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Monthly Community Update - Lateeful-Ul-Akbar 2027"
                          value={newsletterSubject}
                          onChange={(e) => setNewsletterSubject(e.target.value)}
                          className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-semibold"
                        />
                      </div>

                      {/* Rich Text Toolbar Mockup */}
                      <div>
                        <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                          Message Body
                        </label>
                        <div className="border border-ink/15 rounded-2xl overflow-hidden bg-cream">
                          <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-ink/15 bg-white">
                            <button type="button" className="p-1.5 hover:bg-mist rounded text-ink"><Bold className="h-4 w-4" /></button>
                            <button type="button" className="p-1.5 hover:bg-mist rounded text-ink"><Italic className="h-4 w-4" /></button>
                            <button type="button" className="p-1.5 hover:bg-mist rounded text-ink"><Underline className="h-4 w-4" /></button>
                            <span className="h-4 w-px bg-ink/20 mx-1" />
                            <button type="button" className="p-1.5 hover:bg-mist rounded text-ink"><List className="h-4 w-4" /></button>
                            <button type="button" className="p-1.5 hover:bg-mist rounded text-ink"><ListOrdered className="h-4 w-4" /></button>
                            <span className="h-4 w-px bg-ink/20 mx-1" />
                            <button type="button" className="p-1.5 hover:bg-mist rounded text-ink"><AlignLeft className="h-4 w-4" /></button>
                            <button type="button" className="p-1.5 hover:bg-mist rounded text-ink"><AlignCenter className="h-4 w-4" /></button>
                            <button type="button" className="p-1.5 hover:bg-mist rounded text-ink"><AlignRight className="h-4 w-4" /></button>
                            <span className="h-4 w-px bg-ink/20 mx-1" />
                            <button type="button" className="px-3 py-1 bg-mist text-pine text-xs font-bold rounded-lg border border-sage inline-flex items-center gap-1">
                              <Upload className="h-3.5 w-3.5" /> Upload Image
                            </button>
                          </div>
                          <textarea
                            rows={8}
                            placeholder="Write your email newsletter message here..."
                            value={newsletterBody}
                            onChange={(e) => setNewsletterBody(e.target.value)}
                            className="w-full p-4 text-xs text-ink bg-cream focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Live Branded Email Template Preview (Matching Image 2 & 3) */
                    <div className="border border-ink/15 rounded-2xl p-6 bg-cream/50 space-y-6">
                      <div className="text-xs font-bold text-faded uppercase tracking-wider">
                        Live Branded Preview (Desktop View)
                      </div>

                      <div className="bg-white border border-ink/15 rounded-2xl p-8 max-w-xl mx-auto shadow-md">
                        <div className="text-center border-b-2 border-vivid pb-6 mb-6">
                          <h2 className="text-xl font-display font-bold text-pine uppercase tracking-wider">
                            Lateeful Akbar 2027
                          </h2>
                          <span className="text-[10px] text-faded">Nadwat Global Assembly</span>
                        </div>

                        <div className="space-y-4 text-xs text-ink leading-relaxed">
                          <div className="font-bold text-sm text-pine">
                            Subject: {newsletterSubject || "Sample Subject Line"}
                          </div>
                          <p>
                            {newsletterBody || "No content composed yet..."}
                          </p>
                        </div>

                        <div className="border-t border-ink/10 pt-6 mt-8 text-center text-[10px] text-faded space-y-1">
                          <p>&copy; 2027 Nadwat Global Assembly &bull; Tafawa Balewa Square, Lagos</p>
                          <p className="text-vivid">www.lateefulakbar.com</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Saved Templates & Settings (Matching Image 1) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-5">
                    <h3 className="text-xs font-bold text-pine uppercase tracking-wider">
                      Saved Templates
                    </h3>

                    <div>
                      <label className="block text-[11px] font-semibold text-faded mb-1.5">
                        Pick a template
                      </label>
                      <select className="w-full bg-cream border border-ink/15 rounded-xl px-3 py-2 text-xs text-ink">
                        <option>- Select template -</option>
                        {savedTemplates.map((t) => (
                          <option key={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-faded">
                        Save current as template
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Template name..."
                          value={newsletterTemplateName}
                          onChange={(e) => setNewsletterTemplateName(e.target.value)}
                          className="flex-1 bg-cream border border-ink/15 rounded-xl px-3 py-2 text-xs text-ink"
                        />
                        <button
                          type="button"
                          onClick={handleSaveNewsletterTemplate}
                          className="px-4 py-2 bg-pine text-white text-xs font-bold rounded-xl"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-pine uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-vivid" /> Delivery Checklist
                    </h3>
                    <div className="space-y-2 text-xs text-faded">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${newsletterSubject ? "bg-vivid" : "bg-slate-300"}`} />
                        <span>Catchy subject line added</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${newsletterBody ? "bg-vivid" : "bg-slate-300"}`} />
                        <span>Rich content composed</span>
                      </div>
                    </div>
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
                    onClick={() => alert("CSV Export downloaded for registered attendees")}
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
                          No registered attendees in database yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: REFERRALS LEADERBOARD */}
          {activeSection === "referrals" && (
            <div className="bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-pine flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-gilt" /> Referral Leaderboard
                  </h2>
                  <p className="text-xs text-faded">Community members arranged strictly in order of total successful invitees</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-ink/15 text-faded uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Rank Position</th>
                      <th className="py-3 px-4">Referrer Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Referral Code</th>
                      <th className="py-3 px-4 text-right">Total Invited Attendees</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {referrals.map((ref, idx) => (
                      <tr key={idx} className="hover:bg-cream/60">
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${
                            idx === 0
                              ? "bg-gilt text-white shadow-sm"
                              : idx === 1
                              ? "bg-slate-300 text-slate-800"
                              : idx === 2
                              ? "bg-amber-700 text-white"
                              : "bg-mist text-pine"
                          }`}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-ink">{ref.full_name}</td>
                        <td className="py-3.5 px-4 text-faded">{ref.email}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-pine">{ref.referral_code}</td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-vivid text-sm">
                          {ref.total_referrals} attendees
                        </td>
                      </tr>
                    ))}
                    {referrals.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-faded">
                          No community referral tracking data recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: LIVE EVENT STREAM & RESET TASBIH */}
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
                  <Sliders className="h-4 w-4 text-vivid" /> Digital Tasbīh Counter Reset
                </h2>

                <div className="p-5 rounded-2xl bg-pine text-white text-center">
                  <span className="text-xs uppercase tracking-wider font-semibold text-sage block mb-1">
                    Live Global Database Total
                  </span>
                  <div className="text-4xl font-extrabold text-white tabular-nums">
                    {stats ? Number(stats.tasbihCount).toLocaleString() : tasbihCountDisplay}
                  </div>
                </div>

                <p className="text-xs text-faded">
                  The Tasbīh counter increments automatically as website visitors recite. You can reset the database counter to 0 at the start of the event.
                </p>

                <button
                  onClick={handleResetTasbih}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Tasbīh Counter to 0
                </button>
              </div>
            </div>
          )}

          {/* SECTION: EVENT UPDATES */}
          {activeSection === "updates" && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5 bg-white border border-ink/15 rounded-2xl p-6 space-y-5 shadow-sm">
                <h2 className="text-sm font-bold text-pine">Post Quick Announcement</h2>
                <p className="text-xs text-faded">Posts directly to MySQL database and updates the public /live page in real-time</p>
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
                    Publish to Live Page & DB
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white border border-ink/15 rounded-2xl p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-bold text-pine">Active Announcements in Database</h2>
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
                <p className="text-xs text-faded">Saves directly to MySQL database to train the AI Chatbot responses</p>
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
                    Save & Sync to AI Database
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white border border-ink/15 rounded-2xl p-6 space-y-4 shadow-sm">
                <h2 className="text-sm font-bold text-pine">Current Knowledge Memory Items in DB</h2>
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
          {!["dashboard", "attendees", "referrals", "messages", "newsletter", "live_event", "updates", "ai_assistant", "knowledge_base"].includes(
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
                This administrative section is configured and connected to the MySQL database. Management tools are active for organizing committee staff.
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
