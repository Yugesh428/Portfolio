"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, FolderKanban, MessageSquare, FileText,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, AlertCircle, Activity,
  Eye, Plus,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

/* ── Types ── */
interface Stats {
  clients:      { total: number; pending: number; approved: number };
  projects:     { total: number; active: number; completed: number };
  messages:     { total: number; unread: number };
  contacts:     { total: number };
  notifications:{ unread: number };
}

/* ── Mock chart data (replace with real API data later) ── */
const activityData = [
  { month: "May",  clients: 0, projects: 0, messages: 0 },
  { month: "Jun",  clients: 0, projects: 0, messages: 0 },
  { month: "Jul",  clients: 0, projects: 0, messages: 0 },
  { month: "Aug",  clients: 0, projects: 0, messages: 0 },
  { month: "Sep",  clients: 0, projects: 0, messages: 0 },
  { month: "Oct",  clients: 0, projects: 0, messages: 0 },
];

const projectPipelineData = [
  { name: "Planning",    value: 0, color: "#60A5FA" },
  { name: "In Progress", value: 0, color: "#2563EB" },
  { name: "Completed",   value: 0, color: "#16A34A" },
];

const clientStatusData = [
  { name: "Approved", value: 0, color: "#16A34A" },
  { name: "Pending",  value: 0, color: "#F59E0B" },
  { name: "Rejected", value: 0, color: "#EF4444" },
];

const weeklyData = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 0 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 0 },
  { day: "Fri", value: 0 },
  { day: "Sat", value: 0 },
  { day: "Sun", value: 0 },
];

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <p className="text-xs text-gray-500 mb-1" style={{ fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: <span style={{ fontWeight: 800 }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function AdminOverview() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Update chart data with real stats ── */
  const updatedActivity = activityData.map((m, i) =>
    i === activityData.length - 1
      ? { ...m, clients: stats?.clients.total ?? 0, projects: stats?.projects.total ?? 0, messages: stats?.messages.total ?? 0 }
      : m
  );

  const updatedPipeline = [
    { name: "Planning",    value: Math.max(0, (stats?.projects.total ?? 0) - (stats?.projects.active ?? 0) - (stats?.projects.completed ?? 0)), color: "#60A5FA" },
    { name: "In Progress", value: stats?.projects.active ?? 0,    color: "#2563EB" },
    { name: "Completed",   value: stats?.projects.completed ?? 0, color: "#16A34A" },
  ];

  const updatedClientStatus = [
    { name: "Approved", value: stats?.clients.approved ?? 0, color: "#16A34A" },
    { name: "Pending",  value: stats?.clients.pending  ?? 0, color: "#F59E0B" },
    { name: "Rejected", value: Math.max(0, (stats?.clients.total ?? 0) - (stats?.clients.approved ?? 0) - (stats?.clients.pending ?? 0)), color: "#EF4444" },
  ];

  /* ── Top stat cards ── */
  const topStats = [
    {
      label: "Total Clients",
      value: stats?.clients.total ?? 0,
      sub:   `${stats?.clients.pending ?? 0} pending`,
      icon:  Users,
      color: "#2563EB",
      bg:    "#EFF6FF",
      href:  "/dashboard/clients",
      trend: null,
    },
    {
      label: "Projects",
      value: stats?.projects.total ?? 0,
      sub:   `${stats?.projects.active ?? 0} active`,
      icon:  FolderKanban,
      color: "#16A34A",
      bg:    "#F0FDF4",
      href:  "/dashboard/projects",
      trend: null,
    },
    {
      label: "Messages",
      value: stats?.messages.total ?? 0,
      sub:   `${stats?.messages.unread ?? 0} unread`,
      icon:  MessageSquare,
      color: "#7C3AED",
      bg:    "#F5F3FF",
      href:  "/dashboard/messages",
      trend: null,
    },
    {
      label: "Contact Forms",
      value: stats?.contacts.total ?? 0,
      sub:   "From portfolio",
      icon:  FileText,
      color: "#EA580C",
      bg:    "#FFF7ED",
      href:  "/dashboard/contacts",
      trend: null,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>Good day, Yugesh 👋</h2>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>
            Here's what's happening across your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {(["overview", "analytics"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                  activeTab === tab
                    ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/30"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontWeight: 600 }}
              >
                {tab}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard/projects?new=true"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2563EB] text-white rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
            style={{ fontWeight: 600 }}
          >
            <Plus size={14} /> New Project
          </Link>
        </div>
      </div>

      {/* ── Top stat bar (like the image) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map(({ label, value, sub, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-blue-500/5 hover:border-gray-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: bg }}
              >
                <Icon size={17} style={{ color }} />
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ color, borderColor: `${color}30`, background: bg, fontWeight: 600 }}>
                +0%
              </span>
            </div>
            <p className="text-2xl text-[#18181B]" style={{ fontWeight: 800 }}>{value}</p>
            <p className="text-xs text-gray-700 mt-0.5" style={{ fontWeight: 600 }}>{label}</p>
            <p className="text-[11px] text-gray-400 mt-0.5" style={{ fontWeight: 400 }}>{sub}</p>
          </Link>
        ))}
      </div>

      {/* ── Pending alert ── */}
      {(stats?.clients.pending ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={16} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-amber-800 text-sm" style={{ fontWeight: 700 }}>
              {stats!.clients.pending} client{stats!.clients.pending > 1 ? "s" : ""} waiting for approval
            </p>
            <p className="text-amber-600 text-xs" style={{ fontWeight: 400 }}>
              Review and approve client accounts to give them portal access.
            </p>
          </div>
          <Link
            href="/dashboard/clients?status=pending"
            className="flex-shrink-0 flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            style={{ fontWeight: 700 }}
          >
            Review <ArrowUpRight size={12} />
          </Link>
        </div>
      )}

      {/* ── Main chart + right panel ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Activity area chart — spans 2 cols */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm text-[#18181B]" style={{ fontWeight: 700 }}>Portfolio Activity</h3>
              <p className="text-[11px] text-gray-400 mt-0.5" style={{ fontWeight: 400 }}>Clients · Projects · Messages over time</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              {[
                { label: "Clients",  color: "#2563EB" },
                { label: "Projects", color: "#16A34A" },
                { label: "Messages", color: "#7C3AED" },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={updatedActivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradClients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProjects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16A34A" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Poppins', fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Poppins', fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="clients"  stroke="#2563EB" strokeWidth={2} fill="url(#gradClients)"  dot={false} />
              <Area type="monotone" dataKey="projects" stroke="#16A34A" strokeWidth={2} fill="url(#gradProjects)" dot={false} />
              <Area type="monotone" dataKey="messages" stroke="#7C3AED" strokeWidth={2} fill="url(#gradMessages)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Client status donut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm text-[#18181B]" style={{ fontWeight: 700 }}>Client Status</h3>
            <p className="text-[11px] text-gray-400 mt-0.5" style={{ fontWeight: 400 }}>Approval breakdown</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={updatedClientStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {updatedClientStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {updatedClientStatus.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-gray-600" style={{ fontWeight: 500 }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  {name}
                </span>
                <span className="text-xs text-gray-800" style={{ fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Project pipeline + Quick actions + Weekly bar ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Project pipeline bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm text-[#18181B]" style={{ fontWeight: 700 }}>Project Pipeline</h3>
              <p className="text-[11px] text-gray-400 mt-0.5" style={{ fontWeight: 400 }}>Status breakdown</p>
            </div>
            <Link href="/dashboard/projects" className="text-[11px] text-[#2563EB] flex items-center gap-0.5 hover:underline" style={{ fontWeight: 600 }}>
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={updatedPipeline} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'Poppins', fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'Poppins', fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {updatedPipeline.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Progress rows */}
          <div className="mt-4 space-y-2">
            {updatedPipeline.map(({ name, value, color }) => {
              const total = updatedPipeline.reduce((s, x) => s + x.value, 0);
              const pct = total ? Math.round((value / total) * 100) : 0;
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-500 w-20 flex-shrink-0" style={{ fontWeight: 500 }}>{name}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="text-[11px] text-gray-500 w-6 text-right" style={{ fontWeight: 600 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-[#18181B]" style={{ fontWeight: 700 }}>Quick Actions</h3>
            <Activity size={15} className="text-gray-300" />
          </div>
          <div className="space-y-1.5">
            {[
              {
                label: "Review pending clients",
                href: "/dashboard/clients?status=pending",
                badge: stats?.clients.pending ?? 0,
                badgeColor: "#F59E0B",
                badgeBg: "#FFF7ED",
                icon: Users,
                iconColor: "#2563EB",
                iconBg: "#EFF6FF",
              },
              {
                label: "View unread messages",
                href: "/dashboard/messages",
                badge: stats?.messages.unread ?? 0,
                badgeColor: "#7C3AED",
                badgeBg: "#F5F3FF",
                icon: MessageSquare,
                iconColor: "#7C3AED",
                iconBg: "#F5F3FF",
              },
              {
                label: "Check contact forms",
                href: "/dashboard/contacts",
                badge: stats?.contacts.total ?? 0,
                badgeColor: "#EA580C",
                badgeBg: "#FFF7ED",
                icon: FileText,
                iconColor: "#EA580C",
                iconBg: "#FFF7ED",
              },
              {
                label: "Add new project",
                href: "/dashboard/projects?new=true",
                badge: 0,
                badgeColor: "#16A34A",
                badgeBg: "#F0FDF4",
                icon: FolderKanban,
                iconColor: "#16A34A",
                iconBg: "#F0FDF4",
              },
            ].map(({ label, href, badge, badgeColor, badgeBg, icon: Icon, iconColor, iconBg }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
                  <Icon size={14} style={{ color: iconColor }} />
                </div>
                <span className="flex-1 text-xs text-gray-700 group-hover:text-gray-900" style={{ fontWeight: 600 }}>{label}</span>
                {badge > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: badgeColor, background: badgeBg, fontWeight: 700 }}>
                    {badge}
                  </span>
                ) : (
                  <ArrowUpRight size={13} className="text-gray-300 group-hover:text-gray-500" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Weekly messages bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm text-[#18181B]" style={{ fontWeight: 700 }}>Weekly Messages</h3>
              <p className="text-[11px] text-gray-400 mt-0.5" style={{ fontWeight: 400 }}>Inbound this week</p>
            </div>
            <Link href="/dashboard/messages" className="text-[11px] text-[#2563EB] flex items-center gap-0.5 hover:underline" style={{ fontWeight: 600 }}>
              View <ArrowUpRight size={11} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'Poppins', fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'Poppins', fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {/* Summary row */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-[#EFF6FF] rounded-xl p-3">
              <p className="text-lg text-[#2563EB]" style={{ fontWeight: 800 }}>{stats?.messages.total ?? 0}</p>
              <p className="text-[10px] text-blue-400 uppercase tracking-wide mt-0.5" style={{ fontWeight: 600 }}>Total</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-lg text-purple-600" style={{ fontWeight: 800 }}>{stats?.messages.unread ?? 0}</p>
              <p className="text-[10px] text-purple-400 uppercase tracking-wide mt-0.5" style={{ fontWeight: 600 }}>Unread</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notification unread count banner ── */}
      {(stats?.notifications.unread ?? 0) > 0 && (
        <div className="bg-[#EFF6FF] border border-[#2563EB]/20 rounded-2xl px-5 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={16} className="text-[#2563EB]" />
          </div>
          <p className="flex-1 text-sm text-[#1E40AF]" style={{ fontWeight: 600 }}>
            You have {stats!.notifications.unread} unread notification{stats!.notifications.unread > 1 ? "s" : ""}
          </p>
          <Link
            href="/dashboard/notifications"
            className="flex-shrink-0 flex items-center gap-1 text-xs text-[#2563EB] hover:text-blue-800 bg-white border border-[#2563EB]/20 px-3 py-1.5 rounded-lg transition-colors"
            style={{ fontWeight: 700 }}
          >
            View all <ArrowUpRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
