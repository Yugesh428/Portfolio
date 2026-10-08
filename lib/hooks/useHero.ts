import { useState, useEffect } from "react";

interface HeroData {
  id: number;
  greeting: string;
  title: string;
  subtitle: string;
  description: string;
  profileImage: string | null;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  emailUrl: string;
  statusBadge: string;
  yearsExperience: number;
  projectsCompleted: number;
  certificationsCount: number;
  availableForWork: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseHeroReturn {
  hero: HeroData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHero(): UseHeroReturn {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHero = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/hero");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch hero data");
      }
      
      if (data.success) {
        setHero(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch hero data");
      }
    } catch (err: any) {
      console.error("[useHero Error]", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  return {
    hero,
    loading,
    error,
    refetch: fetchHero,
  };
}
