"use client";

import React from "react";

import HeroSection from "@/components/HeroSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import ExperienceSection from "@/components/ExperienceSection";
import AchievementsSection from "@/components/AchievementsSection";
import CoursesSection from "@/components/CoursesSection";
import ProjectsSection from "@/components/ProjectsSection";

export default function Page() {
  return (
    <div className="w-full bg-white text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>
      <HeroSection />
      <SkillsMarquee />
      <ExperienceSection />
      <AchievementsSection />
      <CoursesSection />
      <ProjectsSection />
    </div>
  );
}
