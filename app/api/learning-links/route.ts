export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LearningLink from "@/lib/models/LearningLink";
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
    const category = searchParams.get("category");
    const isCompleted = searchParams.get("isCompleted");
    const isFavorite = searchParams.get("isFavorite");

    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (isCompleted) where.isCompleted = isCompleted === "true";
    if (isFavorite) where.isFavorite = isFavorite === "true";

    const links = await LearningLink.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({ success: true, links });
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
    const link = await LearningLink.create(body);

    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
