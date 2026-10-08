export const dynamic = "force-dynamic";
import { seedHero } from "@/lib/features/hero/heroController";

// POST /api/hero/seed - Seed default hero data
export async function POST() {
  return seedHero();
}
