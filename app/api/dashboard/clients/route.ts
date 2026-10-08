export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncDB, User, Project, Notification } from "@/lib/models/index";
import bcrypt from "bcryptjs";
import { sendClientApprovalEmail } from "@/lib/mailer";

// GET /api/dashboard/clients — admin: all clients | client: own profile
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await syncDB();
  const { searchParams } = new URL(req.url);

  if ((session.user as any).role === "admin") {
    const status = searchParams.get("status"); // filter by pending/approved/rejected
    const where: Record<string, unknown> = { role: "client" };
    if (status) where.status = status;

    const clients = await User.findAll({
      where,
      include: [{ model: Project, as: "projects", attributes: ["id","title","status","progress"] }],
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["passwordHash"] },
    });
    return NextResponse.json({ success: true, clients });
  }

  // Client: return own data
  const user = await User.findByPk((session.user as any).id, {
    include: [{ model: Project, as: "projects" }],
    attributes: { exclude: ["passwordHash"] },
  });
  return NextResponse.json({ success: true, client: user });
}

// POST /api/dashboard/clients — client self-registration (public)
export async function POST(req: NextRequest) {
  try {
    await syncDB();
    const { name, email, password, company, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const client = await User.create({
      name:      name.trim().slice(0, 100),
      email:     email.toLowerCase().trim(),
      passwordHash,
      role:      "client",
      status:    "pending",
      company:   company?.trim().slice(0, 150) || null,
      phone:     phone?.trim().slice(0, 30) || null,
      avatarUrl: null,
      avatarPublicId: null,
      lastLoginAt: null,
    });

    // Notify admin (Yugesh)
    const admin = await User.findOne({ where: { role: "admin" } });
    if (admin) {
      await Notification.create({
        userId: admin.id,
        type:   "client_approved",
        title:  `New client registered: ${client.name}`,
        body:   `${client.email} just signed up and is awaiting approval.`,
        link:   "/dashboard/clients",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Account created! Yugesh will review and approve your access shortly.",
    }, { status: 201 });
  } catch (err) {
    console.error("Client register error:", err);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}

// PATCH /api/dashboard/clients — admin approves/rejects a client
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await syncDB();
    const { clientId, status } = await req.json();

    if (!clientId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "clientId and valid status required." }, { status: 400 });
    }

    const client = await User.findByPk(clientId);
    if (!client || client.role !== "client") {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    await client.update({ status });

    // Notify the client
    await Notification.create({
      userId: client.id,
      type:   status === "approved" ? "client_approved" : "client_rejected",
      title:  status === "approved" ? "Your account has been approved!" : "Account request declined",
      body:   status === "approved"
        ? "You can now log in to the client portal to view your projects."
        : "Unfortunately your account request was not approved. Contact Yugesh directly.",
      link:   status === "approved" ? "/portal" : null,
    });

    // Send email
    try {
      await sendClientApprovalEmail({ name: client.name, email: client.email, status });
    } catch (e) {
      console.error("Approval email failed:", e);
    }

    return NextResponse.json({ success: true, message: `Client ${status}.` });
  } catch (err) {
    console.error("Client PATCH error:", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
