import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncDB, User, Project, Message, ContactMessage } from "@/lib/models/index";
import ProjectPortfolio from "@/lib/features/project/projectModel";
import Skill from "@/lib/features/skill/skillModel";
import Achievement from "@/lib/features/achievement/achievementModel";
import Course from "@/lib/features/course/courseModel";
import Experience from "@/lib/features/experience/experienceModel";
import sequelize from "@/lib/db";
import { QueryTypes } from "sequelize";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await syncDB();

  // ── Parallel fetch everything ──────────────────────────────
  const [
    skills,
    projects,
    achievements,
    courses,
    experiences,
    contacts,
    totalMessages,
    unreadMessages,
    totalClients,
    pendingClients,
    approvedClients,
  ] = await Promise.all([
    Skill.findAll(),
    ProjectPortfolio.findAll(),
    Achievement.findAll(),
    Course.findAll(),
    Experience.findAll(),
    ContactMessage.findAll({ order: [["createdAt", "ASC"]] }),
    Message.count(),
    Message.count({ where: { isRead: false } }),
    User.count({ where: { role: "client" } }),
    User.count({ where: { role: "client", status: "pending" } }),
    User.count({ where: { role: "client", status: "approved" } }),
  ]);

  // ── Skills by category (pie) ───────────────────────────────
  const skillsByCategory = Object.entries(
    skills.reduce((acc: Record<string, number>, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // ── Avg proficiency per category (bar) ────────────────────
  const profByCategory = Object.entries(
    skills.reduce((acc: Record<string, number[]>, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s.proficiency);
      return acc;
    }, {})
  ).map(([category, profs]) => ({
    category,
    avg: Math.round(profs.reduce((a, b) => a + b, 0) / profs.length),
  }));

  // ── Projects by category (pie) ────────────────────────────
  const projectsByCategory = Object.entries(
    projects.reduce((acc: Record<string, number>, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // ── Projects by status (pie) ──────────────────────────────
  const projectsByStatus = Object.entries(
    projects.reduce((acc: Record<string, number>, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // ── Achievements by type (bar) ────────────────────────────
  const achievementsByType = Object.entries(
    achievements.reduce((acc: Record<string, number>, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ type, count }));

  // ── Courses by category (bar) ─────────────────────────────
  const coursesByCategory = Object.entries(
    courses.reduce((acc: Record<string, number>, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }));

  // ── Contacts over last 12 months (line/area) ──────────────
  const now = new Date();
  const contactsByMonth: { month: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    const count = contacts.filter(c => {
      const cd = new Date(c.createdAt as Date);
      return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
    }).length;
    contactsByMonth.push({ month: label, count });
  }

  // ── Experience breakdown by type (pie) ────────────────────
  const experienceByType = Object.entries(
    experiences.reduce((acc: Record<string, number>, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // ── Portfolio tech stack frequency (top 10 bar) ───────────
  const techFreq: Record<string, number> = {};
  projects.forEach(p => {
    const techs = p.technologies
      ? p.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];
    techs.forEach((t: string) => {
      techFreq[t] = (techFreq[t] || 0) + 1;
    });
  });
  const topTech = Object.entries(techFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tech, count]) => ({ tech, count }));

  // ── Summary counts ────────────────────────────────────────
  const summary = {
    skills:        skills.length,
    projects:      projects.length,
    achievements:  achievements.length,
    courses:       courses.length,
    experiences:   experiences.length,
    contacts:      contacts.length,
    messages:      { total: totalMessages, unread: unreadMessages },
    clients:       { total: totalClients, pending: pendingClients, approved: approvedClients },
    featuredProjects: projects.filter(p => p.isFeatured).length,
    completedProjects: projects.filter(p => p.status === "completed").length,
    certifiedCourses: courses.filter(c => c.certificateImage).length,
  };

  return NextResponse.json({
    success: true,
    data: {
      summary,
      skillsByCategory,
      profByCategory,
      projectsByCategory,
      projectsByStatus,
      achievementsByType,
      coursesByCategory,
      contactsByMonth,
      experienceByType,
      topTech,
    },
  });
}
