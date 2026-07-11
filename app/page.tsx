import Link from "next/link";
import { scenarios } from "@/lib/scenarios";
import ScenarioCard from "@/components/ScenarioCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-700 mb-3">💬 Small Talk Gym</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Pick a scenario and practice your small talk skills with an AI persona.
            Unlock hidden secrets by saying the right things!
          </p>
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <Link key={scenario.id} href={`/chat/${scenario.id}`}>
              <ScenarioCard scenario={scenario} />
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          🔒 Each scenario has a hidden bonus — can you unlock them all?
        </p>
      </div>
    </main>
  );
}
