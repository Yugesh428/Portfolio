export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Skill from "@/lib/features/skill/skillModel";

const defaultSkills = [
  // Frontend
  { name: "React", category: "frontend", proficiency: 90, yearsOfExperience: 4, color: "#61DAFB", order: 1, featured: true },
  { name: "Next.js", category: "frontend", proficiency: 85, yearsOfExperience: 3, color: "#000000", order: 2, featured: true },
  { name: "TypeScript", category: "frontend", proficiency: 88, yearsOfExperience: 3, color: "#3178C6", order: 3, featured: true },
  { name: "Tailwind CSS", category: "frontend", proficiency: 92, yearsOfExperience: 3, color: "#06B6D4", order: 4, featured: true },
  { name: "JavaScript", category: "frontend", proficiency: 90, yearsOfExperience: 5, color: "#F7DF1E", order: 5, featured: true },
  
  // Backend
  { name: "Node.js", category: "backend", proficiency: 87, yearsOfExperience: 4, color: "#339933", order: 6, featured: true },
  { name: "Express.js", category: "backend", proficiency: 85, yearsOfExperience: 3, color: "#000000", order: 7, featured: true },
  { name: "Python", category: "backend", proficiency: 75, yearsOfExperience: 2, color: "#3776AB", order: 8, featured: true },
  { name: "FastAPI", category: "backend", proficiency: 70, yearsOfExperience: 2, color: "#009688", order: 9, featured: false },
  
  // Database
  { name: "PostgreSQL", category: "database", proficiency: 82, yearsOfExperience: 3, color: "#4169E1", order: 10, featured: true },
  { name: "MongoDB", category: "database", proficiency: 80, yearsOfExperience: 3, color: "#47A248", order: 11, featured: true },
  { name: "Redis", category: "database", proficiency: 70, yearsOfExperience: 2, color: "#DC382D", order: 12, featured: false },
  
  // DevOps
  { name: "Docker", category: "devops", proficiency: 75, yearsOfExperience: 2, color: "#2496ED", order: 13, featured: true },
  { name: "AWS", category: "devops", proficiency: 70, yearsOfExperience: 2, color: "#FF9900", order: 14, featured: true },
  { name: "Git", category: "devops", proficiency: 88, yearsOfExperience: 4, color: "#F05032", order: 15, featured: true },
  
  // Design
  { name: "Figma", category: "design", proficiency: 80, yearsOfExperience: 3, color: "#F24E1E", order: 16, featured: false },
];

export async function POST() {
  try {
    const count = await Skill.count();
    if (count > 0) {
      return NextResponse.json({ success: false, error: "Skills already exist" }, { status: 400 });
    }

    await Skill.bulkCreate(defaultSkills as any);
    return NextResponse.json({ success: true, message: `Seeded ${defaultSkills.length} skills` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
