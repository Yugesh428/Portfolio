"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, MessageSquare, FolderKanban, Users, Upload } from "lucide-react";
import Link from "next/link";

interface Notif {
  id: number; type: string; title: string; body: string | null;
  link: string | null; isRead: boolean; createdAt: string;
}

const ICONS: Record<string, React.ReactNode> = {
  new_message:     <MessageSquare size={16} className="text-blue-500" />,
  project_update:  <FolderKanban  size={16} className="text-purple-500" />,
  client_approved: <Users         size={16} className="text-green-500" />,
  client_rejected: <Users         size={16} className="text-red-500" />,
  file_uploaded:   <Upload        size={16} className="text-cyan-500" />,
};

export default function PortalNotifications() {
  const [notifs, setNotifs]   = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const load = () =>
    fetch("/api/dashboard/notifications").then(r => r.json()).then(d => {
      if (d.success) setNotifs(d.notifications);
      setLoading(false);
    });

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    setMarking(true);
    await fetch("/api/dashboard/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setMarking(false);
    load();
  };

  const markOne = async (id: number) => {
    await fetch("/api/dashboard/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unread = notifs.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} disabled={marking}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 disabled:opacity-50">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <Bell size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold">All caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => {
            const baseClass = `flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${n.isRead ? "bg-white border-gray-100 hover:border-gray-200" : "bg-purple-50/50 border-purple-100 hover:border-purple-200"}`;
            const inner = (
              <>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? "bg-gray-100" : "bg-white border border-purple-100"}`}>
                  {ICONS[n.type] ?? <Bell size={16} className="text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${n.isRead ? "text-gray-700" : "text-gray-900"}`}>{n.title}</p>
                  {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                  <p className="text-[10px] text-gray-400 mt-1.5 uppercase tracking-wider font-semibold">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />}
              </>
            );
            return n.link ? (
              <Link key={n.id} href={n.link} onClick={() => { if (!n.isRead) markOne(n.id); }} className={baseClass}>{inner}</Link>
            ) : (
              <div key={n.id} onClick={() => { if (!n.isRead) markOne(n.id); }} className={baseClass}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
