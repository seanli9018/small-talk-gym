import { Scenario } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const difficultyVariant: Record<string, "default" | "secondary" | "destructive"> = {
  beginner: "secondary",
  intermediate: "default",
  advanced: "destructive",
};

export default function ScenarioCard({
  scenario,
  completed = false,
}: {
  scenario: Scenario;
  completed?: boolean;
}) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5 border border-border relative">
      {/* Completed overlay badge */}
      {completed && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-green-600 z-10">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Done</span>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{scenario.emoji}</div>
          <Badge
            variant={difficultyVariant[scenario.difficulty]}
            className="text-[10px] uppercase tracking-wider"
          >
            {scenario.difficulty}
          </Badge>
        </div>
        <h2 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {scenario.name}
        </h2>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{scenario.description}</p>
        <p className="text-xs text-muted-foreground">
          with <span className="font-medium text-foreground">{scenario.personaName}</span>
        </p>
      </CardContent>
    </Card>
  );
}
