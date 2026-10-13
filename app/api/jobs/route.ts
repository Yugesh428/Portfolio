export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import JobOpportunity from "@/lib/models/JobOpportunity";
import { syncDB } from "@/lib/models/index";
import { Op } from "sequelize";

// GET /api/jobs - Get all job opportunities with filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const company = searchParams.get("company");
    const isRead = searchParams.get("isRead");
    const isArchived = searchParams.get("isArchived");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    
    if (type) where.type = type;
    if (company) where.company = { [Op.like]: `%${company}%` };
    if (isRead !== null && isRead !== undefined) where.isRead = isRead === "true";
    if (isArchived !== null && isArchived !== undefined) where.isArchived = isArchived === "true";

    const jobs = await JobOpportunity.findAll({
      where,
      order: [["postedDate", "DESC"]],
      limit,
    });

    const stats = {
      total: await JobOpportunity.count(),
      unread: await JobOpportunity.count({ where: { isRead: false, isArchived: false } }),
      archived: await JobOpportunity.count({ where: { isArchived: true } }),
      byType: {
        internship: await JobOpportunity.count({ where: { type: "internship", isArchived: false } }),
        bootcamp: await JobOpportunity.count({ where: { type: "bootcamp", isArchived: false } }),
        job: await JobOpportunity.count({ where: { type: "job", isArchived: false } }),
        cohort: await JobOpportunity.count({ where: { type: "cohort", isArchived: false } }),
      },
    };

    return NextResponse.json({ success: true, jobs, stats });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Manually add a job opportunity
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncDB();

    const body = await req.json();
    const { company, title, type, description, url, location, deadline, salary, requirements } = body;

    if (!company || !title || !type || !description || !url) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if job already exists
    const existing = await JobOpportunity.findOne({ where: { url } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Job opportunity already exists" },
        { status: 409 }
      );
    }

    const job = await JobOpportunity.create({
      company,
      title,
      type,
      description,
      url,
      location: location || "Kathmandu, Nepal",
      postedDate: new Date(),
      deadline: deadline ? new Date(deadline) : undefined,
      salary,
      requirements,
      isRead: false,
      isArchived: false,
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
