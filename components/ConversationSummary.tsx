"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScoreBreakdown, ChatResponse } from "@/types";
import { Trophy, RotateCcw, TrendingUp, TrendingDown, Minus } from "lucide-react";

const DIMENSIONS: { key: keyof ScoreBreakdown; label: string; emoji: string }[] = [
  { key: "naturalness", label: "Naturalness", emoji: "💬" },
  { key: "engagement",  label: "Engagement",  emoji: "🔗" },
  { key: "warmth",      label: "Warmth",      emoji: "☀️" },
  { key: "originality", label: "Originality", emoji: "✨" },
];

function scoreColor(score: number) {
  if (score >= 8) return "text-green-600";
  if (score >= 5) return "text-yellow-600";
  return "text-red-500";
}

function barColor(score: number) {
  if (score >= 8) return "bg-green-500";
  if (score >= 5) return "bg-yellow-500";
  return "bg-red-500";
}

function trendIcon(first: number, last: number) {
  const diff = last - first;
  if (diff > 0) return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
  if (diff < 0) return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

function overallLabel(score: number) {
  if (score >= 9) return "Outstanding 🏆";
  if (score >= 7) return "Great job! 🎉";
  if (score >= 5) return "Good effort 👍";
  return "Keep practising 💪";
}

/** Compute per-dimension averages across all scored turns */
function averageBreakdown(history: ChatResponse[]): ScoreBreakdown | null {
  const scored = history.filter((r) => r.scores != null);
  if (scored.length === 0) return null;
  const sum = scored.reduce(
    (acc, r) => ({
      naturalness: acc.naturalness + r.scores!.naturalness,
      engagement:  acc.engagement  + r.scores!.engagement,
      warmth:      acc.warmth      + r.scores!.warmth,
      originality: acc.originality + r.scores!.originality,
    }),
    { naturalness: 0, engagement: 0, warmth: 0, originality: 0 }
  );
  const n = scored.length;
  return {
    naturalness: Math.round(sum.naturalness / n),
    engagement:  Math.round(sum.engagement  / n),
    warmth:      Math.round(sum.warmth      / n),
    originality: Math.round(sum.originality / n),
  };
}

export default function ConversationSummary({
  scoreHistory,
  finalSummary,
  personaName,
}: {
  scoreHistory: ChatResponse[];
  finalSummary: string;
  personaName: string;
}) {
  const router = useRouter();
  const overallHistory = scoreHistory
    .map((r) => r.overallScore)
    .filter((s): s is number => s != null);

  const avgOverall =
    overallHistory.length > 0
      ? Math.round(overallHistory.reduce((a, b) => a + b, 0) / overallHistory.length)
      : null;

  const avgBreakdown = averageBreakdown(scoreHistory);

  // first vs last per-dimension for trend arrows
  const firstScores = scoreHistory.find((r) => r.scores != null)?.scores ?? null;
  const lastScores  = [...scoreHistory].reverse().find((r) => r.scores != null)?.scores ?? null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <CardContent className="px-5 py-5 flex flex-col gap-5">

          {/* Header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <Trophy className="h-8 w-8 text-indigo-500" />
            <h2 className="text-lg font-bold">Conversation Complete</h2>
            {avgOverall != null && (
              <p className={cn("text-3xl font-extrabold", scoreColor(avgOverall))}>
                {avgOverall}
                <span className="text-base font-normal text-muted-foreground">/10</span>
                <span className="ml-2 text-base font-semibold">{overallLabel(avgOverall)}</span>
              </p>
            )}
          </div>

          {/* Sparkline timeline */}
          {overallHistory.length > 1 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Score over time</p>
              <div className="flex items-end gap-1.5 h-8">
                {overallHistory.map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                    <div
                      title={`Turn ${i + 1}: ${val}/10`}
                      className={cn("w-full rounded-sm", barColor(val))}
                      style={{ height: `${Math.round((val / 10) * 100)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                <span>Turn 1</span>
                <span>Turn {overallHistory.length}</span>
              </div>
            </div>
          )}

          {/* Per-dimension averages */}
          {avgBreakdown && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Dimension averages</p>
              {DIMENSIONS.map(({ key, label, emoji }) => {
                const val = avgBreakdown[key];
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-28 text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                      <span>{emoji}</span>{label}
                    </span>
                    <div className="flex-1 relative h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("absolute inset-y-0 left-0 rounded-full", barColor(val))}
                        style={{ width: `${(val / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 w-12 justify-end">
                      {firstScores && lastScores && trendIcon(firstScores[key], lastScores[key])}
                      <span className={cn("text-xs font-semibold", scoreColor(val))}>{val}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Final summary from persona */}
          <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm text-muted-foreground italic border-l-4 border-indigo-400">
            <span className="font-semibold not-italic text-foreground">{personaName}:</span>{" "}
            {finalSummary}
          </div>

          {/* Actions */}
          <Button
            onClick={() => router.refresh()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
