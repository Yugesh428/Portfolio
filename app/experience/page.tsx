"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, MapPin, Calendar, ArrowLeft,
  Briefcase, GraduationCap, Code2, Heart, Filter,
} from "lucide-react";
import { useExperiences } from "@/lib/hooks/useExperience";

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  work:       { label: "Work",       color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Briefcase },
  internship: { label: "Internship", color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: GraduationCap },
  freelance:  { label: "Freelance",  color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: Code2 },
  volunteer:  { label: "Volunteer",  color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Heart },
};

export default function ExperiencePage() {
  const { experiences, loading, error } = useExperiences(false);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? experiences : experiences.filter(e => e.type === filter);
  const types = ["all", ...Array.from(new Set(experiences.map(e => e.type)))];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Hero banner */}
      <div className="w-full bg-gradient-to-br from-[#EFF6FF] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-16">
          <Link
            href="/#experience"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2563EB] transition-colors mb-6"
            style={{ fontWeight: 500 }}
          >
            <ArrowLeft size={15} /> Back to Portfolio
          </Link>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
            Career Journey
          </p>
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontWeight: 800 }}>
            All <span className="text-[#2563EB]">Experience</span>
          </h1>
          <div className="w-14 h-[3px] rounded-full bg-[#2563EB] mb-4" />
          <p className="text-gray-500 max-w-xl" style={{ fontWeight: 400 }}>
            A complete timeline of my professional journey — internships, freelance work, and everything in between.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            {[
              { value: experiences.length, label: "Total" },
              { value: experiences.filter(e => e.isCurrent).length, label: "Active" },
              { value: experiences.filter(e => e.type === "internship").length, label: "Internships" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl text-[#2563EB]" style={{ fontWeight: 800 }}>{s.value}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5" style={{ fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-xs capitalize transition-all ${
                filter === t
                  ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/30"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={{ fontWeight: 600 }}
            >
              {t === "all" ? "All" : typeConfig[t]?.label || t}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 animate-pulse h-48" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm" style={{ fontWeight: 500 }}>Failed to load experiences.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>No experiences found for this filter.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {filtered.map((exp, i) => {
                  const cfg = typeConfig[exp.type] || typeConfig.work;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      whileHover={{ y: -3 }}
                    >
                      <Link
                        href={`/experience/${exp.id}`}
                        className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563EB]/20 transition-all group h-full"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                            >
                              <Icon size={20} style={{ color: cfg.color }} />
                            </div>
                            <div>
                              <h2 className="text-gray-900 text-sm leading-tight" style={{ fontWeight: 700 }}>
                                {exp.title}
                              </h2>
                              <p className="text-xs mt-0.5" style={{ color: cfg.color, fontWeight: 600 }}>
                                {exp.company}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span
                              className="text-[9px] px-2.5 py-0.5 rounded-full"
                              style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <span className="flex items-center gap-1 text-[11px] text-gray-400" style={{ fontWeight: 500 }}>
                            <Calendar size={11} /> {exp.startDate} — {exp.endDate}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-gray-400" style={{ fontWeight: 500 }}>
                            <MapPin size={11} /> {exp.location}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2" style={{ fontWeight: 400 }}>
                          {exp.description}
                        </p>

                        {/* Points preview */}
                        {exp.points.length > 0 && (
                          <ul className="space-y-1 mb-4">
                            {exp.points.slice(0, 2).map((p, pi) => (
                              <li key={pi} className="flex items-start gap-2 text-[11px] text-gray-500" style={{ fontWeight: 400 }}>
                                <span style={{ color: cfg.color }} className="mt-0.5 flex-shrink-0">▸</span>
                                {p}
                              </li>
                            ))}
                            {exp.points.length > 2 && (
                              <li className="text-[11px] text-gray-400" style={{ fontWeight: 500 }}>
                                +{exp.points.length - 2} more…
                              </li>
                            )}
                          </ul>
                        )}

                        {/* Tech */}
                        {exp.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.techStack.slice(0, 5).map(t => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}>
                                {t}
                              </span>
                            ))}
                            {exp.techStack.length > 5 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400" style={{ fontWeight: 600 }}>
                                +{exp.techStack.length - 5}
                              </span>
                            )}
                          </div>
                        )}

                        {/* View details arrow */}
                        <div className="flex items-center gap-1 text-xs text-[#2563EB] mt-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 600 }}>
                          View full details <ArrowRight size={12} />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
