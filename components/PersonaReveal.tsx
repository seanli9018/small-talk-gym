export default function PersonaReveal({
  message,
  personaName,
}: {
  message: string;
  personaName: string;
}) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-4 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
        🎉 Hidden Bonus Unlocked — {personaName}&apos;s Secret!
      </p>
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}
