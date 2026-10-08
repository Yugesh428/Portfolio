export const dynamic = "force-dynamic";
import { seedAchievements } from "@/lib/features/achievement/achievementController";

// POST /api/achievement/seed
export async function POST() {
  return seedAchievements();
}
