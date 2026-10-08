import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncDB, User, Project, Message, Notification, ContactMessage } from "@/lib/models/index";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await syncDB();

  const [
    totalClients,
    pendingClients,
    approvedClients,
    totalProjects,
    activeProjects,
    completedProjects,
    totalMessages,
    unreadMessages,
    totalContacts,
    unreadNotifications,
  ] = await Promise.all([
    User.count({ where: { role: "client" } }),
    User.count({ where: { role: "client", status: "pending" } }),
    User.count({ where: { role: "client", status: "approved" } }),
    Project.count(),
    Project.count({ where: { status: "in_progress" } }),
    Project.count({ where: { status: "completed" } }),
    Message.count(),
    Message.count({ where: { isRead: false } }),
    ContactMessage.count(),
    Notification.count({ where: { isRead: false } }),
  ]);

  return NextResponse.json({
    success: true,
    stats: {
      clients:      { total: totalClients, pending: pendingClients, approved: approvedClients },
      projects:     { total: totalProjects, active: activeProjects, completed: completedProjects },
      messages:     { total: totalMessages, unread: unreadMessages },
      contacts:     { total: totalContacts },
      notifications:{ unread: unreadNotifications },
    },
  });
}
