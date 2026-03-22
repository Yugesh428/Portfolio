"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Send,
  Phone,
  MapPin,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import SkillBar from "@/components/SkillBar";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ===== HERO SECTION ===== */}
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center items-center text-center pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-blue-400 uppercase tracking-widest">
              Full Stack Developer • SaaS Specialist
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
              Yugesh{" "}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Bastola
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-gray-400 text-lg leading-relaxed">
              Expertise in{" "}
              <span className="text-white">Multi-tenant SaaS architecture</span>{" "}
              and high-performance web systems using Next.js and MSSQL.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <a
                href="/yugesh_resume.pdf"
                target="_blank"
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-purple-500/20 text-sm"
              >
                View Resume <ExternalLink size={18} />
              </a>
              <div className="flex gap-4 items-center">
                <a
                  href="https://github.com/Yugesh428"
                  target="_blank"
                  className="p-3 rounded-full border border-white/10 bg-white/5 hover:text-purple-400 transition-all hover:border-purple-500/50"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/yugesh-bastola-315638317/"
                  target="_blank"
                  className="p-3 rounded-full border border-white/10 bg-white/5 hover:text-blue-400 transition-all hover:border-blue-500/50"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== ABOUT ME ===== */}
        <section
          id="about"
          className="py-24 grid lg:grid-cols-2 gap-16 items-center border-t border-white/5"
        >
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            viewport={{ once: true }}
          >
            <div className="relative group max-w-md mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-card p-4 aspect-square">
                <Image
                  src="/image.png"
                  alt="Yugesh Bastola"
                  fill
                  className="object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </motion.div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold italic">
              About <span className="text-purple-400">Me:</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Experienced Full Stack Developer with internship experience at{" "}
              <span className="text-white font-semibold">
                Aqore Software Pvt. Ltd.
              </span>{" "}
              as a Database Intern. I specialize in{" "}
              <span className="text-blue-400">Multi-tenant architecture</span>,
              bridging complex data structures with modern frontend frameworks.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                <h4 className="text-blue-400 font-bold text-2xl">100%</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  TypeScript
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                <h4 className="text-purple-400 font-bold text-2xl">6+ Mo.</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  Practice
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SKILLS ===== */}
        <section id="skills" className="py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <span className="w-10 h-1 bg-purple-500 rounded-full"></span>{" "}
            SKILLS:
          </h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
            <SkillBar name="TypeScript" level={100} />
            <SkillBar name="NextJS" level={90} />
            <SkillBar name="Nodejs" level={85} />
            <SkillBar name="MSSQL" level={80} />
            <SkillBar name="ReactJs" level={75} />
            <SkillBar name="Java" level={60} />
          </div>
        </section>

        {/* ===== FEATURED PROJECTS (NOW BELOW SKILLS) ===== */}
        <section id="projects" className="py-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold italic">
                Featured <span className="text-blue-400">Projects:</span>
              </h2>
              <p className="text-gray-500 mt-2 italic text-sm">
                Real-world Multi-tenant SaaS & Enterprise applications.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              title="Institute SAAS"
              type="Multi-tenant SaaS"
              desc="A scalable educational platform built with a multi-tenant architecture supporting independent instances for multiple institutes."
              tags={["Next.js", "Node.js", "MSSQL", "SaaS"]}
              link="https://github.com/Yugesh428/InstituteSAAS"
              isSaaS={true}
            />
            <ProjectCard
              title="Clinic Management"
              type="Enterprise / Private"
              desc="Comprehensive multi-tenant clinic solution managing patient records, billing, and scheduling with strict data isolation."
              tags={["React", "Express", "Multitenancy"]}
              isPrivate={true}
              isSaaS={true}
            />
            <ProjectCard
              title="Staffing Management"
              type="Enterprise / Private"
              desc="Full-cycle staffing SaaS to manage recruitment, multitenancy client segregation, and staffing workflows."
              tags={["Next.js", "Prisma", "Enterprise"]}
              isPrivate={true}
              isSaaS={true}
            />
            <ProjectCard
              title="Room Management"
              type="Open Source"
              desc="System for managing room bookings, availability, and user check-ins with automated backend logic."
              tags={["Node.js", "React", "MSSQL"]}
              link="https://github.com/Yugesh428/RoomManagementSystem"
            />
            <ProjectCard
              title="Blog Management"
              type="Open Source"
              desc="A professional CMS for managing digital content with role-based access control and high-performance rendering."
              tags={["JavaScript", "EJS", "CRUD"]}
              link="https://github.com/Yugesh428/Blog_Management"
            />
            <ProjectCard
              title="Shoes E-commerce"
              type="Frontend Focus"
              desc="Modern shoes store frontend showcasing high-performance product filtering and cart state management."
              tags={["React", "Tailwind", "State Management"]}
              link="https://github.com/Yugesh428/shoes-/tree/main/src"
            />
          </div>
        </section>

        {/* ===== WORK & EDUCATION ===== */}
        <section
          id="experience"
          className="py-24 border-t border-white/5 grid md:grid-cols-2 gap-16"
        >
          <div>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="w-10 h-1 bg-blue-500 rounded-full"></span>{" "}
              EXPERIENCE:
            </h2>
            <div className="space-y-12">
              <ExperienceItem
                title="Full Stack Developer"
                company="Freelance & Projects"
                date="Current"
                points={[
                  "Built multitenant SaaS applications.",
                  "API integration & Testing with Postman.",
                  "Next.js performance optimization.",
                ]}
              />
              <ExperienceItem
                title="Database Intern"
                company="Aqore Software Pvt. Ltd."
                date="6 Months"
                points={[
                  "System architecture support.",
                  "MSSQL data management.",
                  "Query optimization & design.",
                ]}
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="w-10 h-1 bg-cyan-500 rounded-full"></span>{" "}
              EDUCATION:
            </h2>
            <div className="space-y-6">
              <EducationCard
                school="TechSpire College"
                location="Kathmandu"
                status="Ongoing"
                desc="Focused on Digital Technology and Full Stack architecture."
              />
              <EducationCard
                school="Digital Pathshala"
                location="Kathmandu"
                status="Completed"
                desc="Intensive training in modern web stacks."
              />
            </div>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="py-24 mb-20 border-t border-white/5">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h2 className="text-5xl font-bold italic">
                  Contact <span className="text-blue-400">Me:</span>
                </h2>
                <div className="space-y-6">
                  <ContactLink
                    icon={<Phone size={20} />}
                    label="Phone"
                    value="+977-9812124264"
                    href="tel:+9779812124264"
                  />
                  <ContactLink
                    icon={<Mail size={20} />}
                    label="Email"
                    value="bastolayugesh2@gmail.com"
                    href="mailto:bastolayugesh2@gmail.com"
                  />
                  <div className="flex items-center gap-4 text-gray-500 italic">
                    <MapPin size={20} /> <span>Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>

              <form
                action="https://formspree.io/f/xnjgyygy"
                method="POST"
                className="space-y-4"
              >
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none transition"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none transition"
                />
                <textarea
                  name="message"
                  placeholder="Describe your project..."
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-32 focus:border-purple-500 outline-none transition"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition hover:opacity-90"
                >
                  Send Message <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 text-center border-t border-white/5 text-gray-500 text-sm italic">
        © {new Date().getFullYear()} Yugesh Bastola • Kathmandu, Nepal
      </footer>
    </div>
  );
}

/* HELPER COMPONENTS */

function ProjectCard({
  title,
  type,
  desc,
  tags,
  link,
  isPrivate,
  isSaaS,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col h-full group hover:border-purple-500/50 transition-all shadow-2xl"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest">
          {type}
        </span>
        {isSaaS && (
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold border border-purple-500/30">
            MULTI-TENANT
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow italic">
        {desc}
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 italic"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="pt-6 border-t border-white/5">
        {isPrivate ? (
          <span className="text-xs text-gray-500 flex items-center gap-2 italic">
            <ShieldCheck size={14} /> Enterprise Repository
          </span>
        ) : (
          <a
            href={link}
            target="_blank"
            className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-blue-400 transition"
          >
            View Source <Github size={14} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function ContactLink({ icon, label, value, href }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest italic">
          {label}
        </p>
        <a
          href={href}
          className="text-lg font-bold hover:text-purple-400 transition"
        >
          {value}
        </a>
      </div>
    </div>
  );
}

function ExperienceItem({ title, company, date, points }: any) {
  return (
    <div className="relative pl-8 border-l border-white/10 py-2">
      <div className="absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-blue-400 font-medium mb-4 text-sm uppercase tracking-wider">
        {company} • {date}
      </p>
      <ul className="space-y-3">
        {points.map((p: string, i: number) => (
          <li
            key={i}
            className="text-gray-400 text-sm leading-relaxed flex gap-2"
          >
            <ChevronRight
              size={14}
              className="text-purple-500 mt-1 flex-shrink-0"
            />{" "}
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EducationCard({ school, location, status, desc }: any) {
  return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all shadow-xl">
      <GraduationCap className="text-cyan-400 mb-4" size={28} />
      <h3 className="font-bold text-lg">{school}</h3>
      <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-3">
        {location} • {status}
      </p>
      <p className="text-gray-400 text-sm leading-relaxed italic">{desc}</p>
    </div>
  );
}
