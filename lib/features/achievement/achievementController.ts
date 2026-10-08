import { NextRequest, NextResponse } from "next/server";
import Achievement from "./achievementModel";
import { syncDB } from "../../models/index";
import { withCache, cacheDel, KEYS, TTL } from "../../cache";

/* ── helper ── */
function parseAchievement(a: Achievement) {
  return { ...a.toJSON() };
}

/**
 * GET /api/achievement  ?featured=true
 */
export async function getAchievements(req: NextRequest) {
  try {
    await syncDB();
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";
    const cacheKey = featuredOnly ? KEYS.achievementFeatured : KEYS.achievement;

    const data = await withCache(cacheKey, TTL.ACHIEVEMENTS, async () => {
      const where: any = featuredOnly ? { featured: true } : {};
      const items = await Achievement.findAll({ where, order: [["order", "ASC"]] });
      return items.map(parseAchievement);
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error: any) {
    console.error("[getAchievements Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/achievement/[id]
 */
export async function getAchievementById(id: number) {
  try {
    await syncDB();
    const item = await Achievement.findByPk(id);
    if (!item) return NextResponse.json({ success: false, error: "Achievement not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: parseAchievement(item) });
  } catch (error: any) {
    console.error("[getAchievementById Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/achievement
 */
export async function createAchievement(req: NextRequest) {
  try {
    await syncDB();
    const body = await req.json();
    const item = await Achievement.create(body);
    await cacheDel(KEYS.achievement, KEYS.achievementFeatured);
    return NextResponse.json({ success: true, message: "Achievement created successfully", data: parseAchievement(item) }, { status: 201 });
  } catch (error: any) {
    console.error("[createAchievement Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/achievement/[id]
 */
export async function updateAchievement(req: NextRequest, id: number) {
  try {
    await syncDB();
    const item = await Achievement.findByPk(id);
    if (!item) return NextResponse.json({ success: false, error: "Achievement not found" }, { status: 404 });
    const body = await req.json();
    await item.update(body);
    await cacheDel(KEYS.achievement, KEYS.achievementFeatured);
    return NextResponse.json({ success: true, message: "Achievement updated successfully", data: parseAchievement(item) });
  } catch (error: any) {
    console.error("[updateAchievement Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/achievement/[id]
 */
export async function deleteAchievement(id: number) {
  try {
    await syncDB();
    const item = await Achievement.findByPk(id);
    if (!item) return NextResponse.json({ success: false, error: "Achievement not found" }, { status: 404 });
    await item.destroy();
    await cacheDel(KEYS.achievement, KEYS.achievementFeatured);
    return NextResponse.json({ success: true, message: "Achievement deleted successfully" });
  } catch (error: any) {
    console.error("[deleteAchievement Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/achievement/seed
 * Seeds your real achievements
 */
export async function seedAchievements() {
  try {
    await syncDB();

    const count = await Achievement.count();
    if (count > 0) {
      return NextResponse.json({ success: true, message: "Achievements already seeded", count });
    }

    const defaults = [
      {
        title: "JunctionX Kathmandu — Hacker",
        organization: "SUMS Nepal × COGKNIT",
        date: "May 2026",
        type: "hackathon" as const,
        description: "Participated as a Hacker in a 30-hour international hackathon under Team Finland on the global stage. Built and pitched a real-world solution competing against teams from multiple countries.",
        certificateImage: null,
        badgeEmoji: "🌍",
        color: "#F59E0B",
        order: 1,
        featured: true,
      },
      {
        title: "Relay Hack — First Runner-Up",
        organization: "Aqore × TechSpire",
        date: "Dec 2025",
        type: "hackathon" as const,
        description: "Secured First Runner-Up in a 10-day competitive hackathon organized by Aqore Software and TechSpire. Recognized for creativity, problem-solving, and technical execution.",
        certificateImage: null,
        badgeEmoji: "🏆",
        color: "#F59E0B",
        order: 2,
        featured: true,
      },
      {
        title: "Relay Hack × Tumlet — First Runner-Up",
        organization: "TechSpire × Tumlet",
        date: "Nov 2025",
        type: "hackathon" as const,
        description: "Secured First Runner-Up in a hackathon focused on game design and creative innovation, organized by TechSpire in collaboration with Tumlet.",
        certificateImage: null,
        badgeEmoji: "🏆",
        color: "#F59E0B",
        order: 3,
        featured: true,
      },
      {
        title: "Database Internship",
        organization: "Aqore Software Pvt. Ltd.",
        date: "Dec 2025 – Feb 2026",
        type: "internship" as const,
        description: "Hands-on enterprise experience in MSSQL database design, optimization, and stored procedure development. Participated in code reviews and agile sprints.",
        certificateImage: null,
        badgeEmoji: "💼",
        color: "#2563EB",
        order: 4,
        featured: true,
      },
      {
        title: "Full Stack SaaS Development",
        organization: "Digital Pathshala",
        date: "Jan – May 2025",
        type: "certification" as const,
        description: "Professional training and certification in multi-tenant SaaS architectures, full stack development, and production deployment pipelines.",
        certificateImage: null,
        badgeEmoji: "📜",
        color: "#16A34A",
        order: 5,
        featured: true,
      },
    ];

    await Achievement.bulkCreate(defaults);

    return NextResponse.json({
      success: true,
      message: "Achievements seeded successfully",
      count: defaults.length,
    });
  } catch (error: any) {
    console.error("[seedAchievements Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
