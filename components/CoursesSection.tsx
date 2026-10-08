"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Globe, Database, Cloud, Code2, Palette } from "lucide-react";
import { useCourses } from "@/lib/hooks/useCourse";

const categoryConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  "web-development": { label: "Web Dev",     color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Globe    },
  "database":        { label: "Database",    color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: Database },
  "cloud":           { label: "Cloud",       color: "#0EA5E9", bg: "#F0F9FF", border: "#0EA5E920", icon: Cloud    },
  "programming":     { label: "Programming", color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Code2    },
  "design":          { label: "Design",      color: "#EC4899", bg: "#FDF2F8", border: "#EC489920", icon: Palette  },
  "other":           { label: "Other",       color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: BookOpen },
};

export default function CoursesSection() {
  const { courses, loading } = useCourses(true); // featured only

  return (
    <section id="courses" className="w-full bg-[#F8FAFF]" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-24">

        {/* Header — same pattern */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
              Continuous Learning
            </p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-3" style={{ fontWeight: 800 }}>
              Courses &amp; <span className="text-[#2563EB]">Certifications</span>
            </h2>
            <div className="w-12 h-[3px] rounded-full bg-[#2563EB]" />
          </div>
          <Link href="/course"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2563EB]/30 text-[#2563EB] text-sm hover:bg-[#EFF6FF] transition-all group"
            style={{ fontWeight: 600 }}>
            View All Courses
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 bg-gray-100 rounded" />
                  <div className="h-2.5 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm" style={{ fontWeight: 500 }}>
            No courses to display yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, i) => {
              const cfg = categoryConfig[c.category] || categoryConfig.other;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                >
                  <Link
                    href={`/course/${c.id}`}
                    className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563EB]/20 transition-all group h-full"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                        >
                          {c.badgeEmoji
                            ? <span>{c.badgeEmoji}</span>
                            : <Icon size={18} style={{ color: cfg.color }} />
                          }
                        </div>
                        <div>
                          <h3 className="text-gray-900 text-sm leading-tight" style={{ fontWeight: 700 }}>
                            {c.title}
                          </h3>
                          <p className="text-xs mt-0.5" style={{ color: cfg.color, fontWeight: 600 }}>
                            {c.issuer}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}
                        >
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

                    {/* Skills tags — same as experience tech stack */}
                    {c.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {c.skills.slice(0, 4).map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}>
                            {s}
                          </span>
                        ))}
                        {c.skills.length > 4 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400" style={{ fontWeight: 600 }}>
                            +{c.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Certificate badge */}
                    {c.certificateImage && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <a
                          href={c.certificateImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 hover:opacity-80 transition-opacity"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }}
                          onClick={e => e.stopPropagation()}
                        >
                          📎 View Certificate
                        </a>
                      </div>
                    )}

                    {/* Hover CTA */}
                    <div className="flex items-center gap-1 text-xs text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 600 }}>
                      View details <ArrowRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA — same as ExperienceSection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/course"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2563EB] text-white text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 group"
            style={{ fontWeight: 700 }}
          >
            View All Courses & Certifications
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
