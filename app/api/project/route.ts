import { NextRequest, NextResponse } from "next/server";
import Project from "@/lib/features/project/projectModel";
import { withCache, cacheDel, KEYS, TTL } from "@/lib/cache";

// GET /api/project
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured") === "true";
    const cacheKey = featured ? KEYS.projectFeatured : KEYS.project;

    const data = await withCache(cacheKey, TTL.PROJECTS, async () => {
      const where = featured ? { isFeatured: true } : {};
      const projects = await Project.findAll({ where, order: [["order", "ASC"], ["id", "DESC"]] });
      return projects.map(p => {
        const plain = p.toJSON();
        return {
          ...plain,
          technologies: plain.technologies
            ? plain.technologies.split(",").map((t: string) => t.trim())
            : [],
        };
      });
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/project
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (Array.isArray(body.technologies)) {
      body.technologies = body.technologies.join(",");
    }
    const project = await Project.create(body);
    await cacheDel(KEYS.project, KEYS.projectFeatured);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
