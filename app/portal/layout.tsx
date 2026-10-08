"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, MessageSquare, Bell, LogOut, Menu, X, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/portal",          icon: LayoutDashboard, label: "Overview"  },
  { href: "/portal/projects", icon: FolderKanban,    label: "Projects"  },
  { href: "/portal/messages", icon: MessageSquare,   label: "Messages"  },
  { href: "/portal/notifications", icon: Bell,       label: "Notifications" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen]     = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
    if (status === "authenticated") {
      const role   = (session?.user as any)?.role;
      const sStatus = (session?.user as any)?.status;
      if (role === "admin") router.replace("/dashboard");
      if (role === "client" && sStatus !== "approved") router.replace("/portal/pending");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetch = () =>
      window.fetch("/api/dashboard/notifications")
        .then(r => r.json()).then(d => { if (d.unreadCount !== undefined) setUnread(d.unreadCount); }).catch(() => {});
    fetch();
    const t = setInterval(fetch, 30000);
    return () => clearInterval(t);
  }, []);

  if (status === "loading") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const role   = (session?.user as any)?.role;
  const sStatus = (session?.user as any)?.status;
  if (role !== "client" || sStatus !== "approved") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link href="/portal" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-green-500 flex items-center justify-center text-white font-black text-sm">Y</span>
            <span className="font-black text-gray-900 tracking-tight">Client Portal</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400"><X size={18} /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/portal" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${active ? "bg-purple-50 text-purple-700 border border-purple-100" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <Icon size={18} className={active ? "text-purple-600" : "text-gray-400 group-hover:text-gray-600"} />
                <span className="flex-1">{label}</span>
                {label === "Notifications" && unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">{unread > 9 ? "9+" : unread}</span>
                )}
                {active && <ChevronRight size={14} className="text-purple-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-black text-sm">
              {session?.user?.name?.[0]?.toUpperCase() ?? "C"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{session?.user?.name}</p>
              <p className="text-[10px] text-purple-600 font-semibold uppercase tracking-wider">Client</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"><Menu size={20} /></button>
          <h1 className="text-base font-black text-gray-900 capitalize">{pathname.split("/").pop()?.replace("-", " ") || "Overview"}</h1>
          <div className="flex items-center gap-3">
            <Link href="/portal/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Bell size={18} />
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">{unread > 9 ? "9+" : unread}</span>}
            </Link>
            <Link href="/" target="_blank" className="text-xs text-gray-500 hover:text-gray-900 font-semibold hidden sm:block">View Site ↗</Link>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
