import { Card, CardContent } from "@/components/ui/card";

export default function PersonaReveal({
  message,
  personaName,
}: {
  message: string;
  personaName: string;
}) {
  return (
    <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
      <CardContent className="p-4">
        <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
          🎉 Hidden Bonus Unlocked — {personaName}&apos;s Secret!
        </p>
        <p className="text-sm leading-relaxed">{message}</p>
      </CardContent>
    </Card>
  );
}
