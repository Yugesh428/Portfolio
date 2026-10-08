import { NextRequest } from "next/server";
import { getExperiences, createExperience } from "@/lib/features/experience/experienceController";

// Cache GET responses for 60 seconds — reduces DB hits on page loads
export const revalidate = 60;

// GET /api/experience          → all experiences
// GET /api/experience?featured=true → featured only (homepage)
export async function GET(req: NextRequest) {
  return getExperiences(req);
}

// POST /api/experience → create new experience
export async function POST(req: NextRequest) {
  return createExperience(req);
}
