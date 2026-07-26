import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserStats } from "@/lib/user-stats";
import { scenarios } from "@/lib/scenarios";
import ScenarioCard from "@/components/ScenarioCard";
import { MessageSquare } from "lucide-react";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  let completedScenarios: string[] = [];
  if (session?.user?.id) {
    const stats = await getUserStats(session.user.id);
    completedScenarios = stats?.scenariosCompleted ?? [];
  }

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
          <Link key={s.id} href={`/chat/${s.id}`}>
            <ScenarioCard
              scenario={s}
              completed={completedScenarios.includes(s.id)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

