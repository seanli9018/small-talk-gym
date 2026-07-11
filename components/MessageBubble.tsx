import { Message } from "@/types";

export default function MessageBubble({
  message,
  personaName,
}: {
  message: Message;
  personaName: string;
}) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {!isUser && (
          <p className="text-xs font-semibold text-indigo-500 mb-1">{personaName}</p>
        )}
        {message.content}
      </div>
    </div>
  );
}
