"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Filter, ExternalLink, Github, Cloud, Code, Smartphone, Layers } from "lucide-react";
import { useProjects, ProjectCategory, ProjectStatus } from "@/lib/hooks/useProject";
import Image from "next/image";

const categoryConfig: Record<ProjectCategory | "all", { label: string; color: string; bg: string; border: string; icon: any }> = {
  all:      { label: "All",       color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Layers     },
  saas:     { label: "SaaS",      color: "#2563EB", bg: "#EFF6FF", border: "#2563EB20", icon: Cloud      },
  "web-app": { label: "Web App",  color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED20", icon: Code       },
  api:      { label: "API",       color: "#16A34A", bg: "#F0FDF4", border: "#16A34A20", icon: Layers     },
  mobile:   { label: "Mobile",    color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B20", icon: Smartphone },
  other:    { label: "Other",     color: "#EC4899", bg: "#FDF2F8", border: "#EC489920", icon: Code       },
};

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  completed:    { label: "Completed",   color: "#16A34A", bg: "#F0FDF4" },
  "in-progress": { label: "In Progress", color: "#F59E0B", bg: "#FFFBEB" },
  planned:      { label: "Planned",     color: "#64748B", bg: "#F8FAFC" },
};

export default function ProjectPage() {
  const { projects, loading, error } = useProjects(false);
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");

  const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);
  const categories: (ProjectCategory | "all")[] = ["all", ...Array.from(new Set(projects.map(p => p.category))) as ProjectCategory[]];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Hero banner */}
      <div className="w-full bg-gradient-to-br from-[#EFF6FF] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-16">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2563EB] transition-colors mb-6"
            style={{ fontWeight: 500 }}
          >
            <ArrowLeft size={15} /> Back to Portfolio
          </Link>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
            Portfolio Showcase
          </p>
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontWeight: 800 }}>
            All <span className="text-[#2563EB]">Projects</span>
          </h1>
          <div className="w-14 h-[3px] rounded-full bg-[#2563EB] mb-4" />
          <p className="text-gray-500 max-w-xl" style={{ fontWeight: 400 }}>
            A complete collection of projects I've built — from SaaS platforms to APIs, web apps to mobile solutions.
          </p>

          {/* Stats */}
          {!loading && (
            <div className="flex gap-8 mt-8">
              {[
                { value: projects.length, label: "Total" },
                { value: projects.filter(p => p.status === "completed").length, label: "Completed" },
                { value: projects.filter(p => p.status === "in-progress").length, label: "In Progress" },
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 animate-pulse h-80" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm" style={{ fontWeight: 500 }}>Failed to load projects.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm" style={{ fontWeight: 500 }}>No projects found for this filter.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((project, i) => {
                  const cfg = categoryConfig[project.category];
                  const statusCfg = statusConfig[project.status];
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      whileHover={{ y: -3 }}
                    >
                      <div
                        className="block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#2563EB]/20 transition-all group h-full"
                      >
                        {/* Image */}
                        {project.image && (
                          <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                              >
                                {project.badgeEmoji || <Icon size={18} style={{ color: cfg.color }} />}
                              </div>
                              <div>
                                <h2 className="text-gray-900 text-sm leading-tight" style={{ fontWeight: 700 }}>
                                  {project.title}
                                </h2>
                              </div>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex gap-1.5 mb-3">
                            <span
                              className="text-[9px] px-2.5 py-0.5 rounded-full"
                              style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, fontWeight: 700 }}
                            >
                              {cfg.label}
                            </span>
                            <span
                              className="text-[9px] px-2.5 py-0.5 rounded-full border"
                              style={{ color: statusCfg.color, background: statusCfg.bg, fontWeight: 700 }}
                            >
                              {statusCfg.label}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3" style={{ fontWeight: 400 }}>
                            {project.shortDescription || project.description}
                          </p>

                          {/* Technologies */}
                          {project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {project.technologies.slice(0, 4).map(tech => (
                                <span
                                  key={tech}
                                  className="text-[10px] px-2 py-0.5 rounded-full"
                                  style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 4 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400" style={{ fontWeight: 600 }}>
                                  +{project.technologies.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Links */}
                          <div className="flex items-center gap-2">
                            {project.githubUrl && !project.isPrivate && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 hover:opacity-80 border border-gray-200 text-gray-600"
                                style={{ fontWeight: 600 }}
                                onClick={e => e.stopPropagation()}
                              >
                                <Github size={11} /> Code
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 hover:opacity-80"
                                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 600 }}
                                onClick={e => e.stopPropagation()}
                              >
                                <ExternalLink size={11} /> Live
                              </a>
                            )}
                            {project.isPrivate && (
                              <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200" style={{ fontWeight: 600 }}>
                                🔒 Private
                              </span>
                            )}
                          </div>
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
