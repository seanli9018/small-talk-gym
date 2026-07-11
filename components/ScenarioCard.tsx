import { Scenario } from "@/types";

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-6 cursor-pointer border border-transparent hover:border-indigo-200 hover:-translate-y-1">
      <div className="text-4xl mb-3">{scenario.emoji}</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">{scenario.name}</h2>
      <p className="text-gray-500 text-sm mb-4">{scenario.description}</p>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor[scenario.difficulty]}`}
        >
          {scenario.difficulty}
        </span>
        <span className="text-xs text-gray-400">with {scenario.personaName}</span>
      </div>
    </div>
  );
}
