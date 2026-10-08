import { seedExperiences } from "@/lib/features/experience/experienceController";

// POST /api/experience/seed
export async function POST() {
  return seedExperiences();
}
