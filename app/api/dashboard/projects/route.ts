export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncDB, Project, User, Notification } from "@/lib/models/index";

// GET /api/dashboard/projects
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await syncDB();
  const { searchParams } = new URL(req.url);
  const role = (session.user as any).role;
  const userId = Number((session.user as any).id);

  if (role === "admin") {
    const clientId = searchParams.get("clientId");
    const status   = searchParams.get("status");
    const where: Record<string, unknown> = {};
    if (clientId) where.clientId = Number(clientId);
    if (status)   where.status   = status;

    const projects = await Project.findAll({
      where,
      include: [{ model: User, as: "client", attributes: ["id","name","email","company"] }],
      order: [["updatedAt", "DESC"]],
    });
    return NextResponse.json({ success: true, projects });
  }

  // Client — own projects only
  const projects = await Project.findAll({
    where: { clientId: userId },
    order: [["updatedAt", "DESC"]],
  });
  return NextResponse.json({ success: true, projects });
}

// POST /api/dashboard/projects — admin creates a project for a client
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await syncDB();
    const { clientId, title, description, techStack, budget, deadline } = await req.json();

    if (!clientId || !title) {
      return NextResponse.json({ error: "clientId and title are required." }, { status: 400 });
    }

    const client = await User.findByPk(clientId);
    if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

    const project = await Project.create({
      clientId:    Number(clientId),
      title:       title.trim().slice(0, 200),
      description: description?.trim() || null,
      techStack:   techStack?.trim().slice(0, 500) || null,
      budget:      budget ? Number(budget) : null,
      deadline:    deadline ? new Date(deadline) : null,
      status:      "planning",
      progress:    0,
      coverUrl:    null,
      coverPublicId: null,
      completedAt: null,
    });

    // Notify client
    await Notification.create({
      userId: client.id,
      type:   "project_update",
      title:  `New project created: ${project.title}`,
      body:   "Yugesh has created a new project for you. Check your portal for details.",
      link:   `/portal/projects/${project.id}`,
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (err) {
    console.error("Project POST error:", err);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}

// PATCH /api/dashboard/projects — admin updates project status/progress
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await syncDB();
    const { projectId, status, progress, description, techStack, budget, deadline, title } = await req.json();

    if (!projectId) return NextResponse.json({ error: "projectId required." }, { status: 400 });

    const project = await Project.findByPk(projectId);
    if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

    const updates: Record<string, unknown> = {};
    if (title)       updates.title       = title.trim().slice(0, 200);
    if (description !== undefined) updates.description = description;
    if (status)      updates.status      = status;
    if (progress !== undefined) updates.progress = Math.min(100, Math.max(0, Number(progress)));
    if (techStack !== undefined) updates.techStack = techStack;
    if (budget !== undefined)    updates.budget    = Number(budget);
    if (deadline)    updates.deadline    = new Date(deadline);
    if (status === "completed") updates.completedAt = new Date();

    await project.update(updates);

    // Notify client about update
    await Notification.create({
      userId: project.clientId,
      type:   "project_update",
      title:  `Project updated: ${project.title}`,
      body:   status ? `Status changed to: ${status}` : `Progress updated to ${progress}%`,
      link:   `/portal/projects/${project.id}`,
    });

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error("Project PATCH error:", err);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}
