import {
  pgTable,
  text,
  integer,
  smallint,
  numeric,
  boolean,
  date,
  timestamp,
  uuid,
  unique,
  index,
} from "drizzle-orm/pg-core";

// ─── User game stats ──────────────────────────────────────────────────────────
// Completely separate from the better-auth `user` table.
// Linked only by userId (the better-auth user id string).
// One row per user, created on first completed session.

export const userStats = pgTable("user_stats", {
  userId:            text("user_id").primaryKey(),   // better-auth user.id
  totalXp:           integer("total_xp").notNull().default(0),
  currentStreak:     integer("current_streak").notNull().default(0),
  longestStreak:     integer("longest_streak").notNull().default(0),
  lastActiveDate:    date("last_active_date"),
  sessionsCompleted: integer("sessions_completed").notNull().default(0),
  updatedAt:         timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Practice sessions ────────────────────────────────────────────────────────

export const practiceSessions = pgTable(
  "practice_sessions",
  {
    id:                   uuid("id").primaryKey().defaultRandom(),
    userId:               text("user_id").notNull(),  // better-auth user.id
    scenarioId:           text("scenario_id").notNull(),

    // Score breakdown (1–10 each)
    scoreNaturalness:     smallint("score_naturalness").notNull(),
    scoreEngagement:      smallint("score_engagement").notNull(),
    scoreWarmth:          smallint("score_warmth").notNull(),
    scoreOriginality:     smallint("score_originality").notNull(),
    scoreActiveListening: smallint("score_active_listening").notNull(),
    scoreQuestionQuality: smallint("score_question_quality").notNull(),
    overallScore:         numeric("overall_score", { precision: 4, scale: 2 }).notNull(),

    triggerActivated:     boolean("trigger_activated").notNull().default(false),
    messageCount:         smallint("message_count").notNull().default(0),
    xpEarned:             integer("xp_earned").notNull().default(0),
    completedAt:          timestamp("completed_at", { withTimezone: true })
                            .notNull()
                            .defaultNow(),
  },
  (table) => [
    index("idx_practice_sessions_user_id").on(table.userId),
    index("idx_practice_sessions_completed_at").on(table.userId, table.completedAt),
  ]
);

// ─── User achievements ────────────────────────────────────────────────────────

export const userAchievements = pgTable(
  "user_achievements",
  {
    id:            uuid("id").primaryKey().defaultRandom(),
    userId:        text("user_id").notNull(),          // better-auth user.id
    achievementId: text("achievement_id").notNull(),
    earnedAt:      timestamp("earned_at", { withTimezone: true })
                     .notNull()
                     .defaultNow(),
  },
  (table) => [
    unique("uq_user_achievement").on(table.userId, table.achievementId),
    index("idx_user_achievements_user_id").on(table.userId),
  ]
);

// ─── Inferred row types ───────────────────────────────────────────────────────

export type UserStatsRow          = typeof userStats.$inferSelect;
export type PracticeSessionRow    = typeof practiceSessions.$inferSelect;
export type UserAchievementRow    = typeof userAchievements.$inferSelect;
export type NewUserStats          = typeof userStats.$inferInsert;
export type NewPracticeSession    = typeof practiceSessions.$inferInsert;
export type NewUserAchievement    = typeof userAchievements.$inferInsert;

