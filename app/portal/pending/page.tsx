"use client";

import { signOut } from "next-auth/react";
import { Clock, Mail, LogOut } from "lucide-react";
import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <div className="w-16 h-16 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center mx-auto mb-6">
            <Clock size={28} className="text-yellow-500" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Account Pending Approval</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Your account is under review. Yugesh will approve your access shortly. You'll receive an email notification once approved.
          </p>
          <div className="space-y-3">
            <a href="mailto:bastolayugesh2@gmail.com"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">
              <Mail size={16} /> Email Yugesh directly
            </a>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600">← Back to portfolio</Link>
        </p>
      </div>
    </div>
  );
}
