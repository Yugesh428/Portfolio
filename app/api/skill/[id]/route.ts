import { NextRequest, NextResponse } from "next/server";
import Skill from "@/lib/features/skill/skillModel";
import { cacheDel, KEYS } from "@/lib/cache";

// GET /api/skill/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const skill = await Skill.findByPk(params.id);
    if (!skill) return NextResponse.json({ success: false, error: "Skill not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: skill });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/skill/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const skill = await Skill.findByPk(params.id);
    if (!skill) return NextResponse.json({ success: false, error: "Skill not found" }, { status: 404 });
    await skill.update(body);
    await cacheDel(KEYS.skill, KEYS.skillFeatured);
    return NextResponse.json({ success: true, data: skill });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/skill/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const skill = await Skill.findByPk(params.id);
    if (!skill) return NextResponse.json({ success: false, error: "Skill not found" }, { status: 404 });
    await skill.destroy();
    await cacheDel(KEYS.skill, KEYS.skillFeatured);
    return NextResponse.json({ success: true, message: "Skill deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
