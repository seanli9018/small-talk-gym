import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function ScoreDisplay({
  score,
  feedback,
}: {
  score: number;
  feedback: string | null;
}) {
  const colorClass =
    score >= 7
      ? "text-green-600"
      : score >= 4
      ? "text-yellow-600"
      : "text-red-500";

  const bar = Math.round((score / 10) * 100);

  return (
    <Card>
      <CardContent className="px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn("text-2xl font-bold", colorClass)}>{score}/10</span>
          {feedback && <p className="text-sm text-muted-foreground flex-1">{feedback}</p>}
        </div>
        <Progress value={bar} className="h-1.5" />
      </CardContent>
    </Card>
  );
}
