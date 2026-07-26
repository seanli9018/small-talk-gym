import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/user-stats";

/**
 * GET /api/leaderboard
 * Returns the top players ranked by total XP.
 * Public endpoint – no auth required.
 */
export async function GET() {
  try {
    const leaderboard = await getLeaderboard(20);
    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("[/api/leaderboard] Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
