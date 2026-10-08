"use client";

import React from "react";
import { useSkills } from "@/lib/hooks/useSkill";
import { motion } from "framer-motion";

const categoryConfig: Record<string, { label: string; gradient: string }> = {
  frontend: { label: "Frontend", gradient: "from-blue-500 to-cyan-400" },
  backend:  { label: "Backend",  gradient: "from-green-500 to-emerald-400" },
  database: { label: "Database", gradient: "from-purple-500 to-violet-400" },
  devops:   { label: "DevOps",   gradient: "from-orange-500 to-amber-400" },
  design:   { label: "Design",   gradient: "from-pink-500 to-rose-400" },
  other:    { label: "Other",    gradient: "from-gray-500 to-slate-400" },
};

export default function SkillsMarquee() {
  const { skills, loading } = useSkills(true); // featured only

  if (loading || skills.length === 0) return null;

  // Duplicate skills for seamless loop
  const duplicatedSkills = [...skills, ...skills, ...skills];

  return (
    <section className="w-full bg-white pt-20 pb-4 overflow-hidden" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Header matching Experience section style */}
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
            SKILLS
          </p>
          <h2 className="text-3xl sm:text-4xl mb-3" style={{ fontWeight: 800 }}>
            <span className="text-[#18181B]">Technical </span>
            <span className="text-[#2563EB]">Skills</span>
          </h2>
          <div className="w-12 h-[3px] rounded-full bg-[#2563EB] mb-3" />
          <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>
            Technologies I work with regularly
          </p>
        </motion.div>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="relative w-full">
        {/* Gradient overlays for edge fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-scroll">
          {duplicatedSkills.map((skill, idx) => {
            const cfg = categoryConfig[skill.category] || categoryConfig.other;
            return (
              <div
                key={`${skill.id}-${idx}`}
                className="flex-shrink-0 group relative"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <div className="w-32 h-32 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4 group-hover:scale-110">
                  {/* Logo or emoji */}
                  {skill.logo ? (
                    <img src={skill.logo} alt={skill.name} className="w-12 h-12 object-contain" />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white text-2xl font-bold`}
                    >
                      {skill.name.charAt(0)}
                    </div>
                  )}
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-900 font-semibold truncate w-full">{skill.name}</p>
                    <p className="text-[10px] text-gray-400">{skill.yearsOfExperience}+ yrs</p>
                  </div>

                  {/* Proficiency indicator */}
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${cfg.gradient} transition-all`}
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>

                {/* Category badge on hover */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r ${cfg.gradient} text-white font-bold shadow-lg`}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
