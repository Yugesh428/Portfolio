import { NextRequest, NextResponse } from "next/server";
import Experience from "./experienceModel";
import { syncDB } from "../../models/index";
import { withCache, cacheDel, KEYS, TTL } from "../../cache";

/* ── helpers ── */
function parseExperience(exp: Experience) {
  return {
    ...exp.toJSON(),
    points:    JSON.parse(exp.points   || "[]"),
    techStack: exp.techStack ? exp.techStack.split(",").map(t => t.trim()).filter(Boolean) : [],
  };
}

/**
 * GET /api/experience
 */
export async function getExperiences(req: NextRequest) {
  try {
    await syncDB();

    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";
    const cacheKey = featuredOnly ? KEYS.experienceFeatured : KEYS.experience;

    const data = await withCache(cacheKey, TTL.EXPERIENCE, async () => {
      const where: any = featuredOnly ? { featured: true } : {};
      const experiences = await Experience.findAll({ where, order: [["order", "ASC"]] });
      return experiences.map(parseExperience);
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error: any) {
    console.error("[getExperiences Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/experience/[id]
 */
export async function getExperienceById(id: number) {
  try {
    await syncDB();
    const experience = await Experience.findByPk(id);
    if (!experience) return NextResponse.json({ success: false, error: "Experience not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: parseExperience(experience) });
  } catch (error: any) {
    console.error("[getExperienceById Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/experience
 */
export async function createExperience(req: NextRequest) {
  try {
    await syncDB();
    const body = await req.json();
    const data = {
      ...body,
      points:    Array.isArray(body.points)    ? JSON.stringify(body.points) : body.points    || "[]",
      techStack: Array.isArray(body.techStack) ? body.techStack.join(",")   : body.techStack || "",
    };
    const experience = await Experience.create(data);
    await cacheDel(KEYS.experience, KEYS.experienceFeatured);
    return NextResponse.json({ success: true, message: "Experience created successfully", data: parseExperience(experience) }, { status: 201 });
  } catch (error: any) {
    console.error("[createExperience Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/experience/[id]
 */
export async function updateExperience(req: NextRequest, id: number) {
  try {
    await syncDB();
    const experience = await Experience.findByPk(id);
    if (!experience) return NextResponse.json({ success: false, error: "Experience not found" }, { status: 404 });
    const body = await req.json();
    const data = {
      ...body,
      points:    Array.isArray(body.points)    ? JSON.stringify(body.points) : body.points,
      techStack: Array.isArray(body.techStack) ? body.techStack.join(",")   : body.techStack,
    };
    await experience.update(data);
    await cacheDel(KEYS.experience, KEYS.experienceFeatured);
    return NextResponse.json({ success: true, message: "Experience updated successfully", data: parseExperience(experience) });
  } catch (error: any) {
    console.error("[updateExperience Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/experience/[id]
 */
export async function deleteExperience(id: number) {
  try {
    await syncDB();
    const experience = await Experience.findByPk(id);
    if (!experience) return NextResponse.json({ success: false, error: "Experience not found" }, { status: 404 });
    await experience.destroy();
    await cacheDel(KEYS.experience, KEYS.experienceFeatured);
    return NextResponse.json({ success: true, message: "Experience deleted successfully" });
  } catch (error: any) {
    console.error("[deleteExperience Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/experience/seed
 * Seeds default experiences
 */
export async function seedExperiences() {
  try {
    await syncDB();

    const count = await Experience.count();
    if (count > 0) {
      return NextResponse.json({ success: true, message: "Experiences already seeded", count });
    }

    const defaults = [
      {
        title: "Full Stack Developer",
        company: "Freelance & Enterprise Projects",
        location: "Kathmandu, Nepal",
        type: "freelance" as const,
        startDate: "Jan 2024",
        endDate: "Present",
        isCurrent: true,
        description: "Building scalable multi-tenant SaaS web applications for clients across Nepal and internationally.",
        points: JSON.stringify([
          "Building scalable multi-tenant SaaS web applications.",
          "REST API development with Node.js and Express.",
          "Optimizing Next.js and React frontend performance.",
          "Database design and optimization with MySQL and PostgreSQL.",
        ]),
        techStack: "Next.js,Node.js,React,TypeScript,MySQL,PostgreSQL",
        companyLogo: null,
        companyUrl: null,
        certificateImage: null,
        order: 1,
        featured: true,
      },
      {
        title: "Remote Intern — Full Stack Developer",
        company: "Digital Pathshala",
        location: "Kathmandu, Nepal (Remote)",
        type: "internship" as const,
        startDate: "Jan 2025",
        endDate: "Present",
        isCurrent: true,
        description: "Full stack development of EdTech, Healthcare, and Tourism SaaS platforms under direct mentorship.",
        points: JSON.stringify([
          "Full stack development of Bidyalaa EdTech SaaS platform.",
          "Building Hospital Management scalable web application.",
          "React and Node.js development for Tourism platform.",
          "Collaborating with senior developers on production codebases.",
        ]),
        techStack: "Next.js,React,Node.js,MySQL,MSSQL,Express",
        companyLogo: null,
        companyUrl: "https://digitalpathshala.com",
        certificateImage: null,
        order: 2,
        featured: true,
      },
      {
        title: "Database Intern",
        company: "Aqore Software Pvt. Ltd.",
        location: "Kathmandu, Nepal",
        type: "internship" as const,
        startDate: "Dec 2025",
        endDate: "Feb 2026",
        isCurrent: false,
        description: "Hands-on enterprise experience in MSSQL database design, optimization, and stored procedure development.",
        points: JSON.stringify([
          "Enterprise MSSQL schema design and optimization.",
          "Authored complex SQL stored procedures and views.",
          "Supported Node.js backend REST API architecture.",
          "Participated in code reviews and agile sprints.",
        ]),
        techStack: "MSSQL,SQL Server,Node.js,REST API",
        companyLogo: null,
        companyUrl: null,
        certificateImage: null,
        order: 3,
        featured: true,
      },
      {
        title: "JunctionX Kathmandu — Hacker",
        company: "SUMS Nepal × COGKNIT",
        location: "Kathmandu, Nepal",
        type: "volunteer" as const,
        startDate: "May 2026",
        endDate: "May 2026",
        isCurrent: false,
        description: "Participated as a Hacker in a 30-hour international hackathon under Team Finland on the global stage.",
        points: JSON.stringify([
          "Built and pitched a real-world solution in 30 hours.",
          "Collaborated with international team members.",
          "Competed against teams from multiple countries.",
        ]),
        techStack: "React,Node.js,PostgreSQL",
        companyLogo: null,
        companyUrl: null,
        certificateImage: null,
        order: 4,
        featured: true,
      },
    ];

    await Experience.bulkCreate(defaults);

    return NextResponse.json({
      success: true,
      message: "Experiences seeded successfully",
      count: defaults.length,
    });
  } catch (error: any) {
    console.error("[seedExperiences Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
