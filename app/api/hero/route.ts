export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { getHero, updateHero } from "@/lib/features/hero/heroController";

// Cache GET responses for 60 seconds — reduces DB hits on page loads
export const revalidate = 60;

// GET /api/hero - Get hero section data
export async function GET() {
  return getHero();
}

// PUT /api/hero - Update hero section data
export async function PUT(req: NextRequest) {
  return updateHero(req);
}
