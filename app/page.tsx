"use client";

import HeroNetwork from "@/components/HeroNetwork";

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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/15 blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-900/15 blur-[140px]" />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ===== HERO SECTION ===== */}
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center items-center text-center pt-28 pb-16 relative overflow-hidden"
        >
          {/* Spider-web network canvas — desktop only */}
          <div className="hidden lg:block absolute inset-0">
            <HeroNetwork />
          </div>

          {/* Floating tech pill labels — positioned to match canvas nodes */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { label: "Next.js",     color: "#FFFFFF", left: "6%",  top: "20%" },
              { label: "Node.js",     color: "#339933", left: "86%", top: "16%" },
              { label: "TypeScript",  color: "#3178C6", left: "4%",  top: "57%" },
              { label: "MySQL",       color: "#4479A1", left: "88%", top: "55%" },
              { label: "React",       color: "#61DAFB", left: "80%", top: "79%" },
              { label: "Spring Boot", color: "#6DB33F", left: "10%", top: "79%" },
            ].map((pill, i) => (
              <motion.div
                key={pill.label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.4, type: "spring" }}
                style={{ left: pill.left, top: pill.top, borderColor: `${pill.color}30`, color: pill.color }}
                className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a0a0a]/80 backdrop-blur border text-[10px] font-bold uppercase tracking-widest"
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: pill.color }} />
                {pill.label}
              </motion.div>
            ))}
          </div>

          {/* Main content — z-10 so it's above canvas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 space-y-8 max-w-3xl"
          >
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-cyan-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Full Stack Developer • SaaS Specialist
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase"
            >
              <span className="block">Yugesh</span>
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Bastola
              </span>
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-20 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full"
            />

            {/* Description */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="space-y-3">
              <p className="max-w-lg mx-auto text-gray-300 text-lg leading-relaxed">
                Architecting{" "}
                <span className="text-white font-bold">Multi-tenant SaaS solutions</span>{" "}
                and high-availability systems using Next.js, Node.js and SQL architectures.
              </p>
              <p className="max-w-lg mx-auto text-gray-500 text-sm leading-relaxed italic">
                Self-taught in <span className="text-white font-medium">Core Java</span>{" "}
                and advancing into Enterprise Backend with the Spring Boot ecosystem.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <a
                href="/yugesh_resume.pdf"
                target="_blank"
                className="group relative bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 text-sm uppercase tracking-widest overflow-hidden hover:shadow-purple-500/50 transition-shadow"
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                View Resume <ExternalLink size={16} />
              </a>
              <a
                href="#contact"
                className="px-8 py-3.5 rounded-full font-bold border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 transition-all text-sm uppercase tracking-widest flex items-center gap-2"
              >
                Hire Me <ChevronRight size={16} />
              </a>
              <div className="flex gap-3 items-center">
                <a href="https://github.com/Yugesh428" target="_blank" className="p-3 rounded-full border border-white/10 bg-white/5 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all">
                  <Github size={19} />
                </a>
                <a href="https://www.linkedin.com/in/yugesh-bastola-315638317/" target="_blank" className="p-3 rounded-full border border-white/10 bg-white/5 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all">
                  <Linkedin size={19} />
                </a>
                <a href="mailto:bastolayugesh2@gmail.com" className="p-3 rounded-full border border-white/10 bg-white/5 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all">
                  <Mail size={19} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ===== ABOUT ME ===== */}
        <section
          id="about"
          className="py-24 grid lg:grid-cols-2 gap-16 items-center border-t border-white/5"
        >
          {/* Image Side */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative group max-w-md mx-auto">
              {/* Animated gradient border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-700" />

              {/* Image container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-square">
                <Image
                  src="/image.png"
                  alt="Yugesh Bastola"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                {/* bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Name tag bottom */}
                <div className="absolute bottom-16 left-5 right-5">
                  <div className="bg-black/60 backdrop-blur border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white font-black text-sm uppercase tracking-widest">Yugesh Bastola</p>
                      <p className="text-cyan-400 text-[10px] uppercase tracking-[0.2em] font-bold">Full Stack Developer</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[9px] text-green-400 uppercase tracking-widest font-bold">Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4, type: "spring" }}
                className="absolute -top-4 -right-4 bg-[#0a0a0a] border border-purple-500/30 rounded-2xl px-4 py-2.5 shadow-xl shadow-purple-500/10 hidden sm:block"
              >
                <p className="text-purple-400 font-black text-lg tracking-tighter">6+</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-black">Projects</p>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
                className="absolute -bottom-4 -left-4 bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl px-4 py-2.5 shadow-xl shadow-cyan-500/10 z-20 hidden sm:block"
              >
                <p className="text-cyan-400 font-black text-lg tracking-tighter">7+</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-black">Certifications</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8 text-left"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black mb-3 block">Who I Am</span>
              <h2 className="text-4xl font-bold italic uppercase tracking-tighter">
                About <span className="text-cyan-400">Me:</span>
              </h2>
            </div>

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

            {/* Traits */}
            <div className="flex flex-wrap gap-2">
              {["Problem Solver", "SaaS Architecture", "Clean Code", "Self-taught Java", "API Design"].map((trait) => (
                <span key={trait} className="text-[10px] px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 uppercase tracking-widest font-bold hover:border-cyan-500/30 hover:text-cyan-400 transition-all cursor-default">
                  {trait}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl hover:border-cyan-500/30 transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-cyan-400 font-black text-3xl tracking-tighter">2+</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">Years TypeScript</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl hover:border-purple-500/30 transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-purple-400 font-black text-3xl tracking-tighter">1+</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mt-1">Year Experience</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ===== SKILLS ===== */}
        <section id="skills" className="py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 italic uppercase tracking-tighter">
            <span className="w-12 h-[3px] bg-cyan-500 rounded-full"></span>{" "}
            SKILLS & <span className="text-cyan-500">Arsenal:</span>
          </h2>
          <p className="text-gray-500 text-sm italic mb-12">Technologies I build with daily — rated by confidence and production usage.</p>

          {/* Skill Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <SkillCard name="TypeScript" level={80} Icon={SiTypescript} color="#3178C6" />
            <SkillCard name="Next.js" level={90} Icon={SiNextdotjs} color="#FFFFFF" />
            <SkillCard name="Node.js" level={85} Icon={SiNodedotjs} color="#339933" />
            <SkillCard name="MySQL/MSSQL" level={80} Icon={SiMysql} color="#4479A1" />
            <SkillCard name="React" level={75} Icon={SiReact} color="#61DAFB" />
            <SkillCard name="Java" level={60} Icon={FaJava} color="#ED8B00" />
          </div>

          {/* Detailed bars */}
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md shadow-2xl">
            <div className="space-y-7">
              <SkillBar name="TypeScript" level={80} Icon={SiTypescript} color="#3178C6" />
              <SkillBar name="Next.js" level={90} Icon={SiNextdotjs} color="#FFFFFF" />
              <SkillBar name="Node.js" level={85} Icon={SiNodedotjs} color="#339933" />
            </div>
            <div className="space-y-7">
              <SkillBar name="MySQL / MSSQL" level={80} Icon={SiMysql} color="#4479A1" />
              <SkillBar name="React" level={75} Icon={SiReact} color="#61DAFB" />
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
              imgSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
            />
            <ProjectCard
              title="Clinic Management"
              type="Healthcare SaaS"
              desc="Private enterprise solution for clinic chains managing patient records and scheduling with secure RBAC."
              tags={["React", "Express", "Security"]}
              isPrivate={true}
              isSaaS={true}
              imgSrc="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80"
            />
            <ProjectCard
              title="Staffing Management"
              type="Enterprise SaaS"
              desc="Built for staffing workflows at Aqore. Manages recruitment life-cycles and client segregation using MSSQL."
              tags={["Next.js", "MSSQL", "Enterprise"]}
              isPrivate={true}
              isSaaS={true}
              imgSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
            />
            <ProjectCard
              title="Room Management"
              type="Hospitality Engine"
              desc="Automated booking engine that optimizes room allocation and real-time availability using Node.js logic."
              tags={["Node.js", "React", "MySQL"]}
              link="https://github.com/Yugesh428/RoomManagementSystem"
              imgSrc="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"
            />
            <ProjectCard
              title="Blog CMS"
              type="Infrastructure"
              desc="A high-performance CMS featuring a custom-built RBAC engine and optimized delivery pipelines."
              tags={["JavaScript", "CRUD", "CMS"]}
              link="https://github.com/Yugesh428/Blog_Management"
              imgSrc="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80"
            />
            <ProjectCard
              title="Shoes Store API"
              type="E-commerce API"
              desc="RESTful API engineered for transactions. Features complex inventory logic and verified via Postman."
              tags={["Node.js", "Postman", "Security"]}
              link="https://github.com/Yugesh428/shoes-/tree/main/src"
              imgSrc="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
            />
          </div>
        </section>

        {/* ===== CURRENTLY BUILDING ===== */}
        <section className="py-24 border-t border-white/5">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-12 h-[3px] bg-green-500 rounded-full" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-green-400 font-black">Live & In Progress</span>
            </div>
            <h2 className="text-4xl font-bold italic uppercase tracking-tighter">
              Currently <span className="text-green-400">Building:</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm italic">
              Active projects I'm working on right now during my remote internship at{" "}
              <span className="text-white font-semibold">Digital Pathshala</span>.
            </p>
          </div>

          {/* Internship banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-4 p-5 rounded-2xl border border-green-500/20 bg-green-500/5"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 text-lg">
              💻
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight">Remote Internship — Digital Pathshala</p>
              <p className="text-[10px] text-green-400 uppercase tracking-widest font-bold mt-0.5">● Active · 2025 — Present</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-black uppercase tracking-widest">In Progress</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <CurrentProjectCard
              title="Bidyalaa"
              type="EdTech Platform"
              desc="A comprehensive educational SaaS platform connecting students and institutions with course management, progress tracking, and interactive learning modules."
              tags={["Next.js", "Node.js", "MySQL", "SaaS"]}
              imgSrc="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80"
              status="Building"
              accent="#06b6d4"
            />
            <CurrentProjectCard
              title="Hospital Management"
              type="Healthcare System"
              desc="Enterprise-grade hospital management system covering patient records, appointment scheduling, billing, and department management with secure role-based access."
              tags={["React", "Node.js", "MSSQL", "RBAC"]}
              imgSrc="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80"
              status="Building"
              accent="#a855f7"
            />
            <CurrentProjectCard
              title="Tourism Management"
              type="Travel Platform"
              desc="A full-featured tourism platform for managing travel packages, bookings, tour guides, and destinations with real-time availability and payment integration."
              tags={["Next.js", "Express", "MySQL"]}
              imgSrc="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"
              status="Building"
              accent="#f59e0b"
            />
          </div>
        </section>

        {/* ===== EXPERIENCE & EDUCATION ===== */}
        <section
          id="experience"
          className="py-24 border-t border-white/5 text-left"
        >
          <div className="grid md:grid-cols-2 gap-16">
            {/* Experience */}
            <div>
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 italic uppercase tracking-tighter">
                <span className="w-12 h-[3px] bg-blue-500 rounded-full"></span>
                Experience:
              </h2>
              <div className="space-y-6">
                <ExperienceItem
                  title="Full Stack Developer"
                  company="Freelance & Enterprise Projects"
                  date="2024 - PRESENT"
                  color="#06b6d4"
                  icon="💻"
                  points={[
                    "Architecting multitenant SaaS platforms.",
                    "Implementing secure RESTful APIs.",
                    "Optimizing Next.js performance.",
                  ]}
                />
                <ExperienceItem
                  title="Remote Intern — Full Stack"
                  company="Digital Pathshala"
                  date="2025 - PRESENT"
                  color="#22c55e"
                  icon="🌐"
                  points={[
                    "Building Bidyalaa EdTech SaaS platform.",
                    "Developing Hospital Management System.",
                    "Working on Tourism Management platform.",
                  ]}
                />
                <ExperienceItem
                  title="Database Intern"
                  company="Aqore Software Pvt. Ltd."
                  date="6 MONTHS"
                  color="#a855f7"
                  icon="🏢"
                  points={[
                    "Supported enterprise system architecture.",
                    "Authored complex SQL stored procedures.",
                    "Database schema optimization.",
                  ]}
                />
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 italic uppercase tracking-tighter">
                <span className="w-12 h-[3px] bg-cyan-500 rounded-full"></span>
                Education:
              </h2>
              <div className="space-y-5">
                <EducationCard
                  school="TechSpire College"
                  location="Kathmandu"
                  status="Ongoing"
                  desc="Specializing in Digital Technology and Full Stack architecture."
                  year="2023 — Present"
                />
                <EducationCard
                  school="Digital Pathshala"
                  location="Kathmandu"
                  status="Certification"
                  desc="Professional training in Modern Web Stacks and SaaS design."
                  year="2025"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== CERTIFICATIONS & BADGES ===== */}
        <section id="certifications" className="py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 italic uppercase tracking-tighter">
            <span className="w-12 h-[3px] bg-cyan-500 rounded-full"></span>
            Certifications <span className="text-cyan-500">& Badges:</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <CertificationCard
              title="Relay Hack x Tumlet Runner-Up"
              issuer="TechSpire x Tumlet"
              date="NOV 2025"
              imgSrc="/RelayTumlet.jpg"
              desc="Secured First Runner-Up in a hackathon focused on game design and creative innovation."
              accent="from-yellow-500/20 to-orange-500/10"
              badge="🏆 Runner-Up"
            />
            <CertificationCard
              title="Full Stack SaaS Development"
              issuer="Digital Pathshala"
              date="JAN 2025 - MAY 2025"
              imgSrc="/FullStackSaas.jpg"
              desc="Professional training in building multi-tenant architectures and modern web stacks."
              accent="from-cyan-500/20 to-blue-500/10"
              badge="🎓 Course"
            />
            <CertificationCard
              title="MERN Stack Development"
              issuer="Digital Pathshala"
              date="MARCH 2025"
              imgSrc="/MernFullStackDigitalPatsala.jpg"
              desc="Comprehensive completion of MongoDB, Express, React, and Node.js specialization."
              accent="from-green-500/20 to-cyan-500/10"
              badge="🎓 Course"
            />
            <CertificationCard
              title="Database Internship"
              issuer="Aqore Software Pvt. Ltd."
              date="DEC 2025 - FEB 2026"
              imgSrc="/AqoreInternship.jpg"
              desc="Hands-on experience in MSSQL, stored procedures, and enterprise data modeling."
              accent="from-blue-500/20 to-purple-500/10"
              badge="💼 Internship"
            />
            <CertificationCard
              title="Relay Hack Runner-Up"
              issuer="Aqore x TechSpire"
              date="DECEMBER 2025"
              imgSrc="/RelayHackAqore.jpg"
              desc="Recognized for outstanding creativity and problem-solving in a 10-day Aqore hackathon."
              accent="from-purple-500/20 to-pink-500/10"
              badge="🏆 Runner-Up"
            />
            <CertificationCard
              title="JunctionX Kathmandu — Participation"
              issuer="SUMS Nepal x COGKNIT"
              date="MAY 2026"
              imgSrc="/JunctionXNepal.jpg"
              desc="Participated as a Hacker at JunctionX Kathmandu, a 30-hour international hackathon under Team Finland."
              accent="from-orange-500/20 to-yellow-500/10"
              badge="🌍 International"
            />
            <CertificationCard
              title="Basics of .NET"
              issuer="TechSpire College x APU"
              date="2025"
              imgSrc="/dotnet.jpg"
              desc="Completed a 45-hour Skill Development Program in Basics of .NET at TechSpire College, in academic collaboration with Asia Pacific University."
              accent="from-indigo-500/20 to-cyan-500/10"
              badge="🎓 Course"
            />
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="py-24 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#050505] to-cyan-900/20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-0">
              {/* Left info panel */}
              <div className="p-10 md:p-14 space-y-10 border-b lg:border-b-0 lg:border-r border-white/5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-black mb-3 block">Get in Touch</span>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                    Let's <span className="text-cyan-400">Work</span><br />Together
                  </h2>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-xs">
                    Have a project in mind? I'm open to freelance work, collaborations, and full-time opportunities.
                  </p>
                </div>

                {/* Contact details */}
                <div className="space-y-4">
                  {[
                    { icon: <Phone size={18} />, label: "Phone", value: "+977-9812124264", href: "tel:+9779812124264", color: "#06b6d4" },
                    { icon: <Mail size={18} />, label: "Email", value: "bastolayugesh2@gmail.com", href: "mailto:bastolayugesh2@gmail.com", color: "#a855f7" },
                    { icon: <MapPin size={18} />, label: "Location", value: "Kathmandu, Nepal", href: "#", color: "#3b82f6" },
                  ].map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/5 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${item.color}15`, color: item.color, border: `1px solid ${item.color}25` }}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.25em] font-black mb-0.5" style={{ color: item.color }}>{item.label}</p>
                        <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Socials */}
                <div className="flex gap-3 pt-2">
                  <a href="https://github.com/Yugesh428" target="_blank"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-purple-400 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all">
                    <Github size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/yugesh-bastola-315638317/" target="_blank"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>

              {/* Right form panel */}
              <div className="p-10 md:p-14">
                <h3 className="text-lg font-black uppercase tracking-widest mb-8 text-gray-300">Send a Message</h3>
                <form action="https://formspree.io/f/xnjgyygy" method="POST" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">Full Name</label>
                      <input
                        name="name" type="text" placeholder="Yugesh Bastola" required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/60 focus:bg-white/[0.07] outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">Email</label>
                      <input
                        name="email" type="email" placeholder="you@example.com" required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/60 focus:bg-white/[0.07] outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">Subject</label>
                    <input
                      name="subject" type="text" placeholder="Project inquiry, collaboration..." required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/60 focus:bg-white/[0.07] outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">Message</label>
                    <textarea
                      name="message" placeholder="Tell me about your project..." required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-36 text-sm focus:border-cyan-500/60 focus:bg-white/[0.07] outline-none transition-all resize-none placeholder:text-gray-600"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 py-4 rounded-xl font-black flex justify-center items-center gap-2 shadow-xl shadow-purple-500/20 uppercase tracking-widest text-sm hover:shadow-purple-500/40 transition-shadow"
                  >
                    Send Message <Send size={16} />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="w-full border-t border-white/5 pt-20 pb-10 text-left relative overflow-hidden">
          {/* bg glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[40%] h-40 bg-cyan-900/10 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* Brand col */}
            <div className="md:col-span-5 space-y-6">
              <a href="#home" className="inline-block">
                <h3 className="text-3xl font-black tracking-tighter uppercase">
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Yugesh
                  </span>
                  <span className="text-white">.dev</span>
                </h3>
              </a>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Building high-performance multi-tenant SaaS applications and secure enterprise-grade digital solutions.
              </p>
              {/* socials */}
              <div className="flex gap-3 pt-1">
                {[
                  { href: "https://github.com/Yugesh428", icon: <Github size={17} />, color: "hover:text-purple-400 hover:border-purple-500/40 hover:bg-purple-500/10" },
                  { href: "https://www.linkedin.com/in/yugesh-bastola-315638317/", icon: <Linkedin size={17} />, color: "hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10" },
                  { href: "mailto:bastolayugesh2@gmail.com", icon: <Mail size={17} />, color: "hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10" },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank"
                    className={`p-2.5 rounded-xl bg-white/5 border border-white/10 transition-all ${s.color}`}>
                    {s.icon}
                  </a>
                ))}
              </div>
              {/* available badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Available for work
              </div>
            </div>

            {/* Nav links */}
            <div className="md:col-span-3 md:col-start-7">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-600 mb-6">Navigate</p>
              <ul className="space-y-3">
                {[
                  { href: "#about", label: "About" },
                  { href: "#skills", label: "Skills" },
                  { href: "#projects", label: "Projects" },
                  { href: "#experience", label: "Experience" },
                  { href: "#certifications", label: "Certifications" },
                  { href: "#contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2 group font-medium">
                      <span className="w-0 group-hover:w-4 h-[1px] bg-cyan-400 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div className="md:col-span-3">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-600 mb-6">Contact</p>
              <div className="space-y-4">
                <a href="tel:+9779812124264"
                  className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone size={13} className="text-cyan-400" />
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-white transition-colors">+977-9812124264</span>
                </a>
                <a href="mailto:bastolayugesh2@gmail.com"
                  className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={13} className="text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-white transition-colors break-all">bastolayugesh2@gmail.com</span>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={13} className="text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-500">Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
              © {new Date().getFullYear()} Yugesh Bastola — All rights reserved
            </p>
            <div className="flex items-center gap-3">
              {["Next.js", "Node.js", "TypeScript", "MySQL"].map((tech, i) => (
                <span key={tech} className="text-[9px] text-gray-700 uppercase tracking-widest font-black flex items-center gap-3">
                  {tech}
                  {i < 3 && <span className="w-1 h-1 rounded-full bg-white/10" />}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* HELPER COMPONENTS */

function CurrentProjectCard({ title, type, desc, tags, imgSrc, status, accent }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col hover:border-white/20 transition-all duration-300"
      style={{ "--accent": accent } as any}
    >
      {/* image */}
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent" />

        {/* status badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-green-400">{status}</span>
        </div>

        {/* type */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10" style={{ color: accent }}>
            {type}
          </span>
        </div>
      </div>

      {/* content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-white transition-colors" style={{ color: accent }}>
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-5">{desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag: string) => (
            <span key={tag} className="text-[9px] px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-500 font-bold uppercase tracking-wide group-hover:border-white/10 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* bottom accent line */}
      <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-b-full" style={{ backgroundColor: accent }} />
    </motion.div>
  );
}

function SkillCard({ name, level, Icon, color }: any) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col items-center gap-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-300 shadow-xl"
    >
      {/* SVG Ring */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 70 70">
          {/* background ring */}
          <circle cx="35" cy="35" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="none" />
          {/* animated progress ring */}
          <motion.circle
            cx="35" cy="35" r={radius}
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "circOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        {/* Icon center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={22} style={{ color }} />
        </div>
      </div>

      {/* Name & level */}
      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">{name}</p>
        <p className="text-xs font-bold mt-0.5" style={{ color }}>{level}%</p>
      </div>
    </motion.div>
  );
}

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
  imgSrc,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 border border-white/10 rounded-[2rem] flex flex-col h-full group hover:border-cyan-500/50 transition-all shadow-2xl backdrop-blur-sm overflow-hidden"
    >
      {/* Image Banner */}
      {imgSrc && (
        <div className="relative w-full h-44 overflow-hidden">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-[#0d0d0d]" />
          {/* floating type badge on image */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest italic bg-black/60 backdrop-blur px-2 py-1 rounded-full border border-cyan-500/30">
              {type}
            </span>
            {isSaaS && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[9px] font-bold border border-purple-500/40 uppercase backdrop-blur">
                SaaS
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-8 flex flex-col flex-grow">
        {/* type badge when no image */}
        {!imgSrc && (
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
        )}

        <h3 className="text-2xl font-bold mb-3 uppercase tracking-tighter italic group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow italic">
          {desc}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 italic font-medium border border-white/5 group-hover:border-cyan-500/20 transition-colors"
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
              className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-cyan-400 transition group/link"
            >
              View Source
              <Github size={14} className="group-hover/link:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
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

function ExperienceItem({ title, company, date, points, color, icon }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white/[0.03] border border-white/10 rounded-3xl p-7 hover:border-white/20 transition-all duration-300 shadow-xl overflow-hidden"
    >
      {/* top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      {/* header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border border-white/10" style={{ backgroundColor: `${color}15` }}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-white transition-colors" style={{ color }}>
              {title}
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-0.5">
              {company}
            </p>
          </div>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border flex-shrink-0 mt-1"
          style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
          {date}
        </span>
      </div>

      {/* points */}
      <ul className="space-y-2.5 pl-1">
        {points.map((p: string, i: number) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="text-gray-400 text-sm leading-relaxed flex gap-3 items-start"
          >
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
            {p}
          </motion.li>
        ))}
      </ul>

      {/* bg glow */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: `${color}20` }} />
    </motion.div>
  );
}

function EducationCard({ school, location, status, desc, year }: any) {
  const isOngoing = status === "Ongoing";
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -3 }}
      className="group bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all duration-300 shadow-xl relative overflow-hidden flex gap-5 items-start"
    >
      {/* icon */}
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        <GraduationCap className="text-cyan-400" size={22} />
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-black text-base uppercase tracking-tighter group-hover:text-white transition-colors">
            {school}
          </h3>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0 ${
            isOngoing
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          }`}>
            {isOngoing ? "● Ongoing" : status}
          </span>
        </div>
        <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-black mb-2">
          {location} {year && `• ${year}`}
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* bg glow */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-cyan-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

function CertificationCard({ title, issuer, date, imgSrc, desc, accent, badge }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col"
    >
      {/* Image top section */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        {/* gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

        {/* badge top-right */}
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white tracking-widest uppercase">
            {badge}
          </span>
        </div>

        {/* eye icon center on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 backdrop-blur border border-cyan-500/40 flex items-center justify-center">
            <Eye size={18} className="text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tighter italic leading-tight mb-1">
          {title}
        </h3>
        <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-black italic mb-3">
          {issuer} • {date}
        </p>
        <p className="text-gray-500 text-xs leading-relaxed italic flex-grow mb-4">
          {desc}
        </p>
        <a
          href={imgSrc}
          target="_blank"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:text-cyan-400 transition-colors group/link"
        >
          View Document
          <ExternalLink size={11} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* bottom glow */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </motion.div>
  );
}
