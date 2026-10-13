export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { scrapeAllJobs } from "@/lib/scrapers/jobScraper";
import { syncDB } from "@/lib/models/index";

// POST /api/jobs/scrape - Manually trigger job scraping
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncDB();

    console.log("🚀 Manual job scraping triggered by admin");
    
    const result = await scrapeAllJobs();

    return NextResponse.json({
      success: true,
      message: `Scraping complete. Found ${result.newJobs} new opportunities out of ${result.total} total.`,
      data: result,
    });
  } catch (error: any) {
    console.error("Error during manual scraping:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
