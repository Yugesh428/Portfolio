export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Skill from "@/lib/features/skill/skillModel";
import { withCache, cacheDel, KEYS, TTL } from "@/lib/cache";

// GET /api/skill
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured") === "true";
    const cacheKey = featured ? KEYS.skillFeatured : KEYS.skill;

    const data = await withCache(cacheKey, TTL.SKILLS, async () => {
      const where = featured ? { featured: true } : {};
      const skills = await Skill.findAll({ where, order: [["order", "ASC"], ["id", "ASC"]] });
      return skills.map(s => s.toJSON());
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/skill
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const skill = await Skill.create(body);
    await cacheDel(KEYS.skill, KEYS.skillFeatured);
    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
