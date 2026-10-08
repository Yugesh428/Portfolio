"use client";

import { useState, useEffect } from "react";

export type CourseCategory = "web-development" | "database" | "cloud" | "programming" | "design" | "other";

export interface CourseData {
  id: number;
  title: string;
  issuer: string;
  category: CourseCategory;
  completedDate: string;
  credentialUrl: string | null;
  certificateImage: string | null;
  certificateImage2: string | null;
  description: string;
  skills: string[];      // parsed array
  badgeEmoji: string;
  color: string;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useCourses(featuredOnly = false) {
  const [courses, setCourses]   = useState<CourseData[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const url = featuredOnly ? "/api/course?featured=true" : "/api/course";
    fetch(url)
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data); else setError(d.error); })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [featuredOnly]);

  return { courses, loading, error };
}

export function useCourse(id: number) {
  const [course, setCourse]   = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/course/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setCourse(d.data); else setError(d.error); })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [id]);

  return { course, loading, error };
}
