import { getScenario } from "@/lib/scenarios";
import { notFound } from "next/navigation";
import Link from "next/link";
import ChatWindow from "@/components/ChatWindow";
import { ArrowLeft } from "lucide-react";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);
  if (!scenario) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl">
        {/* Back + Header */}
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-2xl">{scenario.emoji}</span>
          <div>
            <h1 className="text-lg font-bold text-indigo-700 leading-tight">
              {scenario.name}
            </h1>
            <p className="text-xs text-gray-400">
              Chatting with{" "}
              <span className="font-medium text-gray-500">{scenario.personaName}</span>
              {" · "}
              {scenario.personaDescription}
            </p>
          </div>
        </div>

        <ChatWindow scenario={scenario} />
      </div>
    </main>
  );
}
