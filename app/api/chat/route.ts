import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { getScenario } from "@/lib/scenarios";
import { Message } from "@/types";

const ChatResponseSchema = z.object({
  reply: z.string(),
  score: z.number().min(1).max(10).nullable(),
  feedback: z.string().nullable(),
  triggerActivated: z.boolean(),
  bonusMessage: z.string().nullable(),
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

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: ChatResponseSchema,
      messages: [
        { role: "system", content: scenario.systemPrompt },
        ...messages,
      ],
    });

    return NextResponse.json(object);
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
