"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function AboutAvatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 300;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let frame = 0;
    let animId: number;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, SIZE, SIZE);
      const cx = SIZE / 2;
      const cy = SIZE / 2;
      const t = frame * 0.022;

      // ── Background ──
      const bg = ctx.createRadialGradient(cx, cy - 30, 10, cx, cy, SIZE / 2);
      bg.addColorStop(0, "#0b1a35");
      bg.addColorStop(0.6, "#060d1e");
      bg.addColorStop(1, "#020609");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // ── Stars ──
      const stars = [
        [30, 25], [270, 40], [50, 200], [260, 190],
        [140, 20], [80, 260], [230, 260], [20, 140], [280, 130],
      ];
      stars.forEach(([sx, sy], i) => {
        const pulse = 0.4 + Math.sin(t * 1.2 + i) * 0.4;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${pulse})`;
        ctx.fill();
      });

      // ── Floating offset (bob up/down) ──
      const bob = Math.sin(t) * 8;

      // ══════════════════════════
      //  MONITOR / LAPTOP
      // ══════════════════════════
      const monX = cx - 60;
      const monY = cy + 30 + bob;
      const monW = 120;
      const monH = 76;

      // monitor shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,191,255,0.25)";
      ctx.shadowBlur = 22;

      // screen bezel
      const bezelG = ctx.createLinearGradient(monX, monY, monX, monY + monH);
      bezelG.addColorStop(0, "#1a2a4a");
      bezelG.addColorStop(1, "#0d1728");
      ctx.fillStyle = bezelG;
      ctx.beginPath();
      ctx.roundRect(monX, monY, monW, monH, 8);
      ctx.fill();
      ctx.restore();

      // screen glow
      const screenG = ctx.createLinearGradient(monX + 6, monY + 6, monX + 6, monY + monH - 10);
      screenG.addColorStop(0, "#0a1f3e");
      screenG.addColorStop(1, "#040c1c");
      ctx.fillStyle = screenG;
      ctx.beginPath();
      ctx.roundRect(monX + 6, monY + 6, monW - 12, monH - 18, 4);
      ctx.fill();

      // code lines on screen
      const lineColors = ["#00BFFF", "#a78bfa", "#4ade80", "#00BFFF", "#60a5fa"];
      const lineWidths = [55, 38, 62, 44, 30];
      lineColors.forEach((color, i) => {
        const lineProgress = ((frame * 0.6 + i * 14) % (lineWidths[i] + 10));
        const displayW = Math.min(lineProgress, lineWidths[i]);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.roundRect(monX + 12, monY + 14 + i * 10, displayW, 4, 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // blinking cursor
      if (Math.floor(t * 2) % 2 === 0) {
        ctx.fillStyle = "#00BFFF";
        ctx.fillRect(monX + 14, monY + 14 + 4 * 10, 6, 4);
      }

      // monitor stand
      ctx.fillStyle = "#0d1728";
      ctx.beginPath();
      ctx.moveTo(cx - 10, monY + monH);
      ctx.lineTo(cx + 10, monY + monH);
      ctx.lineTo(cx + 16, monY + monH + 12);
      ctx.lineTo(cx - 16, monY + monH + 12);
      ctx.closePath();
      ctx.fill();
      // stand base
      ctx.fillStyle = "#151f38";
      ctx.beginPath();
      ctx.roundRect(cx - 22, monY + monH + 10, 44, 6, 3);
      ctx.fill();

      // ══════════════════════════
      //  DEVELOPER FIGURE (sitting)
      // ══════════════════════════
      const figX = cx;
      const figY = cy - 20 + bob;

      // chair back
      ctx.fillStyle = "#0f1e38";
      ctx.beginPath();
      ctx.roundRect(figX - 28, figY - 42, 56, 50, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,191,255,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // body / torso
      const torsoG = ctx.createLinearGradient(figX - 20, figY - 38, figX + 20, figY + 10);
      torsoG.addColorStop(0, "#1e3a6e");
      torsoG.addColorStop(1, "#0f1e3a");
      ctx.fillStyle = torsoG;
      ctx.beginPath();
      ctx.roundRect(figX - 20, figY - 38, 40, 50, 6);
      ctx.fill();

      // hoodie stripe
      ctx.strokeStyle = `rgba(0,191,255,${0.5 + Math.sin(t * 2) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(figX - 8, figY - 38);
      ctx.lineTo(figX - 4, figY + 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(figX + 8, figY - 38);
      ctx.lineTo(figX + 4, figY + 12);
      ctx.stroke();

      // arms
      ctx.strokeStyle = "#1a3060";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      // left arm reaching toward monitor
      ctx.beginPath();
      ctx.moveTo(figX - 20, figY - 20);
      ctx.quadraticCurveTo(figX - 50, figY - 5, figX - 42, monY + monH * 0.35 + bob);
      ctx.stroke();
      // right arm
      ctx.beginPath();
      ctx.moveTo(figX + 20, figY - 20);
      ctx.quadraticCurveTo(figX + 46, figY - 8, figX + 40, monY + monH * 0.35 + bob);
      ctx.stroke();

      // hands
      ctx.fillStyle = "#c8954a";
      ctx.beginPath();
      ctx.arc(figX - 42, monY + monH * 0.35 + bob, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(figX + 40, monY + monH * 0.35 + bob, 6, 0, Math.PI * 2);
      ctx.fill();

      // legs
      ctx.strokeStyle = "#162848";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(figX - 12, figY + 12);
      ctx.lineTo(figX - 14, figY + 38);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(figX + 12, figY + 12);
      ctx.lineTo(figX + 14, figY + 38);
      ctx.stroke();

      // shoes
      ctx.fillStyle = "#0d1520";
      ctx.beginPath();
      ctx.ellipse(figX - 16, figY + 42, 12, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(figX + 16, figY + 42, 12, 5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // neck
      ctx.fillStyle = "#c8954a";
      ctx.beginPath();
      ctx.roundRect(figX - 7, figY - 52, 14, 16, 3);
      ctx.fill();

      // head
      const headG = ctx.createRadialGradient(figX - 8, figY - 68, 4, figX, figY - 62, 22);
      headG.addColorStop(0, "#dba870");
      headG.addColorStop(0.5, "#c8954a");
      headG.addColorStop(1, "#9a6030");
      ctx.fillStyle = headG;
      ctx.beginPath();
      ctx.ellipse(figX, figY - 66, 22, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // hair
      ctx.fillStyle = "#1a0e06";
      ctx.beginPath();
      ctx.ellipse(figX, figY - 86, 22, 12, 0, Math.PI, 0);
      ctx.fill();

      // glasses
      ctx.strokeStyle = `rgba(0,191,255,${0.8 + Math.sin(t * 1.5) * 0.2})`;
      ctx.lineWidth = 1.5;
      // left lens
      ctx.beginPath();
      ctx.roundRect(figX - 20, figY - 72, 16, 11, 3);
      ctx.stroke();
      // right lens
      ctx.beginPath();
      ctx.roundRect(figX + 4, figY - 72, 16, 11, 3);
      ctx.stroke();
      // bridge
      ctx.beginPath();
      ctx.moveTo(figX - 4, figY - 67);
      ctx.lineTo(figX + 4, figY - 67);
      ctx.stroke();
      // lens glow fill
      ctx.fillStyle = `rgba(0,191,255,${0.12 + Math.sin(t * 1.5) * 0.05})`;
      ctx.beginPath();
      ctx.roundRect(figX - 20, figY - 72, 16, 11, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(figX + 4, figY - 72, 16, 11, 3);
      ctx.fill();

      // headphones
      ctx.strokeStyle = "#2a3a60";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(figX, figY - 70, 24, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();
      // ear cups
      ctx.fillStyle = "#1e3060";
      ctx.beginPath();
      ctx.ellipse(figX - 22, figY - 68, 5, 7, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(figX + 22, figY - 68, 5, 7, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // ── Floating code snippets ──
      const snippets = [
        { text: "const dev = 🚀", x: 18, y: 55, color: "#4ade80" },
        { text: "{ }", x: 248, y: 80, color: "#a78bfa" },
        { text: "</>", x: 240, y: 210, color: "#00BFFF" },
      ];
      snippets.forEach(({ text, x, y, color }, i) => {
        const alpha = 0.5 + Math.sin(t * 0.8 + i * 1.5) * 0.3;
        ctx.font = "bold 10px 'Courier New', monospace";
        ctx.fillStyle = color.replace(")", `,${alpha})`).replace("#", "rgba(") + ")";
        // convert hex to rgba manually
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.globalAlpha = 1;
      });

      // ── HUD ring around figure ──
      const hudAlpha = 0.18 + Math.sin(t * 1.2) * 0.06;
      ctx.strokeStyle = `rgba(0,191,255,${hudAlpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(cx, figY - 10, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,100,255,0.18) 0%, rgba(80,0,200,0.10) 45%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{ display: "block", position: "relative", zIndex: 1, borderRadius: "1.2rem" }}
      />

      {/* Floating badge — "Full Stack" */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest backdrop-blur-sm"
        style={{
          background: "rgba(5,11,24,0.88)",
          borderColor: "rgba(0,191,255,0.35)",
          color: "#00BFFF",
          boxShadow: "0 0 14px rgba(0,191,255,0.2)",
          zIndex: 2,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-pulse" />
        Full Stack Dev
      </motion.div>

      {/* Top badge — "Nepal" */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest backdrop-blur-sm"
        style={{
          background: "rgba(5,11,24,0.88)",
          borderColor: "rgba(124,58,237,0.35)",
          color: "#a78bfa",
          boxShadow: "0 0 14px rgba(124,58,237,0.2)",
          zIndex: 2,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
        Nepal 🇳🇵
      </motion.div>
    </div>
  );
}
