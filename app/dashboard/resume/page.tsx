"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText, Upload, Link as LinkIcon, CheckCircle2,
  AlertCircle, ExternalLink, Trash2, RefreshCw,
} from "lucide-react";

type Tab = "upload" | "url";

export default function ResumeDashboardPage() {
  const [tab, setTab]           = useState<Tab>("upload");
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [file, setFile]         = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [status, setStatus]     = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Fetch current resume URL ── */
  useEffect(() => {
    fetch("/api/resume")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.resumeUrl) {
          setCurrentUrl(d.resumeUrl);
          setUrlInput(d.resumeUrl);
        }
      })
      .catch(() => {});
  }, []);

  /* ── Save a URL directly ── */
  const saveUrl = async () => {
    if (!urlInput.trim()) return;
    setSaving(true);
    setStatus({ type: null, message: "" });
    try {
      const res = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: urlInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUrl(data.resumeUrl);
        setStatus({ type: "success", message: "Resume URL saved! The navbar now points to your new resume." });
      } else {
        setStatus({ type: "error", message: data.error || "Failed to save URL." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  /* ── Upload PDF then save the Cloudinary URL ── */
  const uploadAndSave = async () => {
    if (!file) return;
    setUploading(true);
    setStatus({ type: null, message: "" });
    try {
      // Step 1: Upload to Cloudinary via /api/upload
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "portfolio/resume");
      form.append("publicId", "yugesh_resume");

      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        setStatus({ type: "error", message: uploadData.error || "Upload failed." });
        return;
      }

      // Step 2: Persist URL to DB
      const saveRes = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: uploadData.url }),
      });
      const saveData = await saveRes.json();
      if (saveData.success) {
        setCurrentUrl(saveData.resumeUrl);
        setUrlInput(saveData.resumeUrl);
        setFile(null);
        setStatus({ type: "success", message: "Resume uploaded and saved! The navbar now links to your new PDF." });
      } else {
        setStatus({ type: "error", message: saveData.error || "Saved upload but failed to update URL." });
      }
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  /* ── Drag & drop handlers ── */
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") setFile(dropped);
    else setStatus({ type: "error", message: "Only PDF files are accepted." });
  };

  const isWorking = uploading || saving;

  return (
    <div className="max-w-2xl mx-auto space-y-6" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Header */}
      <div>
        <h2 className="text-xl text-[#18181B]" style={{ fontWeight: 700 }}>Resume Management</h2>
        <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>
          Upload a new PDF or paste a URL — the navbar Resume button updates instantly.
        </p>
      </div>

      {/* Current resume card */}
      {currentUrl && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
            <FileText size={22} style={{ color: "#2563EB" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>Current Resume</p>
            <p className="text-xs text-gray-400 truncate mt-0.5" style={{ fontWeight: 400 }}>{currentUrl}</p>
          </div>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs hover:bg-blue-100 transition-colors"
            style={{ fontWeight: 600 }}
          >
            <ExternalLink size={13} /> Preview
          </a>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["upload", "url"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setStatus({ type: null, message: "" }); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm capitalize transition-all ${
              tab === t
                ? "bg-white text-[#2563EB] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: 600 }}
          >
            {t === "upload" ? <Upload size={14} /> : <LinkIcon size={14} />}
            {t === "upload" ? "Upload PDF" : "Paste URL"}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === "upload" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              dragging
                ? "border-[#2563EB] bg-[#EFF6FF]"
                : file
                ? "border-green-400 bg-green-50"
                : "border-gray-200 hover:border-[#2563EB]/40 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) { setFile(f); setStatus({ type: null, message: "" }); }
              }}
            />
            {file ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <FileText size={28} className="text-green-600" />
                </div>
                <p className="text-sm text-gray-900 text-center" style={{ fontWeight: 600 }}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-400" style={{ fontWeight: 400 }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Upload size={26} className="text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-700" style={{ fontWeight: 600 }}>
                    Drop your PDF here or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1" style={{ fontWeight: 400 }}>
                    PDF only · max 10 MB
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={uploadAndSave}
              disabled={!file || isWorking}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] text-white text-sm hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
              style={{ fontWeight: 600 }}
            >
              {uploading ? (
                <><RefreshCw size={15} className="animate-spin" /> Uploading…</>
              ) : (
                <><Upload size={15} /> Upload &amp; Save</>
              )}
            </button>
            {file && (
              <button
                onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* URL tab */}
      {tab === "url" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-2" style={{ fontWeight: 600 }}>
              Resume URL
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={e => { setUrlInput(e.target.value); setStatus({ type: null, message: "" }); }}
              placeholder="https://drive.google.com/file/d/…/view  or  https://yoursite.com/resume.pdf"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
              style={{ fontWeight: 400 }}
            />
            <p className="text-xs text-gray-400 mt-2" style={{ fontWeight: 400 }}>
              Works with Google Drive, Dropbox, Cloudinary, or any public PDF link.
            </p>
          </div>

          <button
            onClick={saveUrl}
            disabled={!urlInput.trim() || isWorking}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] text-white text-sm hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            style={{ fontWeight: 600 }}
          >
            {saving ? (
              <><RefreshCw size={15} className="animate-spin" /> Saving…</>
            ) : (
              <><CheckCircle2 size={15} /> Save URL</>
            )}
          </button>
        </div>
      )}

      {/* Status message */}
      {status.type && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {status.type === "success"
            ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
            : <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          }
          <p className="text-sm" style={{ fontWeight: 500 }}>{status.message}</p>
        </div>
      )}

      {/* Tip card */}
      <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-5">
        <p className="text-xs text-blue-600 leading-relaxed" style={{ fontWeight: 500 }}>
          💡 <span style={{ fontWeight: 700 }}>How it works:</span> The Resume button in the navbar reads the URL stored here from the database. Updating it here changes the link for everyone visiting your site — no code deployment needed.
        </p>
      </div>
    </div>
  );
}
