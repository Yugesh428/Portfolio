"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, FolderKanban, MessageSquare,
  Bell, LogOut, Home, FileText, ExternalLink,
  ChevronDown, Search, Settings, Menu, X, Sparkles, Briefcase, Trophy, BookOpen, Code2, BarChart2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",                    icon: LayoutDashboard, label: "Overview"           },
  { href: "/dashboard/analytics",          icon: BarChart2,       label: "Analytics"          },
  { href: "/dashboard/hero",               icon: Sparkles,        label: "Hero Section"       },
  { href: "/dashboard/resume",             icon: FileText,        label: "Resume"             },
  { href: "/dashboard/experience",         icon: Briefcase,       label: "Experience"         },
  { href: "/dashboard/achievements",       icon: Trophy,          label: "Achievements"       },
  { href: "/dashboard/courses",            icon: BookOpen,        label: "Courses"            },
  { href: "/dashboard/skills",             icon: Code2,           label: "Skills"             },
  { href: "/dashboard/projects-portfolio", icon: FolderKanban,    label: "Portfolio Projects" },
  { href: "/dashboard/clients",            icon: Users,           label: "Clients"            },
  { href: "/dashboard/projects",           icon: FolderKanban,    label: "Projects"           },
  { href: "/dashboard/messages",           icon: MessageSquare,   label: "Messages"           },
  { href: "/dashboard/contacts",           icon: FileText,        label: "Contacts"           },
  { href: "/dashboard/notifications",      icon: Bell,            label: "Notifications"      },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [unread, setUnread]       = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.replace("/portal");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetch_ = () =>
      fetch("/api/dashboard/notifications")
        .then(r => r.json())
        .then(d => { if (d.unreadCount !== undefined) setUnread(d.unreadCount); })
        .catch(() => {});
    fetch_();
    const t = setInterval(fetch_, 30000);
    return () => clearInterval(t);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if ((session?.user as any)?.role !== "admin") return null;

  const currentLabel = navItems.find(n =>
    pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href))
  )?.label ?? "Overview";

  return (
    <div className="min-h-screen flex bg-[#F8FAFF]" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Mobile overlay ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ════════════════════════════ SIDEBAR ════════════════════════════ */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto flex flex-col
          bg-white border-r border-gray-100 shadow-sm
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-60" : "w-[70px]"}
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/25">
            <span className="text-white text-base" style={{ fontWeight: 800 }}>Y</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-[#18181B] text-sm leading-none" style={{ fontWeight: 700 }}>Yugesh</p>
              <p className="text-gray-400 text-[11px] mt-0.5" style={{ fontWeight: 500 }}>Admin Panel</p>
            </div>
          )}
          {/* Collapse toggle — desktop only */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="ml-auto hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <Menu size={14} />
          </button>
        </div>

        {/* Search */}
        {sidebarOpen && (
          <div className="px-3 py-3 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Search size={13} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-400 text-xs" style={{ fontWeight: 400 }}>Search…</span>
              <span className="ml-auto text-[10px] text-gray-300 flex-shrink-0" style={{ fontWeight: 500 }}>⌘K</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 overflow-y-auto">
          {sidebarOpen && (
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] px-3 mb-2" style={{ fontWeight: 600 }}>
              Menu
            </p>
          )}
          <ul className="space-y-0.5">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all group
                      ${active
                        ? "bg-[#EFF6FF] text-[#2563EB]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    {/* Active bar */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#2563EB]" />
                    )}
                    <Icon size={17} className={`flex-shrink-0 ${active ? "text-[#2563EB]" : "text-gray-400 group-hover:text-gray-600"}`} />
                    {sidebarOpen && (
                      <>
                        <span className="text-sm flex-1" style={{ fontWeight: active ? 600 : 500 }}>{label}</span>
                        {label === "Notifications" && unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center flex-shrink-0" style={{ fontWeight: 700 }}>
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </>
                    )}
                    {/* Collapsed tooltip */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50" style={{ fontWeight: 500 }}>
                        {label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="my-3 border-t border-gray-100" />

          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-500 hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-all group"
          >
            <Home size={17} className="flex-shrink-0 text-gray-400 group-hover:text-[#2563EB]" />
            {sidebarOpen && (
              <>
                <span className="text-sm flex-1" style={{ fontWeight: 500 }}>Back to Home</span>
                <ExternalLink size={13} className="text-gray-300 group-hover:text-[#2563EB]" />
              </>
            )}
            {!sidebarOpen && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50" style={{ fontWeight: 500 }}>
                Back to Home
              </div>
            )}
          </Link>
        </nav>

        {/* Footer — user card */}
        <div className="border-t border-gray-100 p-3 flex-shrink-0">
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 700 }}>
              {session?.user?.name?.[0]?.toUpperCase() ?? "Y"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 truncate" style={{ fontWeight: 600 }}>{session?.user?.name}</p>
                <p className="text-[10px] text-[#2563EB] uppercase tracking-wider" style={{ fontWeight: 600 }}>Admin</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
              style={{ fontWeight: 600 }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* ════════════════════════════ MAIN ════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(v => !v)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-base text-[#18181B]" style={{ fontWeight: 700 }}>{currentLabel}</h1>
              <p className="text-[11px] text-gray-400 hidden sm:block" style={{ fontWeight: 400 }}>
                Portfolio admin dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search bar (desktop) */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-48">
              <Search size={13} className="text-gray-400" />
              <span className="text-gray-400 text-xs" style={{ fontWeight: 400 }}>Search…</span>
            </div>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700"
            >
              <Bell size={17} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center" style={{ fontWeight: 700 }}>
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>

            {/* Settings */}
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
              <Settings size={17} />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white text-sm cursor-pointer" style={{ fontWeight: 700 }}>
              {session?.user?.name?.[0]?.toUpperCase() ?? "Y"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-[#F8FAFF]">
          {children}
        </main>
      </div>
    </div>
  );
}
