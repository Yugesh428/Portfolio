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

// ── Contact Form ─────────────────────────────────────────────────────────────
export interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(payload: ContactEmailPayload) {
  const { name, email, subject, message } = payload;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.NODEMAILER_GMAIL,
    subject: `📬 Portfolio Contact: ${subject}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#22c55e);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">New Contact Message</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">From your portfolio</p>
        </div>
        <div style="padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;width:80px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;"><a href="mailto:${email}" style="color:#7C3AED;">${email}</a></td></tr>
            <tr><td style="padding:10px 0;font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;">Subject</td>
                <td style="padding:10px 0;font-size:14px;color:#111827;">${subject}</td></tr>
          </table>
          <div style="margin-top:20px;">
            <p style="font-size:12px;color:#6b7280;font-weight:700;text-transform:uppercase;margin:0 0 8px;">Message</p>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</div>
          </div>
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:${email}?subject=Re: ${subject}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#22c55e);color:#fff;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;">Reply to ${name}</a>
          </div>
        </div>
      </div>`,
  });

  // Auto-reply to sender
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Thanks for reaching out, ${name}!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#22c55e);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Hey ${name}! 👋</h1>
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
