"use client";

import { useEffect, useState } from "react";
import { FileText, Mail, Calendar, ChevronDown, ChevronUp } from "lucide-react";

interface Contact {
  id: number; name: string; email: string; subject: string;
  message: string; createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    // We'll call the contact GET endpoint
    fetch("/api/contact").then(r => r.json()).then(async () => {
      // Fetch all contact messages via a dedicated admin endpoint
      const res = await fetch("/api/dashboard/contacts");
      const d = await res.json();
      if (d.success) setContacts(d.contacts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Contact Forms</h1>
        <p className="text-gray-500 text-sm mt-0.5">All messages submitted through your portfolio contact form.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold">No contact messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {c.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />{new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-purple-600 truncate">{c.subject}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Mail size={10} />{c.email}
                  </p>
                </div>
                {expanded === c.id ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
              </button>

              {expanded === c.id && (
                <div className="px-6 pb-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed pt-4 whitespace-pre-wrap">{c.message}</p>
                  <div className="mt-4">
                    <a href={`mailto:${c.email}?subject=Re: ${c.subject}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors">
                      <Mail size={13} /> Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
