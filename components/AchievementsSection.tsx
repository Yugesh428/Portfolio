"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Briefcase, BookOpen, Award, Heart } from "lucide-react";
import { useAchievements } from "@/lib/hooks/useAchievement";

const typeConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  hackathon:     { label: "Hackathon",     color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Trophy   },
  internship:    { label: "Internship",    color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: Briefcase },
  certification: { label: "Certification", color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: BookOpen  },
  award:         { label: "Award",         color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: Award    },
  volunteer:     { label: "Volunteer",     color: "#EC4899", bg: "#FDF2F8", border: "#EC489920", icon: Heart    },
};

export default function AchievementsSection() {
  const { achievements, loading } = useAchievements(true); // featured only

  return (
    <section id="achievements" className="w-full bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-24">

        {/* Header — same pattern as ExperienceSection */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
              Proof of Work
            </p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-3" style={{ fontWeight: 800 }}>
              Achievements &amp; <span className="text-[#2563EB]">Credentials</span>
            </h2>
            <div className="w-12 h-[3px] rounded-full bg-[#2563EB]" />
          </div>
          <Link href="/achievement"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#F59E0B]/30 text-[#F59E0B] text-sm hover:bg-[#FFFBEB] transition-all group"
            style={{ fontWeight: 600 }}>
            View All Achievements
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards grid — identical structure to experience cards */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#F8FAFF] border border-gray-100 rounded-2xl p-6 animate-pulse">
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
        ) : achievements.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm" style={{ fontWeight: 500 }}>
            No achievements to display yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {achievements.map((a, i) => {
              const cfg = typeConfig[a.type] || typeConfig.award;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                >
                  {/* Card — same style as experience cards but on bg-white section → use bg-[#F8FAFF] */}
                  <Link href={`/achievement/${a.id}`} className="block bg-[#F8FAFF] border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563EB]/20 transition-all group h-full">

                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {/* Icon box — same size/style as experience */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                        >
                          {/* Use emoji if available, else icon */}
                          {a.badgeEmoji
                            ? <span>{a.badgeEmoji}</span>
                            : <Icon size={18} style={{ color: cfg.color }} />
                          }
                        </div>
                        <div>
                          <h3 className="text-gray-900 text-sm leading-tight" style={{ fontWeight: 700 }}>
                            {a.title}
                          </h3>
                          <p className="text-xs mt-0.5" style={{ color: cfg.color, fontWeight: 600 }}>
                            {a.organization}
                          </p>
                        </div>
                      </div>
                      {/* Type + date badges */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}
                        >
                          {cfg.label}
                        </span>
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100"
                          style={{ fontWeight: 600 }}
                        >
                          {a.date}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2" style={{ fontWeight: 400 }}>
                      {a.description}
                    </p>

                    {/* Certificate pill — same style as tech tags in experience */}
                    {a.certificateImage && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <a
                          href={a.certificateImage}
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

                    {/* Hover CTA — same as experience "View details" */}
                    <div className="flex items-center gap-1 text-xs text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 600 }}>
                      {a.certificateImage ? "View certificate" : "See details"} <ArrowRight size={12} />
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
          <Link href="/achievement"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F59E0B] text-white text-sm hover:bg-amber-500 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-105 group"
            style={{ fontWeight: 700 }}>
            View All Achievements
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
