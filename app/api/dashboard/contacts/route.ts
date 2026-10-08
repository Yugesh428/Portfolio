export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncDB, ContactMessage } from "@/lib/models/index";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await syncDB();
  const contacts = await ContactMessage.findAll({
    order: [["createdAt", "DESC"]],
  });

  return NextResponse.json({ success: true, contacts });
}
