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

// Rate limiting: Store submission timestamps per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 3;

function checkRateLimit(ip: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now();
  const submissions = rateLimitMap.get(ip) || [];
  
  // Remove old submissions outside the time window
  const recentSubmissions = submissions.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
    const oldestSubmission = Math.min(...recentSubmissions);
    const resetIn = Math.ceil((oldestSubmission + RATE_LIMIT_WINDOW - now) / 1000 / 60);
    return { allowed: false, resetIn };
  }
  
  // Add current submission
  recentSubmissions.push(now);
  rateLimitMap.set(ip, recentSubmissions);
  
  // Cleanup old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
      if (validTimestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  return { allowed: true };
}

// Enhanced XSS sanitizer - strips ALL HTML tags and dangerous characters
function sanitize(str: string): string {
  return str
    .trim()
    // Remove all HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove script/event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    // Remove dangerous characters
    .replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
        "&": "&amp;",
      };
      return entities[char] || char;
    });
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(",")[0].trim() || realIp || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(req);
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please try again in ${rateLimit.resetIn} minutes.`,
        },
        { status: 429 }
      );
    }

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

    // Additional validation - block suspicious patterns
    const suspiciousPatterns = [
      /script/i,
      /onerror/i,
      /onload/i,
      /onclick/i,
      /javascript:/i,
      /<iframe/i,
      /<embed/i,
      /<object/i,
    ];

    const allText = `${name} ${email} ${subject} ${message}`;
    if (suspiciousPatterns.some((pattern) => pattern.test(allText))) {
      console.warn(`[SECURITY] Suspicious content detected from IP: ${clientIp}`);
      return NextResponse.json(
        { success: false, error: "Invalid content detected. Please remove any special characters or scripts." },
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
