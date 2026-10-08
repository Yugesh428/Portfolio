"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ChevronRight, ZoomIn, ExternalLink,
  Trophy, Briefcase, BookOpen, Award, Heart, Calendar, Building2,
} from "lucide-react";
import { useAchievement } from "@/lib/hooks/useAchievement";
import { useParams } from "next/navigation";

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  hackathon:     { label: "Hackathon",     color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Trophy    },
  internship:    { label: "Internship",    color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: Briefcase  },
  certification: { label: "Certification", color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: BookOpen   },
  award:         { label: "Award",         color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: Award      },
  volunteer:     { label: "Volunteer",     color: "#EC4899", bg: "#FDF2F8", border: "#EC489920", icon: Heart      },
};

export default function AchievementDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { achievement: a, loading, error } = useAchievement(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>Loading achievement…</p>
        </div>
      </div>
    );
  }

  if (error || !a) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
        <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>Achievement not found.</p>
        <Link href="/#achievements" className="text-[#2563EB] text-sm hover:underline flex items-center gap-1" style={{ fontWeight: 600 }}>
          <ArrowLeft size={14} /> Back
        </Link>
      </div>
    );
  }

  const cfg = typeConfig[a.type] || typeConfig.award;
  const Icon = cfg.icon;
  const hasCert = Boolean(a.certificateImage);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* ── Full-bleed hero banner ── */}
      <div className="w-full" style={{ background: `linear-gradient(135deg, ${cfg.bg} 0%, #fff 70%)` }}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-28 pb-14">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8" style={{ fontWeight: 500 }}>
            <Link href="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="hover:text-[#2563EB] transition-colors cursor-pointer"
              onClick={() => window.history.back()}>Achievements</span>
            <ChevronRight size={12} />
            <span className="text-gray-600 truncate max-w-[200px]" style={{ fontWeight: 600 }}>{a.title}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Type badge with emoji */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}
              >
                <Icon size={13} /> {cfg.label}
              </span>
            </div>

            {/* Emoji + Title */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                {a.badgeEmoji}
              </div>
              <h1 className="text-4xl sm:text-5xl text-gray-900 leading-tight" style={{ fontWeight: 800 }}>
                {a.title}
              </h1>
            </div>

            {/* Org + date */}
            <p className="text-xl mb-5" style={{ color: cfg.color, fontWeight: 700 }}>{a.organization}</p>

            <div className="flex flex-wrap items-center gap-5">
              <span className="flex items-center gap-1.5 text-sm text-gray-500" style={{ fontWeight: 500 }}>
                <Calendar size={14} className="text-gray-400" /> {a.date}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-500" style={{ fontWeight: 500 }}>
                <Building2 size={14} className="text-gray-400" /> {a.organization}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 py-16">

        {/* ── WITH CERTIFICATE: big focus on cert ── */}
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
                Certificate / Proof
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">

              {/* LEFT — big certificate */}
              <motion.a
                href={a.certificateImage!}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="group relative block rounded-3xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/60"
              >
                <img
                  src={a.certificateImage!}
                  alt={`${a.title} certificate`}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 text-sm shadow-lg"
                    style={{ fontWeight: 700 }}>
                    <ZoomIn size={16} /> View Full Size
                  </div>
                </div>
              </motion.a>

              {/* RIGHT — description + details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-base text-gray-900 mb-2" style={{ fontWeight: 700 }}>About this Achievement</h2>
                  <div className="w-8 h-[2px] rounded-full mb-4" style={{ background: cfg.color }} />
                  <p className="text-gray-600 leading-relaxed text-sm" style={{ fontWeight: 400 }}>
                    {a.description}
                  </p>
                </div>

                <div className="bg-[#F8FAFF] border border-gray-100 rounded-2xl p-5">
                  <h3 className="text-xs text-gray-700 mb-4 uppercase tracking-wider" style={{ fontWeight: 700 }}>Details</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Type",         value: cfg.label },
                      { label: "Date",         value: a.date },
                      { label: "Organization", value: a.organization },
                    ].map(d => (
                      <div key={d.label} className="flex items-start justify-between gap-2">
                        <span className="text-[11px] text-gray-400 flex-shrink-0" style={{ fontWeight: 600 }}>{d.label}</span>
                        <span className="text-[11px] text-gray-700 text-right" style={{ fontWeight: 600 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={a.certificateImage!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm transition-all"
                  style={{
                    color: cfg.color,
                    borderColor: cfg.border,
                    background: cfg.bg,
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={13} /> Open Certificate
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── NO CERTIFICATE — simple layout ── */}
        {!hasCert && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid lg:grid-cols-3 gap-10 mb-16"
          >
            <div className="lg:col-span-2">
              <h2 className="text-base text-gray-900 mb-3" style={{ fontWeight: 700 }}>About this Achievement</h2>
              <div className="w-8 h-[2px] rounded-full mb-4" style={{ background: cfg.color }} />
              <p className="text-gray-600 leading-relaxed" style={{ fontWeight: 400 }}>{a.description}</p>
            </div>

            <div className="bg-[#F8FAFF] border border-gray-100 rounded-2xl p-5 h-fit">
              <h3 className="text-xs text-gray-700 mb-4 uppercase tracking-wider" style={{ fontWeight: 700 }}>Details</h3>
              <div className="space-y-3">
                {[
                  { label: "Type",         value: cfg.label },
                  { label: "Date",         value: a.date },
                  { label: "Organization", value: a.organization },
                ].map(d => (
                  <div key={d.label} className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-gray-400 flex-shrink-0" style={{ fontWeight: 600 }}>{d.label}</span>
                    <span className="text-[11px] text-gray-700 text-right" style={{ fontWeight: 600 }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── BOTTOM NAV ── */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-100">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all text-sm"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={14} /> Go Back
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30"
            style={{ fontWeight: 600 }}
          >
            Back to Portfolio <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
