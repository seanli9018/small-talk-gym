import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { z } from "zod";
import { getScenario } from "@/lib/scenarios";
import { Message } from "@/types";
import { auth } from "@/lib/auth";
import { saveSession } from "@/lib/user-stats";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const ScoreBreakdownSchema = z.object({
  naturalness: z.number().min(1).max(10),
  engagement: z.number().min(1).max(10),
  warmth: z.number().min(1).max(10),
  originality: z.number().min(1).max(10),
  activeListening: z.number().min(1).max(10),
  questionQuality: z.number().min(1).max(10),
});

const ChatResponseSchema = z.object({
  reply: z.string(),
  scores: ScoreBreakdownSchema.nullable(),
  overallScore: z.number().min(1).max(10).nullable(),
  feedback: z.string().nullable(),
  skillHighlight: z.string().nullable(),
  coachingTip: z.string().nullable(),
  triggerActivated: z.boolean(),
  bonusMessage: z.string().nullable(),
  conversationEnded: z.boolean(),
  finalSummary: z.string().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const {
      scenarioId,
      messages,
    }: { scenarioId: string; messages: Message[] } = await req.json();

    const scenario = getScenario(scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const result = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      output: Output.object({ schema: ChatResponseSchema }),
      instructions: scenario.systemPrompt,
      messages,
    });

    const output = result.output;

    // ── Persist completed session ─────────────────────────────────────────────
    if (output.conversationEnded && output.scores && output.overallScore !== null) {
      const session = await auth.api.getSession({ headers: req.headers });
      if (session?.user?.id) {
        // Count only user messages
        const messageCount = messages.filter((m) => m.role === "user").length;
        const { xpEarned, newAchievements } = await saveSession({
          userId: session.user.id,
          scenarioId,
          scores: output.scores,
          overallScore: output.overallScore,
          triggerActivated: output.triggerActivated,
          messageCount,
        });
        return NextResponse.json({ ...output, xpEarned, newAchievements });
      }
    }

    return NextResponse.json(output);
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
