"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Paperclip, MessageSquare, Loader2 } from "lucide-react";

interface User { id: number; name: string; email: string; avatarUrl: string | null; role: string; }
interface Message {
  id: number; body: string; isRead: boolean; createdAt: string;
  senderId: number; receiverId: number;
  attachmentUrl: string | null; attachmentName: string | null;
  sender: User; receiver: User;
}

export default function MessagesPage() {
  const [clients, setClients]     = useState<User[]>([]);
  const [selected, setSelected]   = useState<User | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [file, setFile]           = useState<File | null>(null);
  const [sending, setSending]     = useState(false);
  const [myId, setMyId]           = useState<number | null>(null);
  const bottomRef                 = useRef<HTMLDivElement>(null);

  // Get current user id from session
  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(s => {
      if (s?.user?.id) setMyId(Number(s.user.id));
    });
    fetch("/api/dashboard/clients").then(r => r.json()).then(d => {
      if (d.success) setClients(d.clients.filter((c: any) => c.status === "approved"));
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/dashboard/messages?withUserId=${selected.id}`)
      .then(r => r.json()).then(d => { if (d.success) setMessages(d.messages); });
    const t = setInterval(() => {
      fetch(`/api/dashboard/messages?withUserId=${selected.id}`)
        .then(r => r.json()).then(d => { if (d.success) setMessages(d.messages); });
    }, 5000);
    return () => clearInterval(t);
  }, [selected]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if ((!input.trim() && !file) || !selected || sending) return;
    setSending(true);

    const formData = new FormData();
    formData.append("body", input.trim());
    formData.append("receiverId", String(selected.id));
    if (file) formData.append("file", file);

    const res = await fetch("/api/dashboard/messages", { method: "POST", body: formData });
    const data = await res.json();
    if (data.success) {
      setInput(""); setFile(null);
      const r = await fetch(`/api/dashboard/messages?withUserId=${selected.id}`);
      const d = await r.json();
      if (d.success) setMessages(d.messages);
    }
    setSending(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-200 overflow-hidden max-w-5xl">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900 text-sm">Messages</h2>
          <p className="text-xs text-gray-400 mt-0.5">Chat with your clients</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {clients.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">No approved clients yet</p>
          ) : clients.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${selected?.id === c.id ? "bg-purple-50 border-r-2 border-purple-600" : ""}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {c.name[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-gray-900 truncate">{c.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{c.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {!selected ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <MessageSquare size={40} className="mb-3 text-gray-300" />
          <p className="font-semibold text-sm">Select a client to start chatting</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-black text-sm">
              {selected.name[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{selected.name}</p>
              <p className="text-xs text-gray-400">{selected.email}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(m => {
              const isMe = m.senderId === myId;
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm"
                         : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}>
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
              <label className="cursor-pointer p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-purple-600 transition-colors">
                <Paperclip size={18} />
                <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
              </label>
              <input
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder={`Message ${selected.name}...`}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button onClick={sendMessage} disabled={(!input.trim() && !file) || sending}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0">
                {sending ? <Loader2 size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
