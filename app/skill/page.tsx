"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, Code, Database, Server, Cloud, Palette, Wrench } from "lucide-react";
import { useSkills, SkillCategory } from "@/lib/hooks/useSkill";
import Image from "next/image";

const categoryConfig: Record<SkillCategory | "all", { label: string; color: string; bg: string; border: string; icon: any }> = {
  all:      { label: "All",      color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Wrench   },
  frontend: { label: "Frontend", color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Code     },
  backend:  { label: "Backend",  color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: Server   },
  database: { label: "Database", color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: Database },
  devops:   { label: "DevOps",   color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Cloud    },
  design:   { label: "Design",   color: "#EC4899", bg: "#FDF2F8", border: "#EC489920", icon: Palette  },
  other:    { label: "Other",    color: "#64748B", bg: "#F8FAFC", border: "#64748B20", icon: Wrench   },
};

export default function SkillPage() {
  const { skills, loading, error } = useSkills(false);
  const [filter, setFilter] = useState<SkillCategory | "all">("all");

  const filtered = filter === "all" ? skills : skills.filter(s => s.category === filter);
  const categories: (SkillCategory | "all")[] = ["all", ...Array.from(new Set(skills.map(s => s.category))) as SkillCategory[]];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Hero banner */}
      <div className="w-full bg-gradient-to-br from-[#EFF6FF] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-16">
          <Link
            href="/#skills"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2563EB] transition-colors mb-6"
            style={{ fontWeight: 500 }}
          >
            <ArrowLeft size={15} /> Back to Portfolio
          </Link>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
            Technical Arsenal
          </p>
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontWeight: 800 }}>
            All <span className="text-[#2563EB]">Skills</span>
          </h1>
          <div className="w-14 h-[3px] rounded-full bg-[#2563EB] mb-4" />
          <p className="text-gray-500 max-w-xl" style={{ fontWeight: 400 }}>
            Every technology, framework, and tool in my stack — from frontend to backend, databases to DevOps.
          </p>

          {/* Stats */}
          {!loading && (
            <div className="flex gap-8 mt-8">
              {[
                { value: skills.length, label: "Total" },
                { value: skills.filter(s => s.category === "frontend").length, label: "Frontend" },
                { value: skills.filter(s => s.category === "backend").length, label: "Backend" },
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
          {categories.map(cat => {
            const cfg = categoryConfig[cat];
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs capitalize transition-all ${
                  filter === cat
                    ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/30"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                style={{ fontWeight: 600 }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 animate-pulse h-40" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm" style={{ fontWeight: 500 }}>Failed to load skills.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>No skills found for this filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filtered.map((skill, i) => {
                  const cfg = categoryConfig[skill.category];
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4 }}
                    >
                      <div
                        className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563EB]/20 transition-all group h-full"
                      >
                        {/* Logo */}
                        <div className="flex items-center justify-center mb-4">
                          {skill.logo ? (
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center"
                              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                              <Image
                                src={skill.logo}
                                alt={skill.name}
                                width={48}
                                height={48}
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                              <Icon size={28} style={{ color: cfg.color }} />
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <h2 className="text-gray-900 text-sm text-center mb-3 leading-tight" style={{ fontWeight: 700 }}>
                          {skill.name}
                        </h2>

                        {/* Category badge */}
                        <div className="flex justify-center mb-3">
                          <span
                            className="text-[9px] px-2.5 py-0.5 rounded-full"
                            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}
                          >
                            {cfg.label}
                          </span>
                        </div>

                        {/* Proficiency bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]" style={{ fontWeight: 600 }}>
                            <span className="text-gray-500">Proficiency</span>
                            <span style={{ color: cfg.color }}>{skill.proficiency}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: cfg.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ delay: i * 0.05 + 0.2, duration: 0.6 }}
                            />
                          </div>
                        </div>

                        {/* Years of experience */}
                        <div className="mt-3 text-center">
                          <p className="text-[10px] text-gray-400" style={{ fontWeight: 500 }}>
                            {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? "year" : "years"} experience
                          </p>
                        </div>
                      </div>
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
