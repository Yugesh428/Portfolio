"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", phone: "" });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [done, setDone]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);

    const res  = await fetch("/api/dashboard/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) { setDone(true); return; }
    setError(data.error ?? "Registration failed.");
  };

  if (done) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={28} className="text-green-500" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Request Sent!</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your account request has been submitted. Yugesh will review and approve your access. You'll get an email when it's ready.
          </p>
          <Link href="/auth/login" className="block w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-green-500 flex items-center justify-center text-white font-black text-lg">Y</span>
            <span className="font-black text-xl text-gray-900 tracking-tight">Yugesh.dev</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Request Portal Access</h1>
          <p className="text-gray-500 text-sm mt-1">Create a client account to track your projects</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-semibold">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name",    label: "Full Name *",     type: "text",  placeholder: "Yugesh Bastola",    required: true },
              { key: "email",   label: "Email Address *", type: "email", placeholder: "you@example.com",   required: true },
              { key: "company", label: "Company",         type: "text",  placeholder: "Your company name", required: false },
              { key: "phone",   label: "Phone",           type: "tel",   placeholder: "+977-9812345678",   required: false },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                <input type={f.type} required={f.required} placeholder={f.placeholder}
                  value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Password *</label>
              <div className="relative">
                <input type={show ? "text" : "password"} required minLength={8}
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Request Access"}
            </button>
          </form>
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">Already have access?{" "}
              <Link href="/auth/login" className="text-purple-600 font-bold hover:text-purple-800">Sign in</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600">← Back to portfolio</Link>
        </p>
      </div>
    </div>
  );
}
