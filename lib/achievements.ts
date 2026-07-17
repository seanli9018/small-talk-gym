import { AchievementDefinition, LevelThreshold } from "@/types";

// ─── XP & Level thresholds ────────────────────────────────────────────────────

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: "rookie",           label: "Rookie",           minXp: 0,    emoji: "🌱" },
  { level: "conversationalist",label: "Conversationalist", minXp: 150,  emoji: "💬" },
  { level: "social-pro",       label: "Social Pro",        minXp: 400,  emoji: "🌟" },
  { level: "charmer",          label: "Charmer",           minXp: 800,  emoji: "✨" },
  { level: "master",           label: "Master",            minXp: 1500, emoji: "👑" },
];

/**
 * XP awarded per completed session:
 *   base = overallScore * 10   (max 100 per session)
 *   +20  if trigger was activated (hidden reveal unlocked)
 *   +30  if overallScore === 10 (perfect round)
 *   streak multiplier applied on top: 1 + (streakDays - 1) * 0.1  (capped at 2×)
 */
export function calculateXp(
  overallScore: number,
  triggerActivated: boolean,
  streakDays: number
): number {
  let base = Math.round(overallScore * 10);
  if (triggerActivated) base += 20;
  if (overallScore === 10) base += 30;
  const multiplier = Math.min(2, 1 + (streakDays - 1) * 0.1);
  return Math.round(base * multiplier);
}

// ─── Achievement definitions ──────────────────────────────────────────────────

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // ── Milestone ──────────────────────────────────────────────────────────────
  {
    id: "first-words",
    title: "First Words",
    description: "Complete your very first conversation.",
    emoji: "🗣️",
    xpReward: 50,
    category: "milestone",
  },
  {
    id: "getting-warmed-up",
    title: "Getting Warmed Up",
    description: "Complete 5 conversations.",
    emoji: "🔥",
    xpReward: 75,
    category: "milestone",
  },
  {
    id: "social-butterfly",
    title: "Social Butterfly",
    description: "Complete 10 conversations.",
    emoji: "🦋",
    xpReward: 100,
    category: "milestone",
  },
  {
    id: "chatterbox",
    title: "Chatterbox",
    description: "Complete 25 conversations.",
    emoji: "📣",
    xpReward: 150,
    category: "milestone",
  },
  {
    id: "small-talk-legend",
    title: "Small Talk Legend",
    description: "Complete 50 conversations.",
    emoji: "🏆",
    xpReward: 300,
    category: "milestone",
  },

  // ── Skill ──────────────────────────────────────────────────────────────────
  {
    id: "perfect-round",
    title: "Perfect Round",
    description: "Score a perfect 10/10 overall in a single conversation.",
    emoji: "💯",
    xpReward: 100,
    category: "skill",
  },
  {
    id: "high-achiever",
    title: "High Achiever",
    description: "Score 9 or above in three different conversations.",
    emoji: "📈",
    xpReward: 75,
    category: "skill",
  },
  {
    id: "smooth-talker",
    title: "Smooth Talker",
    description: "Score 10/10 on Naturalness in a conversation.",
    emoji: "🎤",
    xpReward: 60,
    category: "skill",
  },
  {
    id: "warm-heart",
    title: "Warm Heart",
    description: "Score 10/10 on Warmth in a conversation.",
    emoji: "❤️",
    xpReward: 60,
    category: "skill",
  },
  {
    id: "great-listener",
    title: "Great Listener",
    description: "Score 10/10 on Active Listening in a conversation.",
    emoji: "👂",
    xpReward: 60,
    category: "skill",
  },
  {
    id: "curious-mind",
    title: "Curious Mind",
    description: "Score 10/10 on Question Quality in a conversation.",
    emoji: "🤔",
    xpReward: 60,
    category: "skill",
  },

  // ── Streak ─────────────────────────────────────────────────────────────────
  {
    id: "two-day-streak",
    title: "Back Again",
    description: "Practice two days in a row.",
    emoji: "📅",
    xpReward: 30,
    category: "streak",
  },
  {
    id: "week-streak",
    title: "On a Roll",
    description: "Maintain a 7-day practice streak.",
    emoji: "🗓️",
    xpReward: 100,
    category: "streak",
  },
  {
    id: "month-streak",
    title: "Habit Builder",
    description: "Maintain a 30-day practice streak.",
    emoji: "🔑",
    xpReward: 400,
    category: "streak",
  },

  // ── Scenario ───────────────────────────────────────────────────────────────
  {
    id: "scenario-office-chat",
    title: "Coffee Machine Champion",
    description: "Complete the Office Small Talk scenario.",
    emoji: "☕",
    xpReward: 40,
    category: "scenario",
  },
  {
    id: "scenario-morning-run",
    title: "Early Bird",
    description: "Complete the Morning Run scenario.",
    emoji: "🏃",
    xpReward: 40,
    category: "scenario",
  },
  {
    id: "scenario-elevator-talk",
    title: "Elevator Pitch",
    description: "Complete the Elevator Ride scenario.",
    emoji: "🛗",
    xpReward: 60,
    category: "scenario",
  },
  {
    id: "scenario-networking-event",
    title: "Networker",
    description: "Complete the Networking Event scenario.",
    emoji: "🤝",
    xpReward: 80,
    category: "scenario",
  },
  {
    id: "scenario-all",
    title: "Full Circle",
    description: "Complete every available scenario at least once.",
    emoji: "🌐",
    xpReward: 150,
    category: "scenario",
  },

  // ── Special / Secret ───────────────────────────────────────────────────────
  {
    id: "secret-hunter",
    title: "Secret Hunter",
    description: "Unlock a hidden persona reveal in a conversation.",
    emoji: "🔓",
    xpReward: 50,
    category: "special",
  },
  {
    id: "trigger-collector",
    title: "Trigger Collector",
    description: "Unlock hidden reveals in all available scenarios.",
    emoji: "🗝️",
    xpReward: 200,
    category: "special",
    secret: true,
  },
  {
    id: "fast-talker",
    title: "Fast Talker",
    description: "Complete a conversation in under 5 messages.",
    emoji: "⚡",
    xpReward: 40,
    category: "special",
    secret: true,
  },
  {
    id: "deep-diver",
    title: "Deep Diver",
    description: "Have a conversation with 15+ exchanges.",
    emoji: "🤿",
    xpReward: 40,
    category: "special",
    secret: true,
  },
];

export const ACHIEVEMENT_MAP = new Map(
  ACHIEVEMENTS.map((a) => [a.id, a])
);
