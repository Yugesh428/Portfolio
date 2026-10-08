export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import {
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} from "@/lib/features/achievement/achievementController";

// GET /api/achievement/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return getAchievementById(Number(params.id));
}

// PUT /api/achievement/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return updateAchievement(req, Number(params.id));
}

// DELETE /api/achievement/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return deleteAchievement(Number(params.id));
}
