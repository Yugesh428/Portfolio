"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2,
  CheckCircle2, AlertCircle, BookOpen, Star, StarOff, ExternalLink,
} from "lucide-react";
import type { CourseData, CourseCategory } from "@/lib/hooks/useCourse";

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  "web-development": { label: "Web Dev",     color: "#2563EB", bg: "#EFF6FF" },
  "database":        { label: "Database",    color: "#7C3AED", bg: "#F5F3FF" },
  "cloud":           { label: "Cloud",       color: "#0EA5E9", bg: "#F0F9FF" },
  "programming":     { label: "Programming", color: "#F59E0B", bg: "#FFFBEB" },
  "design":          { label: "Design",      color: "#EC4899", bg: "#FDF2F8" },
  "other":           { label: "Other",       color: "#16A34A", bg: "#F0FDF4" },
};

type CourseForm = {
  title: string; issuer: string; category: CourseCategory; completedDate: string;
  credentialUrl: string; certificateImage: string; certificateImage2: string;
  description: string; skills: string[]; badgeEmoji: string;
  color: string; order: number; featured: boolean;
};

const blank: CourseForm = {
  title: "", issuer: "", category: "web-development",
  completedDate: "", credentialUrl: "", certificateImage: "", certificateImage2: "",
  description: "", skills: [], badgeEmoji: "📜", color: "#2563EB", order: 0, featured: false,
};

const colorPresets = [
  { color: "#2563EB", emoji: "🌐" }, { color: "#7C3AED", emoji: "🗄️" },
  { color: "#16A34A", emoji: "📜" }, { color: "#F59E0B", emoji: "⚡" },
  { color: "#EC4899", emoji: "🎨" }, { color: "#0EA5E9", emoji: "☁️" },
  { color: "#ED8B00", emoji: "☕" }, { color: "#18181B", emoji: "🔧" },
];

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

export default function CourseDashboardPage() {
  const [items, setItems]         = useState<CourseData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<number | null>(null);
  const [form, setForm] = useState<CourseForm>({ ...blank });
  const [skillInput, setSkillInput] = useState("");
  const [seeding, setSeeding]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const certRef = useRef<HTMLInputElement>(null);
  const cert2Ref = useRef<HTMLInputElement>(null);

  const load = async () => {
    try { setLoading(true); const r = await fetch("/api/course"); const d = await r.json(); if (d.success) setItems(d.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const set = (key: keyof typeof form) => (val: any) => setForm(p => ({ ...p, [key]: val }));

  const uploadCert = async (file: File, target: "certificateImage" | "certificateImage2" = "certificateImage") => {
    if (!file.type.startsWith("image/")) { setToast({ type: "error", msg: "Select an image file." }); return; }
    if (file.size > 10 * 1024 * 1024)   { setToast({ type: "error", msg: "Max 10MB." }); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("folder", "portfolio/courses");
      const r = await fetch("/api/upload", { method: "POST", body: fd }); const d = await r.json();
      if (d.success) { setForm(p => ({ ...p, [target]: d.url })); setToast({ type: "success", msg: "Uploaded!" }); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setUploading(false); }
  };

  const addSkill = () => { const v = skillInput.trim(); if (!v) return; setForm(p => ({ ...p, skills: [...p.skills, v] })); setSkillInput(""); };

  const openAdd = () => { setEditId(null); setForm({ ...blank, order: items.length + 1 }); setSkillInput(""); setShowForm(true); };

  const openEdit = (c: CourseData) => {
    setEditId(c.id);
    setForm({ title: c.title, issuer: c.issuer, category: c.category, completedDate: c.completedDate,
      credentialUrl: c.credentialUrl || "", certificateImage: c.certificateImage || "",
      certificateImage2: (c as any).certificateImage2 || "",
      description: c.description, skills: [...c.skills],
      badgeEmoji: c.badgeEmoji, color: c.color, order: c.order, featured: c.featured });
    setSkillInput(""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.issuer) { setToast({ type: "error", msg: "Title and issuer are required." }); return; }
    setSaving(true);
    try {
      const url = editId ? `/api/course/${editId}` : "/api/course";
      const r = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (d.success) { setToast({ type: "success", msg: editId ? "Updated!" : "Created!" }); setShowForm(false); load(); }
      else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return; setDeleting(id);
    try {
      const r = await fetch(`/api/course/${id}`, { method: "DELETE" }); const d = await r.json();
      if (d.success) { setToast({ type: "success", msg: "Deleted." }); load(); } else throw new Error(d.error);
    } catch (err: any) { setToast({ type: "error", msg: err.message }); }
    finally { setDeleting(null); }
  };

  const toggleFeatured = async (c: CourseData) => {
    try { await fetch(`/api/course/${c.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...c, featured: !c.featured }) }); load(); } catch {}
  };

  const handleSeed = async () => {
    setSeeding(true);
    try { const r = await fetch("/api/course/seed", { method: "POST" }); const d = await r.json(); if (d.success) { setToast({ type: "success", msg: d.message }); load(); } else throw new Error(d.error); }
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
          <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>Courses & Certifications</h2>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>Manage your courses and certifications. Featured ones show on homepage.</p>
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
            <Plus size={14} /> Add Course
          </button>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base text-[#18181B]" style={{ fontWeight: 700 }}>{editId ? "Edit Course" : "Add Course"}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title *" value={form.title} onChange={set("title")} placeholder="e.g. Next.js Complete Guide" />
                <Input label="Issuer *" value={form.issuer} onChange={set("issuer")} placeholder="e.g. Udemy" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Completed Date" value={form.completedDate} onChange={set("completedDate")} placeholder="Mar 2025" />
                <div className="space-y-1.5">
                  <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Category</label>
                  <select value={form.category} onChange={e => set("category")(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#2563EB] transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    <option value="web-development">Web Development</option>
                    <option value="database">Database</option>
                    <option value="cloud">Cloud</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <Textarea label="Description" value={form.description} onChange={set("description")} placeholder="What you learned…" rows={3} />

              <Input label="Credential / Certificate URL (optional)" value={form.credentialUrl} onChange={set("credentialUrl")} placeholder="https://..." />

              {/* Badge & colour */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Badge Emoji &amp; Accent Colour</label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((p, i) => (
                    <button key={i} type="button" onClick={() => setForm(prev => ({ ...prev, badgeEmoji: p.emoji, color: p.color }))}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border-2 transition-all
                        ${form.badgeEmoji === p.emoji && form.color === p.color ? "border-[#2563EB] scale-110 shadow-md" : "border-transparent hover:border-gray-300"}`}
                      style={{ background: `${p.color}15` }}>
                      {p.emoji}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input value={form.badgeEmoji} onChange={e => set("badgeEmoji")(e.target.value)} placeholder="Emoji" maxLength={4}
                    className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-center text-sm focus:outline-none focus:border-[#2563EB]" />
                  <input type="color" value={form.color} onChange={e => set("color")(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-1" />
                  <span className="text-xs text-gray-400">or pick custom</span>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Skills Covered</label>
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB]" style={{ fontWeight: 600 }}>
                      {s}
                      <button onClick={() => setForm(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }))}
                        className="text-blue-300 hover:text-red-400"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="e.g. Next.js — press Enter"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2563EB]"
                    style={{ fontFamily: "Poppins, sans-serif" }} />
                  <button onClick={addSkill} className="px-3 py-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs hover:bg-blue-100" style={{ fontWeight: 700 }}>Add</button>
                </div>
              </div>

              {/* Certificate upload */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Certificate Image 1 (optional)</label>
                <input ref={certRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadCert(f, "certificateImage"); e.target.value = ""; }} />
                {form.certificateImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.certificateImage} alt="Certificate 1" className="w-full h-40 object-cover" />
                    <button onClick={() => setForm(p => ({ ...p, certificateImage: "" }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"><X size={12} /></button>
                  </div>
                ) : (
                  <button onClick={() => certRef.current?.click()} disabled={uploading} type="button"
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#2563EB]/50 text-gray-400 hover:text-[#2563EB] flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ fontWeight: 600 }}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : "📄"}
                    {uploading ? "Uploading…" : "Upload Certificate / Completion Letter"}
                  </button>
                )}
              </div>

              {/* Certificate upload 2 */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Certificate Image 2 — Recommendation / Extra Proof (optional)</label>
                <input ref={cert2Ref} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadCert(f, "certificateImage2"); e.target.value = ""; }} />
                {form.certificateImage2 ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.certificateImage2} alt="Certificate 2" className="w-full h-40 object-cover" />
                    <button onClick={() => setForm(p => ({ ...p, certificateImage2: "" }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"><X size={12} /></button>
                  </div>
                ) : (
                  <button onClick={() => cert2Ref.current?.click()} disabled={uploading} type="button"
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#7C3AED]/50 text-gray-400 hover:text-[#7C3AED] flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ fontWeight: 600 }}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : "📄"}
                    {uploading ? "Uploading…" : "Upload Recommendation / Second Doc"}
                  </button>
                )}
                <p className="text-[11px] text-gray-400">Upload recommendation letter, transcript, or any second proof. JPG, PNG — max 10MB.</p>
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
                {saving ? "Saving…" : "Save Course"}
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
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-2xl">📜</div>
          <div className="text-center">
            <p className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>No courses yet</p>
            <p className="text-gray-400 text-xs mt-1" style={{ fontWeight: 400 }}>Click "Seed Defaults" or "Add Course" to get started.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(c => {
            const cfg = categoryConfig[c.category] || categoryConfig.other;
            return (
              <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm hover:border-gray-200 transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                  {c.badgeEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm text-gray-900 truncate" style={{ fontWeight: 700 }}>{c.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: cfg.color, background: cfg.bg, fontWeight: 700 }}>{cfg.label}</span>
                    {c.certificateImage && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600" style={{ fontWeight: 600 }}>📎 Cert</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5" style={{ fontWeight: 400 }}>{c.issuer} · {c.completedDate}</p>
                </div>
                <button onClick={() => toggleFeatured(c)} className={`flex-shrink-0 ${c.featured ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}>
                  {c.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(c)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#EFF6FF] text-gray-400 hover:text-[#2563EB]"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 disabled:opacity-50">
                    {deleting === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs text-gray-400 text-center" style={{ fontWeight: 500 }}>
          ⭐ {items.filter(c => c.featured).length} of {items.length} courses featured on homepage.
        </p>
      )}
    </div>
  );
}
