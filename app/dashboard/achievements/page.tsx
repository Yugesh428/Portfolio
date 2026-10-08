"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2,
  CheckCircle2, AlertCircle, Trophy, Eye, Star, StarOff,
} from "lucide-react";
import type { AchievementData } from "@/lib/hooks/useAchievement";

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  hackathon:    { label: "Hackathon",    color: "#F59E0B", bg: "#FFFBEB" },
  internship:   { label: "Internship",   color: "#2563EB", bg: "#EFF6FF" },
  certification:{ label: "Certification",color: "#16A34A", bg: "#F0FDF4" },
  award:        { label: "Award",        color: "#7C3AED", bg: "#F5F3FF" },
  volunteer:    { label: "Volunteer",    color: "#EC4899", bg: "#FDF2F8" },
};

const blank = {
  title: "",
  organization: "",
  date: "",
  type: "hackathon" as const,
  description: "",
  certificateImage: "",
  badgeEmoji: "🏆",
  color: "#F59E0B",
  order: 0,
  featured: true,
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

export default function AchievementDashboardPage() {
  const [items, setItems]         = useState<AchievementData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<number | null>(null);
  const [form, setForm]           = useState({ ...blank });
  const [seeding, setSeeding]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const certRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/achievement");
      const d   = await res.json();
      if (d.success) setItems(d.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (key: keyof typeof form) => (val: any) =>
    setForm(p => ({ ...p, [key]: val }));

  /* ── upload certificate ── */
  const uploadCert = async (file: File) => {
    if (!file.type.startsWith("image/")) { setToast({ type: "error", msg: "Select an image file." }); return; }
    if (file.size > 10 * 1024 * 1024)   { setToast({ type: "error", msg: "Max 10MB." }); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "portfolio/achievements");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d   = await res.json();
      if (d.success) { setForm(p => ({ ...p, certificateImage: d.url })); setToast({ type: "success", msg: "Uploaded!" }); }
      else throw new Error(d.error || "Upload failed");
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setUploading(false); }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ ...blank, order: items.length + 1 });
    setShowForm(true);
  };

  const openEdit = (a: AchievementData) => {
    setEditId(a.id);
    setForm({
      title: a.title, organization: a.organization, date: a.date,
      type: a.type, description: a.description,
      certificateImage: a.certificateImage || "",
      badgeEmoji: a.badgeEmoji, color: a.color,
      order: a.order, featured: a.featured,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.organization) {
      setToast({ type: "error", msg: "Title and organization are required." }); return;
    }
    setSaving(true);
    try {
      const url    = editId ? `/api/achievement/${editId}` : "/api/achievement";
      const method = editId ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d      = await res.json();
      if (d.success) { setToast({ type: "success", msg: editId ? "Updated!" : "Created!" }); setShowForm(false); load(); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message || "Save failed." }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this achievement?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/achievement/${id}`, { method: "DELETE" });
      const d   = await res.json();
      if (d.success) { setToast({ type: "success", msg: "Deleted." }); load(); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setDeleting(null); }
  };

  const toggleFeatured = async (a: AchievementData) => {
    try {
      await fetch(`/api/achievement/${a.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, featured: !a.featured }),
      });
      load();
    } catch {}
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/achievement/seed", { method: "POST" });
      const d   = await res.json();
      if (d.success) { setToast({ type: "success", msg: d.message }); load(); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setSeeding(false); }
  };

  /* colour presets */
  const colorPresets = [
    { color: "#F59E0B", emoji: "🏆" },
    { color: "#2563EB", emoji: "💼" },
    { color: "#16A34A", emoji: "📜" },
    { color: "#7C3AED", emoji: "🎓" },
    { color: "#EC4899", emoji: "❤️" },
    { color: "#F59E0B", emoji: "🌍" },
    { color: "#EF4444", emoji: "🔥" },
    { color: "#06B6D4", emoji: "⚡" },
  ];

  return (
    <div className="space-y-6 max-w-5xl" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm
          ${toast.type === "success" ? "bg-white border-green-200 text-green-700" : "bg-white border-red-200 text-red-700"}`}
          style={{ fontWeight: 600 }}>
          {toast.type === "success"
            ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
            : <AlertCircle  size={16} className="text-red-500 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>Achievements Manager</h2>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>
            Manage hackathons, certifications, internships and awards. Featured ones show on homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {items.length === 0 && (
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition-colors disabled:opacity-60"
              style={{ fontWeight: 600 }}>
              {seeding ? <Loader2 size={14} className="animate-spin" /> : "⚡"} Seed Defaults
            </button>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
            style={{ fontWeight: 700 }}>
            <Plus size={14} /> Add Achievement
          </button>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base text-[#18181B]" style={{ fontWeight: 700 }}>
                {editId ? "Edit Achievement" : "Add Achievement"}
              </h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title *" value={form.title} onChange={set("title")} placeholder="e.g. JunctionX Hackathon" />
                <Input label="Organization *" value={form.organization} onChange={set("organization")} placeholder="e.g. SUMS Nepal" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" value={form.date} onChange={set("date")} placeholder="e.g. May 2026" />
                <div className="space-y-1.5">
                  <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Type</label>
                  <select value={form.type} onChange={e => set("type")(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#2563EB] transition-all"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                    <option value="hackathon">Hackathon</option>
                    <option value="internship">Internship</option>
                    <option value="certification">Certification</option>
                    <option value="award">Award</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
              </div>

              <Textarea label="Description" value={form.description} onChange={set("description")}
                placeholder="Describe this achievement…" rows={3} />

              {/* Badge & colour pickers */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Badge Emoji &amp; Accent Colour</label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((p, i) => (
                    <button key={i} type="button"
                      onClick={() => setForm(prev => ({ ...prev, badgeEmoji: p.emoji, color: p.color }))}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all border-2
                        ${form.badgeEmoji === p.emoji && form.color === p.color
                          ? "border-[#2563EB] scale-110 shadow-md"
                          : "border-transparent hover:border-gray-300"}`}
                      style={{ background: `${p.color}15` }}>
                      {p.emoji}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <input value={form.badgeEmoji} onChange={e => set("badgeEmoji")(e.target.value)}
                    placeholder="Emoji" maxLength={4}
                    className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-center text-sm focus:outline-none focus:border-[#2563EB]" />
                  <input type="color" value={form.color} onChange={e => set("color")(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-1" />
                  <span className="text-xs text-gray-400" style={{ fontWeight: 400 }}>or pick custom emoji/color</span>
                </div>
              </div>

              {/* Certificate upload */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Certificate / Proof (optional)</label>
                <input ref={certRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadCert(f); e.target.value = ""; }} />
                {form.certificateImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.certificateImage} alt="Certificate" className="w-full h-40 object-cover" />
                    <button onClick={() => setForm(p => ({ ...p, certificateImage: "" }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => certRef.current?.click()} disabled={uploading} type="button"
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#2563EB]/50 text-gray-400 hover:text-[#2563EB] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ fontWeight: 600 }}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : "📄"}
                    {uploading ? "Uploading…" : "Click to Upload Certificate"}
                  </button>
                )}
                <p className="text-[11px] text-gray-400">JPG, PNG — max 10MB.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Sort Order" type="number" value={form.order}
                  onChange={(v: string) => set("order")(parseInt(v) || 0)} placeholder="1" />
                <div className="space-y-1.5 flex flex-col justify-end">
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
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50" style={{ fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                style={{ fontWeight: 700 }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Saving…" : "Save Achievement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="grid gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] flex items-center justify-center text-2xl">🏆</div>
          <div className="text-center">
            <p className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>No achievements yet</p>
            <p className="text-gray-400 text-xs mt-1" style={{ fontWeight: 400 }}>
              Click "Seed Defaults" to load your achievements or "Add Achievement" to start fresh.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(a => {
            const cfg = typeConfig[a.type] || typeConfig.award;
            return (
              <div key={a.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm hover:border-gray-200 transition-all">
                {/* Emoji badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                  {a.badgeEmoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm text-gray-900 truncate" style={{ fontWeight: 700 }}>{a.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: cfg.color, background: cfg.bg, fontWeight: 700 }}>
                      {cfg.label}
                    </span>
                    {a.certificateImage && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 flex-shrink-0" style={{ fontWeight: 600 }}>
                        📎 Cert
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5" style={{ fontWeight: 400 }}>
                    {a.organization} · {a.date}
                  </p>
                </div>

                {/* Featured toggle */}
                <button onClick={() => toggleFeatured(a)}
                  className={`flex-shrink-0 transition-colors ${a.featured ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}>
                  {a.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(a)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#EFF6FF] text-gray-400 hover:text-[#2563EB] transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                    {deleting === a.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs text-gray-400 text-center" style={{ fontWeight: 500 }}>
          ⭐ {items.filter(a => a.featured).length} of {items.length} achievements featured on homepage.
        </p>
      )}
    </div>
  );
}
