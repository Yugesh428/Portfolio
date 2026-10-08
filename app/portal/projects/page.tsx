"use client";

import { useEffect, useState } from "react";
import { FolderKanban, Clock, CheckCircle, Loader, Eye, PauseCircle } from "lucide-react";

const STATUS: Record<string, { label: string; color: string }> = {
  planning:    { label: "Planning",    color: "bg-gray-100 text-gray-600" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700" },
  review:      { label: "In Review",   color: "bg-yellow-100 text-yellow-700" },
  completed:   { label: "Completed",   color: "bg-green-100 text-green-700" },
  on_hold:     { label: "On Hold",     color: "bg-orange-100 text-orange-700" },
};

export default function PortalProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/projects").then(r => r.json()).then(d => {
      if (d.success) setProjects(d.projects);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Your Projects</h1>
        <p className="text-gray-500 text-sm mt-1">Track the progress of all your projects with Yugesh.</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <FolderKanban size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold">No projects yet.</p>
          <p className="text-gray-400 text-sm mt-1">Yugesh will create your first project soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(p => {
            const st = STATUS[p.status] ?? STATUS.planning;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-black text-gray-900 text-lg">{p.title}</h2>
                    {p.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{p.description}</p>}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 capitalize ${st.color}`}>
                    {p.status.replace("_", " ")}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="font-semibold">Progress</span>
                    <span className="font-black text-purple-600">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-purple-500 to-green-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${p.progress}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  {p.techStack && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.techStack.split(",").map((t: string) => (
                        <span key={t} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-bold">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  {p.deadline && (
                    <span className="flex items-center gap-1"><Clock size={11} />Due {new Date(p.deadline).toLocaleDateString()}</span>
                  )}
                  {p.budget && (
                    <span className="font-semibold text-gray-600">Budget: ${Number(p.budget).toLocaleString()}</span>
                  )}
                  {p.completedAt && (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <CheckCircle size={11} />Completed {new Date(p.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
