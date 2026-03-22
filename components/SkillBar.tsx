"use client";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

interface SkillBarProps {
  name: string;
  level: number;
  Icon: IconType; // The icon component from react-icons
  color: string; // The brand color (e.g., "#3178C6" for TypeScript)
}

export default function SkillBar({ name, level, Icon, color }: SkillBarProps) {
  return (
    <div className="group space-y-3">
      {/* Label Row */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
            {/* Dynamic Brand Icon */}
            <Icon size={18} style={{ color: color }} />
          </div>
          <span className="text-sm font-bold tracking-widest text-gray-300 uppercase">
            {name}
          </span>
        </div>
        <span className="text-xs font-mono text-gray-500">{level}%</span>
      </div>

      {/* Progress Bar Row */}
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          viewport={{ once: true }}
          className="h-full rounded-full relative"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}44`, // Subtle brand-colored glow
          }}
        >
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full" />
        </motion.div>
      </div>
    </div>
  );
}
