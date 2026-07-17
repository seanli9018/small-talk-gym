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
  hiddenTriggerTheme: string;
  hiddenPersonaReveal: string;
  /** If true, the user must be signed in to access this scenario. */
  requiresAuth?: boolean;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ScoreBreakdown {
  naturalness: number;      // Sounds like real, fluid human speech (1–10)
  engagement: number;       // Invites the other person to continue (1–10)
  warmth: number;           // Friendly, emotionally positive tone (1–10)
  originality: number;      // Avoids clichés, adds personality (1–10)
  activeListening: number;  // References or builds on what the persona said (1–10)
  questionQuality: number;  // Asks open-ended, thoughtful follow-up questions (1–10)
}

export interface ChatResponse {
  reply: string;
  scores: ScoreBreakdown | null;
  overallScore: number | null;
  feedback: string | null;
  skillHighlight: string | null;
  coachingTip: string | null;
  triggerActivated: boolean;
  bonusMessage: string | null;
  conversationEnded: boolean;
  finalSummary: string | null;
}

// ─── Game / Progression types ────────────────────────────────────────────────

export type UserLevel =
  | "rookie"
  | "conversationalist"
  | "social-pro"
  | "charmer"
  | "master";

export interface LevelThreshold {
  level: UserLevel;
  label: string;
  minXp: number;
  emoji: string;
}

/** One completed conversation stored in `practice_sessions`. */
export interface SessionRecord {
  id: string;
  userId: string;
  scenarioId: string;
  overallScore: number;
  scores: ScoreBreakdown;
  triggerActivated: boolean;
  messageCount: number;
  xpEarned: number;
  completedAt: string; // ISO date string
}

/** A user's aggregated game stats (computed from DB). */
export interface UserStats {
  userId: string;
  totalXp: number;
  level: UserLevel;
  levelLabel: string;
  levelEmoji: string;
  xpToNextLevel: number | null; // null at max level
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  scenariosCompleted: string[];   // unique scenario IDs finished at least once
  averageScore: number | null;
  bestScore: number | null;
}

/** A single earned achievement stored in `user_achievements`. */
export interface Achievement {
  id: string;           // matches AchievementDefinition.id
  userId: string;
  earnedAt: string;     // ISO date string
}

/** Static definition of an achievement badge. */
export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** XP bonus awarded when first unlocked. */
  xpReward: number;
  /** Used to group badges in the UI. */
  category: "milestone" | "scenario" | "skill" | "streak" | "special";
  /** Secret achievements are hidden until unlocked. */
  secret?: boolean;
}
