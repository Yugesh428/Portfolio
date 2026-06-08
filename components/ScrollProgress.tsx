"use client";

import { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function ScrollProgress() {
  const raw = useMotionValue(0);
  const scaleX = useSpring(raw, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      raw.set(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [raw]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 origin-left"
        style={{ scaleX }}
      />
    </div>
  );
}
