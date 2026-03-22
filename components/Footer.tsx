"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#050505] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-2xl">
                Yugesh
              </span>
              .dev
            </h3>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed italic">
              Specializing in building high-performance multi-tenant SaaS
              applications and enterprise-grade digital solutions.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://github.com/Yugesh428"
                target="_blank"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:text-purple-400 transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/yugesh-bastola-315638317/"
                target="_blank"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:text-blue-400 transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:bastolayugesh2@gmail.com"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:text-red-400 transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
              Sitemap
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="#about"
                  className="hover:text-white transition flex items-center gap-2 group"
                >
                  <ChevronRight size={12} className="text-purple-500" /> About
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="hover:text-white transition flex items-center gap-2 group"
                >
                  <ChevronRight size={12} className="text-purple-500" /> Skills
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-white transition flex items-center gap-2 group"
                >
                  <ChevronRight size={12} className="text-purple-500" />{" "}
                  Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
              Contact
            </h4>
            <div className="space-y-4 text-sm">
              <p className="text-gray-400">Kathmandu, Nepal</p>
              <a
                href="mailto:bastolayugesh2@gmail.com"
                className="block text-blue-400 hover:underline"
              >
                bastolayugesh2@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - FIXED POSITION */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            © {new Date().getFullYear()} Yugesh Bastola • Kathmandu, Nepal
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
            Built with Next.js & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
