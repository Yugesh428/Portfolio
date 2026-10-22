export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreativeWork from "@/lib/models/CreativeWork";
import { syncDB } from "@/lib/models/index";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const isPublic = searchParams.get("isPublic");

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (isPublic) where.isPublic = isPublic === "true";

    const works = await CreativeWork.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({ success: true, works });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncDB();

    const body = await req.json();
    const work = await CreativeWork.create(body);

    return NextResponse.json({ success: true, work }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
