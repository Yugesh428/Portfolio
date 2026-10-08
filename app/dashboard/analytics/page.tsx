"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from "recharts";
import {
  Code2, FolderKanban, Trophy, BookOpen,
  Briefcase, Mail, Users, TrendingUp,
  RefreshCw, BarChart2,
} from "lucide-react";

// ── Colour palettes ──────────────────────────────────────────
const BLUE_PALETTE   = ["#2563EB","#3B82F6","#60A5FA","#93C5FD","#BFDBFE","#DBEAFE"];
const STATUS_COLORS: Record<string, string> = {
  completed:    "#16A34A",
  "in-progress":"#F59E0B",
  planned:      "#64748B",
};
const CAT_COLORS: Record<string, string> = {
  frontend: "#2563EB",
  backend:  "#16A34A",
  database: "#7C3AED",
  devops:   "#F59E0B",
  design:   "#EC4899",
  other:    "#64748B",
  saas:     "#2563EB",
  "web-app":"#7C3AED",
  api:      "#16A34A",
  mobile:   "#F59E0B",
};
const TYPE_COLORS: Record<string, string> = {
  work:          "#2563EB",
  internship:    "#7C3AED",
  freelance:     "#16A34A",
  volunteer:     "#F59E0B",
  hackathon:     "#F59E0B",
  certification: "#2563EB",
  award:         "#16A34A",
  other:         "#64748B",
  "web-development":"#2563EB",
  programming:   "#F59E0B",
  cloud:         "#0EA5E9",
  database:      "#7C3AED",
  design:        "#EC4899",
};

// ── Custom tooltip ───────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2.5 text-xs"
      style={{ fontFamily: "Poppins, sans-serif" }}>
      {label && <p className="text-gray-500 mb-1" style={{ fontWeight: 600 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill, fontWeight: 600 }}>
          {p.name ?? p.dataKey}: <span style={{ fontWeight: 800 }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ── Custom pie label ─────────────────────────────────────────
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  if (value === 0) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 11, fontFamily: "Poppins", fontWeight: 700 }}>
      {value}
    </text>
  );
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon size={17} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl text-[#18181B]" style={{ fontWeight: 800 }}>{value}</p>
      <p className="text-xs text-gray-700 mt-0.5" style={{ fontWeight: 600 }}>{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5" style={{ fontWeight: 400 }}>{sub}</p>}
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────
function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="mb-5">
        <h3 className="text-sm text-[#18181B]" style={{ fontWeight: 700 }}>{title}</h3>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5" style={{ fontWeight: 400 }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function AnalyticsPage() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [refreshed, setRefreshed] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/api/dashboard/analytics")
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); else setError(true); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [refreshed]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>Crunching your data…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-72" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div className="text-center space-y-3">
          <p className="text-red-500 text-sm" style={{ fontWeight: 600 }}>Failed to load analytics.</p>
          <button onClick={() => setRefreshed(r => r + 1)}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs"
            style={{ fontWeight: 600 }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const s = data.summary;

  const statCards = [
    { label: "Skills",        value: s.skills,       sub: `Across all categories`,      icon: Code2,        color: "#2563EB", bg: "#EFF6FF" },
    { label: "Projects",      value: s.projects,     sub: `${s.completedProjects} completed`, icon: FolderKanban, color: "#16A34A", bg: "#F0FDF4" },
    { label: "Achievements",  value: s.achievements, sub: "Hackathons, awards & certs",  icon: Trophy,       color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Courses",       value: s.courses,      sub: `${s.certifiedCourses} certified`, icon: BookOpen,     color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Experiences",   value: s.experiences,  sub: "Work, internship, freelance", icon: Briefcase,    color: "#0EA5E9", bg: "#F0F9FF" },
    { label: "Contact Forms", value: s.contacts,     sub: "Portfolio inquiries",         icon: Mail,         color: "#EC4899", bg: "#FDF2F8" },
    { label: "Clients",       value: s.clients.total,sub: `${s.clients.pending} pending`, icon: Users,        color: "#EA580C", bg: "#FFF7ED" },
    { label: "Messages",      value: s.messages.total, sub: `${s.messages.unread} unread`, icon: TrendingUp,   color: "#64748B", bg: "#F8FAFC" },
  ];

  // Enrich pie data with colours
  const skillsPie = data.skillsByCategory.map((d: any) => ({
    ...d, fill: CAT_COLORS[d.name] ?? "#64748B",
  }));
  const projectsCatPie = data.projectsByCategory.map((d: any) => ({
    ...d, fill: CAT_COLORS[d.name] ?? "#64748B",
  }));
  const projectsStatusPie = data.projectsByStatus.map((d: any) => ({
    ...d, fill: STATUS_COLORS[d.name] ?? "#64748B",
  }));
  const expPie = data.experienceByType.map((d: any) => ({
    ...d, fill: TYPE_COLORS[d.name] ?? "#64748B",
  }));

  return (
    <div className="space-y-6" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>
            Analytics
          </h2>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>
            A full breakdown of your portfolio data.
          </p>
        </div>
        <button
          onClick={() => setRefreshed(r => r + 1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-[#2563EB] hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] transition-all text-sm"
          style={{ fontWeight: 600 }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* ── Row 1: Contact growth + Top tech ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <Section title="Contact Form Submissions" sub="Portfolio inquiries over the last 12 months">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.contactsByMonth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="contactGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="count" name="Contacts" stroke="#2563EB" strokeWidth={2} fill="url(#contactGrad)" dot={{ r: 3, fill: "#2563EB" }} />
            </AreaChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Top Technologies Used" sub="Frequency across all portfolio projects">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.topTech} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="tech" width={80} tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#374151" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Projects" radius={[0, 6, 6, 0]}>
                {data.topTech.map((_: any, i: number) => (
                  <Cell key={i} fill={BLUE_PALETTE[i % BLUE_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* ── Row 2: 4 pie charts ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Skills by category */}
        <Section title="Skills by Category" sub="Distribution">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={skillsPie} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                paddingAngle={3} dataKey="value" labelLine={false} label={<PieLabel />}>
                {skillsPie.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {skillsPie.map((d: any) => (
              <div key={d.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-600 capitalize" style={{ fontWeight: 500 }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </span>
                <span className="text-gray-800" style={{ fontWeight: 700 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects by category */}
        <Section title="Projects by Category" sub="Distribution">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={projectsCatPie} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                paddingAngle={3} dataKey="value" labelLine={false} label={<PieLabel />}>
                {projectsCatPie.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {projectsCatPie.map((d: any) => (
              <div key={d.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-600 capitalize" style={{ fontWeight: 500 }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </span>
                <span className="text-gray-800" style={{ fontWeight: 700 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects by status */}
        <Section title="Project Status" sub="Completion rate">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={projectsStatusPie} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                paddingAngle={3} dataKey="value" labelLine={false} label={<PieLabel />}>
                {projectsStatusPie.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {projectsStatusPie.map((d: any) => (
              <div key={d.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-600 capitalize" style={{ fontWeight: 500 }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </span>
                <span className="text-gray-800" style={{ fontWeight: 700 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Experience by type */}
        <Section title="Experience Types" sub="Career breakdown">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={expPie} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                paddingAngle={3} dataKey="value" labelLine={false} label={<PieLabel />}>
                {expPie.map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {expPie.map((d: any) => (
              <div key={d.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-600 capitalize" style={{ fontWeight: 500 }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  {d.name}
                </span>
                <span className="text-gray-800" style={{ fontWeight: 700 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── Row 3: Skill proficiency + Achievements + Courses ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        <Section title="Avg. Skill Proficiency" sub="By category (%)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.profByCategory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="avg" name="Avg %" radius={[6, 6, 0, 0]}>
                {data.profByCategory.map((d: any, i: number) => (
                  <Cell key={i} fill={CAT_COLORS[d.category] ?? "#2563EB"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Achievements by Type" sub="Breakdown of recognition">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.achievementsByType} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                {data.achievementsByType.map((d: any, i: number) => (
                  <Cell key={i} fill={TYPE_COLORS[d.type] ?? "#F59E0B"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Courses by Category" sub="Learning distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.coursesByCategory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "Poppins", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                {data.coursesByCategory.map((d: any, i: number) => (
                  <Cell key={i} fill={TYPE_COLORS[d.category] ?? "#7C3AED"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>
      </div>

      {/* ── Row 4: Radar — skills overview ── */}
      <Section title="Skills Radar" sub="Proficiency across all categories at a glance">
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%"
              data={data.profByCategory.map((d: any) => ({ subject: d.category, proficiency: d.avg }))}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="subject"
                tick={{ fontSize: 11, fontFamily: "Poppins", fill: "#374151", fontWeight: 600 }} />
              <Radar name="Avg Proficiency" dataKey="proficiency"
                stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip content={<ChartTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* ── Row 5: Portfolio health summary ── */}
      <div className="bg-gradient-to-br from-[#EFF6FF] to-white border border-blue-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center">
            <BarChart2 size={17} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm text-[#18181B]" style={{ fontWeight: 700 }}>Portfolio Health</h3>
            <p className="text-[11px] text-gray-400" style={{ fontWeight: 400 }}>Key completion metrics</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Projects Completed",
              value: s.projects ? Math.round((s.completedProjects / s.projects) * 100) : 0,
              color: "#16A34A",
              bg: "#F0FDF4",
            },
            {
              label: "Courses Certified",
              value: s.courses ? Math.round((s.certifiedCourses / s.courses) * 100) : 0,
              color: "#2563EB",
              bg: "#EFF6FF",
            },
            {
              label: "Projects Featured",
              value: s.projects ? Math.round((s.featuredProjects / s.projects) * 100) : 0,
              color: "#7C3AED",
              bg: "#F5F3FF",
            },
            {
              label: "Clients Approved",
              value: s.clients.total ? Math.round((s.clients.approved / s.clients.total) * 100) : 0,
              color: "#F59E0B",
              bg: "#FFFBEB",
            },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600" style={{ fontWeight: 600 }}>{label}</p>
                <p className="text-sm" style={{ color, fontWeight: 800 }}>{value}%</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${value}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
