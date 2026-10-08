import { NextRequest } from "next/server";
import { getCourses, createCourse } from "@/lib/features/course/courseController";

export const revalidate = 60;

export async function GET(req: NextRequest) { return getCourses(req); }
export async function POST(req: NextRequest) { return createCourse(req); }
