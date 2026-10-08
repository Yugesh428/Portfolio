"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Plus, Pencil, Trash2, Save, X, Loader2,
  CheckCircle2, AlertCircle, Briefcase, GraduationCap,
  Code2, Heart, Eye, Star, StarOff,
} from "lucide-react";
import Link from "next/link";
import type { ExperienceData } from "@/lib/hooks/useExperience";

type ExperienceType = "work" | "internship" | "freelance" | "volunteer";

/* ── type colours ── */
const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  work:       { label: "Work",       color: "#2563EB", bg: "#EFF6FF" },
  internship: { label: "Internship", color: "#7C3AED", bg: "#F5F3FF" },
  freelance:  { label: "Freelance",  color: "#16A34A", bg: "#F0FDF4" },
  volunteer:  { label: "Volunteer",  color: "#F59E0B", bg: "#FFFBEB" },
};

type ExperienceForm = {
  title: string; company: string; location: string; type: ExperienceType;
  startDate: string; endDate: string; isCurrent: boolean; description: string;
  points: string[]; techStack: string[]; companyLogo: string;
  companyUrl: string; certificateImage: string; order: number; featured: boolean;
};

/* ── blank form ── */
const blank: ExperienceForm = {
  title: "", company: "", location: "Kathmandu, Nepal", type: "work",
  startDate: "", endDate: "Present", isCurrent: false, description: "",
  points: [], techStack: [], companyLogo: "", companyUrl: "",
  certificateImage: "", order: 0, featured: false,
};

/* ── tiny helpers ── */
function Input({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all resize-none"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
      />
    </div>
  );
}

/* ── main component ── */
export default function ExperienceDashboardPage() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState<number | null>(null);
  const [toast, setToast]             = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showForm, setShowForm]       = useState(false);
  const [editId, setEditId]           = useState<number | null>(null);
  const [form, setForm] = useState<ExperienceForm>({ ...blank });
  const [pointInput, setPointInput]   = useState("");
  const [techInput, setTechInput]     = useState("");
  const [seeding, setSeeding]         = useState(false);
  const [uploading, setUploading]     = useState(false);
  const certInputRef = useRef<HTMLInputElement>(null);

  /* ── load ── */
  const load = async () => {
    try {
      setLoading(true);
      const res  = await fetch("/api/experience");
      const data = await res.json();
      if (data.success) setExperiences(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  /* ── toast auto-dismiss ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (key: keyof typeof form) => (val: any) =>
    setForm(p => ({ ...p, [key]: val }));

  /* ── upload certificate ── */
  const uploadCertificate = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setToast({ type: "error", msg: "Please select an image file." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToast({ type: "error", msg: "Image must be under 10MB." });
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "portfolio/certificates");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (data.success) {
        setForm(p => ({ ...p, certificateImage: data.url }));
        setToast({ type: "success", msg: "Certificate uploaded!" });
      } else throw new Error(data.error || "Upload failed");
    } catch (err: any) {
      setToast({ type: "error", msg: err.message || "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  /* ── open add form ── */
  const openAdd = () => {
    setEditId(null);
    setForm({ ...blank, order: experiences.length + 1 });
    setPointInput("");
    setTechInput("");
    setShowForm(true);
  };

  /* ── open edit form ── */
  const openEdit = (exp: ExperienceData) => {
    setEditId(exp.id);
    setForm({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      type: exp.type,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      description: exp.description,
      points: [...exp.points],
      techStack: [...exp.techStack],
      companyLogo: exp.companyLogo || "",
      companyUrl: exp.companyUrl || "",
      certificateImage: exp.certificateImage || "",
      order: exp.order,
      featured: exp.featured,
    });
    setPointInput("");
    setTechInput("");
    setShowForm(true);
  };

  /* ── save ── */
  const handleSave = async () => {
    if (!form.title || !form.company) {
      setToast({ type: "error", msg: "Title and company are required." });
      return;
    }
    setSaving(true);
    try {
      const url    = editId ? `/api/experience/${editId}` : "/api/experience";
      const method = editId ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", msg: editId ? "Experience updated!" : "Experience added!" });
        setShowForm(false);
        load();
      } else throw new Error(data.error);
    } catch (err: any) {
      setToast({ type: "error", msg: err.message || "Save failed." });
    } finally { setSaving(false); }
  };

  /* ── delete ── */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    setDeleting(id);
    try {
      const res  = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", msg: "Deleted successfully." });
        load();
      } else throw new Error(data.error);
    } catch (err: any) {
      setToast({ type: "error", msg: err.message });
    } finally { setDeleting(null); }
  };

  /* ── toggle featured ── */
  const toggleFeatured = async (exp: ExperienceData) => {
    try {
      await fetch(`/api/experience/${exp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...exp, featured: !exp.featured }),
      });
      load();
    } catch {}
  };

  /* ── seed ── */
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res  = await fetch("/api/experience/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", msg: data.message });
        load();
      } else throw new Error(data.error);
    } catch (err: any) {
      setToast({ type: "error", msg: err.message });
    } finally { setSeeding(false); }
  };

  /* ── add point ── */
  const addPoint = () => {
    const v = pointInput.trim();
    if (!v) return;
    setForm(p => ({ ...p, points: [...p.points, v] }));
    setPointInput("");
  };

  /* ── add tech ── */
  const addTech = () => {
    const v = techInput.trim();
    if (!v) return;
    setForm(p => ({ ...p, techStack: [...p.techStack, v] }));
    setTechInput("");
  };

  return (
    <div className="space-y-6 max-w-5xl" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm
          ${toast.type === "success" ? "bg-white border-green-200 text-green-700" : "bg-white border-red-200 text-red-700"}`}
          style={{ fontWeight: 600 }}>
          {toast.type === "success"
            ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
            : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>Experience Manager</h2>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>
            Add, edit or remove experiences. Featured ones (max 4) show on homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/experience" target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition-colors"
            style={{ fontWeight: 600 }}>
            <Eye size={14} /> Preview
          </Link>
          {experiences.length === 0 && (
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition-colors disabled:opacity-60"
              style={{ fontWeight: 600 }}>
              {seeding ? <Loader2 size={14} className="animate-spin" /> : "⚡"}
              Seed Defaults
            </button>
          )}
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30"
            style={{ fontWeight: 700 }}>
            <Plus size={14} /> Add Experience
          </button>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
            {/* Form header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base text-[#18181B]" style={{ fontWeight: 700 }}>
                {editId ? "Edit Experience" : "Add Experience"}
              </h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title *" value={form.title} onChange={set("title")} placeholder="e.g. Full Stack Developer" />
                <Input label="Company *" value={form.company} onChange={set("company")} placeholder="e.g. Aqore Software" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Location" value={form.location} onChange={set("location")} placeholder="Kathmandu, Nepal" />
                <div className="space-y-1.5">
                  <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Type</label>
                  <select value={form.type} onChange={e => set("type")(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#2563EB] transition-all"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>
                    <option value="work">Work</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" value={form.startDate} onChange={set("startDate")} placeholder="Jan 2024" />
                <Input label="End Date" value={form.endDate} onChange={set("endDate")} placeholder="Present or Dec 2024" />
              </div>
              <Textarea label="Description" value={form.description} onChange={set("description")}
                placeholder="Brief overview of this role…" rows={3} />

              {/* Certificate upload */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Certificate / Proof (optional)</label>
                <input ref={certInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadCertificate(f); e.target.value = ""; }} />
                {form.certificateImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.certificateImage} alt="Certificate" className="w-full h-40 object-cover" />
                    <button onClick={() => setForm(p => ({ ...p, certificateImage: "" }))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => certInputRef.current?.click()} disabled={uploading} type="button"
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#2563EB]/50 text-gray-400 hover:text-[#2563EB] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ fontWeight: 600 }}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : "📄"}
                    {uploading ? "Uploading…" : "Click to Upload Certificate"}
                  </button>
                )}
                <p className="text-[11px] text-gray-400" style={{ fontWeight: 400 }}>JPG, PNG — max 10MB. Shows on detail page.</p>
              </div>

              {/* Points */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Responsibilities</label>
                {form.points.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-[#F8FAFF] rounded-xl text-xs text-gray-600">
                    <span className="text-[#2563EB] flex-shrink-0">▸</span>
                    <span className="flex-1" style={{ fontWeight: 400 }}>{p}</span>
                    <button onClick={() => setForm(prev => ({ ...prev, points: prev.points.filter((_, j) => j !== i) }))}
                      className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={pointInput} onChange={e => setPointInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addPoint())}
                    placeholder="Add a responsibility and press Enter…"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#2563EB] transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }} />
                  <button onClick={addPoint} className="px-3 py-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs hover:bg-blue-100 transition-colors" style={{ fontWeight: 700 }}>
                    Add
                  </button>
                </div>
              </div>

              {/* Tech stack */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>Tech Stack</label>
                <div className="flex flex-wrap gap-1.5">
                  {form.techStack.map((t, i) => (
                    <span key={i} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB]" style={{ fontWeight: 600 }}>
                      {t}
                      <button onClick={() => setForm(prev => ({ ...prev, techStack: prev.techStack.filter((_, j) => j !== i) }))}
                        className="text-blue-300 hover:text-red-400 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={techInput} onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech())}
                    placeholder="e.g. Next.js — press Enter"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-[#2563EB] transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }} />
                  <button onClick={addTech} className="px-3 py-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs hover:bg-blue-100 transition-colors" style={{ fontWeight: 700 }}>
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Company URL" value={form.companyUrl} onChange={set("companyUrl")} placeholder="https://..." />
                <Input label="Sort Order" type="number" value={form.order} onChange={(v: string) => set("order")(parseInt(v) || 0)} placeholder="1" />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <button type="button" onClick={() => set("isCurrent")(!form.isCurrent)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.isCurrent ? "bg-[#2563EB]" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isCurrent ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>Currently Active</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <button type="button" onClick={() => set("featured")(!form.featured)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-[#2563EB]" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>Show on Homepage</span>
                </label>
              </div>
            </div>

            {/* Form footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] text-white text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                style={{ fontWeight: 700 }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Saving…" : "Save Experience"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
            <Briefcase size={24} className="text-[#2563EB]" />
          </div>
          <div className="text-center">
            <p className="text-gray-700 text-sm" style={{ fontWeight: 600 }}>No experiences yet</p>
            <p className="text-gray-400 text-xs mt-1" style={{ fontWeight: 400 }}>
              Click "Seed Defaults" to load sample data or "Add Experience" to start fresh.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map(exp => {
            const cfg = typeConfig[exp.type] || typeConfig.work;
            return (
              <div key={exp.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm hover:border-gray-200 transition-all">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: cfg.bg }}>
                  <Briefcase size={16} style={{ color: cfg.color }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm text-gray-900 truncate" style={{ fontWeight: 700 }}>{exp.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: cfg.color, background: cfg.bg, fontWeight: 700 }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5" style={{ fontWeight: 400 }}>
                    {exp.company} · {exp.startDate} — {exp.endDate}
                  </p>
                </div>

                {/* Featured toggle */}
                <button
                  onClick={() => toggleFeatured(exp)}
                  title={exp.featured ? "Remove from homepage" : "Show on homepage"}
                  className={`flex-shrink-0 transition-colors ${exp.featured ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}
                >
                  {exp.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(exp)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#EFF6FF] text-gray-400 hover:text-[#2563EB] transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(exp.id)} disabled={deleting === exp.id}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                    {deleting === exp.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Featured count info */}
      {experiences.length > 0 && (
        <p className="text-xs text-gray-400 text-center" style={{ fontWeight: 500 }}>
          ⭐ {experiences.filter(e => e.featured).length} of {experiences.length} experiences featured on homepage.
          Star icon toggles homepage visibility.
        </p>
      )}
    </div>
  );
}
