import { NextRequest, NextResponse } from "next/server";
import Course from "./courseModel";
import { syncDB } from "../../models/index";
import { withCache, cacheDel, KEYS, TTL } from "../../cache";

function parseCourse(c: Course) {
  return {
    ...c.toJSON(),
    skills: c.skills ? c.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
  };
}

/** GET /api/course  ?featured=true */
export async function getCourses(req: NextRequest) {
  try {
    await syncDB();
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";
    const cacheKey = featuredOnly ? KEYS.courseFeatured : KEYS.course;

    const data = await withCache(cacheKey, TTL.COURSES, async () => {
      const where: any = featuredOnly ? { featured: true } : {};
      const items = await Course.findAll({ where, order: [["order", "ASC"]] });
      return items.map(parseCourse);
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** GET /api/course/[id] */
export async function getCourseById(id: number) {
  try {
    await syncDB();
    const item = await Course.findByPk(id);
    if (!item) return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: parseCourse(item) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** POST /api/course */
export async function createCourse(req: NextRequest) {
  try {
    await syncDB();
    const body = await req.json();
    const data = { ...body, skills: Array.isArray(body.skills) ? body.skills.join(",") : body.skills || "" };
    const item = await Course.create(data);
    await cacheDel(KEYS.course, KEYS.courseFeatured);
    return NextResponse.json({ success: true, message: "Course created", data: parseCourse(item) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** PUT /api/course/[id] */
export async function updateCourse(req: NextRequest, id: number) {
  try {
    await syncDB();
    const item = await Course.findByPk(id);
    if (!item) return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    const body = await req.json();
    const data = { ...body, skills: Array.isArray(body.skills) ? body.skills.join(",") : body.skills };
    await item.update(data);
    await cacheDel(KEYS.course, KEYS.courseFeatured);
    return NextResponse.json({ success: true, message: "Course updated", data: parseCourse(item) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** DELETE /api/course/[id] */
export async function deleteCourse(id: number) {
  try {
    await syncDB();
    const item = await Course.findByPk(id);
    if (!item) return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    await item.destroy();
    await cacheDel(KEYS.course, KEYS.courseFeatured);
    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** POST /api/course/seed */
export async function seedCourses() {
  try {
    await syncDB();
    const count = await Course.count();
    if (count > 0) return NextResponse.json({ success: true, message: "Courses already seeded", count });

    const defaults = [
      {
        title: "Full Stack Web Development Bootcamp",
        issuer: "Udemy",
        category: "web-development" as const,
        completedDate: "Mar 2024",
        credentialUrl: null,
        certificateImage: null,
        description: "Comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, Express and MongoDB. Built 16+ real-world projects.",
        skills: "HTML,CSS,JavaScript,React,Node.js,Express,MongoDB",
        badgeEmoji: "🌐",
        color: "#2563EB",
        order: 1,
        featured: true,
      },
      {
        title: "The Complete SQL Bootcamp",
        issuer: "Udemy",
        category: "database" as const,
        completedDate: "Jan 2025",
        credentialUrl: null,
        certificateImage: null,
        description: "Mastered SQL fundamentals, advanced queries, joins, stored procedures, views and performance optimization.",
        skills: "SQL,PostgreSQL,Query Optimization,Stored Procedures",
        badgeEmoji: "🗄️",
        color: "#7C3AED",
        order: 2,
        featured: true,
      },
      {
        title: "Next.js & React — The Complete Guide",
        issuer: "Udemy",
        category: "web-development" as const,
        completedDate: "Jun 2024",
        credentialUrl: null,
        certificateImage: null,
        description: "Deep dive into Next.js 14 including App Router, Server Components, API Routes, and full-stack deployment.",
        skills: "Next.js,React,TypeScript,App Router,Server Components",
        badgeEmoji: "⚡",
        color: "#18181B",
        order: 3,
        featured: true,
      },
      {
        title: "Full Stack SaaS Development",
        issuer: "Digital Pathshala",
        category: "web-development" as const,
        completedDate: "May 2025",
        credentialUrl: null,
        certificateImage: null,
        description: "Professional training in multi-tenant SaaS architectures, REST API design, and production deployment on cloud platforms.",
        skills: "SaaS Architecture,Multi-tenancy,REST API,Node.js,MySQL",
        badgeEmoji: "📜",
        color: "#16A34A",
        order: 4,
        featured: true,
      },
      {
        title: "Java Programming Masterclass",
        issuer: "Udemy",
        category: "programming" as const,
        completedDate: "Aug 2023",
        credentialUrl: null,
        certificateImage: null,
        description: "Comprehensive Java course covering OOP, data structures, algorithms, and enterprise patterns.",
        skills: "Java,OOP,Data Structures,Algorithms",
        badgeEmoji: "☕",
        color: "#ED8B00",
        order: 5,
        featured: true,
      },
    ];

    await Course.bulkCreate(defaults);
    return NextResponse.json({ success: true, message: "Courses seeded successfully", count: defaults.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
