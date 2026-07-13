import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScoreBreakdown } from "@/types";
import { Lightbulb, TrendingUp, TrendingDown, Minus } from "lucide-react";

const DIMENSIONS: { key: keyof ScoreBreakdown; label: string }[] = [
  { key: "naturalness", label: "Naturalness" },
  { key: "engagement",  label: "Engagement"  },
  { key: "warmth",      label: "Warmth"      },
  { key: "originality", label: "Originality" },
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

function Delta({ current, previous }: { current: number; previous: number | null }) {
  if (previous == null) return null;
  const diff = current - previous;
  if (diff > 0) return <span className="flex items-center gap-0.5 text-green-600 text-xs font-semibold"><TrendingUp className="h-3 w-3" />+{diff}</span>;
  if (diff < 0) return <span className="flex items-center gap-0.5 text-red-500 text-xs font-semibold"><TrendingDown className="h-3 w-3" />{diff}</span>;
  return <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus className="h-3 w-3" /></span>;
}

function Sparkline({ history }: { history: number[] }) {
  if (history.length < 2) return null;
  return (
    <div className="flex items-end gap-1 h-6">
      {history.map((val, i) => (
        <div
          key={i}
          title={`Turn ${i + 1}: ${val}/10`}
          className={cn(
            "w-2 rounded-sm transition-all",
            i === history.length - 1 ? "opacity-100" : "opacity-50",
            barColor(val)
          )}
          style={{ height: `${Math.round((val / 10) * 100)}%` }}
        />
      ))}
    </div>
  );
}

export default function ScoreDisplay({
  scores,
  overallScore,
  previousScores,
  previousOverallScore,
  feedback,
  coachingTip,
  overallHistory,
}: {
  scores: ScoreBreakdown | null;
  overallScore: number | null;
  previousScores: ScoreBreakdown | null;
  previousOverallScore: number | null;
  feedback: string | null;
  coachingTip: string | null;
  overallHistory: number[];
}) {
  if (!scores || overallScore == null) return null;

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardContent className="px-4 py-3 flex flex-col gap-3">
        {/* Overall score header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Score
            </span>
            <Sparkline history={overallHistory} />
          </div>
          <div className="flex items-center gap-2">
            <Delta current={overallScore} previous={previousOverallScore} />
            <span className={cn("text-2xl font-bold", scoreColor(overallScore))}>
              {overallScore}
              <span className="text-sm font-normal text-muted-foreground">/10</span>
            </span>
          </div>
        </div>

        {/* Dimension bars */}
        <div className="flex flex-col gap-2">
          {DIMENSIONS.map(({ key, label }) => {
            const val = scores[key];
            const prev = previousScores?.[key] ?? null;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-24 text-xs text-muted-foreground shrink-0">{label}</span>
                <div className="flex-1 relative h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-500", barColor(val))}
                    style={{ width: `${(val / 10) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 w-12 justify-end">
                  <Delta current={val} previous={prev} />
                  <span className={cn("text-xs font-semibold", scoreColor(val))}>{val}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <p className="text-sm text-muted-foreground border-t pt-2">{feedback}</p>
        )}

        {/* Coaching tip */}
        {coachingTip && (
          <div className="flex items-start gap-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg px-3 py-2">
            <Lightbulb className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
            <p className="text-xs text-indigo-700 dark:text-indigo-300">{coachingTip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

