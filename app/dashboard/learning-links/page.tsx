"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Link2,
  Youtube,
  BookOpen,
  FileText,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Check,
  X,
  Filter,
} from "lucide-react";

interface LearningLink {
  id: number;
  title: string;
  url: string;
  type: "youtube" | "course" | "article" | "documentation" | "tutorial" | "book" | "other";
  category: string;
  platform: string;
  description: string;
  thumbnailUrl?: string;
  author?: string;
  duration?: string;
  isCompleted: boolean;
  isFavorite: boolean;
  progress: number;
  rating?: number;
  notes?: string;
  tags: string;
}

const typeIcons = {
  youtube: Youtube,
  course: GraduationCap,
  article: FileText,
  documentation: BookOpen,
  tutorial: FileText,
  book: BookOpen,
  other: Link2,
};

const typeColors = {
  youtube: "#FF0000",
  course: "#8b5cf6",
  article: "#3b82f6",
  documentation: "#10b981",
  tutorial: "#f59e0b",
  book: "#ec4899",
  other: "#6b7280",
};

export default function LearningLinksPage() {
  const [links, setLinks] = useState<LearningLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const [form, setForm] = useState({
    title: "",
    url: "",
    type: "article" as LearningLink["type"],
    category: "programming",
    platform: "YouTube",
    description: "",
    author: "",
    duration: "",
    tags: "",
  });

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/learning-links");
      const data = await res.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/learning-links/${editingId}` : "/api/learning-links";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        fetchLinks();
        setShowForm(false);
        setEditingId(null);
        setForm({
          title: "",
          url: "",
          type: "article",
          category: "programming",
          platform: "YouTube",
          description: "",
          author: "",
          duration: "",
          tags: "",
        });
      }
    } catch (error) {
      console.error("Error saving link:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this link?")) return;

    try {
      const res = await fetch(`/api/learning-links/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const toggleComplete = async (link: LearningLink) => {
    try {
      await fetch(`/api/learning-links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !link.isCompleted }),
      });
      fetchLinks();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const toggleFavorite = async (link: LearningLink) => {
    try {
      await fetch(`/api/learning-links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !link.isFavorite }),
      });
      fetchLinks();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const filteredLinks = links.filter((link) => {
    if (filter === "all") return true;
    if (filter === "completed") return link.isCompleted;
    if (filter === "favorites") return link.isFavorite;
    return link.type === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Learning Resources</h1>
            <p className="text-gray-600">Track your learning journey</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Add Resource
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "youtube", "course", "article", "completed", "favorites"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-600 border hover:border-violet-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit" : "Add"} Learning Resource
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="url"
                placeholder="URL"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="youtube">YouTube</option>
                <option value="course">Course</option>
                <option value="article">Article</option>
                <option value="documentation">Documentation</option>
                <option value="tutorial">Tutorial</option>
                <option value="book">Book</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Category (e.g., JavaScript)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Platform"
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg"
                rows={3}
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg"
              />
              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700"
                >
                  {editingId ? "Update" : "Add"} Resource
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Links Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Link2 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No resources found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLinks.map((link) => {
              const Icon = typeIcons[link.type];
              const color = typeColors[link.type];

              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg border p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: color + "20" }}
                      >
                        <Icon size={20} style={{ color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{link.title}</h3>
                        <p className="text-sm text-gray-500">{link.platform}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(link)}
                        className={link.isFavorite ? "text-yellow-500" : "text-gray-300"}
                      >
                        <Star size={18} fill={link.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => toggleComplete(link)}
                        className={link.isCompleted ? "text-green-500" : "text-gray-300"}
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {link.description}
                  </p>

                  {link.author && (
                    <p className="text-xs text-gray-500 mb-2">By {link.author}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700"
                    >
                      Open <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
