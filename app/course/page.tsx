"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Filter, Globe, Database, Cloud, Code2, Palette, BookOpen } from "lucide-react";
import { useCourses } from "@/lib/hooks/useCourse";

const categoryConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  "web-development": { label: "Web Dev",     color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Globe    },
  "database":        { label: "Database",    color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: Database },
  "cloud":           { label: "Cloud",       color: "#0EA5E9", bg: "#F0F9FF", border: "#0EA5E920", icon: Cloud    },
  "programming":     { label: "Programming", color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Code2    },
  "design":          { label: "Design",      color: "#EC4899", bg: "#FDF2F8", border: "#EC489920", icon: Palette  },
  "other":           { label: "Other",       color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: BookOpen },
};

export default function CoursePage() {
  const { courses, loading, error } = useCourses(false);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? courses : courses.filter(c => c.category === filter);
  const categories = ["all", ...Array.from(new Set(courses.map(c => c.category)))];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Hero banner */}
      <div className="w-full bg-gradient-to-br from-[#EFF6FF] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-16">
          <Link href="/#courses"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2563EB] transition-colors mb-6"
            style={{ fontWeight: 500 }}>
            <ArrowLeft size={15} /> Back to Portfolio
          </Link>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
            Continuous Learning
          </p>
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontWeight: 800 }}>
            Courses &amp; <span className="text-[#2563EB]">Certifications</span>
          </h1>
          <div className="w-14 h-[3px] rounded-full bg-[#2563EB] mb-4" />
          <p className="text-gray-500 max-w-xl" style={{ fontWeight: 400 }}>
            Every course and certification I've completed — from web development to databases and beyond.
          </p>

          {/* Stats */}
          {!loading && (
            <div className="flex gap-8 mt-8">
              {[
                { value: courses.length,                                                           label: "Total"     },
                { value: courses.filter(c => c.category === "web-development").length,             label: "Web Dev"   },
                { value: courses.filter(c => c.certificateImage).length,                           label: "Certified" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl text-[#2563EB]" style={{ fontWeight: 800 }}>{s.value}</p>
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
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                filter === cat ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/30" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={{ fontWeight: 600 }}>
              {cat === "all" ? "All" : categoryConfig[cat]?.label || cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 animate-pulse h-44" />
            ))}
          </div>
        )}

        {error && <div className="text-center py-16"><p className="text-red-500 text-sm" style={{ fontWeight: 500 }}>Failed to load.</p></div>}

        {/* Grid */}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>No courses found for this filter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((c, i) => {
                const cfg = categoryConfig[c.category] || categoryConfig.other;
                const Icon = cfg.icon;
                return (
                  <motion.div key={c.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }} whileHover={{ y: -3 }}>
                    <Link href={`/course/${c.id}`}
                      className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563EB]/20 transition-all group h-full">

                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                            {c.badgeEmoji || <Icon size={20} style={{ color: cfg.color }} />}
                          </div>
                          <div>
                            <h2 className="text-gray-900 text-sm leading-tight" style={{ fontWeight: 700 }}>{c.title}</h2>
                            <p className="text-xs mt-0.5" style={{ color: cfg.color, fontWeight: 600 }}>{c.issuer}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-[9px] px-2.5 py-0.5 rounded-full"
                            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}>
                            {cfg.label}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100" style={{ fontWeight: 600 }}>
                            {c.completedDate}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2" style={{ fontWeight: 400 }}>
                        {c.description}
                      </p>

                      {/* Skills */}
                      {c.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {c.skills.slice(0, 4).map(s => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full"
                              style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}>{s}</span>
                          ))}
                          {c.skills.length > 4 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400" style={{ fontWeight: 600 }}>+{c.skills.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Certificate badge */}
                      {c.certificateImage && (
                        <div className="flex gap-1.5 mb-4">
                          <a href={c.certificateImage} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 hover:opacity-80"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }}
                            onClick={e => e.stopPropagation()}>
                            📎 View Certificate
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs text-[#2563EB] mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 600 }}>
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
