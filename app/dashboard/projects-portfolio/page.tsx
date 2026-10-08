"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2,
  CheckCircle2, AlertCircle, Star, StarOff, FolderKanban, Github, ExternalLink, Lock,
} from "lucide-react";
import type { ProjectData } from "@/lib/hooks/useProject";

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  "saas":    { label: "SaaS",     color: "#2563EB", bg: "#EFF6FF" },
  "web-app": { label: "Web App",  color: "#10B981", bg: "#F0FDF4" },
  "api":     { label: "API",      color: "#7C3AED", bg: "#F5F3FF" },
  "mobile":  { label: "Mobile",   color: "#F59E0B", bg: "#FFFBEB" },
  "other":   { label: "Other",    color: "#6B7280", bg: "#F9FAFB" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  "completed":   { label: "Completed",   color: "#10B981" },
  "in-progress": { label: "In Progress", color: "#F59E0B" },
  "planned":     { label: "Planned",     color: "#6B7280" },
};

const blank = {
  title: "", category: "web-app" as const, status: "completed" as const,
  description: "", shortDescription: "", technologies: [] as string[],
  image: "", githubUrl: "", liveUrl: "", isPrivate: false, isFeatured: false,
  color: "#2563EB", badgeEmoji: "💻", startDate: "", endDate: "", order: 0,
};

function Input({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>{label}</label>
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all resize-none"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }} />
    </div>
  );
}

export default function ProjectsPortfolioDashboardPage() {
  const [items, setItems]         = useState<ProjectData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<number | null>(null);
  const [form, setForm]           = useState({ ...blank });
  const [techInput, setTechInput] = useState("");
  const [seeding, setSeeding]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try { setLoading(true); const r = await fetch("/api/project"); const d = await r.json(); if (d.success) setItems(d.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const set = (key: keyof typeof form) => (val: any) => setForm(p => ({ ...p, [key]: val }));

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) { setToast({ type: "error", msg: "Select an image file." }); return; }
    if (file.size > 10 * 1024 * 1024)   { setToast({ type: "error", msg: "Max 10MB." }); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", "portfolio/projects");
      const r = await fetch("/api/upload", { method: "POST", body: fd }); const d = await r.json();
      if (d.success) { setForm(p => ({ ...p, image: d.url })); setToast({ type: "success", msg: "Uploaded!" }); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setUploading(false); }
  };

  const addTech = () => { const v = techInput.trim(); if (!v) return; setForm(p => ({ ...p, technologies: [...p.technologies, v] })); setTechInput(""); };

  const openAdd = () => { setEditId(null); setForm({ ...blank, order: items.length + 1 }); setTechInput(""); setShowForm(true); };

  const openEdit = (p: ProjectData) => {
    setEditId(p.id);
    setForm({ title: p.title, category: p.category, status: p.status, description: p.description,
      shortDescription: p.shortDescription, technologies: [...p.technologies], image: p.image || "",
      githubUrl: p.githubUrl || "", liveUrl: p.liveUrl || "", isPrivate: p.isPrivate, isFeatured: p.isFeatured,
      color: p.color, badgeEmoji: p.badgeEmoji, startDate: p.startDate || "", endDate: p.endDate || "", order: p.order });
    setTechInput(""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) { setToast({ type: "error", msg: "Title is required." }); return; }
    setSaving(true);
    try {
      const url = editId ? `/api/project/${editId}` : "/api/project";
      const r = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (d.success) { setToast({ type: "success", msg: editId ? "Updated!" : "Created!" }); setShowForm(false); load(); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return; setDeleting(id);
    try {
      const r = await fetch(`/api/project/${id}`, { method: "DELETE" }); const d = await r.json();
      if (d.success) { setToast({ type: "success", msg: "Deleted." }); load(); } else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setDeleting(null); }
  };

  const toggleFeatured = async (p: ProjectData) => {
    try { await fetch(`/api/project/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, isFeatured: !p.isFeatured }) }); load(); } catch {}
  };

  const handleSeed = async () => {
    setSeeding(true);
    try { const r = await fetch("/api/project/seed", { method: "POST" }); const d = await r.json(); if (d.success) { setToast({ type: "success", msg: d.message }); load(); } else throw new Error(d.error); }
    catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setSeeding(false); }
  };

  return (
    <div className="space-y-6 max-w-5xl" style={{ fontFamily: "Poppins, sans-serif" }}>

      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm
          ${toast.type === "success" ? "bg-white border-green-200 text-green-700" : "bg-white border-red-200 text-red-700"}`}
          style={{ fontWeight: 600 }}>
          {toast.type === "success" ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" /> : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>Portfolio Projects</h2>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>Manage your portfolio projects. Featured ones show on homepage.</p>
        </div>
        <div className="flex items-center gap-2">
          {items.length === 0 && (
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs disabled:opacity-60"
              style={{ fontWeight: 600 }}>
              {seeding ? <Loader2 size={14} className="animate-spin" /> : "⚡"} Seed Defaults
            </button>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs hover:bg-blue-700 shadow-sm shadow-blue-500/30"
            style={{ fontWeight: 700 }}>
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>

      {/* Form modal - will be lengthy, continuing in next part... */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base text-[#18181B]" style={{ fontWeight: 700 }}>{editId ? "Edit Project" : "Add Project"}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <Input label="Project Title *" value={form.title} onChange={set("title")} placeholder="e.g. Institute SAAS" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Category</label>
                  <select value={form.category} onChange={e => set("category")(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2563EB] transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    <option value="saas">SaaS</option>
                    <option value="web-app">Web App</option>
                    <option value="api">API</option>
                    <option value="mobile">Mobile</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Status</label>
                  <select value={form.status} onChange={e => set("status")(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2563EB] transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              <Input label="Short Description" value={form.shortDescription} onChange={set("shortDescription")} placeholder="One-line summary" />
              <Textarea label="Full Description" value={form.description} onChange={set("description")} placeholder="Detailed project description..." rows={4} />

              {/* Technologies */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Technologies</label>
                <div className="flex flex-wrap gap-1.5">
                  {form.technologies.map((t, i) => (
                    <span key={i} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB]" style={{ fontWeight: 600 }}>
                      {t}
                      <button onClick={() => setForm(p => ({ ...p, technologies: p.technologies.filter((_, j) => j !== i) }))}
                        className="text-blue-300 hover:text-red-400"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={techInput} onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="e.g. Next.js — press Enter"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2563EB]"
                    style={{ fontFamily: "Poppins, sans-serif" }} />
                  <button onClick={addTech} className="px-3 py-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs hover:bg-blue-100" style={{ fontWeight: 700 }}>Add</button>
                </div>
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Project Image (optional)</label>
                <input ref={imgRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} />
                {form.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.image} alt="Project" className="w-full h-40 object-cover" />
                    <button onClick={() => setForm(p => ({ ...p, image: "" }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"><X size={12} /></button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button onClick={() => imgRef.current?.click()} disabled={uploading} type="button"
                      className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#2563EB]/50 text-gray-400 hover:text-[#2563EB] flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ fontWeight: 600 }}>
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : "🖼️"}
                      {uploading ? "Uploading…" : "Upload Project Image"}
                    </button>
                    <div className="relative flex items-center gap-2">
                      <div className="flex-1 h-[1px] bg-gray-200" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>or</span>
                      <div className="flex-1 h-[1px] bg-gray-200" />
                    </div>
                    <Input label="" value={form.image} onChange={set("image")} placeholder="Paste image URL (https://...)" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="GitHub URL" value={form.githubUrl} onChange={set("githubUrl")} placeholder="https://github.com/..." />
                <Input label="Live URL" value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" value={form.startDate} onChange={set("startDate")} placeholder="Jan 2025" />
                <Input label="End Date" value={form.endDate} onChange={set("endDate")} placeholder="Mar 2025" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input label="Emoji Badge" value={form.badgeEmoji} onChange={set("badgeEmoji")} placeholder="💻" />
                <div className="space-y-1.5">
                  <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Color</label>
                  <input type="color" value={form.color} onChange={e => set("color")(e.target.value)}
                    className="w-full h-[42px] rounded-xl border border-gray-200 cursor-pointer p-1" />
                </div>
                <Input label="Sort Order" type="number" value={form.order} onChange={(v: string) => set("order")(parseInt(v) || 0)} placeholder="1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <button type="button" onClick={() => set("isPrivate")(!form.isPrivate)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.isPrivate ? "bg-gray-600" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPrivate ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>Private Project</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <button type="button" onClick={() => set("isFeatured")(!form.isFeatured)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.isFeatured ? "bg-[#2563EB]" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>Featured</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] text-white text-sm hover:bg-blue-700 disabled:opacity-60" style={{ fontWeight: 700 }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Saving…" : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="grid gap-3">{[...Array(4)].map((_, i) => <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse h-20" />)}</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-2xl"><FolderKanban size={24} className="text-[#2563EB]" /></div>
          <div className="text-center">
            <p className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>No projects yet</p>
            <p className="text-gray-400 text-xs mt-1" style={{ fontWeight: 400 }}>Click "Seed Defaults" or "Add Project" to get started.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(p => {
            const cfg = categoryConfig[p.category] || categoryConfig.other;
            const sts = statusConfig[p.status] || statusConfig.completed;
            return (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm hover:border-gray-200 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                  {p.badgeEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm text-gray-900 truncate" style={{ fontWeight: 700 }}>{p.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: cfg.color, background: cfg.bg, fontWeight: 700 }}>{cfg.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: sts.color, background: `${sts.color}15`, fontWeight: 600 }}>{sts.label}</span>
                    {p.isPrivate && <Lock size={11} className="text-gray-400" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5" style={{ fontWeight: 400 }}>{p.shortDescription}</p>
                </div>
                <button onClick={() => toggleFeatured(p)} className={`flex-shrink-0 ${p.isFeatured ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}>
                  {p.isFeatured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#EFF6FF] text-gray-400 hover:text-[#2563EB]"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 disabled:opacity-50">
                    {deleting === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs text-gray-400 text-center" style={{ fontWeight: 500 }}>
          ⭐ {items.filter(p => p.isFeatured).length} of {items.length} projects featured on homepage.
        </p>
      )}
    </div>
  );
}
