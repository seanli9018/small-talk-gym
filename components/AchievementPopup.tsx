"use client";

import { useEffect, useRef, useState } from "react";
import { Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Confetti particle colours ────────────────────────────────
const COLORS = [
  "#facc15", "#fb923c", "#f472b6", "#34d399",
  "#60a5fa", "#a78bfa", "#f87171", "#4ade80",
];

interface Particle {
  id: number;
  left: number;      // vw %
  delay: number;     // s
  duration: number;  // s
  color: string;
  size: number;      // px
  shape: "square" | "circle" | "triangle";
}

function makeParticles(count = 40): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.6 + Math.random() * 1.4,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 8,
    shape: (["square", "circle", "triangle"] as const)[i % 3],
  }));
}

export default function AchievementPopup({
  personaName,
  message,
  onDismiss,
}: {
  personaName: string;
  message: string;
  onDismiss: () => void;
}) {
  const [phase, setPhase] = useState<"entering" | "visible" | "exiting">("entering");
  const [particles] = useState(makeParticles);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Entering → visible
  useEffect(() => {
    const t = setTimeout(() => setPhase("visible"), 50);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    if (phase === "exiting") return;
    setPhase("exiting");
    timerRef.current = setTimeout(onDismiss, 380);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const backdropVisible = phase !== "entering";
  const cardClass =
    phase === "entering"
      ? "opacity-0 scale-50"
      : phase === "visible"
      ? "animate-achievement-pop"
      : "animate-achievement-exit";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${
        backdropVisible ? "bg-black/65 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={dismiss}
    >
      {/* ── Confetti ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {particles.map((p) => (
          <span
            key={p.id}
            className="animate-confetti-fall absolute top-0"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: p.size,
              height: p.size,
              backgroundColor: p.shape !== "triangle" ? p.color : "transparent",
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : 0,
              borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
              borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
              borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : undefined,
            }}
          />
        ))}
      </div>

      {/* ── Achievement card ── */}
      <div
        className={`relative max-w-sm w-full mx-4 rounded-2xl overflow-hidden ${cardClass}`}
        style={{ willChange: "transform, opacity" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ring */}
        <div
          className="animate-glow-ring absolute inset-0 rounded-2xl pointer-events-none"
          aria-hidden
        />

        {/* Card background */}
        <div className="relative bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 p-[2px] rounded-2xl">
          <div className="rounded-[14px] bg-card overflow-hidden">

            {/* Shimmer sweep */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-[14px]"
              aria-hidden
            >
              <div
                className="absolute top-0 bottom-0 w-24 bg-white/30 rotate-[20deg] blur-md"
                style={{ animation: "shimmer-sweep 2.5s ease-in-out 0.3s 2" }}
              />
            </div>

            <div className="relative px-6 py-7 flex flex-col items-center text-center gap-4">

              {/* Icon badge */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg">
                  <Unlock className="w-8 h-8 text-amber-900" strokeWidth={2.5} />
                </div>
                {/* Ring ping */}
                <span className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping" />
              </div>

              {/* Header */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600 mb-1">
                  🏆 Secret Unlocked
                </p>
                <h2 className="text-xl font-black text-foreground leading-tight">
                  {personaName}&apos;s Hidden Story
                </h2>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

              {/* Reveal text */}
              <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>

              {/* Dismiss */}
              <Button
                onClick={dismiss}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-amber-950 font-bold border-0 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                ✨ Awesome, got it!
              </Button>

              <p className="text-[10px] text-muted-foreground/60">
                or click anywhere to dismiss
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
