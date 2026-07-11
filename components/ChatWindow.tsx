"use client";

import { useState, useRef, useEffect } from "react";
import { Scenario, Message, ChatResponse } from "@/types";
import MessageBubble from "./MessageBubble";
import ScoreDisplay from "./ScoreDisplay";
import PersonaReveal from "./PersonaReveal";

export default function ChatWindow({ scenario }: { scenario: Scenario }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hey! I'm ${scenario.personaName}. ${scenario.personaDescription} What's up?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id, messages: updatedMessages }),
      });

      const data: ChatResponse = await res.json();
      setLastResponse(data);

      if (data.triggerActivated && !bonusUnlocked) {
        setBonusUnlocked(true);
        setBonusMessage(data.bonusMessage);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Message Thread */}
      <div className="bg-white rounded-2xl shadow-md p-4 h-[440px] overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} personaName={scenario.personaName} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-400 text-sm px-4 py-2 rounded-2xl rounded-bl-sm italic">
              {scenario.personaName} is typing…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Score & Feedback */}
      {lastResponse?.score != null && (
        <ScoreDisplay score={lastResponse.score} feedback={lastResponse.feedback} />
      )}

      {/* Bonus Persona Reveal */}
      {bonusUnlocked && bonusMessage && (
        <PersonaReveal message={bonusMessage} personaName={scenario.personaName} />
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Say something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
