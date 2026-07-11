export default function ScoreDisplay({
  score,
  feedback,
}: {
  score: number;
  feedback: string | null;
}) {
  const color =
    score >= 7
      ? "text-green-600"
      : score >= 4
      ? "text-yellow-600"
      : "text-red-500";

  const bar = Math.round((score / 10) * 100);

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-2xl font-bold ${color}`}>{score}/10</span>
        {feedback && <p className="text-sm text-gray-500 flex-1">{feedback}</p>}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${
            score >= 7 ? "bg-green-500" : score >= 4 ? "bg-yellow-400" : "bg-red-400"
          }`}
          style={{ width: `${bar}%` }}
        />
      </div>
    </div>
  );
}
