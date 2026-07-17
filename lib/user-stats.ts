/**
 * Server-side helpers for persisting game data and evaluating achievements.
 * All DB access uses Drizzle ORM for full type safety.
 */
import { eq, desc, avg, max, sql } from "drizzle-orm";
import { db } from "@/db";
import { userStats, practiceSessions, userAchievements } from "@/db/schema";
import { ScoreBreakdown, UserLevel, UserStats, Achievement } from "@/types";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_MAP,
  LEVEL_THRESHOLDS,
  calculateXp,
} from "@/lib/achievements";
import { scenarioMeta } from "@/lib/scenario-meta";

// ─── Level helpers ────────────────────────────────────────────────────────────

export function getLevelInfo(totalXp: number): {
  level: UserLevel;
  label: string;
  emoji: string;
  xpToNextLevel: number | null;
} {
  let current = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalXp >= threshold.minXp) current = threshold;
    else break;
  }
  const currentIndex = LEVEL_THRESHOLDS.indexOf(current);
  const next = LEVEL_THRESHOLDS[currentIndex + 1] ?? null;
  return {
    level: current.level,
    label: current.label,
    emoji: current.emoji,
    xpToNextLevel: next ? next.minXp - totalXp : null,
  };
}

// ─── Session persistence ──────────────────────────────────────────────────────

export interface SaveSessionInput {
  userId: string;
  scenarioId: string;
  scores: ScoreBreakdown;
  overallScore: number;
  triggerActivated: boolean;
  messageCount: number;
}

/**
 * Saves a completed practice session, updates the user's XP / streak, then
 * evaluates which new achievements were just unlocked.
 * Returns the XP earned and any newly unlocked achievement IDs.
 */
export async function saveSession(input: SaveSessionInput): Promise<{
  xpEarned: number;
  newAchievements: string[];
}> {
  return await db.transaction(async (tx) => {
    // 1. Fetch current user game stats (upsert pattern – may not exist yet)
    const [existing] = await tx
      .select({
        totalXp:           userStats.totalXp,
        currentStreak:     userStats.currentStreak,
        longestStreak:     userStats.longestStreak,
        lastActiveDate:    userStats.lastActiveDate,
        sessionsCompleted: userStats.sessionsCompleted,
      })
      .from(userStats)
      .where(eq(userStats.userId, input.userId));

    const user = existing ?? {
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      sessionsCompleted: 0,
    };

    // 2. Compute streak
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastActive = user.lastActiveDate ?? null;

    let currentStreak = user.currentStreak;
    if (!lastActive) {
      currentStreak = 1;
    } else if (lastActive === today) {
      // Already practiced today – streak unchanged
    } else {
      const yesterday = new Date(Date.now() - 86_400_000)
        .toISOString()
        .split("T")[0];
      currentStreak = lastActive === yesterday ? currentStreak + 1 : 1;
    }
    const longestStreak = Math.max(user.longestStreak, currentStreak);

    // 3. Calculate XP
    const xpEarned = calculateXp(
      input.overallScore,
      input.triggerActivated,
      currentStreak
    );

    // 4. Insert practice session
    await tx.insert(practiceSessions).values({
      userId:               input.userId,
      scenarioId:           input.scenarioId,
      scoreNaturalness:     input.scores.naturalness,
      scoreEngagement:      input.scores.engagement,
      scoreWarmth:          input.scores.warmth,
      scoreOriginality:     input.scores.originality,
      scoreActiveListening: input.scores.activeListening,
      scoreQuestionQuality: input.scores.questionQuality,
      overallScore:         String(input.overallScore),
      triggerActivated:     input.triggerActivated,
      messageCount:         input.messageCount,
      xpEarned,
    });

    // 5. Upsert user_stats row
    const newTotalXp           = user.totalXp + xpEarned;
    const newSessionsCompleted = user.sessionsCompleted + 1;

    await tx
      .insert(userStats)
      .values({
        userId:            input.userId,
        totalXp:           newTotalXp,
        currentStreak,
        longestStreak,
        lastActiveDate:    today,
        sessionsCompleted: newSessionsCompleted,
      })
      .onConflictDoUpdate({
        target: userStats.userId,
        set: {
          totalXp:           newTotalXp,
          currentStreak,
          longestStreak,
          lastActiveDate:    today,
          sessionsCompleted: newSessionsCompleted,
          updatedAt:         new Date(),
        },
      });

    // 6. Evaluate new achievements
    const newAchievements = await evaluateAchievements(tx, {
      userId:           input.userId,
      scenarioId:       input.scenarioId,
      scores:           input.scores,
      overallScore:     input.overallScore,
      triggerActivated: input.triggerActivated,
      messageCount:     input.messageCount,
      totalSessions:    newSessionsCompleted,
      currentStreak,
      longestStreak,
      totalXp:          newTotalXp,
    });

    // 7. Award bonus XP for newly unlocked achievements
    if (newAchievements.length > 0) {
      const bonusXp = newAchievements.reduce(
        (sum, id) => sum + (ACHIEVEMENT_MAP.get(id)?.xpReward ?? 0),
        0
      );
      if (bonusXp > 0) {
        await tx
          .update(userStats)
          .set({ totalXp: sql`${userStats.totalXp} + ${bonusXp}` })
          .where(eq(userStats.userId, input.userId));
      }
    }

    return { xpEarned, newAchievements };
  });
}

// ─── Achievement evaluation ───────────────────────────────────────────────────

interface EvalContext {
  userId: string;
  scenarioId: string;
  scores: ScoreBreakdown;
  overallScore: number;
  triggerActivated: boolean;
  messageCount: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
}

async function evaluateAchievements(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  ctx: EvalContext
): Promise<string[]> {
  // Already-earned achievement IDs
  const earned = await tx
    .select({ achievementId: userAchievements.achievementId })
    .from(userAchievements)
    .where(eq(userAchievements.userId, ctx.userId));

  const alreadyEarned = new Set(earned.map((r) => r.achievementId));

  // All practice sessions for cumulative conditions
  const allSessions = await tx
    .select({
      scenarioId:       practiceSessions.scenarioId,
      overallScore:     practiceSessions.overallScore,
      triggerActivated: practiceSessions.triggerActivated,
      messageCount:     practiceSessions.messageCount,
    })
    .from(practiceSessions)
    .where(eq(practiceSessions.userId, ctx.userId));

  const newlyEarned: string[] = [];
  const allScenarioIds = scenarioMeta.map((s) => s.id);

  function check(id: string, condition: boolean) {
    if (!alreadyEarned.has(id) && condition) newlyEarned.push(id);
  }

  // ── Milestone ──────────────────────────────────────────────────────────────
  check("first-words",       ctx.totalSessions >= 1);
  check("getting-warmed-up", ctx.totalSessions >= 5);
  check("social-butterfly",  ctx.totalSessions >= 10);
  check("chatterbox",        ctx.totalSessions >= 25);
  check("small-talk-legend", ctx.totalSessions >= 50);

  // ── Skill ──────────────────────────────────────────────────────────────────
  check("perfect-round",    ctx.overallScore === 10);
  check(
    "high-achiever",
    allSessions.filter((s) => parseFloat(s.overallScore) >= 9).length >= 3
  );
  check("smooth-talker",  ctx.scores.naturalness     === 10);
  check("warm-heart",     ctx.scores.warmth           === 10);
  check("great-listener", ctx.scores.activeListening  === 10);
  check("curious-mind",   ctx.scores.questionQuality  === 10);

  // ── Streak ─────────────────────────────────────────────────────────────────
  check("two-day-streak", ctx.currentStreak >= 2);
  check("week-streak",    ctx.currentStreak >= 7);
  check("month-streak",   ctx.currentStreak >= 30);

  // ── Scenario ───────────────────────────────────────────────────────────────
  const completedScenarioIds = new Set(allSessions.map((s) => s.scenarioId));
  check(`scenario-${ctx.scenarioId}`, true); // just completed this one
  check(
    "scenario-all",
    allScenarioIds.every((id) => completedScenarioIds.has(id))
  );

  // ── Special / secret ───────────────────────────────────────────────────────
  check("secret-hunter", ctx.triggerActivated);
  check(
    "trigger-collector",
    allScenarioIds.every((id) =>
      allSessions.some((s) => s.scenarioId === id && s.triggerActivated)
    )
  );
  check("fast-talker", ctx.messageCount <= 5);
  check("deep-diver",  ctx.messageCount >= 15);

  // Persist newly earned achievements
  if (newlyEarned.length > 0) {
    await tx
      .insert(userAchievements)
      .values(newlyEarned.map((id) => ({ userId: ctx.userId, achievementId: id })))
      .onConflictDoNothing();
  }

  return newlyEarned;
}

// ─── Read helpers ─────────────────────────────────────────────────────────────

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const [row] = await db
    .select({
      totalXp:           userStats.totalXp,
      currentStreak:     userStats.currentStreak,
      longestStreak:     userStats.longestStreak,
      lastActiveDate:    userStats.lastActiveDate,
      sessionsCompleted: userStats.sessionsCompleted,
    })
    .from(userStats)
    .where(eq(userStats.userId, userId));

  if (!row) return null;

  const completedScenarios = await db
    .selectDistinct({ scenarioId: practiceSessions.scenarioId })
    .from(practiceSessions)
    .where(eq(practiceSessions.userId, userId));

  const [scoreStats] = await db
    .select({
      avgScore:  avg(practiceSessions.overallScore),
      bestScore: max(practiceSessions.overallScore),
    })
    .from(practiceSessions)
    .where(eq(practiceSessions.userId, userId));

  const avgScore = scoreStats?.avgScore
    ? Math.round(parseFloat(scoreStats.avgScore) * 10) / 10
    : null;
  const bestScore = scoreStats?.bestScore
    ? parseFloat(scoreStats.bestScore)
    : null;

  const levelInfo = getLevelInfo(row.totalXp);

  return {
    userId,
    totalXp:            row.totalXp,
    level:              levelInfo.level,
    levelLabel:         levelInfo.label,
    levelEmoji:         levelInfo.emoji,
    xpToNextLevel:      levelInfo.xpToNextLevel,
    totalSessions:      row.sessionsCompleted,
    currentStreak:      row.currentStreak,
    longestStreak:      row.longestStreak,
    lastActiveDate:     row.lastActiveDate ?? null,
    scenariosCompleted: completedScenarios.map((r) => r.scenarioId),
    averageScore:       avgScore,
    bestScore,
  };
}

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const rows = await db
    .select({
      id:       userAchievements.achievementId,
      userId:   userAchievements.userId,
      earnedAt: userAchievements.earnedAt,
    })
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId))
    .orderBy(userAchievements.earnedAt);

  return rows.map((r) => ({
    id:       r.id,
    userId:   r.userId,
    earnedAt: r.earnedAt.toISOString(),
  }));
}

export async function getRecentSessions(userId: string, limit = 10) {
  const rows = await db
    .select({
      id:               practiceSessions.id,
      scenarioId:       practiceSessions.scenarioId,
      overallScore:     practiceSessions.overallScore,
      triggerActivated: practiceSessions.triggerActivated,
      messageCount:     practiceSessions.messageCount,
      xpEarned:         practiceSessions.xpEarned,
      completedAt:      practiceSessions.completedAt,
    })
    .from(practiceSessions)
    .where(eq(practiceSessions.userId, userId))
    .orderBy(desc(practiceSessions.completedAt))
    .limit(limit);

  return rows.map((r) => ({
    ...r,
    overallScore: parseFloat(r.overallScore),
    completedAt:  r.completedAt.toISOString(),
  }));
}
