import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserStats,
  getUserAchievements,
  getRecentSessions,
} from "@/lib/user-stats";
import { ACHIEVEMENTS } from "@/lib/achievements";

/**
 * GET /api/user/stats
 * Returns the authenticated user's game stats, achievements, and recent sessions.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [stats, earnedAchievements, recentSessions] = await Promise.all([
      getUserStats(userId),
      getUserAchievements(userId),
      getRecentSessions(userId, 10),
    ]);

    const earnedIds = new Set(earnedAchievements.map((a) => a.id));

    // Merge static definitions with earned status
    const achievements = ACHIEVEMENTS.map((def) => ({
      ...def,
      earned: earnedIds.has(def.id),
      earnedAt: earnedAchievements.find((a) => a.id === def.id)?.earnedAt ?? null,
      // Hide secret achievements that haven't been earned yet
      ...(def.secret && !earnedIds.has(def.id)
        ? { title: "???", description: "Keep playing to unlock this secret badge." }
        : {}),
    }));

    return NextResponse.json({ stats, achievements, recentSessions });
  } catch (err) {
    console.error("[/api/user/stats] Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
