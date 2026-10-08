"use client";

import { useEffect, useState } from "react";
import { FolderKanban, Plus, ChevronRight, Clock, CheckCircle, Loader, PauseCircle, Eye } from "lucide-react";

const STATUS_STYLES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  planning:    { label: "Planning",     color: "bg-gray-100 text-gray-600",   icon: <Clock size={10} /> },
  in_progress: { label: "In Progress",  color: "bg-blue-100 text-blue-700",   icon: <Loader size={10} /> },
  review:      { label: "In Review",    color: "bg-yellow-100 text-yellow-700", icon: <Eye size={10} /> },
  completed:   { label: "Completed",    color: "bg-green-100 text-green-700", icon: <CheckCircle size={10} /> },
  on_hold:     { label: "On Hold",      color: "bg-orange-100 text-orange-700", icon: <PauseCircle size={10} /> },
};

interface Project {
  id: number; title: string; description: string; status: string;
  progress: number; techStack: string; budget: number; deadline: string;
  createdAt: string;
  client: { id: number; name: string; email: string; company: string };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients]   = useState<any[]>([]);
  const [form, setForm]         = useState({ clientId: "", title: "", description: "", techStack: "", budget: "", deadline: "" });
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState<string | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({ status: "", progress: 0 });

  const loadProjects = () => {
    fetch("/api/dashboard/projects").then(r => r.json()).then(d => {
      if (d.success) setProjects(d.projects);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProjects();
    fetch("/api/dashboard/clients").then(r => r.json()).then(d => {
      if (d.success) setClients(d.clients);
    });
  }, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/dashboard/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setMsg("Project created!");
      setShowForm(false);
      setForm({ clientId:"", title:"", description:"", techStack:"", budget:"", deadline:"" });
      loadProjects();
    } else {
      setMsg(data.error);
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const updateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProject) return;
    setSaving(true);
    const res = await fetch("/api/dashboard/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: editProject.id, ...editForm }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setMsg("Project updated!");
      setEditProject(null);
      loadProjects();
    } else { setMsg(data.error); }
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track and manage all client projects.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">
          <Plus size={16} /> New Project
        </button>
      </div>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl">{msg}</div>}

      {/* Create Project Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h2 className="text-lg font-black text-gray-900 mb-5">Create New Project</h2>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Client *</label>
                <select required value={form.clientId} onChange={e => setForm(f => ({...f, clientId: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                  <option value="">Select a client</option>
                  {clients.filter(c => c.status === "approved").map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Project Title *</label>
                <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                  placeholder="e.g. E-commerce Platform"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  rows={3} placeholder="Brief project description..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Tech Stack</label>
                  <input value={form.techStack} onChange={e => setForm(f => ({...f, techStack: e.target.value}))}
                    placeholder="Next.js, Node.js..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Budget ($)</label>
                  <input type="number" value={form.budget} onChange={e => setForm(f => ({...f, budget: e.target.value}))}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({...f, deadline: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-50">
                  {saving ? "Creating..." : "Create Project"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {editProject && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h2 className="text-lg font-black text-gray-900 mb-1">{editProject.title}</h2>
            <p className="text-gray-500 text-xs mb-5">Update project status and progress</p>
            <form onSubmit={updateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                <select value={editForm.status} onChange={e => setEditForm(f => ({...f, status: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                  {Object.entries(STATUS_STYLES).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">
                  Progress: <span className="text-purple-600">{editForm.progress}%</span>
                </label>
                <input type="range" min={0} max={100} value={editForm.progress}
                  onChange={e => setEditForm(f => ({...f, progress: Number(e.target.value)}))}
                  className="w-full accent-purple-600" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditProject(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <FolderKanban size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold">No projects yet. Create one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map(p => {
            const st = STATUS_STYLES[p.status] ?? STATUS_STYLES.planning;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-black text-gray-900">{p.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{p.client?.name} {p.client?.company ? `· ${p.client.company}` : ""}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${st.color}`}>
                    {st.icon}{st.label}
                  </span>
                </div>

                {p.description && <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{p.description}</p>}

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold">Progress</span>
                    <span className="font-black text-purple-600">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${p.progress}%` }} />
                  </div>
                </div>

                {p.techStack && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.split(",").map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-bold">{t.trim()}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  {p.deadline && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={11} />Due {new Date(p.deadline).toLocaleDateString()}
                    </span>
                  )}
                  <button onClick={() => { setEditProject(p); setEditForm({ status: p.status, progress: p.progress }); }}
                    className="ml-auto text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1">
                    Update <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
