import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are Yugesh's personal portfolio assistant. Answer questions about Yugesh Bastola concisely and professionally.

About Yugesh Bastola:
- Full Stack Developer & SaaS Specialist based in Kathmandu, Nepal
- Specializes in Multi-tenant SaaS architecture, Next.js, Node.js, and SQL
- Self-taught in Core Java and advancing into Spring Boot / Enterprise Backend
- Contact: bastolayugesh2@gmail.com | +977-9812124264
- GitHub: https://github.com/Yugesh428
- LinkedIn: https://www.linkedin.com/in/yugesh-bastola-315638317/

Experience:
- Full Stack Developer (Freelance & Enterprise Projects, 2024 - Present): Multi-tenant SaaS platforms, RESTful APIs, Next.js optimization
- Database Intern at Aqore Software Pvt. Ltd. (6 months): Enterprise MSSQL, stored procedures, schema design

Education:
- TechSpire College, Kathmandu (Ongoing) — Digital Technology & Full Stack architecture
- Digital Pathshala, Kathmandu (Certification) — Modern Web Stacks & SaaS design

Skills: TypeScript (80%), Next.js (90%), Node.js (85%), MySQL/MSSQL (80%), React (75%), Java (60%), JavaScript, Spring Boot, Postman

Projects:
- Institute SAAS: Multi-tenant educational SaaS (Next.js, Node.js, MySQL) — github.com/Yugesh428/InstituteSAAS
- Clinic Management: Healthcare SaaS with RBAC (React, Express) — Private
- Staffing Management: Enterprise SaaS at Aqore (Next.js, MSSQL) — Private
- Room Management: Booking engine (Node.js, React, MySQL) — github.com/Yugesh428/RoomManagementSystem
- Blog CMS: Custom RBAC CMS (JavaScript) — github.com/Yugesh428/Blog_Management
- Shoes Store API: RESTful e-commerce API (Node.js) — github.com/Yugesh428/shoes-

Certifications & Achievements:
- JunctionX Kathmandu Participation (SUMS Nepal x COGKNIT, May 2026) — 30-hour international hackathon, Team Finland
- Basics of .NET (TechSpire College x APU, 2025) — 45-hour Skill Development Program
- Relay Hack x Tumlet Runner-Up (TechSpire x Tumlet, Nov 2025)
- Full Stack SaaS Development (Digital Pathshala, Jan-May 2025)
- MERN Stack Development (Digital Pathshala, March 2025)
- Database Internship (Aqore Software Pvt. Ltd., Dec 2025 - Feb 2026)
- Relay Hack Runner-Up (Aqore x TechSpire, December 2025)

Rules:
- Keep answers short and friendly
- If asked something unrelated to Yugesh or web development, politely redirect
- Always encourage visitors to reach out via email or the contact form
- Do not make up information not listed above`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Build chat history (exclude last user message — we send it separately)
    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Got it! I'm Yugesh's portfolio assistant. How can I help you today?" }],
        },
        ...history,
      ],
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
