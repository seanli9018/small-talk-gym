/**
 * Lightweight scenario metadata used by middleware (Edge runtime).
 * Keep this file free of heavy imports so the middleware bundle stays small.
 */
export const scenarioMeta: { id: string; requiresAuth: boolean }[] = [
  { id: "office-chat", requiresAuth: false },
  { id: "morning-run", requiresAuth: false },
  { id: "elevator-talk", requiresAuth: true },
  { id: "networking-event", requiresAuth: true },
];

export function scenarioRequiresAuth(scenarioId: string): boolean {
  const meta = scenarioMeta.find((s) => s.id === scenarioId);
  // Unknown scenario IDs default to requiring auth (fail-safe)
  return meta ? meta.requiresAuth : true;
}
