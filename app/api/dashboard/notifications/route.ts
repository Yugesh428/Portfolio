export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncDB, Notification } from "@/lib/models/index";

// GET /api/dashboard/notifications
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await syncDB();
  const userId = Number((session.user as any).id);

  const notifications = await Notification.findAll({
    where: { userId },
    order: [["createdAt","DESC"]],
    limit: 50,
  });

  const unreadCount = await Notification.count({
    where: { userId, isRead: false },
  });

  return NextResponse.json({ success: true, notifications, unreadCount });
}

// PATCH /api/dashboard/notifications — mark as read
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await syncDB();
  const userId = Number((session.user as any).id);
  const { id, markAllRead } = await req.json();

  if (markAllRead) {
    await Notification.update({ isRead: true }, { where: { userId } });
    return NextResponse.json({ success: true, message: "All marked as read." });
  }

  if (id) {
    await Notification.update({ isRead: true }, { where: { id, userId } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "id or markAllRead required." }, { status: 400 });
}
