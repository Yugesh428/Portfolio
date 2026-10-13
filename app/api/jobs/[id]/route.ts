export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import JobOpportunity from "@/lib/models/JobOpportunity";
import { syncDB } from "@/lib/models/index";

// PATCH /api/jobs/[id] - Update job (mark as read/archived)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncDB();

    const { id } = params;
    const body = await req.json();

    const job = await JobOpportunity.findByPk(id);
    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // Update allowed fields
    if (body.isRead !== undefined) job.isRead = body.isRead;
    if (body.isArchived !== undefined) job.isArchived = body.isArchived;

    await job.save();

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete job opportunity
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncDB();

    const { id } = params;

    const job = await JobOpportunity.findByPk(id);
    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    await job.destroy();

    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error: any) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
