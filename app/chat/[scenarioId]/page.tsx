import { getScenario } from "@/lib/scenarios";
import { notFound, redirect } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  if (!scenario) notFound();

  if (scenario.requiresAuth) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      redirect(`/sign-in?callbackURL=/chat/${scenarioId}`);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b shrink-0">
        <span className="text-xl">{scenario.emoji}</span>
        <div>
          <h1 className="text-sm font-semibold text-foreground leading-tight">
            {scenario.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            with <span className="font-medium text-foreground">{scenario.personaName}</span>
            {" · "}{scenario.personaDescription}
          </p>
        </div>
      </div>

      {/* Chat area — scrollable middle, sticky input at bottom */}
      <ChatWindow scenario={scenario} />
    </div>
  );
}

