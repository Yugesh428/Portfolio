export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Hero from "@/lib/features/hero/heroModel";
import { syncDB } from "@/lib/models/index";
import { withCache, cacheDel, KEYS } from "@/lib/cache";

/**
 * GET /api/resume
 * Returns the current resume URL stored in the Hero row.
 */
export async function GET() {
  try {
    await syncDB();

    const data = await withCache("resume:url", 300, async () => {
      const hero = await Hero.findOne();
      return { resumeUrl: hero?.resumeUrl ?? null };
    });

    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error("[GET /api/resume]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resume URL." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/resume
 * Body: { resumeUrl: string }
 * Updates the resumeUrl field on the Hero row and busts cache.
 */
export async function PUT(req: NextRequest) {
  try {
    await syncDB();
    const { resumeUrl } = await req.json();

    if (!resumeUrl || typeof resumeUrl !== "string" || !resumeUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "resumeUrl is required." },
        { status: 400 }
      );
    }

    let hero = await Hero.findOne();
    if (!hero) {
      return NextResponse.json(
        { success: false, error: "Hero record not found. Please seed the hero section first." },
        { status: 404 }
      );
    }

    await hero.update({ resumeUrl: resumeUrl.trim() });

    // Bust both resume cache and hero cache so Navbar + Hero section both update
    await Promise.all([
      cacheDel("resume:url"),
      cacheDel(KEYS.hero),
    ]);

    return NextResponse.json({
      success: true,
      message: "Resume updated successfully.",
      resumeUrl: hero.resumeUrl,
    });
  } catch (error: any) {
    console.error("[PUT /api/resume]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update resume URL." },
      { status: 500 }
    );
  }
}
