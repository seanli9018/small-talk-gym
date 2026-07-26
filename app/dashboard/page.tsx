import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  getUserStats,
  getUserAchievements,
  getRecentSessions,
  getLeaderboard,
} from "@/lib/user-stats";
import { ACHIEVEMENTS, LEVEL_THRESHOLDS } from "@/lib/achievements";
import { scenarios } from "@/lib/scenarios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Flame,
  Star,
  MessageSquare,
  CheckCircle2,
  Lock,
  Crown,
  BarChart2,
  CalendarDays,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function scoreColor(score: number) {
  if (score >= 8) return "text-green-600";
  if (score >= 5) return "text-yellow-600";
  return "text-red-500";
}

function rankMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

const CATEGORY_ORDER = ["milestone", "skill", "streak", "scenario", "special"] as const;
const CATEGORY_LABEL: Record<string, string> = {
  milestone: "Milestones",
  skill:     "Skills",
  streak:    "Streaks",
  scenario:  "Scenarios",
  special:   "Special",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/sign-in?callbackURL=/dashboard");

  const userId = session.user.id;

  const [stats, earnedAchievements, recentSessions, leaderboard] =
    await Promise.all([
      getUserStats(userId),
      getUserAchievements(userId),
      getRecentSessions(userId, 10),
      getLeaderboard(20),
    ]);

  const earnedIds = new Set(earnedAchievements.map((a) => a.id));
  const earnedAtMap = new Map(
    earnedAchievements.map((a) => [a.id, a.earnedAt])
  );

  // Merge achievement definitions with earned status
  const allAchievements = ACHIEVEMENTS.map((def) => ({
    ...def,
    earned: earnedIds.has(def.id),
    earnedAt: earnedAtMap.get(def.id) ?? null,
    ...(def.secret && !earnedIds.has(def.id)
      ? { title: "???", description: "Keep playing to unlock this secret badge.", emoji: "🔒" }
      : {}),
  }));

  // XP progress bar
  const currentXp = stats?.totalXp ?? 0;
  const currentLevelIdx = LEVEL_THRESHOLDS.findLastIndex(
    (t) => currentXp >= t.minXp
  );
  const currentThreshold = LEVEL_THRESHOLDS[currentLevelIdx];
  const nextThreshold = LEVEL_THRESHOLDS[currentLevelIdx + 1] ?? null;
  const xpIntoLevel = currentXp - currentThreshold.minXp;
  const xpNeededForLevel = nextThreshold
    ? nextThreshold.minXp - currentThreshold.minXp
    : null;
  const progressPct = xpNeededForLevel
    ? Math.min(100, Math.round((xpIntoLevel / xpNeededForLevel) * 100))
    : 100;

  const myRank = leaderboard.find((r) => r.userId === userId)?.rank ?? null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* ── Hero: Level + XP ── */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Level card */}
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Level</p>
                  <p className="text-2xl font-bold text-foreground">
                    {currentThreshold.emoji} {currentThreshold.label}
                  </p>
                </div>
                {myRank && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Global Rank</p>
                    <p className="text-2xl font-bold">{rankMedal(myRank)}</p>
                  </div>
                )}
              </div>

              {/* XP bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{currentXp.toLocaleString()} XP</span>
                  {nextThreshold ? (
                    <span>{nextThreshold.minXp.toLocaleString()} XP — {nextThreshold.emoji} {nextThreshold.label}</span>
                  ) : (
                    <span>Max Level 👑</span>
                  )}
                </div>
                <Progress value={progressPct} className="h-2" />
                {nextThreshold && (
                  <p className="text-[11px] text-muted-foreground text-right">
                    {(stats?.xpToNextLevel ?? 0).toLocaleString()} XP to next level
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:w-64">
            <StatTile icon={<MessageSquare className="h-4 w-4" />} label="Sessions" value={stats?.totalSessions ?? 0} />
            <StatTile icon={<Flame className="h-4 w-4" />} label="Streak" value={`${stats?.currentStreak ?? 0}d`} />
            <StatTile icon={<Star className="h-4 w-4" />} label="Avg Score" value={stats?.averageScore ?? "—"} />
            <StatTile icon={<BarChart2 className="h-4 w-4" />} label="Best Score" value={stats?.bestScore ?? "—"} />
          </div>
        </div>

        {/* ── Scenario Completion ── */}
        <section>
          <SectionHeading icon={<CheckCircle2 className="h-4 w-4" />} title="Scenarios" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {scenarios.map((s) => {
              const done = stats?.scenariosCompleted.includes(s.id) ?? false;
              return (
                <Link key={s.id} href={`/chat/${s.id}`}>
                  <Card className={cn(
                    "hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5 h-full",
                    done ? "border-green-500/40 bg-green-500/5" : "border-border"
                  )}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="relative">
                        <span className="text-2xl">{s.emoji}</span>
                        {done && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 absolute -bottom-1 -right-1 bg-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-tight">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.personaName}</p>
                      </div>
                      <Badge
                        variant={done ? "secondary" : "outline"}
                        className={cn("text-[9px] uppercase tracking-wider mt-auto", done && "text-green-700 border-green-500/30 bg-green-500/10")}
                      >
                        {done ? "Completed" : s.difficulty}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Main content grid: Recent sessions + Leaderboard ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Sessions (2/3 width) */}
          <section className="lg:col-span-2">
            <SectionHeading icon={<CalendarDays className="h-4 w-4" />} title="Recent Sessions" />
            {recentSessions.length === 0 ? (
              <Card className="mt-3">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No sessions yet — pick a scenario and start chatting!
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-3 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scenario</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">XP</th>
                        <th className="text-center px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Secret</th>
                        <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSessions.map((s, i) => {
                        const scenario = scenarios.find((sc) => sc.id === s.scenarioId);
                        return (
                          <tr key={s.id} className={cn("border-b last:border-0 transition-colors hover:bg-muted/30", i % 2 === 0 ? "" : "bg-muted/10")}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-base shrink-0">{scenario?.emoji ?? "💬"}</span>
                                <div>
                                  <p className="font-medium text-foreground text-xs leading-tight">{scenario?.name ?? s.scenarioId}</p>
                                  <p className="text-[10px] text-muted-foreground">{scenario?.personaName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className={cn("font-bold text-sm", scoreColor(s.overallScore))}>
                                {s.overallScore.toFixed(1)}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="flex items-center justify-center gap-0.5 text-xs font-semibold text-foreground">
                                <Zap className="h-3 w-3 text-yellow-500" />
                                +{s.xpEarned}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center hidden sm:table-cell">
                              {s.triggerActivated ? (
                                <span title="Hidden reveal unlocked!">🔓</span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-muted-foreground hidden md:table-cell">
                              {formatDate(s.completedAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </section>

          {/* Leaderboard (1/3 width) */}
          <section>
            <SectionHeading icon={<Trophy className="h-4 w-4" />} title="Leaderboard" />
            <Card className="mt-3 overflow-hidden">
              {leaderboard.length === 0 ? (
                <CardContent className="p-6 text-sm text-muted-foreground text-center">
                  No players yet — be the first!
                </CardContent>
              ) : (
                <div className="divide-y">
                  {leaderboard.map((entry) => {
                    const isMe = entry.userId === userId;
                    return (
                      <div
                        key={entry.userId}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          isMe ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-muted/30"
                        )}
                      >
                        <span className="text-base w-6 shrink-0 text-center font-bold">
                          {rankMedal(entry.rank)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={cn("font-medium truncate text-xs", isMe && "text-primary")}>
                            {entry.name}
                            {isMe && <span className="ml-1 text-[10px] opacity-60">(you)</span>}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {entry.levelInfo.emoji} {entry.levelInfo.label}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-foreground">{entry.totalXp.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">XP</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </section>
        </div>

        {/* ── Achievements ── */}
        <section>
          <SectionHeading icon={<Crown className="h-4 w-4" />} title="Achievements" subtitle={`${earnedIds.size} / ${ACHIEVEMENTS.length} unlocked`} />
          <div className="flex flex-col gap-6 mt-3">
            {CATEGORY_ORDER.map((category) => {
              const group = allAchievements.filter((a) => a.category === category);
              if (group.length === 0) return null;
              return (
                <div key={category}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                    {CATEGORY_LABEL[category]}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {group.map((a) => (
                      <div
                        key={a.id}
                        title={a.description}
                        className={cn(
                          "flex flex-col items-center text-center gap-1.5 rounded-xl border p-3 transition-all duration-200",
                          a.earned
                            ? "border-border bg-card shadow-sm hover:shadow-md"
                            : "border-dashed border-border/60 bg-muted/20 opacity-50 grayscale"
                        )}
                      >
                        <span className="text-2xl">{a.emoji}</span>
                        <p className="text-[11px] font-semibold text-foreground leading-tight">{a.title}</p>
                        {a.earned && a.earnedAt && (
                          <p className="text-[9px] text-muted-foreground">{formatDate(a.earnedAt)}</p>
                        )}
                        {!a.earned && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                        <Badge variant="outline" className="text-[9px] px-1.5">+{a.xpReward} XP</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {icon}
          <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
        </div>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">{title}</h2>
      </div>
      {subtitle && (
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      )}
    </div>
  );
}
