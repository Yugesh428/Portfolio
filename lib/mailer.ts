import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_GMAIL,
    pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD,
  },
});

// HTML escape function to prevent XSS in emails
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Contact Form ─────────────────────────────────────────────────────────────
export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(payload: ContactEmailPayload) {
  const { name, email, subject, message } = payload;
  
  // Escape all user input to prevent XSS in emails
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.NODEMAILER_GMAIL,
    subject: `📬 Portfolio Contact: ${safeSubject}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#22c55e);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">New Contact Message</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">From your portfolio</p>
        </div>
        <div style="padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;width:80px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${safeName}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;"><a href="mailto:${email}" style="color:#7C3AED;">${safeEmail}</a></td></tr>
            <tr><td style="padding:10px 0;font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;">Subject</td>
                <td style="padding:10px 0;font-size:14px;color:#111827;">${safeSubject}</td></tr>
          </table>
          <div style="margin-top:20px;">
            <p style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;margin:0 0 8px;">Message</p>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${safeMessage}</div>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#22c55e);color:#fff;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;">Reply to ${safeName}</a>
          </div>
        </div>
      </div>`,
  });

  // Auto-reply to sender - also escape
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Thanks for reaching out, ${safeName}!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#22c55e);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Hey ${safeName}! 👋</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">Message received — I'll get back to you soon.</p>
        </div>
        <div style="padding:28px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px;">Thanks for reaching out. I've received your message and will reply within <strong>24–48 hours</strong>.</p>
          <div style="margin-top:24px;">
            <a href="https://github.com/Yugesh428" style="display:inline-block;background:#111827;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;margin-right:8px;">GitHub</a>
            <a href="https://www.linkedin.com/in/yugesh-bastola-315638317/" style="display:inline-block;background:#0077b5;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">LinkedIn</a>
          </div>
        </div>
      </div>`,
  });
}

// ── Client Approval/Rejection ─────────────────────────────────────────────────
export async function sendClientApprovalEmail({
  name, email, status,
}: { name: string; email: string; status: "approved" | "rejected" }) {
  const isApproved = status === "approved";
  const safeName = escapeHtml(name);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: isApproved
      ? `✅ Your client account has been approved — Yugesh Bastola`
      : `Account request update — Yugesh Bastola`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:${isApproved ? "linear-gradient(135deg,#7C3AED,#22c55e)" : "linear-gradient(135deg,#ef4444,#b91c1c)"};padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">${isApproved ? "You're approved! 🎉" : "Account request update"}</h1>
        </div>
        <div style="padding:28px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">Hi <strong>${name}</strong>,</p>
          ${isApproved
            ? `<p style="font-size:15px;color:#374151;line-height:1.7;">Your client account has been approved. You can now log in to the <strong>client portal</strong> to view your projects, send messages, and upload files.</p>
               <div style="margin-top:24px;text-align:center;">
                 <a href="${process.env.NEXTAUTH_URL}/portal" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#22c55e);color:#fff;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">Access Client Portal →</a>
               </div>`
            : `<p style="font-size:15px;color:#374151;line-height:1.7;">Unfortunately, your account request was not approved at this time. Please reach out directly via <a href="mailto:bastolayugesh2@gmail.com" style="color:#7C3AED;">bastolayugesh2@gmail.com</a> if you have questions.</p>`
          }
        </div>
      </div>`,
  });
}

// ── New Project Notification to Client ───────────────────────────────────────
export async function sendProjectCreatedEmail({
  name, email, projectTitle,
}: { name: string; email: string; projectTitle: string }) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `🚀 Project created: ${projectTitle}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#22c55e);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">New Project Started 🚀</h1>
        </div>
        <div style="padding:28px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;">Hi <strong>${name}</strong>,</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;">Yugesh has created a new project for you: <strong>${projectTitle}</strong>. Log in to your portal to track progress and communicate.</p>
          <div style="margin-top:24px;text-align:center;">
            <a href="${process.env.NEXTAUTH_URL}/portal" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#22c55e);color:#fff;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">View Project →</a>
          </div>
        </div>
      </div>`,
  });
}

// ── Job Opportunity Alert ────────────────────────────────────────────────────
export async function sendJobAlert(job: {
  company: string;
  title: string;
  type: string;
  description: string;
  url: string;
  location: string;
  deadline?: Date;
  salary?: string;
}) {
  const typeEmoji = {
    internship: "🎓",
    bootcamp: "🚀",
    job: "💼",
    cohort: "👥",
    other: "📢",
  }[job.type] || "📢";

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.NODEMAILER_GMAIL, // Send to yourself
    subject: `${typeEmoji} New ${job.type}: ${job.title} at ${job.company}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">${typeEmoji} New Opportunity Found!</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:13px;">${job.company} · ${job.location}</p>
        </div>
        <div style="padding:28px;">
          <h2 style="font-size:20px;color:#111827;margin:0 0 8px;font-weight:700;">${job.title}</h2>
          <div style="display:inline-block;background:#dbeafe;color:#1e40af;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;margin-bottom:16px;">${job.type}</div>
          
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;font-weight:600;width:100px;">Company</td>
              <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${job.company}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;font-weight:600;">Location</td>
              <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${job.location}</td>
            </tr>
            ${job.salary ? `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;font-weight:600;">Salary</td>
              <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#10b981;font-weight:600;">${job.salary}</td>
            </tr>
            ` : ""}
            ${job.deadline ? `
            <tr>
              <td style="padding:8px 0;font-size:12px;color:#6b7280;font-weight:600;">Deadline</td>
              <td style="padding:8px 0;font-size:14px;color:#ef4444;font-weight:600;">${new Date(job.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
            </tr>
            ` : ""}
          </table>

          <div style="margin:20px 0;">
            <p style="font-size:12px;color:#6b7280;font-weight:600;margin:0 0 8px;">Description</p>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;font-size:14px;color:#374151;line-height:1.7;">${job.description.substring(0, 300)}${job.description.length > 300 ? "..." : ""}</div>
          </div>

          <div style="margin-top:28px;text-align:center;">
            <a href="${job.url}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">View Full Details →</a>
          </div>

          <div style="margin-top:24px;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="font-size:12px;color:#9ca3af;margin:0;">🤖 This opportunity was automatically detected by your portfolio job tracker</p>
          </div>
        </div>
      </div>`,
  });
}

// ── Admin-Created Client Welcome Email ───────────────────────────────────────
export async function sendClientWelcomeEmail({
  name, email, tempPassword, portalUrl,
}: { name: string; email: string; tempPassword: string; portalUrl: string }) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `🎉 Your Client Portal Access — Yugesh Bastola`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#22c55e);padding:36px 32px;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Welcome to the Portal! 🎉</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Your client account is ready</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">Hi <strong>${name}</strong>,</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
            Yugesh has created a client portal account for you. You can now log in to track your projects, send messages, and view updates.
          </p>

          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:28px;">
            <p style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 16px;">Your Login Credentials</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#9ca3af;font-weight:600;width:80px;">Portal URL</td>
                <td style="padding:8px 0;font-size:13px;"><a href="${portalUrl}" style="color:#7C3AED;font-weight:600;">${portalUrl}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#9ca3af;font-weight:600;">Email</td>
                <td style="padding:8px 0;font-size:13px;color:#111827;font-weight:600;">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:13px;color:#9ca3af;font-weight:600;">Password</td>
                <td style="padding:8px 0;">
                  <span style="background:#fef3c7;color:#92400e;font-family:monospace;font-size:14px;font-weight:700;padding:4px 10px;border-radius:6px;border:1px solid #fde68a;">${tempPassword}</span>
                </td>
              </tr>
            </table>
          </div>

          <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:14px 16px;margin-bottom:28px;">
            <p style="font-size:13px;color:#854d0e;margin:0;font-weight:600;">
              ⚠️ For security, you will be required to change this password on your first login.
            </p>
          </div>

          <div style="text-align:center;">
            <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#22c55e);color:#fff;padding:14px 36px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">Access Your Portal →</a>
          </div>

          <p style="font-size:13px;color:#9ca3af;margin-top:28px;padding-top:20px;border-top:1px solid #e5e7eb;text-align:center;">
            If you didn't expect this email, please ignore it or contact <a href="mailto:bastolayugesh2@gmail.com" style="color:#7C3AED;">bastolayugesh2@gmail.com</a>
          </p>
        </div>
      </div>`,
  });
}

// ── Admin Password Reset Email ────────────────────────────────────────────────
export async function sendPasswordResetByAdminEmail({
  name, email, tempPassword, portalUrl,
}: { name: string; email: string; tempPassword: string; portalUrl: string }) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `🔐 Your Password Has Been Reset — Yugesh Bastola`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#2563EB);padding:36px 32px;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Password Reset 🔐</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Your portal password has been reset by admin</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">Hi <strong>${name}</strong>,</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 24px;">
            Your client portal password has been reset by Yugesh. Use the temporary password below to log in.
          </p>

          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:28px;">
            <p style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 16px;">New Temporary Password</p>
            <div style="text-align:center;">
              <span style="background:#ede9fe;color:#5b21b6;font-family:monospace;font-size:18px;font-weight:700;padding:10px 20px;border-radius:8px;border:1px solid #c4b5fd;display:inline-block;">${tempPassword}</span>
            </div>
          </div>

          <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:14px 16px;margin-bottom:28px;">
            <p style="font-size:13px;color:#854d0e;margin:0;font-weight:600;">
              ⚠️ You must change this password immediately after logging in.
            </p>
          </div>

          <div style="text-align:center;">
            <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#2563EB);color:#fff;padding:14px 36px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">Log In Now →</a>
          </div>
        </div>
      </div>`,
  });
}

// ── Forgot Password Reset Email (Client-Initiated) ───────────────────────────
export async function sendForgotPasswordEmail({
  name, email, resetUrl,
}: { name: string; email: string; resetUrl: string }) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `🔑 Reset Your Password — Yugesh Bastola Portal`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#2563EB);padding:36px 32px;">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Reset Your Password 🔑</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">This link expires in 15 minutes</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px;">Hi <strong>${name}</strong>,</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 28px;">
            We received a request to reset your client portal password. Click the button below to set a new password.
          </p>

          <div style="text-align:center;margin-bottom:28px;">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#2563EB);color:#fff;padding:16px 40px;border-radius:8px;font-size:15px;font-weight:700;text-decoration:none;">Reset My Password →</a>
          </div>

          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
            <p style="font-size:13px;color:#991b1b;margin:0;font-weight:600;">
              ⏰ This link expires in <strong>15 minutes</strong>. If it expires, request a new one.
            </p>
          </div>

          <p style="font-size:13px;color:#6b7280;line-height:1.6;margin:0;">
            If you didn't request a password reset, you can safely ignore this email. Your password won't change.
          </p>

          <p style="font-size:12px;color:#9ca3af;margin-top:24px;padding-top:20px;border-top:1px solid #e5e7eb;">
            If the button doesn't work, copy this URL: <span style="color:#7C3AED;">${resetUrl}</span>
          </p>
        </div>
      </div>`,
  });
}
