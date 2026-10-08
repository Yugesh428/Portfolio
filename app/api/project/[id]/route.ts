export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Project from "@/lib/features/project/projectModel";
import { cacheDel, KEYS } from "@/lib/cache";

// GET /api/project/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await Project.findByPk(params.id);
    if (!project) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    const plain = project.toJSON();
    return NextResponse.json({
      success: true,
      data: {
        ...plain,
        technologies: plain.technologies
          ? plain.technologies.split(",").map((t: string) => t.trim())
          : [],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/project/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const project = await Project.findByPk(params.id);
    if (!project) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    if (Array.isArray(body.technologies)) body.technologies = body.technologies.join(",");
    await project.update(body);
    await cacheDel(KEYS.project, KEYS.projectFeatured);
    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/project/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await Project.findByPk(params.id);
    if (!project) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    await project.destroy();
    await cacheDel(KEYS.project, KEYS.projectFeatured);
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
