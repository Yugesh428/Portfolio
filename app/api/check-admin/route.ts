export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { syncDB, User } from "@/lib/models/index";

export async function GET() {
  try {
    await syncDB();

    const admin = await User.findOne({ 
      where: { email: "bastolayugesh2@gmail.com" } 
    });

    if (!admin) {
      return NextResponse.json({
        success: false,
        message: "Admin user not found. Please run POST /api/seed-admin first."
      });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        hasPassword: !!admin.passwordHash,
        passwordHashLength: admin.passwordHash?.length || 0,
        createdAt: admin.createdAt
      }
    });
  } catch (error: any) {
    console.error("[Check Admin Error]", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to check admin", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
