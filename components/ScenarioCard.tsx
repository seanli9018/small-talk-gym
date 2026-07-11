import { Scenario } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const difficultyVariant: Record<string, "default" | "secondary" | "destructive"> = {
  beginner: "secondary",
  intermediate: "default",
  advanced: "destructive",
};

export default function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer hover:border-indigo-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="text-4xl mb-3">{scenario.emoji}</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{scenario.name}</h2>
        <p className="text-muted-foreground text-sm mb-4">{scenario.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant={difficultyVariant[scenario.difficulty]}>
            {scenario.difficulty}
          </Badge>
          <span className="text-xs text-muted-foreground">with {scenario.personaName}</span>
        </div>
      </CardContent>
    </Card>
  );
}
