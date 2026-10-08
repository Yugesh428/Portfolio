/**
 * Run once to create the admin account:
 *   npx ts-node --project tsconfig.json scripts/seed-admin.ts
 *
 * Or with tsx:
 *   npx tsx scripts/seed-admin.ts
 */
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import bcrypt from "bcryptjs";
import { syncDB, User } from "../lib/models/index";

async function seed() {
  await syncDB();

  const existing = await User.findOne({ where: { email: "bastolayugesh2@gmail.com" } });
  if (existing) {
    console.log("✅ Admin already exists.");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("Admin@Yugesh2026", 12);

  await User.create({
    name:         "Yugesh Bastola",
    email:        "bastolayugesh2@gmail.com",
    passwordHash,
    role:         "admin",
    status:       "approved",
    company:      null,
    phone:        "+977-9812124264",
    avatarUrl:    null,
    avatarPublicId: null,
    lastLoginAt:  null,
  });

  console.log("✅ Admin created: bastolayugesh2@gmail.com / Admin@Yugesh2026");
  console.log("⚠️  Change your password after first login!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
