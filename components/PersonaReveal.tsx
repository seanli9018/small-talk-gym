import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function PersonaReveal({
  message,
  personaName,
}: {
  message: string;
  personaName: string;
}) {
  return (
    <Card className="border-2 border-foreground shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-foreground" />
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">
            Hidden Bonus Unlocked — {personaName}&apos;s Secret
          </p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
