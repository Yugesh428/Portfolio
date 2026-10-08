"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FolderKanban, MessageSquare, Bell, Clock } from "lucide-react";
import Link from "next/link";

export default function PortalOverview() {
  const { data: session } = useSession();
  const [projects, setProjects]   = useState<any[]>([]);
  const [unread, setUnread]       = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/projects").then(r => r.json()),
      fetch("/api/dashboard/notifications").then(r => r.json()),
    ]).then(([proj, notif]) => {
      if (proj.success)  setProjects(proj.projects);
      if (notif.success) setUnread(notif.unreadCount);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const name = session?.user?.name?.split(" ")[0];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const activeProjects = projects.filter(p => p.status === "in_progress").length;
  const doneProjects   = projects.filter(p => p.status === "completed").length;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Welcome back, {name}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of your projects and activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "text-purple-600", bg: "bg-purple-50", href: "/portal/projects" },
          { label: "Active Now",     value: activeProjects,  icon: Clock,         color: "text-blue-600",   bg: "bg-blue-50",   href: "/portal/projects" },
          { label: "Unread Notifs",  value: unread,          icon: Bell,          color: "text-orange-600", bg: "bg-orange-50", href: "/portal/notifications" },
        ].map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={20} className={color} />
            </div>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-sm font-semibold text-gray-600 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Projects list */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-gray-900 flex items-center gap-2"><FolderKanban size={16} className="text-purple-500" /> Your Projects</h2>
          <Link href="/portal/projects" className="text-xs font-bold text-purple-600 hover:text-purple-800">View all →</Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-semibold">No projects yet. Yugesh will create one for you soon!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 5).map(p => {
              const statusColor: Record<string, string> = {
                planning: "bg-gray-100 text-gray-600",
                in_progress: "bg-blue-100 text-blue-700",
                review: "bg-yellow-100 text-yellow-700",
                completed: "bg-green-100 text-green-700",
                on_hold: "bg-orange-100 text-orange-700",
              };
              return (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{p.title}</p>
                    {p.techStack && <p className="text-xs text-gray-400 mt-0.5 truncate">{p.techStack}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-purple-500 to-green-500 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs font-black text-gray-600">{p.progress}%</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${statusColor[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/portal/messages"
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-purple-200 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={22} className="text-purple-600" />
          </div>
          <div>
            <p className="font-black text-gray-900">Send a Message</p>
            <p className="text-sm text-gray-500 mt-0.5">Chat directly with Yugesh</p>
          </div>
        </Link>
        <Link href="/portal/notifications"
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Bell size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="font-black text-gray-900">Notifications</p>
            <p className="text-sm text-gray-500 mt-0.5">{unread} unread update{unread !== 1 ? "s" : ""}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
