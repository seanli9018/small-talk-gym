import Link from "next/link";
import { scenarios } from "@/lib/scenarios";
import { MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-6 overflow-y-auto">
      <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Pick a scenario to start
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-8">
        Choose a scenario from the sidebar to begin practicing your small talk skills with an AI persona.
      </p>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {scenarios.slice(0, 3).map((s) => (
          <Link
            key={s.id}
            href={`/chat/${s.id}`}
            className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-left hover:bg-muted transition-colors"
          >
            <span className="text-lg">{s.emoji}</span>
            <div>
              <p className="font-medium text-foreground">{s.name}</p>
              <p className="text-xs text-muted-foreground">with {s.personaName}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

