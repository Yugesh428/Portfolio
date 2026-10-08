"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, ExternalLink, Lock, FolderKanban } from "lucide-react";
import { useProjects } from "@/lib/hooks/useProject";

const categoryConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  "saas":    { label: "SaaS",    color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20" },
  "web-app": { label: "Web App", color: "#10B981", bg: "#F0FDF4", border: "#10B98120" },
  "api":     { label: "API",     color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20" },
  "mobile":  { label: "Mobile",  color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20" },
  "other":   { label: "Other",   color: "#6B7280", bg: "#F9FAFB", border: "#6B728020" },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  "completed":   { label: "Completed",   color: "#10B981", bg: "#F0FDF4" },
  "in-progress": { label: "In Progress", color: "#F59E0B", bg: "#FFFBEB" },
  "planned":     { label: "Planned",     color: "#6B7280", bg: "#F9FAFB" },
};

export default function ProjectsSection() {
  const { projects, loading } = useProjects(true); // featured only

  return (
    <section id="projects" className="w-full bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-24">

        {/* Header — same pattern as all other sections */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
              Portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-3" style={{ fontWeight: 800 }}>
              My <span className="text-[#2563EB]">Projects</span>
            </h2>
            <div className="w-12 h-[3px] rounded-full bg-[#2563EB]" />
          </div>
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#F8FAFF] border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-100 rounded" />
                  <div className="h-2.5 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm" style={{ fontWeight: 500 }}>
            No projects to display yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => {
              const cfg = categoryConfig[p.category] || categoryConfig.other;
              const sts = statusConfig[p.status]    || statusConfig.completed;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="group bg-[#F8FAFF] border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563EB]/20 transition-all"
                >
                  {/* Image / placeholder */}
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-5xl"
                        style={{ background: `${p.color}10` }}
                      >
                        {p.badgeEmoji}
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span
                        className="text-[9px] px-2.5 py-1 rounded-full text-white"
                        style={{ background: p.color, fontWeight: 700 }}
                      >
                        {cfg.label}
                      </span>
                      {p.isPrivate && (
                        <span className="text-[9px] px-2.5 py-1 rounded-full bg-black/60 text-gray-200 flex items-center gap-1" style={{ fontWeight: 600 }}>
                          <Lock size={9} /> Private
                        </span>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      {p.status === "in-progress" && (
                        <span className="text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1"
                          style={{ background: sts.bg, color: sts.color, fontWeight: 700 }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          {sts.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title + dates */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-gray-900 text-sm leading-tight" style={{ fontWeight: 700 }}>{p.title}</h3>
                      {(p.startDate || p.endDate) && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 flex-shrink-0" style={{ fontWeight: 600 }}>
                          {p.endDate || p.startDate}
                        </span>
                      )}
                    </div>

                    {/* Short description */}
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2" style={{ fontWeight: 400 }}>
                      {p.shortDescription || p.description}
                    </p>

                    {/* Tech tags */}
                    {p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.technologies.slice(0, 4).map(t => (
                          <span key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }}>
                            {t}
                          </span>
                        ))}
                        {p.technologies.length > 4 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400" style={{ fontWeight: 600 }}>
                            +{p.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {p.githubUrl && !p.isPrivate && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                          style={{ fontWeight: 600 }}>
                          <Github size={11} /> GitHub
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-all"
                          style={{ fontWeight: 600 }}>
                          <ExternalLink size={11} /> Live
                        </a>
                      )}
                      {p.isPrivate && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-400" style={{ fontWeight: 500 }}>
                          <Lock size={10} /> Private repo
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <a
              href="#projects"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2563EB] text-white text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 group"
              style={{ fontWeight: 700 }}
            >
              <FolderKanban size={15} />
              View All Projects
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        )}

      </div>
    </section>
  );
}
