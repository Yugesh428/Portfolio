"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function AIDeveloperAvatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animId: number;

    const SIZE = 420;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, SIZE, SIZE);

      const cx = SIZE / 2;
      const cy = SIZE / 2;
      const r = SIZE / 2 - 4;
      const t = frame * 0.018;

      // ── clip everything inside the circle ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // ── deep space background ──
      const bg = ctx.createRadialGradient(cx, cy - 40, 30, cx, cy, r);
      bg.addColorStop(0, "#0a1628");
      bg.addColorStop(0.5, "#060e1c");
      bg.addColorStop(1, "#030810");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // ── subtle grid floor ──
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = "#00BFFF";
      ctx.lineWidth = 0.6;
      for (let gx = 0; gx <= SIZE; gx += 24) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, SIZE); ctx.stroke();
      }
      for (let gy = 0; gy <= SIZE; gy += 24) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(SIZE, gy); ctx.stroke();
      }
      ctx.restore();

      // ── ambient glow orbs ──
      const paintOrb = (x: number, y: number, radius: number, color: string, alpha: number) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, color.replace(")", `,${alpha})`).replace("rgb", "rgba"));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      };
      paintOrb(cx - 40, cy - 60, 160, "rgb(0,80,220)", 0.22);
      paintOrb(cx + 60, cy + 40, 130, "rgb(0,191,255)", 0.12);
      paintOrb(cx, cy + 100, 100, "rgb(80,0,200)", 0.10);

      // ══════════════════════════════════════════
      //  BODY / SUIT
      // ══════════════════════════════════════════
      const suitGrad = ctx.createLinearGradient(cx - 80, cy + 80, cx + 80, cy + 240);
      suitGrad.addColorStop(0, "#0d1e3a");
      suitGrad.addColorStop(0.5, "#0a1628");
      suitGrad.addColorStop(1, "#060e1c");
      ctx.fillStyle = suitGrad;
      // torso shape
      ctx.beginPath();
      ctx.moveTo(cx - 90, SIZE + 10);
      ctx.lineTo(cx - 90, cy + 105);
      ctx.quadraticCurveTo(cx - 85, cy + 68, cx - 50, cy + 58);
      ctx.lineTo(cx - 30, cy + 55);
      ctx.lineTo(cx + 30, cy + 55);
      ctx.lineTo(cx + 50, cy + 58);
      ctx.quadraticCurveTo(cx + 85, cy + 68, cx + 90, cy + 105);
      ctx.lineTo(cx + 90, SIZE + 10);
      ctx.closePath();
      ctx.fill();

      // suit collar cyan glow
      ctx.strokeStyle = `rgba(0,191,255,${0.4 + Math.sin(t) * 0.15})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 28, cy + 56);
      ctx.lineTo(cx - 10, cy + 75);
      ctx.lineTo(cx, cy + 72);
      ctx.lineTo(cx + 10, cy + 75);
      ctx.lineTo(cx + 28, cy + 56);
      ctx.stroke();

      // chest glowing arc / reactor dot
      const reactorPulse = 0.7 + Math.sin(t * 2) * 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy + 95, 12, 0, Math.PI * 2);
      const reactorGrad = ctx.createRadialGradient(cx, cy + 95, 0, cx, cy + 95, 12);
      reactorGrad.addColorStop(0, `rgba(0,191,255,${reactorPulse})`);
      reactorGrad.addColorStop(0.5, `rgba(0,120,255,${reactorPulse * 0.6})`);
      reactorGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = reactorGrad;
      ctx.fill();
      ctx.shadowColor = "#00BFFF";
      ctx.shadowBlur = 16 * reactorPulse;
      ctx.beginPath();
      ctx.arc(cx, cy + 95, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,240,255,${reactorPulse})`;
      ctx.fill();
      ctx.shadowBlur = 0;

      // ══════════════════════════════════════════
      //  NECK
      // ══════════════════════════════════════════
      const neckGrad = ctx.createLinearGradient(cx - 18, cy + 36, cx + 18, cy + 58);
      neckGrad.addColorStop(0, "#c8a882");
      neckGrad.addColorStop(1, "#a07850");
      ctx.fillStyle = neckGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy + 38);
      ctx.lineTo(cx - 18, cy + 58);
      ctx.lineTo(cx + 18, cy + 58);
      ctx.lineTo(cx + 16, cy + 38);
      ctx.closePath();
      ctx.fill();

      // ══════════════════════════════════════════
      //  HEAD (3-D egg shape)
      // ══════════════════════════════════════════
      const headY = cy - 38;
      const headRx = 56;
      const headRy = 65;

      // head shadow/depth on right
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 6;

      const headGrad = ctx.createRadialGradient(cx - 18, headY - 18, 8, cx, headY, headRx + 10);
      headGrad.addColorStop(0, "#d4a87a");
      headGrad.addColorStop(0.45, "#c49060");
      headGrad.addColorStop(0.75, "#9a6840");
      headGrad.addColorStop(1, "#6b3e20");
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.ellipse(cx, headY, headRx, headRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // rim light — left side cyan
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const rimGrad = ctx.createLinearGradient(cx - headRx, headY, cx - headRx * 0.3, headY);
      rimGrad.addColorStop(0, "rgba(0,191,255,0.28)");
      rimGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.ellipse(cx, headY, headRx, headRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── HAIR (dark, stylish swept back) ──
      ctx.fillStyle = "#1a0e08";
      ctx.beginPath();
      ctx.ellipse(cx, headY - headRy + 22, headRx - 4, 30, 0, Math.PI, 0);
      ctx.fill();
      // hair highlight
      ctx.strokeStyle = "rgba(100,60,20,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 30, headY - headRy + 18);
      ctx.quadraticCurveTo(cx + 5, headY - headRy + 5, cx + 36, headY - headRy + 22);
      ctx.stroke();

      // ── EYEBROWS ──
      ctx.strokeStyle = "#2a1a08";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      // left brow
      ctx.beginPath();
      ctx.moveTo(cx - 36, headY - 14);
      ctx.quadraticCurveTo(cx - 22, headY - 20, cx - 10, headY - 15);
      ctx.stroke();
      // right brow
      ctx.beginPath();
      ctx.moveTo(cx + 10, headY - 15);
      ctx.quadraticCurveTo(cx + 22, headY - 20, cx + 36, headY - 14);
      ctx.stroke();

      // ── EYES (glowing AI pupils) ──
      // eye whites
      ctx.fillStyle = "#f0e8d8";
      // left eye
      ctx.beginPath();
      ctx.ellipse(cx - 22, headY - 3, 12, 7.5, -0.12, 0, Math.PI * 2);
      ctx.fill();
      // right eye
      ctx.beginPath();
      ctx.ellipse(cx + 22, headY - 3, 12, 7.5, 0.12, 0, Math.PI * 2);
      ctx.fill();

      // AI iris glow
      const eyeGlow = 0.7 + Math.sin(t * 1.5) * 0.3;
      [[cx - 22, headY - 3], [cx + 22, headY - 3]].forEach(([ex, ey]) => {
        const irisG = ctx.createRadialGradient(ex, ey, 0, ex, ey, 7);
        irisG.addColorStop(0, `rgba(0,220,255,${eyeGlow})`);
        irisG.addColorStop(0.5, `rgba(0,100,255,${eyeGlow * 0.8})`);
        irisG.addColorStop(1, "rgba(0,0,50,0.9)");
        ctx.fillStyle = irisG;
        ctx.beginPath();
        ctx.arc(ex, ey, 7, 0, Math.PI * 2);
        ctx.fill();
        // pupil
        ctx.fillStyle = "#000010";
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // specular
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.arc(ex - 2.5, ey - 2.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
        // glow halo
        ctx.shadowColor = "#00DCFF";
        ctx.shadowBlur = 8 * eyeGlow;
        ctx.beginPath();
        ctx.arc(ex, ey, 7.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,191,255,${eyeGlow * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // ── NOSE ──
      ctx.strokeStyle = "rgba(80,40,10,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, headY - 2);
      ctx.lineTo(cx - 5, headY + 14);
      ctx.quadraticCurveTo(cx, headY + 16, cx + 5, headY + 14);
      ctx.stroke();

      // ── MOUTH (subtle smile) ──
      ctx.strokeStyle = "rgba(80,35,10,0.65)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 16, headY + 26);
      ctx.quadraticCurveTo(cx, headY + 33, cx + 16, headY + 26);
      ctx.stroke();

      // ── EAR LEFT ──
      ctx.fillStyle = "#b87e4a";
      ctx.beginPath();
      ctx.ellipse(cx - headRx + 4, headY + 4, 9, 14, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // ── EAR RIGHT ──
      ctx.beginPath();
      ctx.ellipse(cx + headRx - 4, headY + 4, 9, 14, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // ── FLOATING HUD elements ──
      // scan line across face
      const scanY = headY - headRy + ((frame * 1.5) % (headRy * 2));
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#00BFFF";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - headRx + 4, headY - headRy + scanY % (headRy * 2));
      ctx.lineTo(cx + headRx - 4, headY - headRy + scanY % (headRy * 2));
      ctx.stroke();
      ctx.restore();

      // corner brackets around head
      const bx = cx - headRx - 10, by = headY - headRy - 10;
      const bw = (headRx + 10) * 2, bh = (headRy + 10) * 2;
      const bs = 18; // bracket segment size
      const bracketAlpha = 0.5 + Math.sin(t * 2) * 0.2;
      ctx.strokeStyle = `rgba(0,191,255,${bracketAlpha})`;
      ctx.lineWidth = 1.5;
      // top-left
      ctx.beginPath(); ctx.moveTo(bx, by + bs); ctx.lineTo(bx, by); ctx.lineTo(bx + bs, by); ctx.stroke();
      // top-right
      ctx.beginPath(); ctx.moveTo(bx + bw - bs, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bs); ctx.stroke();
      // bottom-left
      ctx.beginPath(); ctx.moveTo(bx, by + bh - bs); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bs, by + bh); ctx.stroke();
      // bottom-right
      ctx.beginPath(); ctx.moveTo(bx + bw - bs, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - bs); ctx.stroke();

      // small label: "AI DEV"
      ctx.font = "bold 9px 'Courier New', monospace";
      ctx.fillStyle = `rgba(0,191,255,${bracketAlpha})`;
      ctx.fillText("AI // DEV", bx + 2, by - 4);

      ctx.restore(); // end clip

      // ── CIRCLE BORDER — glowing ring ──
      const borderAlpha = 0.6 + Math.sin(t) * 0.15;
      const ring = ctx.createLinearGradient(0, 0, SIZE, SIZE);
      ring.addColorStop(0, `rgba(124,58,237,${borderAlpha})`);
      ring.addColorStop(0.4, `rgba(37,99,235,${borderAlpha})`);
      ring.addColorStop(0.7, `rgba(0,191,255,${borderAlpha})`);
      ring.addColorStop(1, `rgba(124,58,237,${borderAlpha})`);
      ctx.strokeStyle = ring;
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00BFFF";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── Outer orbit ring (dashed, spinning) ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.4);
      ctx.setLineDash([6, 10]);
      ctx.strokeStyle = `rgba(0,191,255,${0.2 + Math.sin(t) * 0.06})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, r + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 420, height: 420 }}>
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,120,255,0.22) 0%, rgba(0,80,180,0.12) 40%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        style={{ borderRadius: "50%", display: "block", position: "relative", zIndex: 1 }}
      />

      {/* Orbiting tech pills */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* Top pill */}
        <div
          className="absolute flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-sm border"
          style={{
            top: "2%", left: "50%", transform: "translateX(-50%)",
            background: "rgba(5,11,24,0.85)", borderColor: "rgba(0,191,255,0.35)",
            color: "#00BFFF", boxShadow: "0 0 12px rgba(0,191,255,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-pulse" />
          React
        </div>
        {/* Bottom pill */}
        <div
          className="absolute flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-sm border"
          style={{
            bottom: "2%", left: "50%", transform: "translateX(-50%)",
            background: "rgba(5,11,24,0.85)", borderColor: "rgba(124,58,237,0.35)",
            color: "#a78bfa", boxShadow: "0 0 12px rgba(124,58,237,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
          Node.js
        </div>
      </motion.div>

      {/* Static side pills (counter-rotate to stay level) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 3 }}
      >
        {/* Left pill */}
        <div
          className="absolute flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-sm border"
          style={{
            top: "50%", left: "-2%", transform: "translateY(-50%)",
            background: "rgba(5,11,24,0.85)", borderColor: "rgba(37,99,235,0.35)",
            color: "#60a5fa", boxShadow: "0 0 12px rgba(37,99,235,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
          TS
        </div>
        {/* Right pill */}
        <div
          className="absolute flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-sm border"
          style={{
            top: "50%", right: "-2%", transform: "translateY(-50%)",
            background: "rgba(5,11,24,0.85)", borderColor: "rgba(0,180,80,0.35)",
            color: "#4ade80", boxShadow: "0 0 12px rgba(0,180,80,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          SQL
        </div>
      </motion.div>

      {/* Second orbit ring — Java & Next.js (diagonal, slower counter-clockwise) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* Top-right diagonal — Next.js */}
        <div
          className="absolute flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-sm border"
          style={{
            top: "11%", right: "4%",
            background: "rgba(5,11,24,0.85)", borderColor: "rgba(255,255,255,0.25)",
            color: "#e2e8f0", boxShadow: "0 0 12px rgba(255,255,255,0.15)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0] animate-pulse" />
          Next.js
        </div>
        {/* Bottom-left diagonal — Java */}
        <div
          className="absolute flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-sm border"
          style={{
            bottom: "11%", left: "4%",
            background: "rgba(5,11,24,0.85)", borderColor: "rgba(249,115,22,0.35)",
            color: "#fb923c", boxShadow: "0 0 12px rgba(249,115,22,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#fb923c] animate-pulse" />
          Java
        </div>
      </motion.div>
    </div>
  );
}
