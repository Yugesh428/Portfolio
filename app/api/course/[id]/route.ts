export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { getCourseById, updateCourse, deleteCourse } from "@/lib/features/course/courseController";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return getCourseById(Number(params.id));
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return updateCourse(req, Number(params.id));
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return deleteCourse(Number(params.id));
}
