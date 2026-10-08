import { NextRequest, NextResponse } from "next/server";
import Hero from "./heroModel";
import { syncDB } from "../../models/index";
import { withCache, cacheDel, KEYS, TTL } from "../../cache";

const DEFAULT_HERO = {
  greeting: "Hello I'M A",
  title: "Full Stack Developer",
  subtitle: "Yugesh Bastola",
  description: "Full Stack Developer from Nepal building scalable SaaS web applications using Next.js, Node.js, React, and SQL databases.",
  profileImage: null as unknown as string,
  resumeUrl: "/yugesh_resume.pdf",
  githubUrl: "https://github.com/Yugesh428",
  linkedinUrl: "https://www.linkedin.com/in/yugesh-bastola-315638317/",
  emailUrl: "mailto:bastolayugesh2@gmail.com",
  statusBadge: "Full Stack Developer · Nepal",
  yearsExperience: 2,
  projectsCompleted: 6,
  certificationsCount: 7,
  availableForWork: true,
};

/**
 * GET /api/hero
 */
export async function getHero() {
  try {
    await syncDB();

    const data = await withCache(KEYS.hero, TTL.HERO, async () => {
      let hero = await Hero.findOne();
      if (!hero) hero = await Hero.create(DEFAULT_HERO);
      return hero.toJSON();
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[getHero Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero data", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/hero
 */
export async function updateHero(req: NextRequest) {
  try {
    await syncDB();
    const body = await req.json();

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create(body);
    } else {
      await hero.update(body);
    }

    await cacheDel(KEYS.hero);

    return NextResponse.json({ success: true, message: "Hero section updated successfully", data: hero });
  } catch (error: any) {
    console.error("[updateHero Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hero data", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/hero/seed
 */
export async function seedHero() {
  try {
    await syncDB();

    const existing = await Hero.findOne();
    if (existing) {
      return NextResponse.json({ success: true, message: "Hero data already exists", data: existing });
    }

    const hero = await Hero.create(DEFAULT_HERO);
    await cacheDel(KEYS.hero);

    return NextResponse.json({ success: true, message: "Hero data seeded successfully", data: hero });
  } catch (error: any) {
    console.error("[seedHero Error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed hero data", message: error.message },
      { status: 500 }
    );
  }
}
