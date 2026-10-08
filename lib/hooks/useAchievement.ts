"use client";

import { useState, useEffect } from "react";

export type AchievementType = "hackathon" | "internship" | "certification" | "award" | "volunteer";

export interface AchievementData {
  id: number;
  title: string;
  organization: string;
  date: string;
  type: AchievementType;
  description: string;
  certificateImage: string | null;
  badgeEmoji: string;
  color: string;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── all or featured achievements ── */
export function useAchievements(featuredOnly = false) {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    const url = featuredOnly
      ? "/api/achievement?featured=true"
      : "/api/achievement";

    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (d.success) setAchievements(d.data);
        else setError(d.error || "Failed to load achievements");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [featuredOnly]);

  return { achievements, loading, error };
}

/* ── single achievement by id ── */
export function useAchievement(id: number) {
  const [achievement, setAchievement] = useState<AchievementData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/achievement/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setAchievement(d.data);
        else setError(d.error || "Not found");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [id]);

  return { achievement, loading, error };
}
