"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Filter, Trophy, Briefcase, BookOpen, Award, Heart } from "lucide-react";
import { useAchievements } from "@/lib/hooks/useAchievement";

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  hackathon:     { label: "Hackathon",     color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Trophy    },
  internship:    { label: "Internship",    color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: Briefcase  },
  certification: { label: "Certification", color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: BookOpen   },
  award:         { label: "Award",         color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: Award      },
  volunteer:     { label: "Volunteer",     color: "#EC4899", bg: "#FDF2F8", border: "#EC489920", icon: Heart      },
};

export default function AchievementPage() {
  const { achievements, loading, error } = useAchievements(false);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? achievements : achievements.filter(a => a.type === filter);
  const types = ["all", ...Array.from(new Set(achievements.map(a => a.type)))];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Hero banner */}
      <div className="w-full bg-gradient-to-br from-[#FFFBEB] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-16">
          <Link href="/#achievements"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#F59E0B] transition-colors mb-6"
            style={{ fontWeight: 500 }}>
            <ArrowLeft size={15} /> Back to Portfolio
          </Link>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#F59E0B] mb-2" style={{ fontWeight: 600 }}>
            Proof of Work
          </p>
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontWeight: 800 }}>
            All <span className="text-[#F59E0B]">Achievements</span>
          </h1>
          <div className="w-14 h-[3px] rounded-full bg-[#F59E0B] mb-4" />
          <p className="text-gray-500 max-w-xl" style={{ fontWeight: 400 }}>
            Hackathons competed, internships completed, certifications earned and recognitions received.
          </p>

          {/* Stats */}
          {!loading && (
            <div className="flex gap-8 mt-8">
              {[
                { value: achievements.length,                                              label: "Total"          },
                { value: achievements.filter(a => a.type === "hackathon").length,          label: "Hackathons"     },
                { value: achievements.filter(a => a.type === "certification").length,      label: "Certifications" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl text-[#F59E0B]" style={{ fontWeight: 800 }}>{s.value}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5" style={{ fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-xs capitalize transition-all ${
                filter === t ? "bg-[#F59E0B] text-white shadow-sm shadow-amber-500/30" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={{ fontWeight: 600 }}>
              {t === "all" ? "All" : typeConfig[t]?.label || t}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 animate-pulse h-44" />
            ))}
          </div>
        )}

        {error && <div className="text-center py-16"><p className="text-red-500 text-sm" style={{ fontWeight: 500 }}>Failed to load.</p></div>}

        {/* Grid */}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>No achievements found for this filter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((a, i) => {
                const cfg = typeConfig[a.type] || typeConfig.award;
                const Icon = cfg.icon;
                return (
                  <motion.div key={a.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }} whileHover={{ y: -3 }}>
                    <Link href={`/achievement/${a.id}`}
                      className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-amber-500/5 hover:border-[#F59E0B]/20 transition-all group h-full">

                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                            {a.badgeEmoji || <Icon size={20} style={{ color: cfg.color }} />}
                          </div>
                          <div>
                            <h2 className="text-gray-900 text-sm leading-tight" style={{ fontWeight: 700 }}>{a.title}</h2>
                            <p className="text-xs mt-0.5" style={{ color: cfg.color, fontWeight: 600 }}>{a.organization}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-[9px] px-2.5 py-0.5 rounded-full"
                            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}>
                            {cfg.label}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100" style={{ fontWeight: 600 }}>
                            {a.date}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3" style={{ fontWeight: 400 }}>
                        {a.description}
                      </p>

                      {/* Certificate badge */}
                      {a.certificateImage && (
                        <div className="flex gap-1.5 mb-4">
                          <a href={a.certificateImage} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 hover:opacity-80"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }}
                            onClick={e => e.stopPropagation()}>
                            📎 View Certificate
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs text-[#F59E0B] mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 600 }}>
                        View details <ArrowRight size={12} />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
