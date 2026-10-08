import { NextRequest } from "next/server";
import { getAchievements, createAchievement } from "@/lib/features/achievement/achievementController";

// Cache GET for 60s
export const revalidate = 60;

// GET /api/achievement
// GET /api/achievement?featured=true
export async function GET(req: NextRequest) {
  return getAchievements(req);
}

// POST /api/achievement
export async function POST(req: NextRequest) {
  return createAchievement(req);
}
