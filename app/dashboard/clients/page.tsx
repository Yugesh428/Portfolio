"use client";

import { useEffect, useState } from "react";
import { Users, Check, X, Clock, Search, Mail, Building, Phone, ChevronDown } from "lucide-react";

interface Client {
  id: number; name: string; email: string; company: string | null;
  phone: string | null; status: string; createdAt: string;
  projects: { id: number; title: string; status: string; progress: number }[];
}

export default function ClientsPage() {
  const [clients, setClients]   = useState<Client[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<string>("all");
  const [search, setSearch]     = useState("");
  const [acting, setActing]     = useState<number | null>(null);
  const [msg, setMsg]           = useState<string | null>(null);

  const load = (status?: string) => {
    const url = status && status !== "all"
      ? `/api/dashboard/clients?status=${status}`
      : "/api/dashboard/clients";
    fetch(url).then(r => r.json()).then(d => {
      if (d.success) setClients(d.clients);
      setLoading(false);
    });
  };

  useEffect(() => { load(filter); }, [filter]);

  const act = async (clientId: number, status: "approved" | "rejected") => {
    setActing(clientId);
    const res = await fetch("/api/dashboard/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, status }),
    });
    const data = await res.json();
    setMsg(data.message || data.error);
    setActing(null);
    load(filter);
    setTimeout(() => setMsg(null), 3000);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      approved: "bg-green-100 text-green-700",
      pending:  "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
    };
    return map[s] ?? "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage client accounts and portal access.</p>
        </div>
        <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {clients.length} total
        </span>
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl">
          {msg}
        </div>
      )}

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or company..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {["all","pending","approved","rejected"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                filter === s ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold">No clients found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                {["Client","Company","Contact","Projects","Status","Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                        {client.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{client.name}</p>
                        <p className="text-xs text-gray-400">
                          Joined {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Building size={13} className="text-gray-400" />
                      {client.company ?? <span className="text-gray-300 italic">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail size={11} className="text-gray-400" />{client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Phone size={11} />{client.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-black text-gray-700">{client.projects?.length ?? 0}</span>
                    <span className="text-xs text-gray-400 ml-1">project{client.projects?.length !== 1 ? "s" : ""}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusBadge(client.status)}`}>
                      {client.status === "pending"  && <Clock size={10} />}
                      {client.status === "approved" && <Check size={10} />}
                      {client.status === "rejected" && <X size={10} />}
                      {client.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {client.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => act(client.id, "approved")}
                          disabled={acting === client.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          onClick={() => act(client.id, "rejected")}
                          disabled={acting === client.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          <X size={12} /> Reject
                        </button>
                      </div>
                    )}
                    {client.status === "approved" && (
                      <button
                        onClick={() => act(client.id, "rejected")}
                        disabled={acting === client.id}
                        className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                    {client.status === "rejected" && (
                      <button
                        onClick={() => act(client.id, "approved")}
                        disabled={acting === client.id}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
