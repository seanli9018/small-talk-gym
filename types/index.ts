export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  emoji: string;
  personaName: string;
  personaDescription: string;
  systemPrompt: string;
  hiddenTriggerKeywords: string[];
  hiddenPersonaReveal: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  score: number | null;
  feedback: string | null;
  triggerActivated: boolean;
  bonusMessage: string | null;
}
