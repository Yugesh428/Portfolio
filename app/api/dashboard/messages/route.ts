import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncDB, Message, User, Notification } from "@/lib/models/index";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET /api/dashboard/messages?withUserId=X  (thread between current user and X)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await syncDB();
  const myId = Number((session.user as any).id);
  const { searchParams } = new URL(req.url);
  const withUserId = searchParams.get("withUserId");

  if (!withUserId) {
    // Return latest conversation starters (unique threads)
    const sent = await Message.findAll({
      where: { senderId: myId },
      include: [
        { model: User, as: "receiver", attributes: ["id","name","email","avatarUrl","role"] },
      ],
      order: [["createdAt","DESC"]],
    });
    const received = await Message.findAll({
      where: { receiverId: myId },
      include: [
        { model: User, as: "sender", attributes: ["id","name","email","avatarUrl","role"] },
      ],
      order: [["createdAt","DESC"]],
    });
    return NextResponse.json({ success: true, sent, received });
  }

  // Full thread between myId ↔ withUserId
  const { Op } = await import("sequelize");
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: myId, receiverId: Number(withUserId) },
        { senderId: Number(withUserId), receiverId: myId },
      ],
    },
    include: [
      { model: User, as: "sender",   attributes: ["id","name","email","avatarUrl"] },
      { model: User, as: "receiver", attributes: ["id","name","email","avatarUrl"] },
    ],
    order: [["createdAt","ASC"]],
  });

  // Mark received messages as read
  await Message.update(
    { isRead: true },
    { where: { senderId: Number(withUserId), receiverId: myId, isRead: false } }
  );

  return NextResponse.json({ success: true, messages });
}

// POST /api/dashboard/messages  (send a message, optionally with file)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await syncDB();
    const myId = Number((session.user as any).id);

    const contentType = req.headers.get("content-type") || "";
    let body: string, receiverId: number, projectId: number | null = null;
    let attachmentUrl: string | null = null;
    let attachmentPublicId: string | null = null;
    let attachmentName: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body       = (formData.get("body") as string)?.trim() || "";
      receiverId = Number(formData.get("receiverId"));
      projectId  = formData.get("projectId") ? Number(formData.get("projectId")) : null;

      const file = formData.get("file") as File | null;
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadToCloudinary(buffer, "portfolio/messages");
        attachmentUrl      = result.url;
        attachmentPublicId = result.publicId;
        attachmentName     = file.name;
      }
    } else {
      const json = await req.json();
      body       = json.body?.trim() || "";
      receiverId = Number(json.receiverId);
      projectId  = json.projectId ? Number(json.projectId) : null;
    }

    if (!body && !attachmentUrl) {
      return NextResponse.json({ error: "Message body or attachment required." }, { status: 400 });
    }
    if (!receiverId) {
      return NextResponse.json({ error: "receiverId required." }, { status: 400 });
    }

    const receiver = await User.findByPk(receiverId);
    if (!receiver) return NextResponse.json({ error: "Recipient not found." }, { status: 404 });

    const message = await Message.create({
      senderId:   myId,
      receiverId,
      projectId,
      body:       body || "(attachment)",
      isRead:     false,
      attachmentUrl,
      attachmentPublicId,
      attachmentName,
    });

    // Notify recipient
    const sender = await User.findByPk(myId, { attributes: ["name"] });
    await Notification.create({
      userId: receiverId,
      type:   "new_message",
      title:  `New message from ${sender?.name}`,
      body:   body ? body.slice(0, 100) : "Sent an attachment.",
      link:   `/dashboard/messages?withUserId=${myId}`,
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err) {
    console.error("Message POST error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
