"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Rocket,
  Users,
  Bell,
  ExternalLink,
  Archive,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
} from "lucide-react";

interface JobOpportunity {
  id: number;
  company: string;
  title: string;
  type: "internship" | "bootcamp" | "job" | "cohort" | "other";
  description: string;
  url: string;
  location: string;
  postedDate: string;
  deadline?: string;
  salary?: string;
  requirements?: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

interface Stats {
  total: number;
  unread: number;
  archived: number;
  byType: {
    internship: number;
    bootcamp: number;
    job: number;
    cohort: number;
  };
}

const typeConfig = {
  internship: { icon: GraduationCap, label: "Internship", color: "#3b82f6", bg: "#dbeafe" },
  bootcamp: { icon: Rocket, label: "Bootcamp", color: "#8b5cf6", bg: "#ede9fe" },
  job: { icon: Briefcase, label: "Job", color: "#10b981", bg: "#d1fae5" },
  cohort: { icon: Users, label: "Cohort", color: "#f59e0b", bg: "#fef3c7" },
  other: { icon: Bell, label: "Other", color: "#6b7280", bg: "#f3f4f6" },
};

export default function JobOpportunitiesPage() {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filter === "unread") params.set("isRead", "false");
      if (filter === "archived") params.set("isArchived", "true");
      if (typeFilter !== "all") params.set("type", typeFilter);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.jobs);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filter, typeFilter]);

  const markAsRead = async (id: number, isRead: boolean) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });

      if (res.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const toggleArchive = async (id: number, isArchived: boolean) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived }),
      });

      if (res.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const deleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const triggerScrape = async () => {
    try {
      setScraping(true);
      const res = await fetch("/api/jobs/scrape", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        fetchJobs();
      } else {
        alert("Scraping failed: " + data.error);
      }
    } catch (error) {
      console.error("Error triggering scrape:", error);
      alert("Failed to trigger scraping");
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Opportunities Tracker</h1>
          <p className="text-gray-600">
            Automatically track opportunities from top Nepali tech companies
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total" value={stats.total} icon={Briefcase} color="#3b82f6" />
            <StatCard label="Unread" value={stats.unread} icon={Bell} color="#ef4444" />
            <StatCard label="Internships" value={stats.byType.internship} icon={GraduationCap} color="#3b82f6" />
            <StatCard label="Bootcamps" value={stats.byType.bootcamp} icon={Rocket} color="#8b5cf6" />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={triggerScrape}
            disabled={scraping}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw size={18} className={scraping ? "animate-spin" : ""} />
            {scraping ? "Scraping..." : "Scrape Now"}
          </button>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="all">All</option>
            <option value="unread">Unread Only</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="all">All Types</option>
            <option value="internship">Internships</option>
            <option value="bootcamp">Bootcamps</option>
            <option value="job">Jobs</option>
            <option value="cohort">Cohorts</option>
          </select>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw size={32} className="animate-spin mx-auto text-gray-400" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No opportunities found. Try running the scraper!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onMarkRead={markAsRead}
                onToggleArchive={toggleArchive}
                onDelete={deleteJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 border shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: color + "20" }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

function JobCard({ job, onMarkRead, onToggleArchive, onDelete }: any) {
  const config = typeConfig[job.type as keyof typeof typeConfig];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white rounded-lg border p-6 hover:shadow-md transition-all ${
        !job.isRead ? "border-l-4" : ""
      }`}
      style={{ borderLeftColor: !job.isRead ? config.color : undefined }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: config.bg }}>
              <Icon size={18} style={{ color: config.color }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Building2 size={14} />
                {job.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(job.postedDate).toLocaleDateString()}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <DollarSign size={14} />
                {job.salary}
              </span>
            )}
            {job.deadline && (
              <span className="flex items-center gap-1 text-red-600 font-medium">
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>

          <div className="flex flex-wrap gap-2">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              View Details <ExternalLink size={14} />
            </a>

            {!job.isRead && (
              <button
                onClick={() => onMarkRead(job.id, true)}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <CheckCircle size={14} />
                Mark as Read
              </button>
            )}

            <button
              onClick={() => onToggleArchive(job.id, !job.isArchived)}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <Archive size={14} />
              {job.isArchived ? "Unarchive" : "Archive"}
            </button>

            <button
              onClick={() => onDelete(job.id)}
              className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <XCircle size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
