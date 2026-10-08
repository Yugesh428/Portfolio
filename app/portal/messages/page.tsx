"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Paperclip, Loader2 } from "lucide-react";

interface Message {
  id: number; body: string; senderId: number; createdAt: string;
  attachmentUrl: string | null; attachmentName: string | null;
}

export default function PortalMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myId, setMyId]         = useState<number | null>(null);
  const [adminId, setAdminId]   = useState<number | null>(null);
  const [input, setInput]       = useState("");
  const [file, setFile]         = useState<File | null>(null);
  const [sending, setSending]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(async s => {
      const id = Number(s?.user?.id);
      setMyId(id);
      // Find admin
      const adminRes = await fetch("/api/portal/admin-id");
      const adminData = await adminRes.json();
      if (adminData.adminId) {
        setAdminId(adminData.adminId);
        const msgRes = await fetch(`/api/dashboard/messages?withUserId=${adminData.adminId}`);
        const d = await msgRes.json();
        if (d.success) setMessages(d.messages);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if ((!input.trim() && !file) || !adminId || sending) return;
    setSending(true);
    const formData = new FormData();
    formData.append("body", input.trim());
    formData.append("receiverId", String(adminId));
    if (file) formData.append("file", file);

    const res = await fetch("/api/dashboard/messages", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      setInput(""); setFile(null);
      const r = await fetch(`/api/dashboard/messages?withUserId=${adminId}`);
      const d = await r.json();
      if (d.success) setMessages(d.messages);
    }
    setSending(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Chat directly with Yugesh about your projects.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: "60vh" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-green-500 flex items-center justify-center text-white font-black text-sm">Y</div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Yugesh Bastola</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-xs text-green-600 font-semibold">Available</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm font-semibold">No messages yet.</p>
              <p className="text-xs mt-1">Send a message to get started!</p>
            </div>
          )}
          {messages.map(m => {
            const isMe = m.senderId === myId;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                  <p>{m.body}</p>
                  {m.attachmentUrl && (
                    <a href={m.attachmentUrl} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 mt-2 text-xs underline ${isMe ? "text-blue-200" : "text-purple-600"}`}>
                      <Paperclip size={11} />{m.attachmentName ?? "Attachment"}
                    </a>
                  )}
                  <p className={`text-[9px] mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100">
          {file && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-purple-50 rounded-lg text-xs text-purple-700 font-semibold">
              <Paperclip size={11} />{file.name}
              <button onClick={() => setFile(null)} className="ml-auto text-purple-400 hover:text-red-500">×</button>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <label className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-purple-600">
              <Paperclip size={18} />
              <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
              placeholder="Type a message..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-colors" />
            <button onClick={sendMessage} disabled={(!input.trim() && !file) || sending}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0">
              {sending ? <Loader2 size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
