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
  EyeOff,
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
  Upload,
  UserPlus,
  Lock,
  Key,
  Trash2,
  Edit,
  ShieldAlert,
  Home,
  Globe
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
  id?: number;
  name: string;
  email: string;
  role: UserRole;
  permissions?: string[];
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

const ALL_PERMISSIONS = [
  { id: "dashboard", label: "Dashboard Overview" },
  { id: "messages", label: "Live Support Chat" },
  { id: "live_event", label: "Live Event Stream" },
  { id: "updates", label: "Event Updates" },
  { id: "attendees", label: "Attendees" },
  { id: "referrals", label: "Referrals Leaderboard" },
  { id: "newsletter", label: "Email & Newsletter Hub" },
  { id: "blog", label: "Blog Manager" },
  { id: "gallery", label: "Gallery Manager" },
  { id: "donations", label: "Donation & Sadaqah Management" },
  { id: "ai_assistant", label: "AI Knowledge Base" },
  { id: "settings", label: "Website Settings" },
  { id: "admin_users", label: "Admin Users" },
  { id: "activity_log", label: "Activity Audit Log" },
];

export default function AdminPage() {
  // Authentication State
  const [user, setUser] = useState<AdminUser | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
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
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [donationsList, setDonationsList] = useState<any[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Live Chat Support State
  const [chatTickets, setChatTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [adminReplyInput, setAdminReplyInput] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Admin User Creation Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("Content Admin");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "dashboard", "newsletter", "blog", "gallery"
  ]);

  // Admin Settings Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeStatus, setPasswordChangeStatus] = useState("");

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

  // Paystack Gateway Configuration State
  const [paystackMode, setPaystackMode] = useState<"test" | "live">("test");
  const [paystackPublicKey, setPaystackPublicKey] = useState("");
  const [paystackSecretKey, setPaystackSecretKey] = useState("");
  const [paystackSaveStatus, setPaystackSaveStatus] = useState("");

  // Campaign Form State
  const [showAddCampaignForm, setShowAddCampaignForm] = useState(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState("");
  const [newCampaignCategory, setNewCampaignCategory] = useState("");
  const [newCampaignTargetQty, setNewCampaignTargetQty] = useState(500);
  const [newCampaignUnitPrice, setNewCampaignUnitPrice] = useState(25000);
  const [newCampaignDescription, setNewCampaignDescription] = useState("");
  const [newCampaignImageUrl, setNewCampaignImageUrl] = useState("");

  // Check saved session on load
  useEffect(() => {
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
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

  // Data loading state
  const [loadingSection, setLoadingSection] = useState(false);

  const loadSectionData = async (section: string) => {
    setLoadingSection(true);
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
      } else if (section === "admin_users") {
        const res = await fetch("/api/admin/users?type=admin_users");
        const data = await res.json();
        if (data.success) setAdminUsersList(data.users || []);
      } else if (section === "blog") {
        const res = await fetch("/api/admin/users?type=blog");
        const data = await res.json();
        if (data.success) setBlogPosts(data.posts || []);
      } else if (section === "gallery") {
        const res = await fetch("/api/admin/users?type=gallery");
        const data = await res.json();
        if (data.success) setGalleryItems(data.items || []);
      } else if (section === "donations") {
        const res = await fetch("/api/admin/users?type=donations_list");
        const data = await res.json();
        if (data.success) setDonationsList(data.donations || []);

        const cRes = await fetch("/api/admin/crud?type=campaigns");
        const cData = await cRes.json();
        if (cData.success) setCampaigns(cData.data || []);
      } else if (section === "settings") {
        const res = await fetch("/api/admin/crud?type=settings");
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.paystack_mode) setPaystackMode(data.data.paystack_mode as any);
          if (data.data.paystack_public_key) setPaystackPublicKey(data.data.paystack_public_key);
          if (data.data.paystack_secret_key) setPaystackSecretKey(data.data.paystack_secret_key);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSection(false);
    }
  };

  const handleSavePaystackSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_paystack_settings",
          payload: { mode: paystackMode, publicKey: paystackPublicKey, secretKey: paystackSecretKey },
          adminEmail: user?.email,
          adminName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaystackSaveStatus("Paystack settings saved!");
        setTimeout(() => setPaystackSaveStatus(""), 4000);
      }
    } catch (e) {
      alert("Error saving Paystack settings");
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignTitle) return;
    try {
      const res = await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_campaign",
          payload: {
            title: newCampaignTitle,
            category: newCampaignCategory || newCampaignTitle,
            targetQty: newCampaignTargetQty,
            unitPrice: newCampaignUnitPrice,
            description: newCampaignDescription,
            imageUrl: newCampaignImageUrl,
          },
          adminEmail: user?.email,
          adminName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCampaignTitle("");
        setNewCampaignCategory("");
        setNewCampaignDescription("");
        setNewCampaignImageUrl("");
        setShowAddCampaignForm(false);
        alert("Donation item published to live site!");
        loadSectionData("donations");
        loadSectionData("sadaqah");
      }
    } catch (e) {
      alert("Error creating campaign");
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await fetch("/api/admin/crud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_campaign",
          payload: { id },
          adminEmail: user?.email,
          adminName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadSectionData("sadaqah");
      }
    } catch (e) {
      alert("Error deleting campaign");
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
    if (!confirm("Are you sure you want to reset the global Yaa Lateef counter to 0?")) return;

    try {
      const res = await fetch("/api/tasbih", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 0 }),
      });
      const data = await res.json();
      if (data.success) {
        setTasbihCountDisplay("0");
        alert("Global Tasbīh counter has been reset to 0.");
        loadDashboardStats();
      }
    } catch (e) {
      alert("Failed to reset counter");
    }
  };

  // Create New Admin User with Assigned Rights
  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) {
      alert("Please fill in Name, Email, and Password.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_admin_user",
          payload: {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
            role: newUserRole,
            permissions: selectedPermissions,
          },
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`Admin user login created successfully for ${newUserEmail}!`);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        loadSectionData("admin_users");
      } else {
        alert(data.error || "Failed to create admin user");
      }
    } catch (err) {
      alert("Server error creating admin user");
    }
  };

  // Admin Change Password Form
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordChangeStatus("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          payload: {
            email: user?.email,
            currentPassword,
            newPassword,
          },
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPasswordChangeStatus("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordChangeStatus(data.error || "Failed to change password.");
      }
    } catch (err) {
      setPasswordChangeStatus("Error updating password.");
    }
  };

  // Toggle permission selection helper
  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
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
        alert("Announcement published!");
        loadSectionData("updates");
      }
    } catch (e) {
      alert("Error publishing announcement");
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
        alert("Knowledge item saved to AI memory!");
        loadSectionData("knowledge_base");
      }
    } catch (e) {
      alert("Error adding AI knowledge item");
    }
  };

  // Render Login View if unauthenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-6 right-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-white border border-ink/15 text-pine hover:bg-mist transition-all shadow-sm"
          >
            <Home className="h-3.5 w-3.5 text-vivid" />
            Visit Main Site
          </Link>
        </div>
        <div className="w-full max-w-md bg-white border border-ink/15 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-mist text-pine mb-4 border border-sage">
              <ShieldCheck className="h-8 w-8 text-pine" />
            </div>
            <div className="flex justify-center w-full">
              <Eyebrow>Nadwat Global Assembly</Eyebrow>
            </div>
            <h1 className="text-2xl font-display font-bold text-pine dark:text-emerald-400 mt-2">
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
                placeholder="Enter email address"
                className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-vivid transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 pr-12 text-sm text-ink focus:outline-none focus:border-vivid transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-faded hover:text-pine transition-colors focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-vivid hover:bg-vivid-deep text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md disabled:opacity-50 mt-2"
            >
              {authLoading ? "Authenticating..." : "Sign In to Admin Console"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Permission Filtering Helper - Users only see modules they have explicit access to
  const userPermissions = user.permissions || [
    'dashboard', 'messages', 'live_event', 'updates', 'attendees', 'referrals',
    'newsletter', 'blog', 'gallery', 'sadaqah', 'donations', 'ai_assistant',
    'settings', 'admin_users', 'activity_log'
  ];

  const FULL_SIDEBAR_NAV = [
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
        { id: "sadaqah", label: "Donation Campaigns", icon: HeartIcon },
        { id: "donations", label: "Sadaqah Payments", icon: DollarSign },
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
        { id: "admin_users", label: "Admin Users & Rights", icon: UserPlus },
        { id: "activity_log", label: "Activity Audit Log", icon: Activity },
      ],
    },
  ];

  // Filter sidebar according to user permissions (Super Admin sees all)
  const SIDEBAR_NAV = user.role === 'Super Admin'
    ? FULL_SIDEBAR_NAV
    : FULL_SIDEBAR_NAV.map((g) => ({
        ...g,
        items: g.items.filter((item) => userPermissions.includes(item.id)),
      })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col md:flex-row font-body">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-cream border-r border-ink/15 flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Header - Single Line Layout */}
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
            onClick={() => setShowSignoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mist hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-pine transition-all border border-ink/10"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal */}
      {showSignoutModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-ink/15 shadow-2xl space-y-4 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <LogOut className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pine">Confirm Sign Out</h3>
              <p className="text-xs text-faded mt-1">
                Are you sure you want to end your session and sign out of the Admin Console?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignoutModal(false)}
                className="flex-1 bg-cream hover:bg-mist text-pine font-bold py-2.5 rounded-xl text-xs border border-ink/15 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSignoutModal(false);
                  handleLogout();
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        {/* Top Header Bar - Simple Refresh Button */}
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-ink/15 px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-display font-bold text-pine capitalize">
              {activeSection.replace("_", " ")}
            </h1>
            <p className="text-xs text-faded">
              Lateeful-Ul-Akbar 2027 &bull; Central Control Console
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-vivid text-white hover:bg-vivid-deep transition-all shadow-sm"
              title="Open public website in new tab"
            >
              <Globe className="h-3.5 w-3.5" />
              Visit Site
            </Link>
            <button
              onClick={() => { loadDashboardStats(); loadSectionData(activeSection); }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-mist text-pine border border-ink/15 hover:bg-sage transition-all shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingStats ? "animate-spin" : ""}`} />
              Refresh
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

              {/* Charts */}
              <div className="grid gap-8 lg:grid-cols-12">
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

                <div className="lg:col-span-4 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-pine">Donation Category Split</h3>
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

          {/* SECTION: ADMIN USERS & RIGHTS MANAGEMENT */}
          {activeSection === "admin_users" && (
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Create Admin User & Assign Rights Form */}
              <div className="lg:col-span-6 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-bold text-pine flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-vivid" /> Create Admin Login & Assign Rights
                  </h2>
                  <p className="text-xs text-faded mt-0.5">
                    Create login credentials for committee organizers and explicitly assign what sections they can view.
                  </p>
                </div>

                <form onSubmit={handleCreateAdminUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ibrahim Abubakar"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Admin Email Address (Login ID)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ibrahim@lateefulakbar.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Assign Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Role Badge
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-semibold"
                    >
                      <option value="Content Admin">Content Admin</option>
                      <option value="Event Admin">Event Admin</option>
                      <option value="Finance Admin">Finance Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  {/* Explicit Module Permissions Checkboxes */}
                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Assign Module Access Rights (Only checked modules will be visible)
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-cream p-4 rounded-xl border border-ink/15 max-h-48 overflow-y-auto">
                      {ALL_PERMISSIONS.map((perm) => (
                        <label key={perm.id} className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                            className="rounded border-ink/20 text-vivid focus:ring-vivid h-4 w-4"
                          />
                          <span>{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-vivid hover:bg-vivid-deep text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md"
                  >
                    Create Admin Account & Rights
                  </button>
                </form>
              </div>

              {/* Admin Users List & Roles Table */}
              <div className="lg:col-span-6 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-pine flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-pine" /> Active Admin Users & Rights
                </h2>
                <p className="text-xs text-faded">Every organizer sees only the specific modules assigned to their login.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/15 text-faded uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3">Email</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Assigned Rights</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {adminUsersList.map((u) => (
                        <tr key={u.id} className="hover:bg-cream/60">
                          <td className="py-3 px-3 font-bold text-ink">{u.name}</td>
                          <td className="py-3 px-3 text-faded">{u.email}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-mist text-pine font-semibold text-[10px]">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {u.permissions?.map((p: string) => (
                                <span key={p} className="px-1.5 py-0.5 rounded bg-cream border border-ink/10 text-[9px] text-faded">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {adminUsersList.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-faded">
                            Master Admin Account active. Custom admin users will appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: WEBSITE SETTINGS & PAYSTACK CONFIGURATION */}
          {activeSection === "settings" && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-bold text-pine flex items-center gap-2">
                    <Lock className="h-5 w-5 text-vivid" /> Change Admin Password
                  </h2>
                  <p className="text-xs text-faded mt-0.5">Update password for {user.email}</p>
                </div>

                {passwordChangeStatus && (
                  <div className="p-3 rounded-xl bg-mist border border-sage text-pine text-xs font-semibold">
                    {passwordChangeStatus}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pine hover:bg-ink text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              <div className="lg:col-span-6 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-bold text-pine flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gilt" /> Paystack Payment Gateway
                    </h2>
                    <p className="text-xs text-faded">Switch environment & manage Paystack API keys</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    paystackSecretKey.startsWith("sk_")
                      ? paystackMode === "live"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-slate-100 text-slate-700 border border-slate-300"
                  }`}>
                    {paystackSecretKey.startsWith("sk_")
                      ? paystackMode === "live"
                        ? "Connected (Live Production)"
                        : "Connected (Test Mode)"
                      : "Not Configured (Fallback Mode)"}
                  </span>
                </div>

                {paystackSaveStatus && (
                  <div className="p-3 rounded-xl bg-mist border border-sage text-pine text-xs font-semibold">
                    {paystackSaveStatus}
                  </div>
                )}

                <form onSubmit={handleSavePaystackSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Paystack Environment Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaystackMode("test")}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                          paystackMode === "test"
                            ? "bg-amber-50 border-amber-400 text-amber-900 shadow-sm"
                            : "bg-cream border-ink/15 text-faded"
                        }`}
                      >
                        🧪 Test Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaystackMode("live")}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                          paystackMode === "live"
                            ? "bg-vivid text-white border-vivid shadow-sm"
                            : "bg-cream border-ink/15 text-faded"
                        }`}
                      >
                        🚀 Live Production
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Paystack Public Key ({paystackMode.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={paystackPublicKey}
                      onChange={(e) => setPaystackPublicKey(e.target.value)}
                      placeholder={paystackMode === "live" ? "pk_live_xxxxxxxx..." : "pk_test_xxxxxxxx..."}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                      Paystack Secret Key ({paystackMode.toUpperCase()})
                    </label>
                    <input
                      type="password"
                      value={paystackSecretKey}
                      onChange={(e) => setPaystackSecretKey(e.target.value)}
                      placeholder={paystackMode === "live" ? "sk_live_xxxxxxxx..." : "sk_test_xxxxxxxx..."}
                      className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-vivid hover:bg-vivid-deep text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md"
                  >
                    Save Paystack Gateway Settings
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SECTION: SADAQAH CAMPAIGNS & THRESHOLDS */}
          {activeSection === "sadaqah" && (
            <div className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-pine flex items-center gap-2">
                      <HeartIcon className="h-5 w-5 text-vivid" /> Create Donation Campaign
                    </h2>
                    <p className="text-xs text-faded mt-0.5">Add a new physical item campaign with threshold & unit price</p>
                  </div>

                  <form onSubmit={handleCreateCampaign} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                        Campaign Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Provide Cooling Fans"
                        value={newCampaignTitle}
                        onChange={(e) => setNewCampaignTitle(e.target.value)}
                        className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                        Category Key
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. cooling, water, mats, media"
                        value={newCampaignCategory}
                        onChange={(e) => setNewCampaignCategory(e.target.value)}
                        className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                          Target Threshold
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={newCampaignTargetQty}
                          onChange={(e) => setNewCampaignTargetQty(Number(e.target.value))}
                          className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                          Unit Price (₦)
                        </label>
                        <input
                          type="number"
                          required
                          min={100}
                          value={newCampaignUnitPrice}
                          onChange={(e) => setNewCampaignUnitPrice(Number(e.target.value))}
                          className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                        Short Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe what this campaign sponsors..."
                        value={newCampaignDescription}
                        onChange={(e) => setNewCampaignDescription(e.target.value)}
                        className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                        Cover Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="/assets/donation-cooling.jpg"
                        value={newCampaignImageUrl}
                        onChange={(e) => setNewCampaignImageUrl(e.target.value)}
                        className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-vivid hover:bg-vivid-deep text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md"
                    >
                      Publish Donation Campaign
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-pine">Active Donation Campaigns ({campaigns.length})</h2>
                    <p className="text-xs text-faded">Threshold progress, items raised, and unit prices</p>
                  </div>

                  <div className="space-y-4">
                    {campaigns.map((c) => {
                      const pct = Math.min(100, Math.round(((c.current_qty || 0) / (c.target_qty || 1)) * 100));
                      return (
                        <div key={c.id} className="p-5 rounded-2xl bg-cream border border-ink/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-sm text-pine">{c.title}</h3>
                              <span className="text-[10px] text-faded">Category: {c.category}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-vivid">
                                ₦{Number(c.unit_price || 0).toLocaleString()} / item
                              </span>
                              <div className="text-[10px] text-faded">
                                Target: {c.target_qty} items
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-ink">
                                {c.current_qty || 0} / {c.target_qty || 100} items raised
                              </span>
                              <span className="text-vivid">{pct}%</span>
                            </div>
                            <div className="h-2 w-full bg-mist rounded-full overflow-hidden">
                              <div className="h-full bg-vivid transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-1 text-xs">
                            <span className="text-faded text-[11px] max-w-sm truncate">{c.description}</span>
                            <button
                              onClick={() => handleDeleteCampaign(c.id)}
                              className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold border border-rose-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {campaigns.length === 0 && (
                      <div className="text-center py-10 text-faded text-xs">No active donation campaigns found</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: BLOG MANAGER */}
          {activeSection === "blog" && (
            <div className="bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-pine">Blog CMS & Article Stats</h2>
                  <p className="text-xs text-faded">Manage published articles, views, and likes</p>
                </div>
                <button
                  onClick={() => alert("Article editor opened!")}
                  className="px-4 py-2 bg-vivid text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Create Article
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-ink/15 text-faded uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Article Slug</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4">Likes</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {blogPosts.map((post) => (
                      <tr key={post.slug} className="hover:bg-cream/60">
                        <td className="py-3.5 px-4 font-bold text-pine font-mono">{post.slug}</td>
                        <td className="py-3.5 px-4 text-ink font-semibold">{post.views || 0}</td>
                        <td className="py-3.5 px-4 text-vivid font-bold">{post.likes || 0}</td>
                        <td className="py-3.5 px-4 text-right">
                          <Link href={`/blog/${post.slug}`} target="_blank" className="text-vivid hover:underline font-semibold">
                            View Article
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {blogPosts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-faded">
                          No blog stats recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: GALLERY MANAGER */}
          {activeSection === "gallery" && (
            <div className="bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-pine">Gallery & Media Manager</h2>
                  <p className="text-xs text-faded">Organize event photography, videos, and drone media</p>
                </div>
                <button
                  onClick={() => alert("Upload media dialog opened!")}
                  className="px-4 py-2 bg-vivid text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Upload Media
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map((item) => (
                  <div key={item.id} className="border border-ink/15 rounded-2xl overflow-hidden bg-cream p-3 space-y-2">
                    <div className="aspect-video relative rounded-xl overflow-hidden bg-mist">
                      <Image src={item.url} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="font-bold text-xs text-ink">{item.title}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-mist text-pine border border-sage uppercase inline-block">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: DONATION CAMPAIGNS & THRESHOLDS PAGE */}
          {activeSection === "sadaqah" && (
            <div className="space-y-8">
              <div className="bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
                  <div>
                    <h2 className="text-base font-bold text-pine flex items-center gap-2">
                      <HeartIcon className="h-5 w-5 text-vivid" /> Live Site Donation Items & Thresholds ({campaigns.length})
                    </h2>
                    <p className="text-xs text-faded mt-0.5">Manage physical items, target quantities, and unit prices visible to visitors on the live site</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddCampaignForm((prev) => !prev)}
                    className="px-4 py-2.5 bg-vivid hover:bg-vivid-deep text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className={`h-4 w-4 transition-transform duration-300 ${showAddCampaignForm ? "rotate-45" : ""}`} />
                    {showAddCampaignForm ? "Close Form" : "Add New Donation Item"}
                  </button>
                </div>

                {/* Collapsible Dropdown Form */}
                {showAddCampaignForm && (
                  <div className="p-6 rounded-2xl bg-cream border border-ink/15 space-y-5 shadow-inner">
                    <div>
                      <h3 className="text-sm font-bold text-pine flex items-center gap-2">
                        <HeartIcon className="h-4 w-4 text-vivid" /> Add New Donation Item
                      </h3>
                      <p className="text-xs text-faded">Publish a physical item campaign for visitors on the live site</p>
                    </div>

                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                            Donation Item Title
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Provide Cooling Fans"
                            value={newCampaignTitle}
                            onChange={(e) => setNewCampaignTitle(e.target.value)}
                            className="w-full bg-white border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                            Category Key
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. cooling, water, mats, media"
                            value={newCampaignCategory}
                            onChange={(e) => setNewCampaignCategory(e.target.value)}
                            className="w-full bg-white border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                            Target Threshold (Qty)
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={newCampaignTargetQty}
                            onChange={(e) => setNewCampaignTargetQty(Number(e.target.value))}
                            className="w-full bg-white border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                            Unit Price (₦)
                          </label>
                          <input
                            type="number"
                            required
                            min={100}
                            value={newCampaignUnitPrice}
                            onChange={(e) => setNewCampaignUnitPrice(Number(e.target.value))}
                            className="w-full bg-white border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe what visitors sponsor with this item..."
                          value={newCampaignDescription}
                          onChange={(e) => setNewCampaignDescription(e.target.value)}
                          className="w-full bg-white border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-faded uppercase tracking-wider mb-2">
                          Cover Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="/assets/donation-cooling.jpg"
                          value={newCampaignImageUrl}
                          onChange={(e) => setNewCampaignImageUrl(e.target.value)}
                          className="w-full bg-white border border-ink/15 rounded-xl px-4 py-2.5 text-xs text-ink"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCampaignForm(false)}
                          className="px-5 py-2.5 bg-mist text-pine text-xs font-bold rounded-xl border border-ink/10 hover:bg-sage"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-vivid hover:bg-vivid-deep text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md"
                        >
                          Publish Item to Live Site
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Full Width Grid of Live Site Items */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {campaigns.map((c) => {
                    const pct = Math.min(100, Math.round(((c.current_qty || 0) / (c.target_qty || 1)) * 100));
                    return (
                      <div key={c.id} className="p-5 rounded-2xl bg-cream border border-ink/10 space-y-3 flex flex-col justify-between shadow-xs">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-sm text-pine">{c.title}</h3>
                              <span className="text-[10px] text-faded block">Category: {c.category}</span>
                            </div>
                            <span className="text-xs font-bold text-vivid bg-mist px-2.5 py-1 rounded-lg border border-sage shrink-0">
                              ₦{Number(c.unit_price || 0).toLocaleString()}
                            </span>
                          </div>

                          <p className="text-xs text-faded line-clamp-2">{c.description || "Community donation project"}</p>

                          <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-ink">
                                {c.current_qty || 0} / {c.target_qty || 100} items raised
                              </span>
                              <span className="text-vivid font-mono">{pct}%</span>
                            </div>
                            <div className="h-2 w-full bg-mist rounded-full overflow-hidden">
                              <div className="h-full bg-vivid transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-ink/10 pt-3 text-xs">
                          <span className="text-[11px] font-mono text-faded">Target: {c.target_qty} items</span>
                          <button
                            onClick={() => handleDeleteCampaign(c.id)}
                            className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold border border-rose-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {campaigns.length === 0 && (
                    <div className="col-span-full text-center py-10 text-faded text-xs">No active donation items found</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SADAQAH PAYMENTS LOG PAGE */}
          {activeSection === "donations" && (
            <div className="space-y-6">
              {/* Overview Metrics Cards */}
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="p-5 rounded-2xl bg-white border border-ink/15 shadow-sm">
                  <span className="text-xs font-semibold text-faded uppercase tracking-wider">Total Raised</span>
                  <div className="text-2xl font-extrabold text-pine mt-1">
                    ₦{donationsList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-ink/15 shadow-sm">
                  <span className="text-xs font-semibold text-faded uppercase tracking-wider">Total Donors</span>
                  <div className="text-2xl font-extrabold text-vivid mt-1">
                    {donationsList.length} donors
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-ink/15 shadow-sm">
                  <span className="text-xs font-semibold text-faded uppercase tracking-wider">Avg Contribution</span>
                  <div className="text-2xl font-extrabold text-gilt mt-1">
                    ₦{donationsList.length > 0
                      ? Math.round(donationsList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0) / donationsList.length).toLocaleString()
                      : 0}
                  </div>
                </div>
              </div>

              {/* Transactions Log Section */}
              <div className="bg-white border border-ink/15 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-bold text-pine">Completed Sadaqah Payments Log</h2>
                    <p className="text-xs text-faded">Real-time listing of completed Sadaqah contributions from live site visitors</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-ink/15 text-faded uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Donor Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Item / Category</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {donationsList.map((d) => (
                        <tr key={d.id} className="hover:bg-cream/60">
                          <td className="py-3.5 px-4 font-bold text-ink">{d.donor_name}</td>
                          <td className="py-3.5 px-4 text-faded">{d.email}</td>
                          <td className="py-3.5 px-4 font-semibold text-pine">{d.category}</td>
                          <td className="py-3.5 px-4 font-extrabold text-vivid">
                            ₦{Number(d.amount).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-faded">
                            {new Date(d.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {donationsList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-faded">
                            No donation payment records in database yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* SECTION: LIVE CHAT SUPPORT PAGE */}
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

                <div className="lg:col-span-8 bg-white border border-ink/15 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[520px]">
                  {activeTicket ? (
                    <>
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
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/admin/messages", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  action: "update_status",
                                  ticketId: activeTicket.id,
                                  status: "resolved",
                                }),
                              });
                              const data = await res.json();
                              if (data.success) {
                                setActiveTicket((prev: any) => prev ? { ...prev, status: "resolved" } : null);
                                setChatTickets((prev) =>
                                  prev.map((t) => (t.id === activeTicket.id ? { ...t, status: "resolved" } : t))
                                );
                                alert("Chat thread marked as resolved in DB!");
                              }
                            } catch (e) {
                              alert("Failed to update status");
                            }
                          }}
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all"
                        >
                          Resolve Chat
                        </button>
                      </div>

                      <div className="py-6 space-y-4 max-h-[350px] overflow-y-auto px-2">
                        <div className="bg-cream border border-ink/10 p-4 rounded-2xl max-w-xl">
                          <span className="text-[10px] font-bold uppercase text-pine block mb-1">
                            {activeTicket.name} (Visitor)
                          </span>
                          <p className="text-xs text-ink leading-relaxed">"{activeTicket.query}"</p>
                        </div>

                        <div className="bg-mist/60 border border-sage p-3.5 rounded-2xl max-w-xl">
                          <span className="text-[10px] font-bold uppercase text-vivid block mb-1">
                            AI BOT
                          </span>
                          <p className="text-xs text-faded">
                            Thank you {activeTicket.name}. A human representative has been notified of your request and will reply shortly!
                          </p>
                        </div>

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

          {/* SECTION: NEWSLETTER & EMAIL HUB */}
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
                <p className="text-xs text-faded">Publishes announcement directly to live visitors</p>
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
                <p className="text-xs text-faded">Trains the AI Chatbot responses</p>
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
                    Save & Sync AI Knowledge
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

          {/* SECTION: ACTIVITY AUDIT LOG */}
          {activeSection === "activity_log" && (
            <div className="space-y-6">
              {/* Header & Refresh */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-ink/15 p-6 rounded-2xl shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-vivid" />
                    <h2 className="text-lg font-bold text-pine">Activity Audit Log</h2>
                  </div>
                  <p className="text-xs text-faded mt-1">
                    System-wide audit trail recording actions, logins, updates, and changes across all admin staff members.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-mist text-pine border border-sage">
                    {logs.length} Total Log Entries
                  </span>
                  <button
                    onClick={() => loadSectionData("activity_log")}
                    className="flex items-center gap-2 bg-cream hover:bg-mist text-pine font-bold px-4 py-2 rounded-xl text-xs border border-ink/15 transition-all shadow-sm"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh Logs
                  </button>
                </div>
              </div>

              {/* Log Entries Table / List */}
              <div className="bg-white border border-ink/15 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-ink/10 bg-cream/50 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-pine">Recent System Events</h3>
                  <span className="text-[11px] text-faded">Auto-logged in real-time</span>
                </div>

                {logs.length === 0 ? (
                  <div className="p-12 text-center text-faded text-xs space-y-2">
                    <Activity className="h-8 w-8 text-faded mx-auto opacity-50" />
                    <p className="font-semibold text-ink">No activity records found</p>
                    <p>Actions performed by admins will automatically be recorded here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-ink/10">
                    {logs.map((log: any, idx: number) => {
                      const isLogin = log.action?.toLowerCase().includes("login");
                      const isDelete = log.action?.toLowerCase().includes("delete");
                      const isCreate = log.action?.toLowerCase().includes("create") || log.action?.toLowerCase().includes("add") || log.action?.toLowerCase().includes("post");
                      
                      return (
                        <div key={log.id || idx} className="p-5 hover:bg-cream/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`mt-0.5 p-2.5 rounded-xl border flex-shrink-0 ${
                              isLogin 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                                : isDelete 
                                ? "bg-red-50 border-red-200 text-red-700" 
                                : isCreate 
                                ? "bg-blue-50 border-blue-200 text-blue-700" 
                                : "bg-amber-50 border-amber-200 text-amber-700"
                            }`}>
                              <Activity className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-xs text-ink">{log.action}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream text-pine border border-ink/15">
                                  {log.admin_name || "Admin"} ({log.admin_email})
                                </span>
                              </div>
                              <p className="text-xs text-faded">{log.details || "No additional details provided."}</p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right flex-shrink-0">
                            <span className="text-[11px] font-mono text-faded bg-cream px-2.5 py-1 rounded-lg border border-ink/10 inline-block">
                              {log.created_at ? new Date(log.created_at).toLocaleString('en-NG', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              }) : 'Just now'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FALLBACK / GENERIC PLACEHOLDER FOR OTHER SECTIONS */}
          {!["dashboard", "attendees", "referrals", "messages", "newsletter", "live_event", "updates", "ai_assistant", "knowledge_base", "admin_users", "settings", "blog", "gallery", "donations", "sadaqah", "activity_log"].includes(
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
                This administrative section is configured and connected to your backend. Management tools are active for organizing committee staff.
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
