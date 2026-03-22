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
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent text-wrap">
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
                <span className="text-white">Enterprise Backend</span>{" "}
                development with Java and the Spring Boot ecosystem.
              </p>
            </div>

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
                  className="object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold italic">
              About <span className="text-purple-400">Me:</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Passionate Full Stack Developer with professional internship
              experience at{" "}
              <span className="text-white font-semibold">
                Aqore Software Pvt. Ltd.
              </span>{" "}
              Specialized in database schema design and{" "}
              <span className="text-blue-400 font-medium italic underline underline-offset-4">
                Multi-tenant SaaS architecture
              </span>
              . I focus on building secure, scalable backends that power
              intuitive user experiences.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                <h4 className="text-blue-400 font-bold text-2xl">2+ Year</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  TypeScript Proficiency
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
                <h4 className="text-purple-400 font-bold text-2xl">1+ Year</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  Practical Experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SKILLS ===== */}
        <section id="skills" className="py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 italic">
            <span className="w-10 h-1 bg-purple-500 rounded-full"></span> SKILLS
            & <span className="text-purple-400 uppercase">Arsenal:</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md">
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
                name="MySQL / SQL"
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
            <h2 className="text-4xl font-bold italic">
              Featured <span className="text-blue-400">Projects:</span>
            </h2>
            <p className="text-gray-500 mt-2 italic text-sm font-medium">
              Engineered for high-throughput scalability, security, and
              multi-tenant isolation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              title="Institute SAAS"
              type="Multi-tenant SaaS"
              desc="A scalable educational ecosystem allowing multiple institutes to manage students and staff independently. Features strict data isolation, custom subdomains, and an optimized MySQL backend."
              tags={["Next.js", "Node.js", "MySQL", "SaaS"]}
              link="https://github.com/Yugesh428/InstituteSAAS"
              isSaaS={true}
            />
            <ProjectCard
              title="Clinic Management"
              type="Healthcare SaaS/Private"
              desc="Private enterprise solution for clinic chains. Orchestrates patient records and appointment scheduling with a focus on high-security data segregation and role-based access control."
              tags={["React", "Express", "Security"]}
              isPrivate={true}
              isSaaS={true}
            />
            <ProjectCard
              title="Staffing Management"
              type="Enterprise SaaS/Private"
              desc="Built for staffing workflows during an Aqore hackathon. Manages recruitment life-cycles and client multitenancy using MSSQL, ensuring high-throughput data processing."
              tags={["Next.js", "MSSQL", "Enterprise"]}
              isPrivate={true}
              isSaaS={true}
            />
            <ProjectCard
              title="Room Management"
              type="Hospitality Engine"
              desc="Automated booking engine that optimizes room allocation and real-time availability. Built to handle race conditions during peak booking hours using Node.js."
              tags={["Node.js", "React", "MySQL"]}
              link="https://github.com/Yugesh428/RoomManagementSystem"
            />
            <ProjectCard
              title="Blog CMS"
              type="Backend Infrastructure"
              desc="A high-performance Content Management System featuring a custom-built Role Based Access Control (RBAC) engine and optimized content delivery pipelines."
              tags={["JavaScript", "CRUD", "CMS"]}
              link="https://github.com/Yugesh428/Blog_Management"
            />
            <ProjectCard
              title="Shoes Store API"
              type="E-commerce Backend"
              desc="RESTful API engineered for high-volume transactions. Features complex inventory tracking logic and was rigorously tested using Postman for 99.9% reliability."
              tags={["Node.js", "Postman", "Security"]}
              link="https://github.com/Yugesh428/shoes-/tree/main/src"
            />
          </div>
        </section>

        {/* ===== EXPERIENCE & EDUCATION ===== */}
        <section
          id="experience"
          className="py-24 border-t border-white/5 grid md:grid-cols-2 gap-16"
        >
          <div>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 italic">
              <span className="w-10 h-1 bg-blue-500 rounded-full"></span>{" "}
              EXPERIENCE:
            </h2>
            <div className="space-y-12">
              <ExperienceItem
                title="Full Stack Developer"
                company="Freelance & Enterprise Projects"
                date="2024 - Present"
                points={[
                  "Architecting multitenant SaaS platforms with data isolation.",
                  "Implementing secure RESTful APIs verified via Postman.",
                  "Optimizing frontend performance for Next.js applications.",
                ]}
              />
              <ExperienceItem
                title="Database Intern"
                company="Aqore Software Pvt. Ltd."
                date="6 Months"
                points={[
                  "Supported enterprise system architecture and maintenance.",
                  "Authored complex SQL stored procedures and queries.",
                  "Collaborated on database schema optimization for large datasets.",
                ]}
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 italic">
              <span className="w-10 h-1 bg-cyan-500 rounded-full"></span>{" "}
              EDUCATION:
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

        {/* ===== CONTACT ===== */}
        <section id="contact" className="py-24 border-t border-white/5">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
            <div className="grid lg:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-8 text-left">
                <h2 className="text-5xl font-bold italic">
                  Contact{" "}
                  <span className="text-blue-400 font-black tracking-tighter">
                    Me:
                  </span>
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
                  <div className="flex items-center gap-4 text-gray-500 italic font-medium">
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
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none transition"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:border-purple-500 outline-none transition"
                />
                <textarea
                  name="message"
                  placeholder="Describe your project goals..."
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 h-32 focus:border-purple-500 outline-none transition"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition hover:opacity-90 active:scale-95 shadow-xl shadow-purple-500/10"
                >
                  Send Message <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ===== PROFESSIONAL FOOTER ===== */}
        <footer className="w-full border-t border-white/5 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-12 text-left">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-black tracking-tighter uppercase">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
                Explore
              </h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition flex items-center gap-2 group italic font-medium"
                  >
                    <ChevronRight
                      size={12}
                      className="text-purple-500 opacity-0 group-hover:opacity-100 transition-all"
                    />{" "}
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#skills"
                    className="hover:text-white transition flex items-center gap-2 group italic font-medium"
                  >
                    <ChevronRight
                      size={12}
                      className="text-purple-500 opacity-0 group-hover:opacity-100 transition-all"
                    />{" "}
                    Skills
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="hover:text-white transition flex items-center gap-2 group italic font-medium"
                  >
                    <ChevronRight
                      size={12}
                      className="text-purple-500 opacity-0 group-hover:opacity-100 transition-all"
                    />{" "}
                    Projects
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
                Contact
              </h4>
              <div className="space-y-4 text-sm font-medium">
                <p className="text-gray-400">Kathmandu, Nepal</p>
                <a
                  href="mailto:bastolayugesh2@gmail.com"
                  className="block text-blue-400 hover:text-blue-300 transition-colors"
                >
                  bastolayugesh2@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
              © {new Date().getFullYear()} Yugesh Bastola • Digital Craftsman
            </p>
            <div className="flex gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black">
              <span>Next.js</span> <span>Node.js</span> <span>Java</span>
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
      className="p-3 rounded-full bg-white/5 border border-white/10 hover:text-white hover:border-purple-500/50 transition-all duration-300"
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
      className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col h-full group hover:border-purple-500/50 transition-all shadow-2xl backdrop-blur-sm"
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
            className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 italic font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="pt-6 border-t border-white/5">
        {isPrivate ? (
          <span className="text-xs text-gray-500 flex items-center gap-2 italic">
            <ShieldCheck size={14} /> Enterprise Protected
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
      <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 shadow-lg">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest italic font-bold">
          {label}
        </p>
        <a
          href={href}
          className="text-lg font-bold hover:text-purple-400 transition-colors"
        >
          {value}
        </a>
      </div>
    </div>
  );
}

function ExperienceItem({ title, company, date, points }: any) {
  return (
    <div className="relative pl-8 border-l border-white/10 py-2 group">
      <div className="absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform" />
      <h3 className="text-2xl font-bold transition-colors group-hover:text-blue-400">
        {title}
      </h3>
      <p className="text-blue-400 font-bold mb-4 text-sm uppercase tracking-wider">
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
    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all shadow-xl group">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <GraduationCap className="text-cyan-400" size={28} />
      </div>
      <h3 className="font-bold text-lg">{school}</h3>
      <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-3 italic">
        {location} • {status}
      </p>
      <p className="text-gray-400 text-sm leading-relaxed italic">{desc}</p>
    </div>
  );
}
