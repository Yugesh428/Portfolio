"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, FileText, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { href: "/",            label: "Home"         },
  { href: "/skill",       label: "Skills"       },
  { href: "/experience",  label: "Experience"   },
  { href: "/achievement", label: "Achievements" },
  { href: "/course",      label: "Courses"      },
  { href: "/project",     label: "Projects"     },
  { href: "/contact",     label: "Contact"      },
];

const contactLinks = [
  {
    href: "mailto:bastolayugesh2@gmail.com",
    label: "bastolayugesh2@gmail.com",
    icon: Mail,
    color: "#EA4335",
    bg: "#FEF2F2",
  },
  {
    href: "https://www.linkedin.com/in/yugesh-bastola-315638317/",
    label: "yugesh-bastola",
    icon: Linkedin,
    color: "#0A66C2",
    bg: "#EFF6FF",
    external: true,
  },
  {
    href: "https://github.com/Yugesh428",
    label: "Yugesh428",
    icon: Github,
    color: "#18181B",
    bg: "#F4F4F5",
    external: true,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-white border-t border-gray-100"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-14 pb-8">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all group-hover:scale-105">
                <span className="text-white text-lg" style={{ fontWeight: 700 }}>Y</span>
              </div>
              <div>
                <p className="text-gray-900 text-sm leading-none" style={{ fontWeight: 700 }}>Yugesh Bastola</p>
                <p className="text-gray-400 text-xs mt-0.5" style={{ fontWeight: 400 }}>Full Stack Developer</p>
              </div>
            </Link>

            <p className="text-gray-500 text-sm leading-relaxed max-w-sm" style={{ fontWeight: 400 }}>
              Building scalable web applications and SaaS products from Nepal — one commit at a time.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {contactLinks.map(({ href, icon: Icon, color, bg, external, label }) => (
                <a
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 hover:scale-105 hover:shadow-md transition-all"
                  style={{ background: bg }}
                >
                  <Icon size={17} style={{ color }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-5" style={{ fontWeight: 700 }}>
              Quick Links
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-[#2563EB] flex items-center gap-1.5 group transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#2563EB] flex-shrink-0 transition-colors"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-5" style={{ fontWeight: 700 }}>
              Contact
            </p>
            <ul className="space-y-3">
              {contactLinks.map(({ href, label, icon: Icon, color, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-gray-900 group transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <Icon size={14} style={{ color }} className="flex-shrink-0" />
                    <span className="truncate group-hover:underline underline-offset-2">{label}</span>
                    {external && (
                      <ArrowUpRight size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
                    )}
                  </a>
                </li>
              ))}

              <li className="pt-1">
                <p className="flex items-center gap-2.5 text-sm text-gray-400" style={{ fontWeight: 400 }}>
                  <span className="text-base leading-none">📍</span>
                  Kathmandu, Nepal
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-100" />

        {/* ── Bottom bar ── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400" style={{ fontWeight: 500 }}>
            © {year} Yugesh Bastola · All rights reserved.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1.5" style={{ fontWeight: 400 }}>
            Built with
            <span className="text-[#2563EB]" style={{ fontWeight: 600 }}>Next.js</span>
            &amp;
            <span className="text-[#2563EB]" style={{ fontWeight: 600 }}>Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
