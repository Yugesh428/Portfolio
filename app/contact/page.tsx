"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send, Github, Linkedin, Twitter, CheckCircle2, AlertCircle, MapPin } from "lucide-react";

interface HeroContact {
  emailUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  statusBadge: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [hero, setHero]         = useState<HeroContact>({
    emailUrl:    "mailto:bastolayugesh2@gmail.com",
    githubUrl:   "https://github.com/Yugesh428",
    linkedinUrl: "https://www.linkedin.com/in/yugesh-bastola-315638317/",
    statusBadge: "Full Stack Developer · Nepal",
  });

  // Pull real contact links from Hero API
  useEffect(() => {
    fetch("/api/hero")
      .then(r => r.json())
      .then(d => { if (d.success && d.data) setHero(d.data); })
      .catch(() => {});
  }, []);

  const email = hero.emailUrl.replace("mailto:", "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const res  = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", message: data.message || "Message sent! I'll get back to you soon." });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  const socials = [
    { href: hero.githubUrl,   icon: Github,   label: "GitHub",   color: "#18181B", bg: "#F4F4F5" },
    { href: hero.linkedinUrl, icon: Linkedin, label: "LinkedIn", color: "#0A66C2", bg: "#EFF6FF" },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Hero banner */}
      <div className="w-full bg-gradient-to-br from-[#EFF6FF] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-32 pb-16">
          <Link href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2563EB] transition-colors mb-6"
            style={{ fontWeight: 500 }}>
            <ArrowLeft size={15} /> Back to Portfolio
          </Link>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2563EB] mb-2" style={{ fontWeight: 600 }}>
            Get In Touch
          </p>
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4" style={{ fontWeight: 800 }}>
            Let's <span className="text-[#2563EB]">Work Together</span>
          </h1>
          <div className="w-14 h-[3px] rounded-full bg-[#2563EB] mb-4" />
          <p className="text-gray-500 max-w-xl" style={{ fontWeight: 400 }}>
            Have a project in mind, want to collaborate, or just want to say hi? Drop me a message and I'll get back to you soon.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Left — contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }} className="space-y-7">

            <div>
              <h2 className="text-2xl text-gray-900 mb-3" style={{ fontWeight: 700 }}>Contact Information</h2>
              <p className="text-gray-500 leading-relaxed text-sm" style={{ fontWeight: 400 }}>
                I'm always open to new projects, creative ideas, and opportunities to be part of your vision.
              </p>
            </div>

            {/* Email card */}
            <a href={hero.emailUrl}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-[#2563EB]/20 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#FEF2F2", border: "1px solid #EA433520" }}>
                <Mail size={20} style={{ color: "#EA4335" }} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5" style={{ fontWeight: 600 }}>
                  Email
                </p>
                <p className="text-sm text-gray-900 group-hover:text-[#2563EB] transition-colors break-all" style={{ fontWeight: 600 }}>
                  {email}
                </p>
              </div>
            </a>

            {/* Location card */}
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#F0FDF4", border: "1px solid #16A34A20" }}>
                <MapPin size={20} style={{ color: "#16A34A" }} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5" style={{ fontWeight: 600 }}>
                  Location
                </p>
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
                  Kathmandu, Nepal
                </p>
              </div>
            </div>

            {/* Social links */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4" style={{ fontWeight: 700 }}>Connect With Me</h3>
              <div className="flex gap-3">
                {socials.map(({ href, icon: Icon, label, color, bg }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-[#2563EB]/20 hover:shadow-md transition-all"
                    style={{ background: bg }}>
                    <Icon size={16} style={{ color }} />
                    <span className="text-sm text-gray-700" style={{ fontWeight: 600, color }}>{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="p-5 bg-gradient-to-br from-[#EFF6FF] to-white rounded-2xl border border-blue-100">
              <p className="text-xs text-gray-500 leading-relaxed" style={{ fontWeight: 400 }}>
                💡 <span style={{ fontWeight: 600 }}>Quick response:</span> I typically reply within 24 hours. Looking forward to hearing from you!
              </p>
            </div>
          </motion.div>

          {/* ── Right — form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name + Email row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" id="name" name="name" value={formData.name}
                    onChange={handleChange} required placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    style={{ fontWeight: 400 }} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" id="email" name="email" value={formData.email}
                    onChange={handleChange} required placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    style={{ fontWeight: 400 }} />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>
                  Subject <span className="text-red-500">*</span>
                </label>
                <input type="text" id="subject" name="subject" value={formData.subject}
                  onChange={handleChange} required placeholder="Project Collaboration Opportunity"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  style={{ fontWeight: 400 }} />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 600 }}>
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea id="message" name="message" value={formData.message}
                  onChange={handleChange} required rows={6}
                  placeholder="Tell me about your project or idea..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all resize-none"
                  style={{ fontWeight: 400 }} />
              </div>

              {/* Status */}
              {status.type && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    status.type === "success"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}>
                  {status.type === "success"
                    ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                    : <AlertCircle  size={18} className="flex-shrink-0 mt-0.5" />}
                  <p className="text-sm" style={{ fontWeight: 500 }}>{status.message}</p>
                </motion.div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full px-6 py-3.5 bg-[#2563EB] text-white rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                style={{ fontWeight: 600 }}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
