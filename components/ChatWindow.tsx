"use client";

import { useState, useRef, useEffect } from "react";
import { Scenario, Message, ChatResponse } from "@/types";
import MessageBubble from "./MessageBubble";
import ScoreDisplay from "./ScoreDisplay";
import PersonaReveal from "./PersonaReveal";
import ConversationSummary from "./ConversationSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";

export default function ChatWindow({ scenario }: { scenario: Scenario }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hey! I'm ${scenario.personaName}. ${scenario.personaDescription} What's up?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<ChatResponse[]>([]);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [finalSummary, setFinalSummary] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading || conversationEnded) return;

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
      setScoreHistory((prev) => [...prev, data]);

      if (data.triggerActivated && !bonusUnlocked) {
        setBonusUnlocked(true);
        setBonusMessage(data.bonusMessage);
      }

      if (data.conversationEnded && data.finalSummary) {
        setConversationEnded(true);
        setFinalSummary(data.finalSummary);
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
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

          {/* Messages */}
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} personaName={scenario.personaName} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <span className="inline-flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Score & Feedback */}
          {scoreHistory.length > 0 && (() => {
            const latest = scoreHistory[scoreHistory.length - 1];
            const previous = scoreHistory.length > 1 ? scoreHistory[scoreHistory.length - 2] : null;
            return latest.overallScore != null ? (
              <ScoreDisplay
                key={scoreHistory.length}
                scores={latest.scores}
                overallScore={latest.overallScore}
                previousScores={previous?.scores ?? null}
                previousOverallScore={previous?.overallScore ?? null}
                feedback={latest.feedback}
                coachingTip={latest.coachingTip}
                overallHistory={scoreHistory.map((r) => r.overallScore).filter((s): s is number => s != null)}
              />
            ) : null;
          })()}

          {/* Bonus Persona Reveal */}
          {bonusUnlocked && bonusMessage && (
            <PersonaReveal message={bonusMessage} personaName={scenario.personaName} />
          )}

          {/* Final Summary */}
          {conversationEnded && finalSummary && (
            <ConversationSummary
              scoreHistory={scoreHistory}
              finalSummary={finalSummary}
              personaName={scenario.personaName}
            />
          )}

        </div>
      </div>

      {/* Sticky input bar */}
      {!conversationEnded && (
        <div className="shrink-0 border-t bg-background px-4 py-3">
          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              placeholder="Say something…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              size="icon"
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
