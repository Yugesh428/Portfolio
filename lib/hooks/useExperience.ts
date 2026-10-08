import { useState, useEffect } from "react";

export interface ExperienceData {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "work" | "internship" | "freelance" | "volunteer";
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  points: string[];        // parsed array
  techStack: string[];     // parsed array
  companyLogo: string | null;
  companyUrl: string | null;
  certificateImage: string | null;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseExperiencesReturn {
  experiences: ExperienceData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseExperienceReturn {
  experience: ExperienceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/* ── All experiences (optionally featured only) ── */
export function useExperiences(featuredOnly = false): UseExperiencesReturn {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = featuredOnly ? "/api/experience?featured=true" : "/api/experience";
      const res  = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      if (data.success) setExperiences(data.data);
      else throw new Error(data.error || "Failed to fetch");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperiences(); }, [featuredOnly]);

  return { experiences, loading, error, refetch: fetchExperiences };
}

/* ── Single experience by id ── */
export function useExperience(id: number | null): UseExperienceReturn {
  const [experience, setExperience] = useState<ExperienceData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetchExperience = async () => {
    if (!id) { setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const res  = await fetch(`/api/experience/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      if (data.success) setExperience(data.data);
      else throw new Error(data.error || "Not found");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperience(); }, [id]);

  return { experience, loading, error, refetch: fetchExperience };
}
