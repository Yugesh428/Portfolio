"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2,
  CheckCircle2, AlertCircle, Star, StarOff, Code2,
} from "lucide-react";
import type { SkillData, SkillCategory } from "@/lib/hooks/useSkill";

const categoryConfig: Record<string, { label: string; gradient: string; color: string }> = {
  frontend: { label: "Frontend", gradient: "from-blue-500 to-cyan-400", color: "#3B82F6" },
  backend:  { label: "Backend",  gradient: "from-green-500 to-emerald-400", color: "#10B981" },
  database: { label: "Database", gradient: "from-purple-500 to-violet-400", color: "#8B5CF6" },
  devops:   { label: "DevOps",   gradient: "from-orange-500 to-amber-400", color: "#F59E0B" },
  design:   { label: "Design",   gradient: "from-pink-500 to-rose-400", color: "#EC4899" },
  other:    { label: "Other",    gradient: "from-gray-500 to-slate-400", color: "#6B7280" },
};

type SkillForm = {
  name: string; category: SkillCategory; logo: string;
  proficiency: number; yearsOfExperience: number;
  color: string; order: number; featured: boolean;
};

const blank: SkillForm = {
  name: "", category: "frontend", logo: "", proficiency: 50,
  yearsOfExperience: 1, color: "#2563EB", order: 0, featured: false,
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

export default function SkillsDashboardPage() {
  const [items, setItems]         = useState<SkillData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<number | null>(null);
  const [form, setForm] = useState<SkillForm>({ ...blank });
  const [seeding, setSeeding]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try { setLoading(true); const r = await fetch("/api/skill"); const d = await r.json(); if (d.success) setItems(d.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const set = (key: keyof typeof form) => (val: any) => setForm(p => ({ ...p, [key]: val }));

  const uploadLogo = async (file: File) => {
    if (!file.type.startsWith("image/")) { setToast({ type: "error", msg: "Select an image file." }); return; }
    if (file.size > 5 * 1024 * 1024)    { setToast({ type: "error", msg: "Max 5MB." }); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", "portfolio/skills");
      const r = await fetch("/api/upload", { method: "POST", body: fd }); const d = await r.json();
      if (d.success) { setForm(p => ({ ...p, logo: d.url })); setToast({ type: "success", msg: "Uploaded!" }); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setUploading(false); }
  };

  const openAdd = () => { setEditId(null); setForm({ ...blank, order: items.length + 1 }); setShowForm(true); };

  const openEdit = (s: SkillData) => {
    setEditId(s.id);
    setForm({ name: s.name, category: s.category, logo: s.logo || "", proficiency: s.proficiency,
      yearsOfExperience: s.yearsOfExperience, color: s.color, order: s.order, featured: s.featured });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) { setToast({ type: "error", msg: "Skill name is required." }); return; }
    setSaving(true);
    try {
      const url = editId ? `/api/skill/${editId}` : "/api/skill";
      const r = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (d.success) { setToast({ type: "success", msg: editId ? "Updated!" : "Created!" }); setShowForm(false); load(); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this skill?")) return; setDeleting(id);
    try {
      const r = await fetch(`/api/skill/${id}`, { method: "DELETE" }); const d = await r.json();
      if (d.success) { setToast({ type: "success", msg: "Deleted." }); load(); } else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setDeleting(null); }
  };

  const toggleFeatured = async (s: SkillData) => {
    try { await fetch(`/api/skill/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...s, featured: !s.featured }) }); load(); } catch {}
  };

  const handleSeed = async () => {
    setSeeding(true);
    try { const r = await fetch("/api/skill/seed", { method: "POST" }); const d = await r.json(); if (d.success) { setToast({ type: "success", msg: d.message }); load(); } else throw new Error(d.error); }
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
          <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>Technical Skills</h2>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>Manage your technical skills. Featured ones show on homepage marquee.</p>
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
            <Plus size={14} /> Add Skill
          </button>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base text-[#18181B]" style={{ fontWeight: 700 }}>{editId ? "Edit Skill" : "Add Skill"}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>

            <div className="p-6 space-y-4">
              <Input label="Skill Name *" value={form.name} onChange={set("name")} placeholder="e.g. React" />
              
              <div className="space-y-1.5">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Category</label>
                <select value={form.category} onChange={e => set("category")(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2563EB] transition-all"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Logo upload or URL */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Logo (optional)</label>
                <input ref={logoRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(f); e.target.value = ""; }} />
                
                {form.logo ? (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 w-20 h-20">
                      <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
                      <button onClick={() => setForm(p => ({ ...p, logo: "" }))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"><X size={10} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button onClick={() => logoRef.current?.click()} disabled={uploading} type="button"
                      className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#2563EB]/50 text-gray-400 hover:text-[#2563EB] flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ fontWeight: 600 }}>
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : "🖼️"}
                      {uploading ? "Uploading…" : "Upload Logo"}
                    </button>
                    
                    <div className="relative flex items-center gap-2">
                      <div className="flex-1 h-[1px] bg-gray-200" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>or</span>
                      <div className="flex-1 h-[1px] bg-gray-200" />
                    </div>
                    
                    <Input 
                      label="" 
                      value={form.logo} 
                      onChange={set("logo")} 
                      placeholder="Paste image URL (https://...)" 
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Proficiency (%)</label>
                  <input type="range" min="1" max="100" value={form.proficiency} onChange={e => set("proficiency")(parseInt(e.target.value))}
                    className="w-full" />
                  <div className="text-center text-sm text-gray-600" style={{ fontWeight: 700 }}>{form.proficiency}%</div>
                </div>
                <Input label="Years of Experience" type="number" value={form.yearsOfExperience} onChange={(v: string) => set("yearsOfExperience")(parseInt(v) || 1)} placeholder="1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Sort Order" type="number" value={form.order} onChange={(v: string) => set("order")(parseInt(v) || 0)} placeholder="1" />
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button type="button" onClick={() => set("featured")(!form.featured)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-[#2563EB]" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>Show on Homepage</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50" style={{ fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] text-white text-sm hover:bg-blue-700 disabled:opacity-60" style={{ fontWeight: 700 }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Saving…" : "Save Skill"}
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
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-2xl"><Code2 size={24} className="text-[#2563EB]" /></div>
          <div className="text-center">
            <p className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>No skills yet</p>
            <p className="text-gray-400 text-xs mt-1" style={{ fontWeight: 400 }}>Click "Seed Defaults" or "Add Skill" to get started.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(s => {
            const cfg = categoryConfig[s.category] || categoryConfig.other;
            return (
              <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm hover:border-gray-200 transition-all">
                {s.logo ? (
                  <img src={s.logo} alt={s.name} className="w-10 h-10 rounded-xl object-contain flex-shrink-0" />
                ) : (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 bg-gradient-to-br ${cfg.gradient}`}>
                    {s.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm text-gray-900 truncate" style={{ fontWeight: 700 }}>{s.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: cfg.color, background: `${cfg.color}15`, fontWeight: 700 }}>{cfg.label}</span>
                    <span className="text-[10px] text-gray-400" style={{ fontWeight: 500 }}>{s.yearsOfExperience}+ yrs · {s.proficiency}%</span>
                  </div>
                </div>
                <button onClick={() => toggleFeatured(s)} className={`flex-shrink-0 ${s.featured ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}>
                  {s.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(s)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#EFF6FF] text-gray-400 hover:text-[#2563EB]"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 disabled:opacity-50">
                    {deleting === s.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs text-gray-400 text-center" style={{ fontWeight: 500 }}>
          ⭐ {items.filter(s => s.featured).length} of {items.length} skills featured on homepage.
        </p>
      )}
    </div>
  );
}
