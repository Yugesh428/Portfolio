"use client";

import { useEffect, useRef } from "react";

const NODES = [
  { label: "Next.js",     color: "#FFFFFF", x: 0.08, y: 0.22 },
  { label: "Node.js",     color: "#339933", x: 0.88, y: 0.18 },
  { label: "TypeScript",  color: "#3178C6", x: 0.06, y: 0.60 },
  { label: "MySQL",       color: "#4479A1", x: 0.90, y: 0.58 },
  { label: "React",       color: "#61DAFB", x: 0.82, y: 0.82 },
  { label: "Spring Boot", color: "#6DB33F", x: 0.14, y: 0.82 },
];

export default function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let progress = 0; // 0 → 1 line draw progress
    let pulse = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.42; // center = roughly where name sits

      progress = Math.min(progress + 0.008, 1);
      pulse += 0.04;

      NODES.forEach((node) => {
        const nx = w * node.x;
        const ny = h * node.y;

        // --- draw line ---
        const lineProgress = Math.min(progress * 1.4, 1); // lines draw fast
        const endX = cx + (nx - cx) * lineProgress;
        const endY = cy + (ny - cy) * lineProgress;

        // glowing line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        const grad = ctx.createLinearGradient(cx, cy, nx, ny);
        grad.addColorStop(0, `${node.color}55`);
        grad.addColorStop(1, `${node.color}22`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // traveling dot along line
        if (lineProgress >= 1) {
          const t = (Math.sin(pulse + node.x * 5) + 1) / 2;
          const dotX = cx + (nx - cx) * t;
          const dotY = cy + (ny - cy) * t;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // node dot
        if (lineProgress >= 1) {
          const glow = (Math.sin(pulse + node.x * 3) + 1) / 2;
          ctx.beginPath();
          ctx.arc(nx, ny, 4 + glow * 2, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 15 + glow * 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // center dot pulse
      const cp = (Math.sin(pulse) + 1) / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 5 + cp * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6,182,212,${0.5 + cp * 0.5})`;
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 20 + cp * 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
