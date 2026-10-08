"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, ExternalLink, Briefcase, GraduationCap, Code2, Heart } from "lucide-react";
import { useExperiences } from "@/lib/hooks/useExperience";

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  work:        { label: "Work",        color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Briefcase },
  internship:  { label: "Internship",  color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: GraduationCap },
  freelance:   { label: "Freelance",   color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: Code2 },
  volunteer:   { label: "Volunteer",   color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Heart },
};

export default function ExperienceSection() {
  const { experiences, loading } = useExperiences(true); // featured only

  return (
    <section id="experience" className="w-full bg-[#F8FAFF]" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-24">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
              Career
            </p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-3" style={{ fontWeight: 800 }}>
              My <span className="text-[#2563EB]">Experience</span>
            </h2>
            <div className="w-12 h-[3px] rounded-full bg-[#2563EB]" />
          </div>
          <Link
            href="/experience"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2563EB]/30 text-[#2563EB] text-sm hover:bg-[#EFF6FF] transition-all group"
            style={{ fontWeight: 600 }}
          >
            View All Experience
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100" />
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
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {experiences.slice(0, 4).map((exp, i) => {
              const cfg = typeConfig[exp.type] || typeConfig.work;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                >
                  <Link
                    href={`/experience/${exp.id}`}
                    className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563EB]/20 transition-all group h-full"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                        >
                          <Icon size={18} style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <h3 className="text-gray-900 text-sm leading-tight" style={{ fontWeight: 700 }}>
                            {exp.title}
                          </h3>
                          <p className="text-xs mt-0.5" style={{ color: cfg.color, fontWeight: 600 }}>
                            {exp.company}
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
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-3">
                      <span className="flex items-center gap-1 text-[11px] text-gray-400" style={{ fontWeight: 500 }}>
                        <Calendar size={11} />
                        {exp.startDate} — {exp.endDate}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400" style={{ fontWeight: 500 }}>
                        <MapPin size={11} />
                        {exp.location}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2" style={{ fontWeight: 400 }}>
                      {exp.description}
                    </p>

                    {/* Tech stack */}
                    {exp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {exp.techStack.slice(0, 4).map(t => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}
                          >
                            {t}
                          </span>
                        ))}
                        {exp.techStack.length > 4 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400" style={{ fontWeight: 600 }}>
                            +{exp.techStack.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View details */}
                    <div className="flex items-center gap-1 text-xs text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 600 }}>
                      View details <ArrowRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/experience"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2563EB] text-white text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 group"
            style={{ fontWeight: 700 }}
          >
            View All Experience
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
