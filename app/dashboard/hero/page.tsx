"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Save, RefreshCw, Eye, ExternalLink, CheckCircle2,
  AlertCircle, User, Link2, BarChart2, Info, Loader2,
  Upload, ImageIcon, X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroForm {
  greeting: string;
  title: string;
  subtitle: string;
  description: string;
  profileImage: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  emailUrl: string;
  statusBadge: string;
  yearsExperience: number;
  projectsCompleted: number;
  certificationsCount: number;
  availableForWork: boolean;
}

const defaultForm: HeroForm = {
  greeting: "Hello I'M A",
  title: "Full Stack Developer",
  subtitle: "Yugesh Bastola",
  description: "Full Stack Developer from Nepal building scalable SaaS web applications using Next.js, Node.js, React, and SQL databases.",
  profileImage: "",
  resumeUrl: "/yugesh_resume.pdf",
  githubUrl: "https://github.com/Yugesh428",
  linkedinUrl: "https://www.linkedin.com/in/yugesh-bastola-315638317/",
  emailUrl: "mailto:bastolayugesh2@gmail.com",
  statusBadge: "Full Stack Developer · Nepal",
  yearsExperience: 2,
  projectsCompleted: 6,
  certificationsCount: 7,
  availableForWork: true,
};

/* ── Field wrapper ── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-gray-700" style={{ fontWeight: 600 }}>{label}</label>
      {hint && <p className="text-[11px] text-gray-400" style={{ fontWeight: 400 }}>{hint}</p>}
      {children}
    </div>
  );
}

/* ── Input ── */
function Input({ value, onChange, placeholder, type = "text" }: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
    />
  );
}

/* ── Textarea ── */
function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all resize-none"
      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
    />
  );
}

/* ── Section card ── */
function SectionCard({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
          <Icon size={14} className="text-[#2563EB]" />
        </div>
        <h3 className="text-sm text-[#18181B]" style={{ fontWeight: 700 }}>{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

export default function HeroEditorPage() {
  const [form, setForm]           = useState<HeroForm>(defaultForm);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Load ── */
  useEffect(() => {
    fetch("/api/hero")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          const { id, createdAt, updatedAt, ...rest } = d.data;
          setForm({ ...defaultForm, ...rest });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Auto-dismiss toast ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── Upload image to Cloudinary ── */
  const handleImageUpload = async (file: File) => {
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
      fd.append("folder", "portfolio/hero");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (data.success) {
        setForm(p => ({ ...p, profileImage: data.url }));
        setToast({ type: "success", msg: "Photo uploaded! Click Save to apply." });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      setToast({ type: "error", msg: err.message || "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  /* ── Save ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", msg: "Hero section saved! Changes are live on homepage." });
        setLastSaved(new Date());
      } else {
        throw new Error(data.error || "Save failed");
      }
    } catch (err: any) {
      setToast({ type: "error", msg: err.message || "Failed to save changes." });
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof HeroForm) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>Loading hero data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm ${
            toast.type === "success"
              ? "bg-white border-green-200 text-green-700"
              : "bg-white border-red-200 text-red-700"
          }`}
          style={{ fontWeight: 600 }}
        >
          {toast.type === "success"
            ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
            : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>Hero Section Editor</h2>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>
            Edit your homepage hero. Changes go live after saving.
            {lastSaved && (
              <span className="ml-2 text-green-500" style={{ fontWeight: 500 }}>
                Last saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Eye size={14} /> Preview <ExternalLink size={11} />
          </Link>
          <button
            onClick={() => { setForm(defaultForm); setToast({ type: "success", msg: "Reset to defaults." }); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition-colors"
            style={{ fontWeight: 600 }}
          >
            <RefreshCw size={14} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 disabled:opacity-60"
            style={{ fontWeight: 700 }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-gradient-to-r from-[#EFF6FF] to-white border border-[#2563EB]/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
          <Info size={15} className="text-[#2563EB]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#1E40AF]" style={{ fontWeight: 600 }}>Live Data</p>
          <p className="text-xs text-blue-400 mt-0.5 truncate" style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 600 }}>{form.greeting}</span>{" "}
            <span style={{ fontWeight: 800 }}>{form.title}</span>{" "}
            <span style={{ fontWeight: 800 }}>{form.subtitle}</span>
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex-shrink-0 flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
          style={{ fontWeight: 700 }}
        >
          Open homepage <ExternalLink size={11} />
        </Link>
      </div>

      {/* ── PROFILE IMAGE UPLOAD — big prominent section ── */}
      <SectionCard icon={ImageIcon} title="Profile Photo">
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* Preview circle — matches the reference design */}
          <div className="relative flex-shrink-0">
            <div
              className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#2563EB]/20 shadow-lg shadow-blue-500/10 bg-[#EFF6FF] flex items-center justify-center"
            >
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <User size={36} className="text-[#2563EB]/40" />
                  <span className="text-[10px] text-gray-400" style={{ fontWeight: 500 }}>No photo</span>
                </div>
              )}
            </div>
            {/* Remove button */}
            {form.profileImage && (
              <button
                onClick={() => setForm(p => ({ ...p, profileImage: "" }))}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Upload area */}
          <div className="flex-1 w-full">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
                e.target.value = "";
              }}
            />

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleImageUpload(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`
                w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                ${dragOver
                  ? "border-[#2563EB] bg-[#EFF6FF]"
                  : "border-gray-200 hover:border-[#2563EB]/50 hover:bg-[#EFF6FF]/50"
                }
              `}
            >
              {uploading ? (
                <>
                  <Loader2 size={28} className="text-[#2563EB] animate-spin" />
                  <p className="text-sm text-[#2563EB]" style={{ fontWeight: 600 }}>Uploading…</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
                    <Upload size={22} className="text-[#2563EB]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                      Drop your photo here or <span className="text-[#2563EB]">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1" style={{ fontWeight: 400 }}>
                      JPG, PNG, WebP — max 10MB. Appears on the right side of your hero.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Or paste URL */}
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1.5" style={{ fontWeight: 500 }}>Or paste an image URL:</p>
              <Input
                value={form.profileImage}
                onChange={set("profileImage")}
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Form grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Content */}
        <SectionCard icon={User} title="Content">
          <Field label="Greeting Text" hint="Shown above the main title">
            <Input value={form.greeting} onChange={set("greeting")} placeholder="Hello I'M A" />
          </Field>
          <Field label="Title / Role" hint="First line of the big heading (dark color)">
            <Input value={form.title} onChange={set("title")} placeholder="Full Stack Developer" />
          </Field>
          <Field label="Name (Subtitle)" hint="Second line of the big heading (blue gradient)">
            <Input value={form.subtitle} onChange={set("subtitle")} placeholder="Yugesh Bastola" />
          </Field>
          <Field label="Status Badge" hint="Small pill badge shown above greeting">
            <Input value={form.statusBadge} onChange={set("statusBadge")} placeholder="Full Stack Developer · Nepal" />
          </Field>
          <Field label="Description" hint="Bio paragraph shown below the title">
            <Textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Describe yourself…"
              rows={4}
            />
          </Field>
        </SectionCard>

        {/* Links + Stats */}
        <div className="space-y-5">
          <SectionCard icon={Link2} title="Links">
            <Field label="Resume URL" hint="PDF link or Google Drive URL">
              <Input value={form.resumeUrl} onChange={set("resumeUrl")} placeholder="/yugesh_resume.pdf" />
            </Field>
            <Field label="GitHub URL">
              <Input value={form.githubUrl} onChange={set("githubUrl")} placeholder="https://github.com/..." />
            </Field>
            <Field label="LinkedIn URL">
              <Input value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/..." />
            </Field>
            <Field label="Email" hint={'Use "mailto:" prefix'}>
              <Input value={form.emailUrl} onChange={set("emailUrl")} placeholder="mailto:you@email.com" />
            </Field>
          </SectionCard>

          <SectionCard icon={BarChart2} title="Stats & Availability">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Projects">
                <Input
                  type="number"
                  value={form.projectsCompleted}
                  onChange={v => setForm(p => ({ ...p, projectsCompleted: parseInt(v) || 0 }))}
                />
              </Field>
              <Field label="Years Exp.">
                <Input
                  type="number"
                  value={form.yearsExperience}
                  onChange={v => setForm(p => ({ ...p, yearsExperience: parseInt(v) || 0 }))}
                />
              </Field>
              <Field label="Certs">
                <Input
                  type="number"
                  value={form.certificationsCount}
                  onChange={v => setForm(p => ({ ...p, certificationsCount: parseInt(v) || 0 }))}
                />
              </Field>
            </div>
            <Field label="Available for Work">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, availableForWork: !p.availableForWork }))}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.availableForWork ? "bg-[#2563EB]" : "bg-gray-200"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.availableForWork ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
                <span className="text-sm" style={{ fontWeight: 500 }}>
                  {form.availableForWork
                    ? <span className="text-green-600" style={{ fontWeight: 600 }}>Showing "Available for work" badge</span>
                    : <span className="text-gray-400">Badge hidden</span>
                  }
                </span>
              </div>
            </Field>
          </SectionCard>
        </div>
      </div>

      {/* ── Live preview ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm text-gray-700 mb-4" style={{ fontWeight: 700 }}>Homepage Preview</h3>
        <div className="bg-[#F3F0FF] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-10 py-10 min-h-[220px]">
            {/* Left — text */}
            <div className="flex-1 max-w-sm">
              <p className="text-base text-gray-600 mb-1" style={{ fontWeight: 400 }}>
                {form.greeting || "Hello I'M A"}
              </p>
              <h1 className="text-3xl leading-tight mb-3" style={{ fontWeight: 800 }}>
                <span className="text-[#18181B]">{form.title || "Full Stack"} </span>
                <span style={{ color: "#2563EB" }}>{form.subtitle || "Developer."}</span>
              </h1>
              <p className="text-gray-500 text-xs leading-relaxed mb-4" style={{ fontWeight: 400 }}>
                {form.description}
              </p>
              <div className="flex gap-2">
                {["GitHub", "LinkedIn", "Email"].map(s => (
                  <div key={s} className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                    <span className="text-white text-[8px]" style={{ fontWeight: 700 }}>{s[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — photo circle */}
            <div className="relative flex-shrink-0 ml-8">
              {/* Outer circle glow */}
              <div className="absolute inset-0 rounded-full bg-[#2563EB]/10 scale-125" />
              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-[#2563EB] border-4 border-white shadow-xl">
                {form.profileImage ? (
                  <img
                    src={form.profileImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <User size={40} className="text-white/60" />
                    <span className="text-white/60 text-[10px]" style={{ fontWeight: 500 }}>Upload photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save footer */}
      <div className="flex justify-end gap-3 pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/25 disabled:opacity-60"
          style={{ fontWeight: 700 }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving…" : "Save & Publish"}
        </button>
      </div>
    </div>
  );
}
