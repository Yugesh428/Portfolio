"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";

function useResumeUrl() {
  const [resumeUrl, setResumeUrl] = useState("/yugesh_resume.pdf");
  useEffect(() => {
    fetch("/api/resume")
      .then(r => r.json())
      .then(d => { if (d.success && d.resumeUrl) setResumeUrl(d.resumeUrl); })
      .catch(() => {});
  }, []);
  return resumeUrl;
}

const links = [
  { href: "/",             label: "Home"         },
  { href: "/skill",        label: "Skills"       },
  { href: "/experience",   label: "Experience"   },
  { href: "/achievement",  label: "Achievements" },
  { href: "/course",       label: "Courses"      },
  { href: "/project",      label: "Projects"     },
  { href: "/contact",      label: "Contact"      },
];

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin  = (session?.user as any)?.role === "admin";
  const pathname = usePathname();
  const resumeUrl = useResumeUrl();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/40 transition-all group-hover:scale-105">
            <span className="text-white text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>Y</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#18181B] text-sm leading-tight" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Yugesh</span>
            <span className="text-gray-500 text-xs leading-tight" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>Developer</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(l => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    active
                      ? "text-[#2563EB]"
                      : "text-gray-600 hover:text-[#2563EB]"
                  }`}
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: active ? 600 : 500 }}
                >
                  {l.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2563EB]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA — Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2563EB]/30 text-[#2563EB] text-sm hover:bg-[#EFF6FF] transition-all"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>
          )}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 text-sm"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            <FileText size={16} /> Resume
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 w-full bg-white/98 backdrop-blur-xl border-b border-gray-100 px-6 py-6 flex flex-col gap-2 md:hidden shadow-lg">
          {links.map(l => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm transition-all ${
                  active
                    ? "bg-[#EFF6FF] text-[#2563EB] border border-blue-200"
                    : "text-gray-600 hover:text-[#2563EB] hover:bg-gray-50"
                }`}
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: active ? 600 : 500 }}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/30 text-sm"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            <FileText size={16} /> View Resume
          </a>
          {isAdmin && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#2563EB]/30 text-[#2563EB] hover:bg-[#EFF6FF] transition-all text-sm"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              <LayoutDashboard size={16} /> My Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
