"use client";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

interface SkillBarProps {
  name: string;
  level: number;
  Icon: IconType;
  color: string;
}

export default function SkillBar({ name, level, Icon, color }: SkillBarProps) {
  const label =
    level >= 85 ? "Expert" : level >= 75 ? "Advanced" : level >= 60 ? "Proficient" : "Learning";

  return (
    <div className="group space-y-2">
      {/* Label Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-300"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <span className="text-sm font-bold tracking-widest text-gray-300 uppercase group-hover:text-white transition-colors">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
          >
            {label}
          </span>
          <span className="text-xs font-mono text-gray-500">{level}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          viewport={{ once: true }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 12px ${color}66`,
          }}
        >
          {/* shine sweep */}
          <motion.div
            initial={{ x: "-100%" }}
            whileInView={{ x: "200%" }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}
