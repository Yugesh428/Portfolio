"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, ChevronRight, User } from "lucide-react";
import { useHero } from "@/lib/hooks/useHero";

export default function HeroSection() {
  const { hero, loading, error } = useHero();

  const heroData = hero || {
    greeting: "Hello I'M A",
    title: "Full Stack Developer",
    subtitle: "Yugesh Bastola",
    description: "Full Stack Developer from Nepal building scalable SaaS web applications using Next.js, Node.js, React, and SQL databases.",
    profileImage: "",
    resumeUrl: "/yugesh_resume.pdf",
    githubUrl: "https://github.com/Yugesh428",
    linkedinUrl: "https://www.linkedin.com/in/yugesh-bastola-315638317/",
    emailUrl: "mailto:bastolayugesh2@gmail.com",
    statusBadge: "Full Stack Developer · Nepal",
    yearsExperience: 2,
    projectsCompleted: 6,
    certificationsCount: 7,
    availableForWork: true,
  };

  if (loading) {
    return (
      <section
        id="home"
        className="min-h-screen flex items-center justify-center"
        style={{ fontFamily: "Poppins, sans-serif", background: "#FFFFFF" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>Loading…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif" }}>
        <p className="text-red-500 text-sm" style={{ fontWeight: 500 }}>Failed to load hero data.</p>
      </section>
    );
  }

  return (
    <section
      id="home"
      aria-label="Hero — Yugesh Bastola Full Stack Developer Nepal"
      className="w-full min-h-screen flex items-center relative overflow-hidden pt-20 pb-10"
      style={{ fontFamily: "Poppins, sans-serif", background: "#FFFFFF" }}
    >
      {/* Soft background blobs */}
      <div className="absolute top-[-15%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#2563EB]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[0%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#60A5FA]/6 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">

          {/* ── LEFT — Text content ── */}
          <div className="flex-1 max-w-xl">

            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl text-gray-500 mb-2"
              style={{ fontWeight: 400 }}
            >
              {heroData.greeting}
            </motion.p>

            {/* Main heading — matches reference layout */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="leading-tight mb-4"
              style={{ fontWeight: 800, fontSize: "clamp(2.4rem, 5.5vw, 4rem)" }}
            >
              <span className="text-[#18181B]">{heroData.title} </span>
              <span
                style={{
                  backgroundImage: "linear-gradient(95deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {heroData.subtitle}.
              </span>
            </motion.h1>

            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.45, duration: 0.8, ease: "easeOut" }}
              className="w-16 h-[3px] rounded-full mb-5"
              style={{ background: "linear-gradient(90deg, #2563EB, #60A5FA)" }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-gray-500 leading-relaxed mb-8 max-w-md"
              style={{ fontWeight: 400, fontSize: "0.95rem" }}
            >
              {heroData.description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap gap-3 items-center mb-8"
            >
              <a
                href={heroData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] text-white text-xs uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                style={{ fontWeight: 700 }}
              >
                View Resume <ExternalLink size={13} />
              </a>
              <a
                href="#contact"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#2563EB]/30 text-[#2563EB] text-xs uppercase tracking-[0.15em] hover:bg-[#2563EB]/5 transition-all"
                style={{ fontWeight: 700 }}
              >
                Hire Me <ChevronRight size={13} />
              </a>
            </motion.div>

            {/* Social icons — filled circles like reference */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="flex gap-3 items-center"
            >
              {[
                { href: heroData.githubUrl,   icon: <Github size={17} />,   label: "GitHub",   bg: "#18181B" },
                { href: heroData.linkedinUrl, icon: <Linkedin size={17} />, label: "LinkedIn", bg: "#0A66C2" },
                { href: heroData.emailUrl,    icon: <Mail size={17} />,     label: "Email",    bg: "#2563EB" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg"
                  style={{ background: s.bg }}
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>

          </div>

          {/* ── RIGHT — Profile photo circle ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <div className="relative">
              {/* Outer soft glow ring */}
              <div
                className="absolute inset-0 rounded-full scale-[1.18]"
                style={{
                  background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 60%, transparent 80%)",
                }}
              />

              {/* Middle ring */}
              <div
                className="absolute inset-0 rounded-full scale-[1.08] border-[1.5px]"
                style={{ borderColor: "rgba(37,99,235,0.15)" }}
              />

              {/* Main photo circle */}
              <div
                className="relative rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-blue-500/20"
                style={{
                  width: "clamp(320px, 38vw, 500px)",
                  height: "clamp(320px, 38vw, 500px)",
                  background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)",
                }}
              >
                {heroData.profileImage ? (
                  <img
                    src={heroData.profileImage}
                    alt={`${heroData.subtitle} — ${heroData.title}`}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  /* Placeholder when no image uploaded yet */
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <User size={64} className="text-white/40" />
                    <span className="text-white/50 text-sm text-center px-4" style={{ fontWeight: 500 }}>
                      Upload your photo from Dashboard → Hero Section
                    </span>
                  </div>
                )}
              </div>

              {/* Floating badge — Available */}
              {heroData.availableForWork && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg border border-gray-100"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-gray-700 whitespace-nowrap" style={{ fontWeight: 600 }}>
                    Available for work
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
