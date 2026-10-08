"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Calendar, ExternalLink,
  Briefcase, GraduationCap, Code2, Heart,
  CheckCircle2, ChevronRight, ZoomIn,
} from "lucide-react";
import { useExperience } from "@/lib/hooks/useExperience";
import { useParams } from "next/navigation";

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  work:       { label: "Work",       color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Briefcase },
  internship: { label: "Internship", color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: GraduationCap },
  freelance:  { label: "Freelance",  color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: Code2 },
  volunteer:  { label: "Volunteer",  color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Heart },
};

export default function ExperienceDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { experience: exp, loading, error } = useExperience(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>Loading experience…</p>
        </div>
      </div>
    );
  }

  if (error || !exp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
        <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>Experience not found.</p>
        <Link href="/experience" className="text-[#2563EB] text-sm hover:underline flex items-center gap-1" style={{ fontWeight: 600 }}>
          <ArrowLeft size={14} /> Back to all experience
        </Link>
      </div>
    );
  }

  const cfg = typeConfig[exp.type] || typeConfig.work;
  const Icon = cfg.icon;
  const hasCert = Boolean(exp.certificateImage);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* ── Full-bleed hero banner ── */}
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${cfg.bg} 0%, #fff 70%)` }}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-28 pb-14">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8" style={{ fontWeight: 500 }}>
            <Link href="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/experience" className="hover:text-[#2563EB] transition-colors">Experience</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 truncate max-w-[200px]" style={{ fontWeight: 600 }}>{exp.title}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Type badge */}
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full mb-5"
              style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}
            >
              <Icon size={13} /> {cfg.label}
            </span>

            <h1 className="text-4xl sm:text-5xl text-gray-900 mb-3 leading-tight" style={{ fontWeight: 800 }}>
              {exp.title}
            </h1>

            <div className="flex items-center gap-2 mb-5">
              <p className="text-xl" style={{ color: cfg.color, fontWeight: 700 }}>{exp.company}</p>
              {exp.companyUrl && (
                <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#2563EB] transition-colors">
                  <ExternalLink size={15} />
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <span className="flex items-center gap-1.5 text-sm text-gray-500" style={{ fontWeight: 500 }}>
                <Calendar size={14} className="text-gray-400" />
                {exp.startDate} — {exp.endDate}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500" style={{ fontWeight: 500 }}>
                <MapPin size={14} className="text-gray-400" />
                {exp.location}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT — full bleed container ── */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 py-16">

        {/* ── CERTIFICATE HERO (full width, big focus) ── */}
        {hasCert && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[3px] rounded-full" style={{ background: cfg.color }} />
              <h2 className="text-sm uppercase tracking-widest text-gray-400" style={{ fontWeight: 700 }}>
                Certificate of Completion
              </h2>
            </div>

            {/* Certificate + info side by side */}
            <div className="grid lg:grid-cols-2 gap-10 items-start">

              {/* LEFT — certificate image (big) */}
              <motion.a
                href={exp.certificateImage!}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="group relative block rounded-3xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/60"
              >
                <img
                  src={exp.certificateImage!}
                  alt={`${exp.title} certificate`}
                  className="w-full object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 text-sm shadow-lg"
                    style={{ fontWeight: 700 }}>
                    <ZoomIn size={16} /> View Full Size
                  </div>
                </div>
              </motion.a>

              {/* RIGHT — description + details + tech */}
              <div className="space-y-8">

                {/* Overview */}
                <div>
                  <h2 className="text-base text-gray-900 mb-2" style={{ fontWeight: 700 }}>Overview</h2>
                  <div className="w-8 h-[2px] rounded-full mb-4" style={{ background: cfg.color }} />
                  <p className="text-gray-600 leading-relaxed text-sm" style={{ fontWeight: 400 }}>
                    {exp.description}
                  </p>
                </div>

                {/* Quick details */}
                <div className="bg-[#F8FAFF] border border-gray-100 rounded-2xl p-5">
                  <h3 className="text-xs text-gray-700 mb-4 uppercase tracking-wider" style={{ fontWeight: 700 }}>Details</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Type",     value: cfg.label },
                      { label: "Period",   value: `${exp.startDate} — ${exp.isCurrent ? "Present" : exp.endDate}` },
                      { label: "Location", value: exp.location },
                      { label: "Status",   value: exp.isCurrent ? "Active" : "Completed" },
                    ].map(d => (
                      <div key={d.label} className="flex items-start justify-between gap-2">
                        <span className="text-[11px] text-gray-400 flex-shrink-0" style={{ fontWeight: 600 }}>{d.label}</span>
                        <span className="text-[11px] text-gray-700 text-right" style={{ fontWeight: 600 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech stack */}
                {exp.techStack.length > 0 && (
                  <div>
                    <h3 className="text-xs text-gray-700 mb-3 uppercase tracking-wider" style={{ fontWeight: 700 }}>Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map(t => (
                        <span key={t} className="text-[11px] px-2.5 py-1 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company link */}
                {exp.companyUrl && (
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                    style={{ fontWeight: 600 }}>
                    Visit Company <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── NO CERTIFICATE — normal layout ── */}
        {!hasCert && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid lg:grid-cols-3 gap-10 mb-16"
          >
            {/* Left: overview + points */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-base text-gray-900 mb-3" style={{ fontWeight: 700 }}>Overview</h2>
                <div className="w-8 h-[2px] rounded-full mb-4" style={{ background: cfg.color }} />
                <p className="text-gray-600 leading-relaxed" style={{ fontWeight: 400 }}>{exp.description}</p>
              </div>
            </div>

            {/* Right: details + tech */}
            <div className="space-y-5">
              <div className="bg-[#F8FAFF] border border-gray-100 rounded-2xl p-5">
                <h3 className="text-xs text-gray-700 mb-4 uppercase tracking-wider" style={{ fontWeight: 700 }}>Details</h3>
                <div className="space-y-3">
                  {[
                    { label: "Type",     value: cfg.label },
                    { label: "Period",   value: `${exp.startDate} — ${exp.isCurrent ? "Present" : exp.endDate}` },
                    { label: "Location", value: exp.location },
                    { label: "Status",   value: exp.isCurrent ? "Active" : "Completed" },
                  ].map(d => (
                    <div key={d.label} className="flex items-start justify-between gap-2">
                      <span className="text-[11px] text-gray-400 flex-shrink-0" style={{ fontWeight: 600 }}>{d.label}</span>
                      <span className="text-[11px] text-gray-700 text-right" style={{ fontWeight: 600 }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {exp.techStack.length > 0 && (
                <div className="bg-[#F8FAFF] border border-gray-100 rounded-2xl p-5">
                  <h3 className="text-xs text-gray-700 mb-4 uppercase tracking-wider" style={{ fontWeight: 700 }}>Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map(t => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {exp.companyUrl && (
                <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                  style={{ fontWeight: 600 }}>
                  Visit Company <ExternalLink size={13} />
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* ── KEY RESPONSIBILITIES — full width ── */}
        {exp.points.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-base text-gray-900 mb-3" style={{ fontWeight: 700 }}>Key Responsibilities</h2>
            <div className="w-8 h-[2px] rounded-full mb-6" style={{ background: cfg.color }} />
            <div className="grid sm:grid-cols-2 gap-3">
              {exp.points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.4 }}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-[#F8FAFF]"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}>
                    <CheckCircle2 size={12} style={{ color: cfg.color }} />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed" style={{ fontWeight: 400 }}>{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── BOTTOM NAV ── */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-100">
          <Link href="/experience"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all text-sm"
            style={{ fontWeight: 600 }}>
            <ArrowLeft size={14} /> All Experience
          </Link>
          <Link href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30"
            style={{ fontWeight: 600 }}>
            Back to Portfolio <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
