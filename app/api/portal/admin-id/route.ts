import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncDB, User } from "@/lib/models/index";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await syncDB();
  const admin = await User.findOne({ where: { role: "admin" }, attributes: ["id"] });
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  return NextResponse.json({ adminId: admin.id });
}
