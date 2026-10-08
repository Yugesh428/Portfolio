export const dynamic = "force-dynamic";
import { seedCourses } from "@/lib/features/course/courseController";

export async function POST() { return seedCourses(); }
