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

export interface ScoreBreakdown {
  naturalness: number;   // Sounds like real, fluid human speech (1–10)
  engagement: number;    // Invites the other person to continue (1–10)
  warmth: number;        // Friendly, emotionally positive tone (1–10)
  originality: number;   // Avoids clichés, adds personality (1–10)
}

export interface ChatResponse {
  reply: string;
  scores: ScoreBreakdown | null;
  overallScore: number | null;
  feedback: string | null;
  coachingTip: string | null;
  triggerActivated: boolean;
  bonusMessage: string | null;
  conversationEnded: boolean;
  finalSummary: string | null;
}
