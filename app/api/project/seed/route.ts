export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import Project from "@/lib/features/project/projectModel";

const defaultProjects = [
  {
    title: "Institute SAAS",
    category: "saas",
    status: "completed",
    shortDescription: "Cloud-based SaaS for educational institutions with tenant data isolation and custom subdomains.",
    description: "Multi-tenant SaaS platform for educational institutions featuring tenant data isolation, custom subdomain routing, optimized Node.js REST API, and MySQL database with complex relational schemas.",
    technologies: "Next.js,Node.js,MySQL,TypeScript",
    githubUrl: "https://github.com/Yugesh428/InstituteSAAS",
    isPrivate: false,
    isFeatured: true,
    color: "#2563EB",
    badgeEmoji: "🏫",
    startDate: "Jan 2025",
    endDate: "Mar 2025",
    order: 1,
  },
  {
    title: "Clinic Management",
    category: "saas",
    status: "completed",
    shortDescription: "Enterprise-grade SaaS for clinic chains with patient records and scheduling.",
    description: "Healthcare SaaS platform with patient records management, appointment scheduling, role-based access control, and HIPAA compliance considerations.",
    technologies: "React,Express,PostgreSQL,Security",
    isPrivate: true,
    isFeatured: true,
    color: "#10B981",
    badgeEmoji: "🏥",
    startDate: "Oct 2024",
    endDate: "Dec 2024",
    order: 2,
  },
  {
    title: "Staffing Management",
    category: "saas",
    status: "completed",
    shortDescription: "Full stack project for managing recruitment pipelines and multi-tenant data.",
    description: "Enterprise staffing management system built for Aqore Software with recruitment pipeline management, applicant tracking, and multi-tenant architecture using Next.js and MSSQL.",
    technologies: "Next.js,MSSQL,TypeScript,Enterprise",
    isPrivate: true,
    isFeatured: true,
    color: "#7C3AED",
    badgeEmoji: "👔",
    startDate: "Sep 2024",
    endDate: "Present",
    order: 3,
  },
  {
    title: "Room Management System",
    category: "web-app",
    status: "completed",
    shortDescription: "Node.js REST API for real-time room booking and allocation optimization.",
    description: "Hospitality management system with real-time room availability, booking management, allocation optimization algorithms, and comprehensive admin dashboard.",
    technologies: "Node.js,React,MySQL,REST API",
    githubUrl: "https://github.com/Yugesh428/RoomManagementSystem",
    isPrivate: false,
    isFeatured: true,
    color: "#F59E0B",
    badgeEmoji: "🏨",
    startDate: "Aug 2024",
    endDate: "Sep 2024",
    order: 4,
  },
  {
    title: "Blog CMS",
    category: "web-app",
    status: "completed",
    shortDescription: "Full stack CMS with custom RBAC engine and optimized delivery pipeline.",
    description: "Content Management System with role-based access control, rich text editor, media management, SEO optimization, and RESTful API for content delivery.",
    technologies: "JavaScript,Node.js,MongoDB,CRUD",
    githubUrl: "https://github.com/Yugesh428/Blog_Management",
    isPrivate: false,
    isFeatured: false,
    color: "#EC4899",
    badgeEmoji: "📝",
    startDate: "Jul 2024",
    endDate: "Aug 2024",
    order: 5,
  },
  {
    title: "Shoes Store API",
    category: "api",
    status: "completed",
    shortDescription: "E-commerce REST API with complex inventory logic and secure endpoints.",
    description: "Node.js REST API for e-commerce with inventory management, order processing, payment integration, secure authentication, and full Postman test coverage.",
    technologies: "Node.js,Express,Postman,Security",
    githubUrl: "https://github.com/Yugesh428/shoes-/tree/main/src",
    isPrivate: false,
    isFeatured: false,
    color: "#0EA5E9",
    badgeEmoji: "👟",
    startDate: "Jun 2024",
    endDate: "Jul 2024",
    order: 6,
  },
];

export async function POST() {
  try {
    const count = await Project.count();
    if (count > 0) {
      return NextResponse.json({ success: false, error: "Projects already exist" }, { status: 400 });
    }

    await Project.bulkCreate(defaultProjects as any);
    return NextResponse.json({ success: true, message: `Seeded ${defaultProjects.length} projects` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
