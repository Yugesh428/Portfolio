"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PenTool,
  BookOpen,
  Music,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Download,
  Loader2,
} from "lucide-react";

interface CreativeWork {
  id: number;
  title: string;
  type: "book" | "poem" | "rap" | "story" | "essay" | "article" | "script" | "other";
  category: string;
  description: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  coverImageUrl?: string;
  status: "draft" | "in-progress" | "completed" | "published";
  isPublic: boolean;
  wordCount?: number;
  language: string;
  tags: string;
}

const typeIcons = {
  book: BookOpen,
  poem: PenTool,
  rap: Music,
  story: FileText,
  essay: FileText,
  article: FileText,
  script: FileText,
  other: PenTool,
};

const typeColors = {
  book: "#8b5cf6",
  poem: "#ec4899",
  rap: "#f59e0b",
  story: "#3b82f6",
  essay: "#10b981",
  article: "#6366f1",
  script: "#ef4444",
  other: "#6b7280",
};

const statusColors = {
  draft: "#9ca3af",
  "in-progress": "#3b82f6",
  completed: "#10b981",
  published: "#8b5cf6",
};

export default function CreativeWorksPage() {
  const [works, setWorks] = useState<CreativeWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const [form, setForm] = useState({
    title: "",
    type: "poem" as CreativeWork["type"],
    category: "personal",
    description: "",
    content: "",
    status: "draft" as CreativeWork["status"],
    isPublic: false,
    language: "english",
    tags: "",
    fileUrl: "",
    fileName: "",
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/creative-works");
      const data = await res.json();
      if (data.success) {
        setWorks(data.works);
      }
    } catch (error) {
      console.error("Error fetching works:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "portfolio/creative-works");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setForm({ 
          ...form, 
          fileUrl: data.url, 
          fileName: data.fileName,
        });
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/creative-works/${editingId}` : "/api/creative-works";
      const method = editingId ? "PATCH" : "POST";

      // Calculate word count from content
      const wordCount = form.content ? form.content.split(/\s+/).filter(Boolean).length : 0;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          wordCount,
          fileSize: selectedFile?.size,
        }),
      });

      if (res.ok) {
        fetchWorks();
        setShowForm(false);
        setEditingId(null);
        setSelectedFile(null);
        setForm({
          title: "",
          type: "poem",
          category: "personal",
          description: "",
          content: "",
          status: "draft",
          isPublic: false,
          language: "english",
          tags: "",
          fileUrl: "",
          fileName: "",
        });
      }
    } catch (error) {
      console.error("Error saving work:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this work?")) return;

    try {
      const res = await fetch(`/api/creative-works/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchWorks();
      }
    } catch (error) {
      console.error("Error deleting work:", error);
    }
  };

  const togglePublic = async (work: CreativeWork) => {
    try {
      await fetch(`/api/creative-works/${work.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !work.isPublic }),
      });
      fetchWorks();
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };

  const filteredWorks = works.filter((work) => {
    if (filter === "all") return true;
    if (filter === "public") return work.isPublic;
    if (filter === "draft") return work.status === "draft";
    return work.type === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Creative Works</h1>
            <p className="text-gray-600">Books, poems, raps, and writings</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            New Work
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "book", "poem", "rap", "story", "public", "draft"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-600 border hover:border-pink-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit" : "Create"} Work</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="book">Book</option>
                <option value="poem">Poem</option>
                <option value="rap">Rap</option>
                <option value="story">Story</option>
                <option value="essay">Essay</option>
                <option value="article">Article</option>
                <option value="script">Script</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="published">Published</option>
              </select>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="english">English</option>
                <option value="nepali">Nepali</option>
                <option value="hindi">Hindi</option>
              </select>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg"
                rows={2}
              />
              <textarea
                placeholder="Content (write your text here)"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg"
                rows={6}
              />
              
              {/* File Upload */}
              <div className="col-span-2 border-2 border-dashed rounded-lg p-4">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-600 mb-2">
                    Upload PDF (optional, max 10MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-violet-600">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                  {form.fileName && !uploading && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ {form.fileName}
                    </div>
                  )}
                </label>
              </div>

              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="col-span-2 px-4 py-2 border rounded-lg"
              />
              <label className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Make this work public</span>
              </label>
              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                >
                  {editingId ? "Update" : "Create"} Work
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setSelectedFile(null);
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Works Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <PenTool size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No works found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorks.map((work) => {
              const Icon = typeIcons[work.type];
              const color = typeColors[work.type];
              const statusColor = statusColors[work.status];

              return (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg border p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: color + "20" }}
                    >
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePublic(work)}
                        className={work.isPublic ? "text-green-500" : "text-gray-300"}
                      >
                        {work.isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(work.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-1">{work.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{work.category}</p>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {work.description}
                  </p>

                  {work.fileName && (
                    <a
                      href={work.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 mb-2"
                    >
                      <Download size={14} />
                      {work.fileName}
                    </a>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: statusColor + "20",
                        color: statusColor,
                      }}
                    >
                      {work.status}
                    </span>
                    {work.wordCount && (
                      <span className="text-xs text-gray-500">
                        {work.wordCount.toLocaleString()} words
                      </span>
                    )}
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
