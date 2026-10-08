import { seedCourses } from "@/lib/features/course/courseController";

export async function POST() { return seedCourses(); }
