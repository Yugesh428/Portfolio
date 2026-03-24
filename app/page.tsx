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
  Eye,
} from "lucide-react";

// Brand Icons
import {
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiJavascript,
  SiSpringboot,
  SiPostman,
  SiMysql,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

import SkillBar from "@/components/SkillBar";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-cyan-900/10 blur-[120px]" />
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
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-cyan-400 uppercase tracking-widest">
              Full Stack Developer • SaaS Specialist
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight uppercase italic text-wrap">
              Yugesh{" "}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent uppercase">
                Bastola
              </span>
            </h1>

            <div className="space-y-4">
              <p className="max-w-xl mx-auto text-gray-400 text-lg leading-relaxed">
                Architecting{" "}
                <span className="text-white font-semibold">
                  Multi-tenant SaaS solutions
                </span>{" "}
                and high-availability systems using Next.js, Node.js and SQL
                architectures.
              </p>
              <p className="max-w-xl mx-auto text-gray-500 text-md leading-relaxed italic">
                Currently advancing into{" "}
                <span className="text-white font-medium">
                  Enterprise Backend
                </span>{" "}
                development with Java and the Spring Boot ecosystem.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <a
                href="/yugesh_resume.pdf"
                target="_blank"
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-purple-500/20 text-sm uppercase tracking-widest"
              >
                View Resume <ExternalLink size={18} />
              </a>
              <div className="flex gap-4 items-center">
                <a
                  href="https://github.com/Yugesh428"
                  target="_blank"
                  className="p-3 rounded-full border border-white/10 bg-white/5 hover:text-purple-400 transition-all hover:border-purple-500/50 shadow-xl"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/yugesh-bastola-315638317/"
                  target="_blank"
                  className="p-3 rounded-full border border-white/10 bg-white/5 hover:text-blue-400 transition-all hover:border-blue-500/50 shadow-xl"
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
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-card p-4 aspect-square shadow-2xl">
                <Image
                  src="/image.png"
                  alt="Yugesh Bastola"
                  fill
                  className="object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </motion.div>
          <div className="space-y-6 text-left">
            <h2 className="text-4xl font-bold italic uppercase tracking-tighter">
              About <span className="text-cyan-400">Me:</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Passionate Full Stack Developer with professional internship
              experience at{" "}
              <span className="text-white font-semibold">
                Aqore Software Pvt. Ltd.
              </span>{" "}
              Specialized in database schema design and{" "}
              <span className="text-cyan-400 font-medium italic underline underline-offset-8">
                Multi-tenant SaaS architecture
              </span>
              . I focus on building secure, scalable backends that power
              intuitive user experiences.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl hover:border-cyan-500/30 transition-all">
                <h4 className="text-cyan-400 font-bold text-2xl tracking-tighter">
                  2+ YEAR
                </h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">
                  TypeScript Proficiency
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl hover:border-cyan-500/30 transition-all">
                <h4 className="text-purple-400 font-bold text-2xl tracking-tighter">
                  1+ YEAR
                </h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">
                  Practical Experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SKILLS ===== */}
        <section id="skills" className="py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 italic uppercase tracking-tighter">
            <span className="w-12 h-[3px] bg-cyan-500 rounded-full"></span>{" "}
            SKILLS & <span className="text-cyan-500">Arsenal:</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md shadow-2xl">
            <div className="space-y-8">
              <SkillBar
                name="TypeScript"
                level={80}
                Icon={SiTypescript}
                color="#3178C6"
              />
              <SkillBar
                name="Next.js"
                level={90}
                Icon={SiNextdotjs}
                color="#FFFFFF"
              />
              <SkillBar
                name="Node.js"
                level={85}
                Icon={SiNodedotjs}
                color="#339933"
              />
            </div>
            <div className="space-y-8">
              <SkillBar
                name="MySQL / MSSQL"
                level={80}
                Icon={SiMysql}
                color="#4479A1"
              />
              <SkillBar
                name="React"
                level={75}
                Icon={SiReact}
                color="#61DAFB"
              />
              <SkillBar name="Java" level={60} Icon={FaJava} color="#ED8B00" />
            </div>
          </div>
        </section>

        {/* ===== FEATURED PROJECTS ===== */}
        <section id="projects" className="py-24 border-t border-white/5">
          <div className="mb-12">
            <h2 className="text-4xl font-bold italic uppercase tracking-tighter">
              Featured <span className="text-cyan-400">Projects:</span>
            </h2>
            <p className="text-gray-500 mt-2 italic text-sm font-medium">
              Engineered for high-throughput scalability, security, and
              multi-tenant isolation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <ProjectCard
              title="Institute SAAS"
              type="Multi-tenant SaaS"
              desc="A comprehensive educational ecosystem with strict data isolation, custom subdomains, and optimized SQL backend."
              tags={["Next.js", "Node.js", "MySQL"]}
              link="https://github.com/Yugesh428/InstituteSAAS"
              isSaaS={true}
            />
            <ProjectCard
              title="Clinic Management"
              type="Healthcare SaaS"
              desc="Private enterprise solution for clinic chains managing patient records and scheduling with secure RBAC."
              tags={["React", "Express", "Security"]}
              isPrivate={true}
              isSaaS={true}
            />
            <ProjectCard
              title="Staffing Management"
              type="Enterprise SaaS"
              desc="Built for staffing workflows at Aqore. Manages recruitment life-cycles and client segregation using MSSQL."
              tags={["Next.js", "MSSQL", "Enterprise"]}
              isPrivate={true}
              isSaaS={true}
            />
            <ProjectCard
              title="Room Management"
              type="Hospitality Engine"
              desc="Automated booking engine that optimizes room allocation and real-time availability using Node.js logic."
              tags={["Node.js", "React", "MySQL"]}
              link="https://github.com/Yugesh428/RoomManagementSystem"
            />
            <ProjectCard
              title="Blog CMS"
              type="Infrastructure"
              desc="A high-performance CMS featuring a custom-built RBAC engine and optimized delivery pipelines."
              tags={["JavaScript", "CRUD", "CMS"]}
              link="https://github.com/Yugesh428/Blog_Management"
            />
            <ProjectCard
              title="Shoes Store API"
              type="E-commerce API"
              desc="RESTful API engineered for transactions. Features complex inventory logic and verified via Postman."
              tags={["Node.js", "Postman", "Security"]}
              link="https://github.com/Yugesh428/shoes-/tree/main/src"
            />
          </div>
        </section>

        {/* ===== EXPERIENCE & EDUCATION ===== */}
        <section
          id="experience"
          className="py-24 border-t border-white/5 grid md:grid-cols-2 gap-16 text-left"
        >
          <div>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 italic uppercase tracking-tighter">
              <span className="w-12 h-[3px] bg-blue-500 rounded-full"></span>{" "}
              Experience:
            </h2>
            <div className="space-y-12">
              <ExperienceItem
                title="Full Stack Developer"
                company="Freelance & Enterprise Projects"
                date="2024 - PRESENT"
                points={[
                  "Architecting multitenant SaaS platforms.",
                  "Implementing secure RESTful APIs.",
                  "Optimizing Next.js performance.",
                ]}
              />
              <ExperienceItem
                title="Database Intern"
                company="Aqore Software Pvt. Ltd."
                date="6 MONTHS"
                points={[
                  "Supported enterprise system architecture.",
                  "Authored complex SQL stored procedures.",
                  "Database schema optimization.",
                ]}
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 italic uppercase tracking-tighter">
              <span className="w-12 h-[3px] bg-cyan-500 rounded-full"></span>{" "}
              Education:
            </h2>
            <div className="space-y-6">
              <EducationCard
                school="TechSpire College"
                location="Kathmandu"
                status="Ongoing"
                desc="Specializing in Digital Technology and Full Stack architecture."
              />
              <EducationCard
                school="Digital Pathshala"
                location="Kathmandu"
                status="Certification"
                desc="Professional training in Modern Web Stacks and SaaS design."
              />
              <EducationCard
                school="Broadway Infosys"
                location="Kathmandu"
                status="Certification"
                desc="Deep-dive into Core Java and Backend Logic."
              />
            </div>
          </div>
        </section>

        {/* ===== CERTIFICATIONS & BADGES ===== */}
        <section id="certifications" className="py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 italic uppercase tracking-tighter">
            <span className="w-12 h-[3px] bg-cyan-500 rounded-full"></span>
            Certifications <span className="text-cyan-500">& Badges:</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <CertificationCard
              title="Relay Hack x Tumlet Runner-Up"
              issuer="TechSpire x Tumlet"
              date="NOV 2025"
              imgSrc="/RelayTumlet.jpg"
              desc="Secured First Runner-Up in a hackathon focused on game design and creative innovation."
            />
            <CertificationCard
              title="Full Stack SaaS Development"
              issuer="Digital Pathshala"
              date="JAN 2025 - MAY 2025"
              imgSrc="/FullStackSaas.jpg"
              desc="Professional training in building multi-tenant architectures and modern web stacks."
            />
            <CertificationCard
              title="MERN Stack Development"
              issuer="Digital Pathshala"
              date="MARCH 2025"
              imgSrc="/MernFullStackDigitalPatsala.jpg"
              desc="Comprehensive completion of MongoDB, Express, React, and Node.js specialization."
            />
            <CertificationCard
              title="Database Internship"
              issuer="Aqore Software Pvt. Ltd."
              date="DEC 2025 - FEB 2026"
              imgSrc="/AqoreInternship.jpg"
              desc="Hands-on experience in MSSQL, stored procedures, and enterprise data modeling."
            />
            <CertificationCard
              title="Relay Hack Runner-Up"
              issuer="Aqore x TechSpire"
              date="DECEMBER 2025"
              imgSrc="/RelayHackAqore.jpg"
              desc="Recognized for outstanding creativity and problem-solving in a 10-day Aqore hackathon."
            />
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="py-24 border-t border-white/5">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative shadow-2xl text-left">
            <div className="grid lg:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-8">
                <h2 className="text-5xl font-bold italic uppercase tracking-tighter">
                  Contact <span className="text-cyan-400">Me:</span>
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
                  <div className="flex items-center gap-4 text-gray-500 italic font-medium tracking-widest uppercase text-[10px]">
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
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-cyan-500 outline-none transition"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-cyan-500 outline-none transition"
                />
                <textarea
                  name="message"
                  placeholder="Describe your project goals..."
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 h-32 focus:border-cyan-500 outline-none transition"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition hover:opacity-90 active:scale-95 shadow-xl uppercase tracking-widest text-sm"
                >
                  Send Message <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="w-full border-t border-white/5 pt-16 pb-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-black tracking-tighter uppercase italic">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase">
                  Yugesh
                </span>
                .dev
              </h3>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed italic">
                Building high-performance multi-tenant SaaS applications and
                secure enterprise-grade digital solutions for a modern web.
              </p>
              <div className="flex gap-4 pt-2">
                <SocialBtn
                  href="https://github.com/Yugesh428"
                  icon={<Github size={18} />}
                />
                <SocialBtn
                  href="https://www.linkedin.com/in/yugesh-bastola-315638317/"
                  icon={<Linkedin size={18} />}
                />
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
                Explore
              </h4>
              <ul className="space-y-3 text-sm text-gray-400 font-bold uppercase tracking-tighter italic">
                <li>
                  <a
                    href="#about"
                    className="hover:text-cyan-400 transition flex items-center gap-2 group underline-offset-4 hover:underline"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#skills"
                    className="hover:text-cyan-400 transition flex items-center gap-2 group underline-offset-4 hover:underline"
                  >
                    Skills
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="hover:text-cyan-400 transition flex items-center gap-2 group underline-offset-4 hover:underline"
                  >
                    Projects
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
                Contact
              </h4>
              <div className="space-y-4 text-sm font-bold tracking-tighter text-gray-500 italic">
                <p>KATHMANDU, NEPAL</p>
                <a
                  href="mailto:bastolayugesh2@gmail.com"
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4 lowercase"
                >
                  bastolayugesh2@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold italic">
              © {new Date().getFullYear()} Yugesh Bastola • Digital Craftsman
            </p>
            <div className="flex gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black italic">
              <span>Next.js</span> <span>Node.js</span> <span>MySQL</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* HELPER COMPONENTS */

function SocialBtn({ href, icon }: any) {
  return (
    <a
      href={href}
      target="_blank"
      className="p-3 rounded-full bg-white/5 border border-white/10 hover:text-white hover:border-cyan-500/50 transition-all duration-300 shadow-xl"
    >
      {icon}
    </a>
  );
}

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
      className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col h-full group hover:border-cyan-500/50 transition-all shadow-2xl backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest italic">
          {type}
        </span>
        {isSaaS && (
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold border border-purple-500/30 uppercase">
            SaaS
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-3 uppercase tracking-tighter italic">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow italic">
        {desc}
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 italic font-medium border border-white/5"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="pt-6 border-t border-white/5">
        {isPrivate ? (
          <span className="text-xs text-gray-500 flex items-center gap-2 italic">
            <ShieldCheck size={14} /> Private Repo
          </span>
        ) : (
          <a
            href={link}
            target="_blank"
            className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-cyan-400 transition"
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
      <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg group-hover:text-cyan-400">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest italic font-black">
          {label}
        </p>
        <a
          href={href}
          className="text-lg font-bold hover:text-cyan-400 transition-colors uppercase tracking-tighter italic"
        >
          {value}
        </a>
      </div>
    </div>
  );
}

function ExperienceItem({ title, company, date, points }: any) {
  return (
    <div className="relative pl-8 border-l border-white/10 py-2 group text-left">
      <div className="absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:scale-125 transition-transform" />
      <h3 className="text-2xl font-bold transition-colors group-hover:text-cyan-400 uppercase tracking-tighter italic">
        {title}
      </h3>
      <p className="text-cyan-400 font-bold mb-4 text-[10px] uppercase tracking-[0.2em] italic">
        {company} • {date}
      </p>
      <ul className="space-y-3 text-left">
        {points.map((p: string, i: number) => (
          <li
            key={i}
            className="text-gray-400 text-sm leading-relaxed flex gap-2 italic"
          >
            <ChevronRight
              size={14}
              className="text-cyan-500 mt-1 flex-shrink-0"
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
    <div className="bg-[#0a0a0a]/60 p-8 rounded-[2rem] border border-white/10 hover:border-cyan-500/40 transition-all shadow-xl group relative overflow-hidden text-left">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <GraduationCap className="text-cyan-400" size={28} />
      </div>
      <h3 className="font-bold text-xl uppercase tracking-tighter italic">
        {school}
      </h3>
      <p className="text-cyan-400 text-[10px] uppercase font-black tracking-[0.2em] mb-3 italic">
        {location} • {status}
      </p>
      <p className="text-gray-400 text-sm leading-relaxed italic">{desc}</p>
    </div>
  );
}

function CertificationCard({ title, issuer, date, imgSrc, desc }: any) {
  return (
    <div className="bg-[#0a0a0a]/60 border border-white/10 p-8 rounded-[2rem] hover:border-cyan-500/30 transition-all group shadow-2xl relative overflow-hidden text-left">
      <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
        <div className="flex-1 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="text-cyan-400" size={26} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tighter italic">
              {title}
            </h3>
            <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-black mt-1 italic">
              {issuer} • {date}
            </p>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed italic mb-4">
            {desc}
          </p>
          <a
            href={imgSrc}
            target="_blank"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
          >
            View Document <ExternalLink size={12} />
          </a>
        </div>
        <div className="relative w-full md:w-32 h-40 md:h-32 shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-2">
            <Eye
              size={16}
              className="text-white/50 group-hover:text-cyan-400 transition-colors"
            />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/5 blur-[50px] group-hover:bg-cyan-500/10 transition-all" />
    </div>
  );
}
