import { NextRequest } from "next/server";
import {
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "@/lib/features/experience/experienceController";

// GET /api/experience/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return getExperienceById(Number(params.id));
}

// PUT /api/experience/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return updateExperience(req, Number(params.id));
}

// DELETE /api/experience/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return deleteExperience(Number(params.id));
}
