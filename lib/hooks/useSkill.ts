"use client";

import { useState, useEffect } from "react";

export type SkillCategory = "frontend" | "backend" | "database" | "devops" | "design" | "other";

export interface SkillData {
  id: number;
  name: string;
  category: SkillCategory;
  logo: string | null;
  proficiency: number;
  yearsOfExperience: number;
  color: string;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useSkills(featuredOnly = false) {
  const [skills, setSkills]   = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const url = featuredOnly ? "/api/skill?featured=true" : "/api/skill";
    fetch(url)
      .then(r => r.json())
      .then(d => { if (d.success) setSkills(d.data); else setError(d.error); })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [featuredOnly]);

  return { skills, loading, error };
}

export function useSkill(id: number) {
  const [skill, setSkill]     = useState<SkillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/skill/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setSkill(d.data); else setError(d.error); })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [id]);

  return { skill, loading, error };
}
