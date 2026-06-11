"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFoundContent() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[20%] h-[20%] rounded-full bg-cyan-900/15 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 space-y-8 max-w-lg"
      >
        {/* 404 number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-[10rem] font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Page Not Found
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Looks like this page went off-grid. The URL might be wrong or the
            page no longer exists.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full"
        />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow"
          >
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-gray-300 font-bold text-sm uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </motion.div>

        {/* Brand */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[10px] text-gray-600 uppercase tracking-widest font-black"
        >
          Yugesh<span className="text-cyan-400">.dev</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
