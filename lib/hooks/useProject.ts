"use client";

import { useState, useEffect } from "react";

export type ProjectCategory = "saas" | "web-app" | "api" | "mobile" | "other";
export type ProjectStatus = "completed" | "in-progress" | "planned";

export interface ProjectData {
  id: number;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  shortDescription: string;
  technologies: string[];      // parsed array
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  isPrivate: boolean;
  isFeatured: boolean;
  color: string;
  badgeEmoji: string;
  startDate: string | null;
  endDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function useProjects(featuredOnly = false) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const url = featuredOnly ? "/api/project?featured=true" : "/api/project";
    fetch(url)
      .then(r => r.json())
      .then(d => { if (d.success) setProjects(d.data); else setError(d.error); })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [featuredOnly]);

  return { projects, loading, error };
}

export function useProject(id: number) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/project/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setProject(d.data); else setError(d.error); })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [id]);

  return { project, loading, error };
}
