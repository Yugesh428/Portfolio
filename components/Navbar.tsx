"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ExternalLink } from "lucide-react";

const links = [
  { href: "#about",          label: "About" },
  { href: "#skills",         label: "Skills" },
  { href: "#experience",     label: "Experience" },
  { href: "#projects",       label: "Projects" },
  { href: "#certifications", label: "Certifications" },
  { href: "#blog",           label: "Blog" },
  { href: "#contact",        label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]   = useState("");

  // scroll background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy
  useEffect(() => {
    const sectionIds = links.map((l) => l.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-black text-xl tracking-tighter flex items-center gap-1">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Yugesh
          </span>
          <span className="text-white">.dev</span>
          {/* live dot */}
          <span className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[8px] font-black uppercase tracking-widest text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Open
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/8"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                  {/* active underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-cyan-400" />
                  )}
                </a>
              </li>
            );
          })}
          <li className="ml-3">
            <a
              href="/yugesh_resume.pdf"
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold hover:opacity-90 transition shadow-lg shadow-purple-500/20"
            >
              Resume <ExternalLink size={11} />
            </a>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-1 md:hidden">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/8 text-white border border-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href="/yugesh_resume.pdf"
            target="_blank"
            className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold"
          >
            View Resume <ExternalLink size={14} />
          </a>
        </div>
      )}
    </header>
  );
}
