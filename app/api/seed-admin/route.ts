export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { syncDB, User } from "@/lib/models/index";

export async function POST() {
  try {
    await syncDB();

    // Check if admin already exists
    const existing = await User.findOne({ 
      where: { email: "bastolayugesh2@gmail.com" } 
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Admin already exists",
        credentials: {
          email: "bastolayugesh2@gmail.com",
          password: "Admin@Yugesh2026"
        }
      });
    }

    // Create admin user
    const passwordHash = await bcrypt.hash("Admin@Yugesh2026", 12);

    await User.create({
      name: "Yugesh Bastola",
      email: "bastolayugesh2@gmail.com",
      passwordHash,
      role: "admin",
      status: "approved",
      company: null,
      phone: "+977-9812124264",
      avatarUrl: null,
      avatarPublicId: null,
      lastLoginAt: null,
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully!",
      credentials: {
        email: "bastolayugesh2@gmail.com",
        password: "Admin@Yugesh2026"
      }
    });
  } catch (error: any) {
    console.error("[Seed Admin Error]", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to seed admin", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
