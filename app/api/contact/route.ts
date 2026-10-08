export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/lib/db";
import ContactMessage from "@/lib/models/ContactMessage";
import { sendContactNotification } from "@/lib/mailer";

// Sync the table on first request (creates if not exists)
let synced = false;
async function ensureSync() {
  if (!synced) {
    await sequelize.sync({ alter: false });
    synced = true;
  }
}

// Basic input sanitizer
function sanitize(str: string): string {
  return str.trim().replace(/[<>]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // — Validation —
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const cleanName    = sanitize(name).slice(0, 100);
    const cleanEmail   = email.trim().toLowerCase().slice(0, 200);
    const cleanSubject = sanitize(subject).slice(0, 200);
    const cleanMessage = sanitize(message).slice(0, 5000);

    // — Save to Neon PostgreSQL via Sequelize —
    await ensureSync();
    await ContactMessage.create({
      name:    cleanName,
      email:   cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    });

    // — Send email notifications (non-blocking on failure) —
    try {
      await sendContactNotification({
        name:    cleanName,
        email:   cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
      });
    } catch (mailErr) {
      console.error("Email send failed (non-fatal):", mailErr);
    }

    return NextResponse.json(
      { success: true, message: "Message received! I'll get back to you soon." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// GET — basic health check / message count (no auth needed for portfolio)
export async function GET() {
  try {
    await ensureSync();
    const count = await ContactMessage.count();
    return NextResponse.json({ success: true, totalMessages: count });
  } catch (err) {
    console.error("Contact GET error:", err);
    return NextResponse.json({ success: false, error: "DB error" }, { status: 500 });
  }
}
